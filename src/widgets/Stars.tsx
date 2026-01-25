import { useCallback } from 'react';
import { loadSlim } from 'tsparticles-slim';
import { Particles } from 'react-tsparticles';
import type { Container, Engine } from 'tsparticles-engine';

const Stars = () => {
  const particlesInit = useCallback(async (engine: Engine) => {
    await loadSlim(engine);
  }, []);

  const particlesLoaded = useCallback(async (container?: Container) => {
    console.log(container);
  }, []);

  return (
    <Particles
      className='fixed -z-10'
      id='tsparticles'
      init={particlesInit}
      loaded={particlesLoaded}
      options={{
        fpsLimit: 60,
        interactivity: {
          events: {
            resize: true,
          },
          modes: {
            push: {
              quantity: 4,
            },
            repulse: {
              distance: 200,
              duration: 0.4,
            },
          },
        },
        particles: {
          color: {
            value: '#8589FE',
          },
          move: {
            direction: 'right',
            enable: true,
            outModes: {
              default: 'out',
            },
            random: false,
            speed: 1,
            straight: true,
          },
          number: {
            density: {
              enable: true,
              area: 800,
            },
            value: 80,
          },
          opacity: {
            value: 1,
            anim: {
              enable: true,
              speed: 1,
              opacity_min: 0.4,
              sync: false,
            },
          },
          shape: {
            type: 'square',
          },
          size: {
            value: { min: 1, max: 5 },
          },
        },
        detectRetina: true,
      }}
    />
  );
};

export default Stars;
