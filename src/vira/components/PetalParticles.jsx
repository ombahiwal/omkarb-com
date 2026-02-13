import { useState, useEffect, useMemo, useCallback } from 'react';
import Particles, { initParticlesEngine } from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';

export default function PetalParticles() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => setReady(true));
  }, []);

  const options = useMemo(
    () => ({
      fullScreen: false,
      fpsLimit: 60,
      particles: {
        number: { value: 18, density: { enable: true, area: 1100 } },
        color: { value: ['#f4c2df', '#d879bf', '#b36be3', '#f1d6ea', '#a45fbf'] },
        shape: { type: ['circle', 'polygon'] },
        opacity: {
          value: { min: 0.14, max: 0.4 },
          animation: { enable: true, speed: 0.2, minimumValue: 0.08, sync: false },
        },
        size: {
          value: { min: 2.2, max: 6.2 },
          animation: { enable: true, speed: 0.6, minimumValue: 1.6, sync: false },
        },
        move: {
          enable: true,
          direction: 'bottom',
          speed: { min: 0.12, max: 0.55 },
          random: true,
          straight: false,
          outModes: { default: 'out', top: 'none' },
          drift: { min: -0.18, max: 0.18 },
        },
        wobble: { enable: true, distance: 5, speed: { min: 0.7, max: 1.6 } },
        tilt: {
          enable: true,
          direction: 'random',
          value: { min: 0, max: 360 },
          animation: { enable: true, speed: 3.5, sync: false },
        },
        rotate: {
          value: { min: 0, max: 360 },
          direction: 'random',
          animation: { enable: true, speed: 1.8, sync: false },
        },
      },
      interactivity: {
        events: { onHover: { enable: false }, onClick: { enable: false } },
      },
      detectRetina: true,
    }),
    [],
  );

  const particlesLoaded = useCallback(() => {}, []);

  if (!ready) return null;

  return (
    <Particles
      id="falling-petals"
      className="petal-particles"
      options={options}
      particlesLoaded={particlesLoaded}
    />
  );
}
