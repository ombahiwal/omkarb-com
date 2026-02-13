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
      fpsLimit: 40,
      particles: {
        number: { value: 28, density: { enable: true, area: 1300 } },
        color: { value: ['#fff7b3', '#ffe98d', '#ffe4a3', '#ffd86b'] },
        shape: { type: 'circle' },
        opacity: {
          value: { min: 0.15, max: 0.65 },
          animation: { enable: true, speed: 0.55, minimumValue: 0.05, sync: false },
        },
        size: {
          value: { min: 1.2, max: 3.8 },
          animation: { enable: true, speed: 0.4, minimumValue: 0.8, sync: false },
        },
        move: {
          enable: true,
          direction: 'none',
          speed: { min: 0.04, max: 0.2 },
          random: true,
          straight: false,
          outModes: { default: 'bounce' },
          drift: { min: -0.08, max: 0.08 },
        },
        wobble: { enable: true, distance: 2.6, speed: { min: 0.2, max: 0.6 } },
        twinkle: {
          particles: {
            enable: true,
            frequency: 0.08,
            color: '#fffde0',
            opacity: 1,
          },
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
      id="fireflies"
      className="petal-particles"
      options={options}
      particlesLoaded={particlesLoaded}
    />
  );
}
