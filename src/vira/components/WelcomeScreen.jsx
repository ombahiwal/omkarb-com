import { motion } from 'framer-motion';
import useGameStore from '../store';

const floatingHeart = {
  y: [0, -6, 0],
  transition: { repeat: Infinity, duration: 2.4, ease: 'easeInOut' },
};

export default function WelcomeScreen() {
  const startGame = useGameStore((s) => s.startGame);

  return (
    <motion.div
      className="welcome-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
    >
      {/* Vyshyvanka border decoration */}
      <div className="vyshyvanka-border top" />
      <div className="vyshyvanka-border bottom" />

      <motion.div
        className="welcome-content"
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, type: 'spring', stiffness: 60, damping: 18 }}
      >
        <motion.div className="welcome-hearts" animate={floatingHeart}>
          🌻💛🌻
        </motion.div>

        <h1 className="welcome-title">Happy Valentine&apos;s Day</h1>

        <div className="welcome-hero-photo-wrap">
          <img
            className="welcome-hero-photo"
            src="/assets/images/7.jpeg"
            alt="Our memory"
            draggable="false"
          />
        </div>

        <p className="welcome-subtitle">
          A journey through our love story.
        </p>

        {/* <div className="welcome-avatars">
          <div className="welcome-avatar him">
            <span role="img" aria-label="him">🧑</span>
          </div>
          <motion.span
            className="welcome-heart-between"
            animate={{ scale: [1, 1.25, 1] }}
            transition={{ repeat: Infinity, duration: 1.4, ease: 'easeInOut' }}
          >
            ❤️
          </motion.span>
          <div className="welcome-avatar her">
            <span role="img" aria-label="her">👩</span>
          </div>
        </div> */}

        <p className="welcome-message">
          Every flower blooms because of you, сонечко.
        </p>

        <motion.button
          className="start-button"
          onClick={startGame}
          whileHover={{ scale: 1.06, boxShadow: '0 8px 30px rgba(255,107,157,0.4)' }}
          whileTap={{ scale: 0.96 }}
        >
          Start Our Journey 💛
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
