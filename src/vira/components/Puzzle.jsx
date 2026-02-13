import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useGameStore from '../store';
import { milestones } from '../data/milestones';

export default function Puzzle({ milestone, index }) {
  const { solvePuzzle, triggerShake, puzzleShake } = useGameStore();
  const [input, setInput] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [correct, setCorrect] = useState(false);
  const inputRef = useRef(null);

  const puzzle = milestone.puzzle;

  useEffect(() => {
    setInput('');
    setShowHint(false);
    setCorrect(false);
    inputRef.current?.focus();
  }, [index]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (correct) return;

    const normalised = input.trim().toUpperCase();
    if (normalised === puzzle.correctAnswer.toUpperCase()) {
      setCorrect(true);
      setTimeout(() => solvePuzzle(), 900);
    } else {
      triggerShake();
    }
  };

  /* ── Render letters for scramble ── */
  const scrambleLetters = puzzle.type === 'scramble' && puzzle.scrambled
    ? puzzle.scrambled.split('').map((ch, i) => (
        <motion.span
          key={i}
          className="scramble-letter"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.06, type: 'spring', stiffness: 120, damping: 14 }}
        >
          {ch}
        </motion.span>
      ))
    : null;

  return (
    <motion.div
      className="puzzle-card"
      initial={{ y: 60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 60, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 80, damping: 20 }}
    >
      <span className="puzzle-milestone-badge">
        {index + 1} / {milestones.length}
      </span>

      {/* Question */}
      <p className="puzzle-question">{puzzle.question}</p>

      {/* Scrambled letters */}
      {puzzle.type === 'scramble' && (
        <div className="scramble-letters">{scrambleLetters}</div>
      )}

      {/* Image for image-guess */}
      {puzzle.type === 'image-guess' && puzzle.imageUrl && (
        <img
          className="puzzle-image"
          src={puzzle.imageUrl}
          alt="Guess what this is"
          draggable="false"
        />
      )}

      {/* Input form */}
      <form className="puzzle-form" onSubmit={handleSubmit}>
        <motion.input
          ref={inputRef}
          className={`puzzle-input ${correct ? 'correct' : ''}`}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your answer…"
          disabled={correct}
          autoComplete="off"
          animate={puzzleShake ? { x: [-8, 8, -6, 6, -3, 3, 0] } : {}}
          transition={{ duration: 0.5 }}
        />
        <motion.button
          className="puzzle-submit"
          type="submit"
          disabled={correct || !input.trim()}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {correct ? '🌻 Correct!' : 'Submit 💛'}
        </motion.button>
      </form>

      {/* Hint */}
      <button
        className="puzzle-hint-btn"
        onClick={() => setShowHint(true)}
        disabled={showHint || correct}
      >
        {showHint ? puzzle.hint : 'Need a hint? 🤔'}
      </button>

      {/* Wrong-answer encouragement */}
      <AnimatePresence>
        {puzzleShake && (
          <motion.p
            className="puzzle-encouragement"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            Close, my сонечко ❤️ Try again!
          </motion.p>
        )}
      </AnimatePresence>

      {/* Correct flash */}
      <AnimatePresence>
        {correct && (
          <motion.div
            className="correct-flash"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          >
            🌻 Beautiful!
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
