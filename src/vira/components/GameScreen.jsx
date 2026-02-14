import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import useGameStore from '../store';
import { milestones } from '../data/milestones';
import { TOTAL } from '../store';
import Puzzle from './Puzzle';
import BloomSplash from './BloomSplash';
import ThreeGardenBoard from './ThreeGardenBoard';

function ProgressBar({ solved, total }) {
  const pct = (solved / total) * 100;

  return (
    <div className="progress-bar-container">
      <div className="progress-bar-track">
        <motion.div
          className="progress-bar-fill"
          animate={{ width: `${pct}%` }}
          transition={{ type: 'spring', stiffness: 64, damping: 20 }}
        />
      </div>
      <span className="progress-label">{Math.round(pct)}% Garden Bloomed</span>
    </div>
  );
}

export default function GameScreen() {
  const { currentMilestone, bloomedFlowers, showTimelineModal, bloomSplash, completeBloomSplash } = useGameStore();
  const [gardenInteracted, setGardenInteracted] = useState(false);

  const solvedCount = bloomedFlowers.length;
  const milestone = milestones[currentMilestone];
  const splashMilestone =
    bloomSplash.active && bloomSplash.milestoneIndex !== null
      ? milestones[bloomSplash.milestoneIndex]
      : null;
  const showInteractionHint =
    !gardenInteracted && currentMilestone === 0 && solvedCount === 0 && !showTimelineModal && !bloomSplash.active;

  return (
    <motion.div
      className="game-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <ProgressBar solved={solvedCount} total={TOTAL} />

      <div className="field-area">
        <ThreeGardenBoard
          bloomedFlowers={bloomedFlowers}
          solvedCount={solvedCount}
          totalMilestones={TOTAL}
          onInteract={() => setGardenInteracted(true)}
        />
        <AnimatePresence>
          {showInteractionHint && (
            <motion.div
              className="garden-interaction-hint"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35 }}
            >
              <motion.span
                className="garden-interaction-hint-hand"
                animate={{ x: [0, -10, 12, 0] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
              >
                🖐️
              </motion.span>
              <span className="garden-interaction-hint-text">Drag to rotate the garden</span>
              <motion.span
                className="garden-interaction-hint-arrow"
                animate={{ rotate: [0, -22, 22, 0] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
              >
                ↺
              </motion.span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence mode="wait">
        {!showTimelineModal && !bloomSplash.active && milestone && (
          <Puzzle key={currentMilestone} milestone={milestone} index={currentMilestone} />
        )}
      </AnimatePresence>

      <BloomSplash splash={bloomSplash} milestone={splashMilestone} onContinue={completeBloomSplash} />
    </motion.div>
  );
}
