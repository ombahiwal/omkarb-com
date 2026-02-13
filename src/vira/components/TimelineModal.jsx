import { motion, AnimatePresence } from 'framer-motion';
import useGameStore from '../store';

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const modalVariants = {
  hidden: { scale: 0.75, opacity: 0, y: 30 },
  visible: {
    scale: 1,
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 90, damping: 18, delay: 0.1 },
  },
  exit: {
    scale: 0.85,
    opacity: 0,
    y: 20,
    transition: { duration: 0.3 },
  },
};

export default function TimelineModal() {
  const { showTimelineModal, currentModalData, closeModal } = useGameStore();

  return (
    <AnimatePresence>
      {showTimelineModal && currentModalData && (
        <motion.div
          className="timeline-fullscreen"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          <motion.div
            className="timeline-fullscreen-inner"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <p className="timeline-fullscreen-kicker">Milestone Unlocked</p>
            <motion.h2
              className="timeline-fullscreen-title"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              {currentModalData.title}
            </motion.h2>

            <motion.span
              className="timeline-fullscreen-date"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {currentModalData.date}
            </motion.span>

            <motion.p
              className="timeline-fullscreen-description"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 }}
            >
              {currentModalData.description}
            </motion.p>

            <motion.blockquote
              className="timeline-fullscreen-flirty"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65 }}
            >
              "{currentModalData.flirtyMessage}"
            </motion.blockquote>

            {currentModalData.ukrainianEndearment && (
              <motion.p
                className="timeline-fullscreen-ukr"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.75 }}
              >
                {currentModalData.ukrainianEndearment}
              </motion.p>
            )}

            <motion.button
              className="modal-continue"
              onClick={closeModal}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.85 }}
            >
              Continue Our Journey →
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
