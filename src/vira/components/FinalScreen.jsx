import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import ConfettiExplosion from 'react-confetti-explosion';
import useGameStore from '../store';
import ThreeGardenBoard from './ThreeGardenBoard';

const FINAL_HEART_BLOOM_TOTAL = 20;

/* ── Staggered letter animation ── */
function StaggerText({ text, className, delay = 0 }) {
  return (
    <span className={className} aria-label={text}>
      {text.split('').map((ch, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: delay + i * 0.035, type: 'spring', stiffness: 120, damping: 14 }}
          style={{ display: 'inline-block', whiteSpace: ch === ' ' ? 'pre' : 'normal' }}
        >
          {ch}
        </motion.span>
      ))}
    </span>
  );
}

/* ── Countdown timer (placeholder target) ── */
function Countdown() {
  const [remaining, setRemaining] = useState('');

  useEffect(() => {
    // Set your reunion date here
    const target = new Date('2026-06-01T00:00:00');
    const tick = () => {
      const diff = target - Date.now();
      if (diff <= 0) {
        setRemaining("We're together! 💛");
        return;
      }
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setRemaining(`${d}d ${h}h ${m}m ${s}s`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <motion.div
      className="countdown"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 3 }}
    >
      <span className="countdown-label">Until we're together again</span>
      <span className="countdown-value">{remaining}</span>
    </motion.div>
  );
}

export default function FinalScreen() {
  const [showConfetti, setShowConfetti] = useState(true);
  const [extraBloomCount, setExtraBloomCount] = useState(0);
  const resetGame = useGameStore((s) => s.resetGame);
  const bloomedFlowers = useGameStore((s) => s.bloomedFlowers);

  useEffect(() => {
    const t = setTimeout(() => setShowConfetti(false), 5000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const remaining = Math.max(0, FINAL_HEART_BLOOM_TOTAL - bloomedFlowers.length);
    if (remaining === 0) {
      return undefined;
    }

    setExtraBloomCount(0);
    const id = setInterval(() => {
      setExtraBloomCount((prev) => {
        if (prev >= remaining) {
          clearInterval(id);
          return prev;
        }
        return prev + 1;
      });
    }, 300);

    return () => clearInterval(id);
  }, [bloomedFlowers.length]);

  const finalBloomedFlowers = useMemo(() => {
    if (bloomedFlowers.length >= FINAL_HEART_BLOOM_TOTAL) {
      return bloomedFlowers.slice(0, FINAL_HEART_BLOOM_TOTAL);
    }

    const extrasToAdd = Math.max(0, Math.min(extraBloomCount, FINAL_HEART_BLOOM_TOTAL - bloomedFlowers.length));
    const nextIdStart = bloomedFlowers.reduce((max, flower) => Math.max(max, flower.id), -1) + 1;
    const extras = Array.from({ length: extrasToAdd }, (_, index) => ({
      id: nextIdStart + index,
      type: 'rose',
      milestoneIndex: Math.min(FINAL_HEART_BLOOM_TOTAL - 1, bloomedFlowers.length + index),
    }));

    return [...bloomedFlowers, ...extras];
  }, [bloomedFlowers, extraBloomCount]);

  return (
    <motion.div
      className="final-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2 }}
    >
      {showConfetti && (
        <div className="confetti-wrapper">
          <ConfettiExplosion
            force={0.85}
            duration={4500}
            particleCount={200}
            colors={['#FFD700', '#FF6B9D', '#FFB6C1', '#E8394D', '#0057B7', '#FFA500']}
            width={window.innerWidth}
          />
        </div>
      )}

      <div className="final-garden-area">
        <ThreeGardenBoard
          bloomedFlowers={finalBloomedFlowers}
          solvedCount={finalBloomedFlowers.length}
          totalMilestones={FINAL_HEART_BLOOM_TOTAL}
        />
      </div>

      <div className="final-content">
        {/* Main heading */}
        <motion.div
          className="final-emoji-row"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 100, damping: 12, delay: 0.5 }}
        >
          🌻💛🌻
        </motion.div>

        <h1 className="final-title">
          <StaggerText text="Our garden is in full bloom." delay={1} />
        </h1>

        <motion.div
          className="final-letter"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2, duration: 1 }}
        >
          <p>
            My dearest,
          </p>
          <p>
            Every puzzle you solved, every flower that bloomed — they all represent
            a piece of our story. A story I'd choose again and again, in every
            lifetime, in every universe.
          </p>
          <p>
            Distance is just space. What we have is timeless — deeper than oceans,
            brighter than the sunflowers we planted here together.
          </p>
          <p>
            I love you more than words in any language can say. But let me try in
            yours:
          </p>
          <p className="final-ukrainian">
            Я тебе кохаю назавжди.
          </p>
          <p className="final-translation">
            — I love you forever.
          </p>
          <p className="final-sign-off">
            Назавжди твій / твоя 💛<br />
            — Your Omkar
          </p>
        </motion.div>

        <Countdown />

        <motion.a
          className="final-cta"
          href="sms:"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 4 }}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.95 }}
        >
          Text me when you finish ❤️
        </motion.a>
      </div>

      <motion.button
        className="final-redo-mini"
        onClick={resetGame}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 4.5 }}
      >
        Redo
      </motion.button>
    </motion.div>
  );
}
