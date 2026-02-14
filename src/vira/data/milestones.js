/* ─── Milestone positions (SVG viewBox 0 0 1000 600) ────────────────────── */
/* Convert to CSS %: x → x/10 %, y → y/6 %                                 */
export const milestonePoints = [
  { x: 80,  y: 520 },  // Start
  { x: 200, y: 455 },  // Milestone 1
  { x: 310, y: 400 },  // Milestone 2
  { x: 400, y: 345 },  // Milestone 3
  { x: 500, y: 290 },  // Milestone 4
  { x: 600, y: 240 },  // Milestone 5
  { x: 700, y: 185 },  // Milestone 6
  { x: 800, y: 135 },  // Milestone 7
];

export const toPercent = (pt) => ({
  x: (pt.x / 1000) * 100,
  y: (pt.y / 600) * 100,
});

/* ─── Decorative SVG path ───────────────────────────────────────────────── */
export const trailPath =
  'M 80,520 C 140,530 160,470 200,455 C 240,440 270,420 310,400 ' +
  'C 350,380 360,360 400,345 C 440,330 460,310 500,290 ' +
  'C 540,270 560,255 600,240 C 640,225 660,205 700,185 ' +
  'C 740,165 760,150 800,135';

/* ─── Milestones ────────────────────────────────────────────────────────── */
export const milestones = [
  {
    id: 1,
    title: 'How We Met',
    date: 'The Day Everything Changed',
    description:
      'Two souls, different countries, one destiny. The universe conspired beautifully when it brought us together.',
    photoUrl: '/assets/images/1.jpeg',
    flirtyMessage:
      'Slow burn ❤️‍🔥',
    ukrainianEndearment: 'Моє сонечко — My little sun ☀️',
    puzzle: {
      type: 'scramble',
      question: 'Unscramble this word — it describes what our meeting was:',
      scrambled: 'YNITDES',
      correctAnswer: 'DESTINY',
      hint: 'Something that was meant to be… 🌟',
    },
  },
  {
  id: 2,
  title: 'Our Little Adventures',
  date: 'The Moments We Make Ours',
  description:
    'From tiny plans to spontaneous detours, every little adventure with you turns into a core memory. It is all about the moments we share.',
  photoUrl: '/assets/images/2.jpeg',
  flirtyMessage:
    'Even the smallest moments with you feels amazing. With you, every day becomes an adventure I never want to end. 🥰',
  ukrainianEndearment: 'Моя пригода — My adventure 💫',
  puzzle: {
    type: 'scramble',
    scrambled: 'VETUANRDES',
    question: '"With you, even ordinary days feel like _______."',
    correctAnswer: 'ADVENTURES',
    hint: 'Little moments, big memories… ✨',
  },
},

  {
  id: 3,
  title: 'Our Long-Distance Love',
  date: 'Holding On Until We\'re Together',
  description:
    'Distance tests us, but it never weakens us. Every day apart is one day closer to finally being in each other’s arms for good.',
  photoUrl: '/assets/images/3.jpeg',
  flirtyMessage:
    'No matter how far you are, my heart chooses you every single day. We’ll hang in there, and soon distance will be our old story. ❤️',
  ukrainianEndearment: 'Сумую за тобою — I miss you 💗',
  puzzle: {
    type: 'scramble',
    question: 'Unscramble this — what our love keeps giving us:',
    scrambled: 'EPOH',
    correctAnswer: 'HOPE',
    hint: 'What keeps us going until reunion… ✨',
  },
},
{
  id: 4,
  title: 'I Believe In You',
  date: 'Your Strength Inspires Me',
  description:
    'I see how much weight you carry with courage, and still keep moving forward with grace. Your hard work and persistence inspire me every day, and I believe in you with all my heart.',
  photoUrl: '/assets/images/4.jpeg',
  flirtyMessage:
    'You turn challenges into strength. I am endlessly proud of you, and I will always stand beside you. 🌹',
  ukrainianEndearment: 'Я вірю в тебе — I believe in you 💫',
  puzzle: {
    type: 'scramble',
    question: 'What quality in you do I admire the most?',
    scrambled: 'GROTNS',
    correctAnswer: 'STRONG',
    hint: 'You keep going with courage, every single day… 💪',
    imageUrl: '/assets/images/4.jpeg',
  },
},
  {
  id: 5,
  title: 'Your Kisses',
  date: 'Every Kiss, Every Time',
  description:
    'Your kisses still melt me the same way. They are soft, electric, and impossible to forget.',
  photoUrl: '/assets/images/5.jpeg',
  flirtyMessage:
    'I keep replaying your kisses in my head. I miss them more than words can say. 💋',
  ukrainianEndearment: 'Моє серденько — My little heart 💖',
  puzzle: {
    type: 'blank',
    question: '"When you kiss me, I feel _______ in my stomach."',
    correctAnswer: 'BUTTERFLIES',
    hint: 'They flutter inside you… 🦋',
  },
},
  {
  id: 6,
  title: 'Our Future',
  date: 'What We Are Building',
  description:
    'Together hand in hand, I trust in our love and the future we are creating together.',
  photoUrl: '/assets/images/6.jpeg',
  flirtyMessage:
    'Step by step, it is becoming real.',
  ukrainianEndearment: 'Назавжди твій / твоя — Forever yours 💛',
  puzzle: {
    type: 'blank',
    question: '"You are my _______ in every lifetime."',
    correctAnswer: 'ALWAYS',
    hint: 'Without end, without pause… 💛',
  },
},
{
  id: 7,
  title: 'Chai & Your Heart',
  date: 'The Cup That Started It All',
  description:
    'Somewhere between warm cups and sweet moments, chai became our little love language. I smile thinking how I stole your heart with my chai.',
  photoUrl: '/assets/images/7.jpeg',
  flirtyMessage:
    'Honestly, I think chai was my secret wingman ☕.',
  ukrainianEndearment: 'Сонечко — Little sun ☀️',
  puzzle: {
    type: 'scramble',
    question: 'What stole your heart:',
    scrambled: 'AHCI',
    correctAnswer: 'CHAI',
    hint: 'Your favorite warm drink… ☕',
  },
}
];
