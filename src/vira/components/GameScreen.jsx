import { motion, AnimatePresence } from 'framer-motion';
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

  const solvedCount = bloomedFlowers.length;
  const milestone = milestones[currentMilestone];
  const splashMilestone =
    bloomSplash.active && bloomSplash.milestoneIndex !== null
      ? milestones[bloomSplash.milestoneIndex]
      : null;

  return (
    <motion.div
      className="game-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <ProgressBar solved={solvedCount} total={TOTAL} />

      <div className="field-area">
        <ThreeGardenBoard bloomedFlowers={bloomedFlowers} solvedCount={solvedCount} totalMilestones={TOTAL} />
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
