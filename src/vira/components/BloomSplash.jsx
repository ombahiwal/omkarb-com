import { AnimatePresence, motion } from 'framer-motion';

const BLOOM_THEMES = [
  {
    name: 'Sunflower Sigil',
    icon: '✶',
    petals: 12,
    baseFrom: '#170d22',
    baseTo: '#35163d',
    petalA: '#f0a9d6',
    petalB: '#8e3ca4',
    ring: '#f4d3f1',
  },
  {
    name: 'Scarlet Compass',
    icon: '✦',
    petals: 10,
    baseFrom: '#1b1027',
    baseTo: '#3a1a47',
    petalA: '#f6bfdc',
    petalB: '#9b4fc6',
    ring: '#f6d8ef',
  },
  {
    name: 'Moonlit Rose',
    icon: '✹',
    petals: 14,
    baseFrom: '#130f21',
    baseTo: '#2c1843',
    petalA: '#e691c8',
    petalB: '#7440ae',
    ring: '#f3d4f2',
  },
  {
    name: 'Amber Archive',
    icon: '✺',
    petals: 9,
    baseFrom: '#1f1224',
    baseTo: '#43214c',
    petalA: '#d07db7',
    petalB: '#8f3fa4',
    ring: '#f3cbeb',
  },
  {
    name: 'Velvet Vow',
    icon: '✧',
    petals: 16,
    baseFrom: '#1a0e23',
    baseTo: '#3c1748',
    petalA: '#cf74b2',
    petalB: '#69319e',
    ring: '#ecc2e7',
  },
  {
    name: 'Ink & Gold',
    icon: '✷',
    petals: 11,
    baseFrom: '#170f22',
    baseTo: '#2f1a47',
    petalA: '#e0a3d3',
    petalB: '#7f49bf',
    ring: '#f1d2f0',
  },
  {
    name: 'Crimson Letter',
    icon: '✥',
    petals: 13,
    baseFrom: '#1c0c1f',
    baseTo: '#3e1542',
    petalA: '#e185b3',
    petalB: '#8a3f93',
    ring: '#f2caea',
  },
  {
    name: 'Candlelight Oath',
    icon: '✵',
    petals: 8,
    baseFrom: '#1a1122',
    baseTo: '#3f224a',
    petalA: '#e8acd6',
    petalB: '#8b49b6',
    ring: '#f6d9f3',
  },
];

export default function BloomSplash({ splash, milestone, onContinue }) {
  const active = splash?.active;
  const theme = BLOOM_THEMES[(splash?.variant ?? 0) % BLOOM_THEMES.length];
  const petals = Array.from({ length: theme.petals });

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          className="bloom-splash"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9 }}
          style={{ '--splash-from': theme.baseFrom, '--splash-to': theme.baseTo }}
        >
          <motion.div
            className="bloom-splash-flower"
            initial={{ scale: 0.82, rotate: -14, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            exit={{ scale: 0.88, opacity: 0 }}
            transition={{ duration: 1.1, ease: 'easeOut' }}
          >
            {petals.map((_, index) => (
              <span
                key={index}
                className="bloom-petal-shell"
                style={{
                  '--petal-rotate': `${(360 / theme.petals) * index}deg`,
                  '--petal-color': index % 2 === 0 ? theme.petalA : theme.petalB,
                }}
              >
                <motion.span
                  className="bloom-petal"
                  initial={{ scaleY: 0.1, scaleX: 0.25, opacity: 0 }}
                  animate={{
                    scaleY: [0.1, 1.2, 0.95, 1.08, 1],
                    scaleX: [0.25, 1.1, 0.92, 1],
                    opacity: [0, 0.94, 0.82, 0.95],
                  }}
                  transition={{
                    duration: 2.6,
                    delay: index * 0.09,
                    ease: 'easeOut',
                  }}
                />
              </span>
            ))}

            <motion.span
              className="bloom-ring bloom-ring--outer"
              style={{ '--ring-color': theme.ring }}
              animate={{ rotate: 360, scale: [1, 1.05, 1] }}
              transition={{ rotate: { duration: 28, repeat: Infinity, ease: 'linear' }, scale: { duration: 7.8, repeat: Infinity } }}
            />
            <motion.span
              className="bloom-ring bloom-ring--inner"
              style={{ '--ring-color': theme.ring }}
              animate={{ rotate: -360, scale: [1, 0.94, 1] }}
              transition={{ rotate: { duration: 21, repeat: Infinity, ease: 'linear' }, scale: { duration: 6.2, repeat: Infinity } }}
            />

            <motion.div
              className="bloom-core"
              style={{ '--core-color': theme.ring }}
              animate={{ scale: [0.84, 1.12, 1], rotate: [0, 8, 0] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
            >
              <span>{theme.icon}</span>
            </motion.div>
          </motion.div>

          <motion.div
            className="bloom-splash-caption"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.7 }}
          >
            <p className="bloom-splash-kicker">Memory Bloomed</p>
            <h3>{milestone?.title || theme.name}</h3>
            <p>{milestone?.flirtyMessage || 'Our story keeps unfolding like pressed petals in an old love letter.'}</p>
            <motion.button
              className="bloom-splash-continue"
              type="button"
              onClick={() => onContinue?.()}
              onTouchEnd={() => onContinue?.()}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.75, duration: 0.45 }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
            >
              Continue Our Journey
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
