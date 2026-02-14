import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const BOARD_POINTS = [
  { x: 14, y: 84 },
  { x: 27, y: 78 },
  { x: 42, y: 72 },
  { x: 58, y: 64 },
  { x: 73, y: 55 },
  { x: 74, y: 39 },
  { x: 62, y: 26 },
  { x: 44, y: 23 },
  { x: 25, y: 30 },
];

const FLOWER_SHAPES = {
  sunflower: { layers: [16, 12], radii: [0.2, 0.12] },
  rose: { layers: [15, 12, 9], radii: [0.14, 0.1, 0.072] },
  poppy: { layers: [13, 10], radii: [0.17, 0.11] },
};

const FLOWER_GLTF_CANDIDATE_URLS = ['/assets/roses_in_tivoli_gardens.glb'];

const GRASS_GLTF_CANDIDATE_URLS = ['/assets/patch_of_grass.glb'];

const HEDGEHOG_GLTF_CANDIDATE_URLS = ['/assets/hedgehog.glb'];

const clamp01 = (value) => Math.max(0, Math.min(1, value));

const seedRandom = (seed) => {
  let x = Math.sin(seed * 917.31) * 10000;
  return () => {
    x = Math.sin(x) * 10000;
    return x - Math.floor(x);
  };
};

const easeOutBack = (value) => {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(value - 1, 3) + c1 * Math.pow(value - 1, 2);
};

const hslHex = (h, s, l) => `#${new THREE.Color().setHSL(h, s, l).getHexString()}`;

const buildFlowerPalette = (seed) => {
  const rand = seedRandom(seed * 1.37);
  const archetypes = [
    { h: 0.93, s: 0.62, l: 0.68 },
    { h: 0.97, s: 0.58, l: 0.67 },
    { h: 0.11, s: 0.78, l: 0.66 },
    { h: 0.08, s: 0.7, l: 0.68 },
  ];

  const base = archetypes[Math.floor(rand() * archetypes.length)];
  const hueShift = (rand() - 0.5) * 0.03;
  const petalA = hslHex((base.h + hueShift + 1) % 1, clamp01(base.s + 0.05), clamp01(base.l + 0.05));
  const petalB = hslHex((base.h + hueShift + 0.015 + 1) % 1, clamp01(base.s), clamp01(base.l - 0.03));
  const petalC = hslHex((base.h + hueShift - 0.018 + 1) % 1, clamp01(base.s - 0.08), clamp01(base.l - 0.08));

  return {
    stem: hslHex(0.31 + rand() * 0.04, 0.38 + rand() * 0.16, 0.39 + rand() * 0.12),
    center: hslHex(0.05 + rand() * 0.04, 0.34 + rand() * 0.14, 0.18 + rand() * 0.09),
    petals: [petalA, petalB, petalC],
  };
};

const toBoard = (point) => {
  const x = (point.x / 100 - 0.5) * 8.2;
  const z = (point.y / 100 - 0.5) * 8.2;
  return new THREE.Vector3(x, 0.42, z);
};

const terrainHeightAt = (x, z) => {
  const radial = Math.max(0, 1 - Math.sqrt(x * x + z * z) / 6.2);
  const wave = Math.sin(x * 0.9) * 0.04 + Math.cos(z * 0.8) * 0.035;
  const ripple = Math.sin((x + z) * 1.7) * 0.014;
  return wave + ripple + radial * 0.05;
};

const createHeartPositions = (count) => {
  const points = [];
  if (!count) {
    return points;
  }

  for (let i = 0; i < count; i += 1) {
    const t = Math.PI - (2 * Math.PI * i) / count;
    const hx = 16 * Math.pow(Math.sin(t), 3);
    const hy =
      13 * Math.cos(t) -
      5 * Math.cos(2 * t) -
      2 * Math.cos(3 * t) -
      Math.cos(4 * t);

    const nx = hx / 16;
    const ny = hy / 17;

    points.push(new THREE.Vector3(nx * 2.15, 0, -ny * 1.75 + 0.15));
  }

  return points;
};

const createSunTexture = () => {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    return null;
  }

  const gradient = ctx.createRadialGradient(size / 2, size / 2, 8, size / 2, size / 2, size / 2);
  gradient.addColorStop(0, 'rgba(255,244,222,1)');
  gradient.addColorStop(0.25, 'rgba(255,215,160,0.94)');
  gradient.addColorStop(0.58, 'rgba(255,170,118,0.44)');
  gradient.addColorStop(1, 'rgba(255,170,118,0)');

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
};

const createPetalGeometry = (rand, widthBase, lengthBase) => {
  const width = widthBase + rand() * 0.045;
  const length = lengthBase + rand() * 0.085;
  const asymmetry = (rand() - 0.5) * 0.22;
  const shoulder = 0.46 + rand() * 0.16;
  const tipPinch = 0.56 + rand() * 0.2;

  const shape = new THREE.Shape();
  shape.moveTo(0, 0);
  shape.bezierCurveTo(
    width * (0.35 + asymmetry * 0.4),
    length * 0.2,
    width * (0.92 + asymmetry * 0.25),
    length * shoulder,
    width * tipPinch,
    length * 0.9
  );
  shape.bezierCurveTo(width * (0.42 + asymmetry * 0.2), length * 1.03, 0.03, length * 1.08, 0, length * 1.11);
  shape.bezierCurveTo(-0.03, length * 1.08, -width * (0.42 - asymmetry * 0.2), length * 1.03, -width * tipPinch, length * 0.9);
  shape.bezierCurveTo(
    -width * (0.92 - asymmetry * 0.25),
    length * shoulder,
    -width * (0.35 - asymmetry * 0.4),
    length * 0.2,
    0,
    0
  );

  const geometry = new THREE.ShapeGeometry(shape, 34);
  const positions = geometry.attributes.position;
  for (let i = 0; i < positions.count; i += 1) {
    const y = positions.getY(i);
    const x = positions.getX(i);
    const normalizedY = Math.max(0, Math.min(1, y / (length || 1)));
    const normalizedX = width === 0 ? 0 : Math.max(-1, Math.min(1, x / width));
    const bend = Math.sin(normalizedY * Math.PI) * (0.055 + rand() * 0.038);
    const cup = Math.sin(normalizedY * Math.PI) * (0.03 + rand() * 0.025) * (1 - Math.abs(normalizedX) * 0.42);
    const vein = Math.pow(normalizedY, 1.85) * 0.06;
    const twist = (normalizedY - 0.45) * 0.03;
    const edgeNoise = (Math.abs(normalizedX) > 0.64 ? (rand() - 0.5) * 0.01 : 0) * (1 - normalizedY);
    positions.setZ(i, positions.getZ(i) - bend - cup - vein);
    positions.setX(i, x + twist + edgeNoise);
  }

  positions.needsUpdate = true;
  geometry.computeVertexNormals();
  return geometry;
};

const createLeafGeometry = (rand) => {
  const width = 0.085 + rand() * 0.02;
  const length = 0.22 + rand() * 0.06;

  const shape = new THREE.Shape();
  shape.moveTo(0, 0);
  shape.bezierCurveTo(width * 0.72, length * 0.18, width, length * 0.58, width * 0.32, length);
  shape.bezierCurveTo(width * 0.12, length * 1.02, 0.02, length * 1.04, 0, length * 1.05);
  shape.bezierCurveTo(-0.02, length * 1.04, -width * 0.12, length * 1.02, -width * 0.32, length);
  shape.bezierCurveTo(-width, length * 0.58, -width * 0.72, length * 0.18, 0, 0);

  const geometry = new THREE.ShapeGeometry(shape, 20);
  const positions = geometry.attributes.position;
  for (let i = 0; i < positions.count; i += 1) {
    const y = positions.getY(i);
    const x = positions.getX(i);
    const ny = Math.max(0, Math.min(1, y / length));
    const nx = Math.max(-1, Math.min(1, x / width));
    const arc = Math.sin(ny * Math.PI) * 0.025;
    positions.setZ(i, positions.getZ(i) + arc + (1 - Math.abs(nx)) * ny * 0.01);
  }
  positions.needsUpdate = true;
  geometry.computeVertexNormals();
  return geometry;
};

const disposeObject3D = (object) => {
  object.traverse((child) => {
    if (child.geometry) {
      child.geometry.dispose();
    }
    if (child.material) {
      if (Array.isArray(child.material)) {
        child.material.forEach((material) => material.dispose());
      } else {
        child.material.dispose();
      }
    }
  });
};

const extractSceneRoot = (loadedAsset) => {
  if (!loadedAsset) {
    return null;
  }
  if (loadedAsset.scene) {
    return loadedAsset.scene;
  }
  if (Array.isArray(loadedAsset.scenes) && loadedAsset.scenes.length > 0) {
    return loadedAsset.scenes[0];
  }
  return loadedAsset;
};

const normalizeFlowerModel = (model) => {
  const initialBox = new THREE.Box3().setFromObject(model);
  if (!Number.isFinite(initialBox.min.x) || !Number.isFinite(initialBox.max.x)) {
    return null;
  }

  const center = new THREE.Vector3();
  const size = new THREE.Vector3();
  initialBox.getCenter(center);
  initialBox.getSize(size);

  const alignToGround = () => {
    const box = new THREE.Box3().setFromObject(model);
    const c = new THREE.Vector3();
    box.getCenter(c);
    model.position.sub(c);
    const recentered = new THREE.Box3().setFromObject(model);
    model.position.y -= recentered.min.y;
    return recentered.getSize(new THREE.Vector3());
  };

  model.position.sub(center);
  let alignedSize = alignToGround();
  if (alignedSize.y < Math.max(alignedSize.x, alignedSize.z) * 0.3) {
    model.rotation.x = -Math.PI / 2;
    alignedSize = alignToGround();
  }

  const maxDim = Math.max(alignedSize.x, alignedSize.y, alignedSize.z) || 1;
  const targetHeight = 2.4;
  const scale = targetHeight / maxDim;
  model.scale.setScalar(scale);
  alignToGround();

  model.traverse((child) => {
    if (!child.isMesh) {
      return;
    }
    child.castShadow = false;
    child.receiveShadow = true;
  });

  return model;
};

const normalizeGrassPatchModel = (model) => {
  const initialBox = new THREE.Box3().setFromObject(model);
  if (!Number.isFinite(initialBox.min.x) || !Number.isFinite(initialBox.max.x)) {
    return null;
  }

  const center = new THREE.Vector3();
  const size = new THREE.Vector3();
  initialBox.getCenter(center);
  initialBox.getSize(size);

  model.position.sub(center);
  const centeredBox = new THREE.Box3().setFromObject(model);
  model.position.y -= centeredBox.min.y;

  const footprint = Math.max(size.x, size.z) || 1;
  model.scale.setScalar(1 / footprint);

  model.traverse((child) => {
    if (!child.isMesh) {
      return;
    }
    child.castShadow = false;
    child.receiveShadow = true;
  });

  return model;
};

const normalizeHedgehogModel = (model) => {
  const initialBox = new THREE.Box3().setFromObject(model);
  if (!Number.isFinite(initialBox.min.x) || !Number.isFinite(initialBox.max.x)) {
    return null;
  }

  const alignToGround = () => {
    const box = new THREE.Box3().setFromObject(model);
    const center = box.getCenter(new THREE.Vector3());
    model.position.sub(center);
    const recentered = new THREE.Box3().setFromObject(model);
    model.position.y -= recentered.min.y;
    return recentered.getSize(new THREE.Vector3());
  };

  let size = alignToGround();
  if (size.y < Math.max(size.x, size.z) * 0.42) {
    model.rotation.x = -Math.PI / 2;
    size = alignToGround();
  }

  const maxDim = Math.max(size.x, size.y, size.z) || 1;
  model.scale.setScalar(1.45 / maxDim);
  model.rotation.y = -Math.PI / 2;

  model.traverse((child) => {
    if (!child.isMesh) {
      return;
    }
    child.castShadow = false;
    child.receiveShadow = false;
  });

  return model;
};

const placeSingleGrassPatch = ({ group, template }) => {
  while (group.children.length > 0) {
    const existing = group.children[0];
    group.remove(existing);
    disposeObject3D(existing);
  }

  if (!template) {
    return;
  }

  const boardSpan = 8.8;
  const patch = template.clone(true);
  patch.scale.multiplyScalar(boardSpan);
  patch.position.set(0, 0.425, 0);
  group.add(patch);
};

const createParametricRosePoints = (seed, palette) => {
  const rand = seedRandom(seed * 2.17);
  const positions = [];
  const radii = [];

  const xCount = 18;
  const thetaCount = 980;
  const thetaStart = -2 * Math.PI;
  const thetaEnd = 12 * Math.PI;
  const scale = 0.12 + rand() * 0.03;

  for (let xi = 0; xi <= xCount; xi += 1) {
    const x = xi / xCount;
    for (let ti = 0; ti <= thetaCount; ti += 1) {
      const theta = thetaStart + (ti / thetaCount) * (thetaEnd - thetaStart);
      const phi = (Math.PI / 2) * Math.exp(-theta / (8 * Math.PI));
      const wrapped = ((3.6 * theta) % (2 * Math.PI)) / Math.PI;
      const X = 1 - 0.5 * Math.pow((5 / 4) * (1 - wrapped), 2) - 0.25;
      const y = 1.95653 * Math.pow(x, 2) * Math.pow((1.27689 * x - 1), 2) * Math.sin(phi);
      let r = X * (x * Math.sin(phi) + y * Math.cos(phi));

      if (r <= 0) {
        continue;
      }

      r *= scale;

      const px = r * Math.sin(theta);
      const pz = r * Math.cos(theta);
      const py = X * scale * (x * Math.cos(phi) - y * Math.sin(phi));

      positions.push(px, py, pz);
      radii.push(r);
    }
  }

  if (positions.length === 0) {
    return null;
  }

  let rMin = Infinity;
  let rMax = -Infinity;
  for (let i = 0; i < radii.length; i += 1) {
    if (radii[i] < rMin) rMin = radii[i];
    if (radii[i] > rMax) rMax = radii[i];
  }

  const petalBase = new THREE.Color(palette.petals[0]);
  const petalDeep = new THREE.Color(palette.petals[2]);
  const colorArray = new Float32Array((positions.length / 3) * 3);
  for (let i = 0; i < radii.length; i += 1) {
    const t = (radii[i] - rMin) / Math.max(0.0001, rMax - rMin);
    const c = petalDeep.clone().lerp(petalBase, t);
    colorArray[i * 3] = c.r;
    colorArray[i * 3 + 1] = c.g;
    colorArray[i * 3 + 2] = c.b;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));

  const points = new THREE.Points(
    geometry,
    new THREE.PointsMaterial({
      size: 0.026 + rand() * 0.01,
      vertexColors: true,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.9,
      depthTest: true,
      depthWrite: false,
    })
  );

  points.rotation.x = -Math.PI / 2 + (rand() - 0.5) * 0.2;
  points.rotation.z = (rand() - 0.5) * 0.3;
  return points;
};

const markGrowthPart = (mesh, part) => {
  mesh.userData.growthPart = part;
  mesh.userData.baseScale = mesh.scale.clone();
  return mesh;
};

const addCenterSeeds = (flower, rand, centerY, palette) => {
  const seedGeometry = new THREE.IcosahedronGeometry(0.008, 0);
  const seedMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color(palette.center).offsetHSL(0, 0, -0.12),
    roughness: 0.84,
    metalness: 0.06,
  });

  const seedCount = 18 + Math.floor(rand() * 9);
  const golden = Math.PI * (3 - Math.sqrt(5));
  const maxRadius = 0.052 + rand() * 0.012;
  for (let i = 0; i < seedCount; i += 1) {
    const angle = i * golden + rand() * 0.24;
    const radius = maxRadius * Math.sqrt((i + 0.45) / seedCount);
    const seed = new THREE.Mesh(seedGeometry, seedMaterial);
    seed.position.set(
      Math.cos(angle) * radius,
      centerY + (rand() - 0.5) * 0.014 + radius * 0.09,
      Math.sin(angle) * radius
    );
    markGrowthPart(seed, 'core');
    flower.add(seed);
  }
};

const applyGrowthToFlower = (flower, progress) => {
  const p = clamp01(progress);
  const stemP = clamp01(p / 0.45);
  const leafP = clamp01((p - 0.2) / 0.35);
  const petalP = clamp01((p - 0.42) / 0.4);
  const coreP = clamp01((p - 0.63) / 0.3);

  const stemScale = Math.max(0.001, easeOutBack(stemP));
  const leafScale = Math.max(0.001, THREE.MathUtils.smoothstep(leafP, 0, 1));
  const petalScale = Math.max(0.001, easeOutBack(petalP));
  const coreScale = Math.max(0.001, THREE.MathUtils.smoothstep(coreP, 0, 1));

  flower.traverse((child) => {
    if (!child.userData.baseScale) {
      return;
    }

    const base = child.userData.baseScale;
    if (child.userData.growthPart === 'stem') {
      child.scale.set(base.x, base.y * stemScale, base.z);
      return;
    }

    if (child.userData.growthPart === 'leaf') {
      child.scale.set(base.x * leafScale, base.y * leafScale, base.z * leafScale);
      return;
    }

    if (child.userData.growthPart === 'petal') {
      child.scale.set(base.x * petalScale, base.y * petalScale, base.z * petalScale);
      return;
    }

    child.scale.set(base.x * coreScale, base.y * coreScale, base.z * coreScale);
  });
};

const createProceduralFlower = (type, seed = 1) => {
  const rand = seedRandom(seed);
  const shape = FLOWER_SHAPES[type] || FLOWER_SHAPES.rose;
  const palette = buildFlowerPalette(seed);

  const flower = new THREE.Group();
  flower.userData = {
    swayPhase: rand() * Math.PI * 2,
    swaySpeed: 0.66 + rand() * 0.62,
    bloom: 0,
    baseY: 0,
  };

  const stemHeight = 0.56 + rand() * 0.3;
  const stemCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3((rand() - 0.5) * 0.06, stemHeight * 0.34, (rand() - 0.5) * 0.05),
    new THREE.Vector3((rand() - 0.5) * 0.1, stemHeight * 0.72, (rand() - 0.5) * 0.07),
    new THREE.Vector3((rand() - 0.5) * 0.05, stemHeight, (rand() - 0.5) * 0.02),
  ]);

  const stem = markGrowthPart(
    new THREE.Mesh(
      new THREE.TubeGeometry(stemCurve, 20, 0.023, 8, false),
      new THREE.MeshStandardMaterial({ color: new THREE.Color(palette.stem), roughness: 0.92, metalness: 0.04 })
    ),
    'stem'
  );
  stem.castShadow = true;
  stem.receiveShadow = true;
  flower.add(stem);

  const leafGeometry = createLeafGeometry(rand);
  for (let i = 0; i < 2; i += 1) {
    const leaf = markGrowthPart(
      new THREE.Mesh(
        leafGeometry,
        new THREE.MeshStandardMaterial({ color: new THREE.Color('#67b86f'), roughness: 0.78, side: THREE.DoubleSide })
      ),
      'leaf'
    );

    leaf.scale.set(1 + rand() * 0.18, 1 + rand() * 0.16, 1);
    leaf.userData.baseScale = leaf.scale.clone();
    leaf.position.set(i === 0 ? 0.05 : -0.05, stemHeight * (0.45 + i * 0.08), i === 0 ? 0.01 : -0.02);
    leaf.rotation.z = i === 0 ? 0.75 : -0.68;
    leaf.rotation.y = i === 0 ? 0.42 : -0.36;
    flower.add(leaf);
  }

  shape.layers.forEach((petalCount, layerIndex) => {
    const step = type === 'rose' ? 2 : 1;
    const radius = shape.radii[layerIndex] || 0.1;
    const lift = stemHeight - layerIndex * 0.024;

    for (let i = 0; i < petalCount; i += step) {
      const angle = (i / petalCount) * Math.PI * 2 + rand() * 0.08;
      const geometry = createPetalGeometry(rand, 0.09 - layerIndex * 0.012, 0.24 - layerIndex * 0.03);
      const material = new THREE.MeshStandardMaterial({
        color: new THREE.Color(palette.petals[(i + layerIndex) % palette.petals.length]),
        roughness: 0.56,
        metalness: 0.08,
        side: THREE.DoubleSide,
      });

      const petal = new THREE.Mesh(geometry, material);
      petal.position.set(Math.cos(angle) * radius, lift, Math.sin(angle) * radius);
      petal.rotation.y = angle;
      petal.rotation.x = -Math.PI / 2 + 0.31 + layerIndex * 0.06 + rand() * 0.16;
      petal.rotation.z = (rand() - 0.5) * 0.18;
      petal.scale.set(0.92 + rand() * 0.2, 0.9 + rand() * 0.2, 1);
      markGrowthPart(petal, 'petal');
      petal.userData.baseScale = petal.scale.clone();
      petal.castShadow = true;
      flower.add(petal);
    }
  });

  if (type === 'rose') {
    const rosePoints = createParametricRosePoints(seed, palette);
    if (rosePoints) {
      rosePoints.position.y = stemHeight - 0.02;
      rosePoints.scale.setScalar(1.2);
      markGrowthPart(rosePoints, 'petal');
      rosePoints.userData.baseScale = rosePoints.scale.clone();
      flower.add(rosePoints);
    }
  }

  const center = markGrowthPart(
    new THREE.Mesh(
      new THREE.OctahedronGeometry(type === 'rose' ? 0.086 : 0.096, 1),
      new THREE.MeshStandardMaterial({
        color: new THREE.Color(palette.center),
        roughness: 0.45,
        metalness: 0.2,
        emissive: new THREE.Color('#2b0f2d'),
        emissiveIntensity: 0.25,
      })
    ),
    'core'
  );
  center.position.y = stemHeight - 0.02;
  center.castShadow = true;
  flower.add(center);

  const disk = markGrowthPart(
    new THREE.Mesh(
      new THREE.CylinderGeometry(0.078, 0.083, 0.03, 20),
      new THREE.MeshStandardMaterial({
        color: new THREE.Color(palette.center).offsetHSL(0, 0, -0.05),
        roughness: 0.72,
        metalness: 0.12,
      })
    ),
    'core'
  );
  disk.position.y = center.position.y - 0.01;
  disk.rotation.x = Math.PI / 2;
  flower.add(disk);

  addCenterSeeds(flower, rand, center.position.y + 0.006, palette);

  flower.scale.setScalar(1.15);
  applyGrowthToFlower(flower, 0);
  return flower;
};

export default function ThreeGardenBoard({ bloomedFlowers, solvedCount, totalMilestones, onInteract }) {
  const hostRef = useRef(null);
  const sceneStateRef = useRef(null);
  const solvedRef = useRef(solvedCount);
  const [modelVersion, setModelVersion] = useState(0);
  const hasInteractedRef = useRef(false);

  useEffect(() => {
    solvedRef.current = solvedCount;
  }, [solvedCount]);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) {
      return undefined;
    }
    let cancelled = false;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2('#2c0e16', 0.022);

    const camera = new THREE.PerspectiveCamera(46, 1, 0.1, 120);
    camera.position.set(0, 8.6, 10.8);

    const renderer = new THREE.WebGLRenderer({
      antialias: false,
      alpha: true,
      powerPreference: 'high-performance',
      precision: 'mediump',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 0.56));
    renderer.shadowMap.enabled = false;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.NoToneMapping;
    host.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = false;
    controls.enablePan = false;
    controls.target.set(0, 0.6, 0);
    controls.minDistance = 7.8;
    controls.maxDistance = 13.4;
    controls.minPolarAngle = THREE.MathUtils.degToRad(24);
    controls.maxPolarAngle = THREE.MathUtils.degToRad(80);
    controls.minAzimuthAngle = THREE.MathUtils.degToRad(-60);
    controls.maxAzimuthAngle = THREE.MathUtils.degToRad(60);
    controls.update();

    const markInteracted = () => {
      if (hasInteractedRef.current) {
        return;
      }
      hasInteractedRef.current = true;
      if (typeof onInteract === 'function') {
        onInteract();
      }
    };
    controls.addEventListener('start', markInteracted);
    renderer.domElement.addEventListener('pointerdown', markInteracted, { passive: true });

    const ambient = new THREE.AmbientLight('#ffe1f1', 0.5);
    scene.add(ambient);

    const keyLight = new THREE.DirectionalLight('#ffd9c2', 0.9);
    keyLight.position.set(8, 11, 7);
    keyLight.castShadow = false;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight('#ffc7e3', 0.56);
    fillLight.position.set(-8, 7, -6);
    scene.add(fillLight);

    const sunTexture = createSunTexture();
    const sunGroup = new THREE.Group();
    sunGroup.position.set(-5.6, 8.8, -8.2);

    const sunMesh = new THREE.Mesh(
      new THREE.OctahedronGeometry(0.98, 2),
      new THREE.MeshStandardMaterial({
        color: '#ffd79d',
        emissive: '#ffaf6f',
        emissiveIntensity: 0.48,
        roughness: 0.58,
        metalness: 0.06,
      })
    );
    sunGroup.add(sunMesh);

    let sunGlow = null;
    if (sunTexture) {
      sunGlow = new THREE.Sprite(
        new THREE.SpriteMaterial({
          map: sunTexture,
          color: '#ffd39b',
          transparent: true,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
          opacity: 0.4,
        })
      );
      sunGlow.scale.set(4.8, 4.8, 1);
      sunGroup.add(sunGlow);
    }
    scene.add(sunGroup);

    const boardGroup = new THREE.Group();
    scene.add(boardGroup);

    const topGeometry = new THREE.PlaneGeometry(8.9, 8.9, 16, 16);
    const topPositions = topGeometry.attributes.position;
    for (let i = 0; i < topPositions.count; i += 1) {
      const x = topPositions.getX(i);
      const z = topPositions.getY(i);
      topPositions.setZ(i, terrainHeightAt(x, z));
    }
    topPositions.needsUpdate = true;
    topGeometry.computeVertexNormals();

    const grassTop = new THREE.Mesh(
      topGeometry,
      new THREE.MeshStandardMaterial({
        color: '#4a7e50',
        emissive: '#2f1f34',
        emissiveIntensity: 0.12,
        roughness: 0.88,
        metalness: 0.03,
      })
    );
    grassTop.rotation.x = -Math.PI / 2;
    grassTop.position.y = 0.42;
    grassTop.receiveShadow = false;
    boardGroup.add(grassTop);

    const pathPoints3D = BOARD_POINTS.map(toBoard);
    const grassTilesGroup = new THREE.Group();
    boardGroup.add(grassTilesGroup);

    const milestoneNodes = [];

    const avatarGroup = new THREE.Group();
    avatarGroup.position.set(0, 0.42 + terrainHeightAt(0, 0), 0);
    boardGroup.add(avatarGroup);

    const flowersGroup = new THREE.Group();
    boardGroup.add(flowersGroup);

    const resize = () => {
      const w = host.clientWidth;
      const h = host.clientHeight;
      if (w <= 0 || h <= 0) {
        return;
      }
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(host);
    resize();

    const clock = new THREE.Clock();
    let rafId = null;

    const colorGrassLow = new THREE.Color('#4a7e50');
    const colorGrassHigh = new THREE.Color('#7bd17a');
    const fogLow = new THREE.Color('#2c0e16');
    const fogHigh = new THREE.Color('#7a2f45');

    const state = {
      scene,
      boardGroup,
      camera,
      renderer,
      controls,
      ambient,
      keyLight,
      fillLight,
      sunGroup,
      sunMesh,
      sunGlow,
      grassTop,
      colorGrassLow,
      colorGrassHigh,
      fogLow,
      fogHigh,
      progressCurrent: 0,
      progressTarget: 0,
      milestoneNodes,
      pathPoints3D,
      heartPositions: createHeartPositions(totalMilestones),
      avatarGroup,
      grassTilesGroup,
      grassTemplate: null,
      flowersGroup,
      flowerMap: new Map(),
      flowerModelTemplate: null,
      hedgehogTemplate: null,
      modelLoading: true,
      frameTime: 0,
      frameAccumulator: 0,
      setProgressFromSolved(value) {
        const ratio = clamp01(value / Math.max(1, totalMilestones));
        this.progressTarget = ratio;
      },
    };

    sceneStateRef.current = state;

    const gltfLoader = new GLTFLoader();
    const loadGLTFFromCandidates = async (urls, normalizeFn) => {
      for (let i = 0; i < urls.length; i += 1) {
        const url = urls[i];
        try {
          const loaded = await gltfLoader.loadAsync(url);
          const root = extractSceneRoot(loaded);
          if (!root) {
            continue;
          }
          const normalized = normalizeFn(root);
          if (normalized) {
            return normalized;
          }
        } catch (_error) {
          // Try next path.
        }
      }
      return null;
    };

    (async () => {
      const [flowerTemplate, grassTemplate, hedgehogTemplate] = await Promise.all([
        loadGLTFFromCandidates(FLOWER_GLTF_CANDIDATE_URLS, normalizeFlowerModel),
        loadGLTFFromCandidates(GRASS_GLTF_CANDIDATE_URLS, normalizeGrassPatchModel),
        loadGLTFFromCandidates(HEDGEHOG_GLTF_CANDIDATE_URLS, normalizeHedgehogModel),
      ]);

      if (cancelled || !sceneStateRef.current) {
        return;
      }

      if (flowerTemplate) {
        state.flowerModelTemplate = flowerTemplate;
      }
      state.modelLoading = false;

      if (grassTemplate) {
        state.grassTemplate = grassTemplate;
        placeSingleGrassPatch({ group: state.grassTilesGroup, template: grassTemplate });
        state.grassTop.visible = false;
      }

      if (hedgehogTemplate) {
        state.hedgehogTemplate = hedgehogTemplate;
        while (state.avatarGroup.children.length > 0) {
          const child = state.avatarGroup.children[0];
          state.avatarGroup.remove(child);
          disposeObject3D(child);
        }
        const avatarHedgehog = hedgehogTemplate.clone(true);
        avatarHedgehog.scale.multiplyScalar(1.0);
        avatarHedgehog.rotation.y = -Math.PI / 2;
        const avatarBox = new THREE.Box3().setFromObject(avatarHedgehog);
        const avatarCenter = avatarBox.getCenter(new THREE.Vector3());
        avatarHedgehog.position.x -= avatarCenter.x;
        avatarHedgehog.position.z -= avatarCenter.z;
        avatarHedgehog.position.y -= avatarBox.min.y;
        avatarHedgehog.position.y += 0.01;
        state.avatarGroup.add(avatarHedgehog);
      }

      state.flowerMap.forEach((mesh) => {
        state.flowersGroup.remove(mesh);
        if (!mesh.userData?.isModel) {
          disposeObject3D(mesh);
        }
      });
      state.flowerMap.clear();

      setModelVersion((value) => value + 1);
    })();

    const renderFrame = () => {
      rafId = window.requestAnimationFrame(renderFrame);

      state.frameAccumulator += clock.getDelta();
      const frameStep = 1 / 30;
      if (state.frameAccumulator < frameStep) {
        return;
      }

      const delta = Math.min(0.05, state.frameAccumulator);
      state.frameAccumulator = 0;
      state.frameTime += delta;

      state.progressCurrent = THREE.MathUtils.lerp(state.progressCurrent, state.progressTarget, delta * 2.6);
      const progress = state.progressCurrent;

      state.ambient.intensity = THREE.MathUtils.lerp(0.5, 0.94, progress);
      state.keyLight.intensity = THREE.MathUtils.lerp(0.9, 1.52, progress);
      state.fillLight.intensity = THREE.MathUtils.lerp(0.56, 1.08, progress);

      state.sunMesh.material.emissiveIntensity = THREE.MathUtils.lerp(0.48, 1.1, progress);
      state.sunGroup.position.y = 9.1 + Math.sin(state.frameTime * 0.22) * 0.1 - progress * 2.4;
      if (state.sunGlow) {
        state.sunGlow.material.opacity = THREE.MathUtils.lerp(0.4, 0.72, progress);
      }

      state.grassTop.material.color.lerpColors(state.colorGrassLow, state.colorGrassHigh, progress);
      state.grassTop.material.emissiveIntensity = THREE.MathUtils.lerp(0.12, 0.31, progress);

      if (state.scene.fog) {
        state.scene.fog.color.lerpColors(state.fogLow, state.fogHigh, progress);
        state.scene.fog.density = THREE.MathUtils.lerp(0.022, 0.012, progress);
      }

      const solvedIndex = Math.max(0, Math.min(BOARD_POINTS.length - 1, solvedRef.current));
      const pathMaxIndex = Math.max(1, state.pathPoints3D.length - 1);
      const centerPoint = new THREE.Vector3(0, 0, 0);
      let targetPoint = null;

      if (solvedRef.current <= 0) {
        targetPoint = centerPoint;
      } else {
        const totalSegments = pathMaxIndex + 1;
        const travel = clamp01(state.progressCurrent) * totalSegments;
        if (travel <= 1) {
          targetPoint = new THREE.Vector3().lerpVectors(centerPoint, state.pathPoints3D[0], travel);
        } else {
          const pathTravel = Math.min(pathMaxIndex, travel - 1);
          const fromIndex = Math.floor(pathTravel);
          const toIndex = Math.min(pathMaxIndex, fromIndex + 1);
          const t = pathTravel - fromIndex;
          const fromPoint = state.pathPoints3D[fromIndex];
          const toPoint = state.pathPoints3D[toIndex];
          targetPoint = new THREE.Vector3().lerpVectors(fromPoint, toPoint, t);
        }
      }

      if (!targetPoint) {
        targetPoint = centerPoint;
      }
      const avatarGround = 0.42 + terrainHeightAt(targetPoint.x, targetPoint.z);
      state.avatarGroup.position.x = THREE.MathUtils.lerp(state.avatarGroup.position.x, targetPoint.x, delta * 5.4);
      state.avatarGroup.position.z = THREE.MathUtils.lerp(state.avatarGroup.position.z, targetPoint.z, delta * 5.4);
      state.avatarGroup.position.y = avatarGround + Math.sin(state.frameTime * 1.28) * 0.005;

      state.milestoneNodes.forEach((node) => {
        const solved = node.userData.index < solvedIndex;
        const current = node.userData.index === solvedIndex;

        if (solved) {
          node.material.color.set('#9dd78f');
          node.material.emissive.set('#3f7d43');
          node.material.emissiveIntensity = 0.6;
        } else if (current) {
          node.material.color.set('#f2a8b6');
          node.material.emissive.set('#7a1f35');
          node.material.emissiveIntensity = 0.74 + Math.sin(state.frameTime * 2.6) * 0.14;
        } else {
          node.material.color.set('#8c3f55');
          node.material.emissive.set('#481423');
          node.material.emissiveIntensity = 0.24;
        }
      });

      state.flowersGroup.children.forEach((flower) => {
        if (flower.userData.bloom < 1) {
          flower.userData.bloom = Math.min(1, flower.userData.bloom + delta / 2.4);
          if (flower.userData.isModel && flower.userData.baseScale) {
            const modelScale = Math.max(0.001, easeOutBack(flower.userData.bloom));
            flower.scale.copy(flower.userData.baseScale).multiplyScalar(modelScale);
          } else {
            applyGrowthToFlower(flower, flower.userData.bloom);
          }
        }

        const swaySpeed = Number.isFinite(flower.userData.swaySpeed) ? flower.userData.swaySpeed : 0.72;
        const swayPhase = Number.isFinite(flower.userData.swayPhase) ? flower.userData.swayPhase : 0;
        const sway = Math.sin(state.frameTime * swaySpeed + swayPhase);
        flower.position.y = flower.userData.baseY + sway * 0.009;
        flower.rotation.z = sway * 0.03;
      });

      renderer.render(scene, camera);
    };

    state.setProgressFromSolved(solvedRef.current);
    renderFrame();

    return () => {
      cancelled = true;
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
      }

      resizeObserver.disconnect();
      controls.dispose();
      controls.removeEventListener('start', markInteracted);
      renderer.domElement.removeEventListener('pointerdown', markInteracted);

      if (renderer.domElement.parentNode === host) {
        host.removeChild(renderer.domElement);
      }

      scene.traverse((child) => {
        if (child.geometry) {
          child.geometry.dispose();
        }
        if (child.material) {
          if (Array.isArray(child.material)) {
            child.material.forEach((material) => material.dispose());
          } else {
            child.material.dispose();
          }
        }
      });

      if (sunTexture) {
        sunTexture.dispose();
      }

      renderer.dispose();
      sceneStateRef.current = null;
    };
  }, [totalMilestones]);

  useEffect(() => {
    const state = sceneStateRef.current;
    if (!state) {
      return;
    }

    if (state.modelLoading) {
      return;
    }

    state.setProgressFromSolved(solvedCount);

    const incomingIds = new Set(bloomedFlowers.map((flower) => flower.id));

    state.flowerMap.forEach((mesh, id) => {
      if (!incomingIds.has(id)) {
        state.flowersGroup.remove(mesh);
        if (!mesh.userData?.isModel) {
          disposeObject3D(mesh);
        }
        state.flowerMap.delete(id);
      }
    });

    bloomedFlowers.forEach((flowerData) => {
      if (state.flowerMap.has(flowerData.id)) {
        return;
      }

      const flower = state.flowerModelTemplate
        ? state.flowerModelTemplate.clone(true)
        : createProceduralFlower(flowerData.type, flowerData.id + 1);
      const heartPoint = state.heartPositions[Math.min(flowerData.milestoneIndex, state.heartPositions.length - 1)] || new THREE.Vector3(0, 0, 0);

      const x = heartPoint.x;
      const z = heartPoint.z;
      const y = 0.58 + terrainHeightAt(x, z);

      flower.position.set(x, y, z);
      flower.userData.baseY = y;
      flower.userData.bloom = 0;
      flower.userData.swayPhase = (flowerData.id + 1) * 1.37;
      flower.userData.swaySpeed = 0.62 + ((flowerData.id % 7) * 0.07);
      if (state.flowerModelTemplate) {
        flower.userData.isModel = true;
        flower.scale.multiplyScalar(0.55);
        flower.position.y -= 1.0;
        flower.userData.baseY -= 1.0;
        flower.userData.baseScale = flower.scale.clone();
        flower.scale.setScalar(0.001);
      } else {
        applyGrowthToFlower(flower, 0);
      }

      state.flowersGroup.add(flower);
      state.flowerMap.set(flowerData.id, flower);
    });
  }, [bloomedFlowers, solvedCount, modelVersion]);

  return <div ref={hostRef} className="garden-three-root" aria-label="Interactive 3D rotatable garden board" />;
}
