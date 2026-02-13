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
  { x: 920, y: 70  },  // Milestone 8 (final heart)
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
  'C 740,165 760,150 800,135 C 850,110 890,85 920,70';

/* ─── Milestones ────────────────────────────────────────────────────────── */
export const milestones = [
  {
    id: 1,
    title: 'How We Met',
    date: 'The Day Everything Changed',
    description:
      'Two souls, different countries, one destiny. The universe conspired beautifully when it brought us together.',
    photoUrl: 'https://placehold.co/400x300/FFD700/333?text=🌻+How+We+Met',
    flirtyMessage:
      'From the moment I first saw you, I knew my heart had found its home. 💛',
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
    title: 'First Virtual Date',
    date: 'When Distance Didn\'t Matter',
    description:
      'Hours flew by like minutes. We talked, laughed, and fell deeper — even through a screen. Distance was just a number.',
    photoUrl: 'https://placehold.co/400x300/87CEEB/333?text=💻+First+Date',
    flirtyMessage:
      'I could listen to your voice forever. Every call makes my heart race like the very first time. 🥰',
    ukrainianEndearment: 'Зірочка моя — My little star ⭐',
    puzzle: {
      type: 'blank',
      question: '"Every time I hear your voice, it feels like _______."',
      correctAnswer: 'HOME',
      hint: 'A place where you truly belong… 🏠',
    },
  },
  {
    id: 3,
    title: 'First "I Love You"',
    date: 'Three Words, One Universe',
    description:
      'My heart was pounding. Those three words changed everything — and I\'d say them a million times again.',
    photoUrl: 'https://placehold.co/400x300/FF6B9D/fff?text=💕+I+Love+You',
    flirtyMessage:
      'I love you more with every sunrise. You are my forever, my always, my everything.',
    ukrainianEndearment: 'Кохання моє — My love 💗',
    puzzle: {
      type: 'scramble',
      question: 'Unscramble this — what I want to say to you every day:',
      scrambled: 'ROEEVRF',
      correctAnswer: 'FOREVER',
      hint: 'It never ends… ♾️',
    },
  },
  {
    id: 4,
    title: 'Our Special Place',
    date: 'Where Our Souls Danced',
    description:
      'That place where the world stood still and it was just us. Every cobblestone, every sunset — ours.',
    photoUrl: 'https://placehold.co/400x300/DDA0DD/333?text=🏰+Our+Place',
    flirtyMessage:
      'One day we\'ll go back and I\'ll hold your hand exactly like I did the first time. 🌅',
    ukrainianEndearment: 'Любов моя — My love 🌹',
    puzzle: {
      type: 'image-guess',
      question: 'What word describes how you felt in our special place?',
      correctAnswer: 'MAGICAL',
      hint: 'Like a fairy tale come true… ✨',
      imageUrl: 'https://placehold.co/400x300/E6E6FA/333?text=✨+Guess+Me',
    },
  },
  {
    id: 5,
    title: 'First Kiss',
    date: 'When Time Froze',
    description:
      'The world disappeared. There was only your warmth, your breath, and that perfect moment I\'ll never forget.',
    photoUrl: 'https://placehold.co/400x300/FFB6C1/333?text=💋+First+Kiss',
    flirtyMessage:
      'That kiss replays in my mind on loop. I crave your lips like the flowers crave the sun. 🌻💋',
    ukrainianEndearment: 'Моє серденько — My little heart 💖',
    puzzle: {
      type: 'blank',
      question: '"When we kissed, I felt _______ in my stomach."',
      correctAnswer: 'BUTTERFLIES',
      hint: 'They flutter inside you… 🦋',
    },
  },
  {
    id: 6,
    title: 'Our Inside Joke',
    date: 'What Only We Understand',
    description:
      'That thing that makes us both burst out laughing when no one else gets it. Our secret language of love.',
    photoUrl: 'https://placehold.co/400x300/98FB98/333?text=😂+Inside+Joke',
    flirtyMessage:
      'Your laugh is my favourite sound in the universe. I\'d cross oceans just to hear it. 😂❤️',
    ukrainianEndearment: 'Сонечко — Little sun ☀️',
    puzzle: {
      type: 'scramble',
      question: 'Unscramble — what your laugh gives me:',
      scrambled: 'SNHIPSEAP',
      correctAnswer: 'HAPPINESS',
      hint: 'Pure joy… 😊',
    },
  },
  {
    id: 7,
    title: 'The Night We Were Closest',
    date: 'Two Hearts, One Beat',
    description:
      'Wrapped in each other, the rest of the world faded away. A memory written in starlight and whispered promises.',
    photoUrl: 'https://placehold.co/400x300/191970/FFD700?text=🌙+Starlight',
    flirtyMessage:
      'Being close to you is like finding the missing piece of my soul. You complete me in ways words can\'t describe. 🌙✨',
    ukrainianEndearment: 'Ти — моє все — You are my everything 💫',
    puzzle: {
      type: 'blank',
      question: '"You are my _______ in every lifetime."',
      correctAnswer: 'SOULMATE',
      hint: 'Two souls meant for each other… 💫',
    },
  },
  {
    id: 8,
    title: 'Our Future Dreams',
    date: 'What Awaits Us',
    description:
      'A house with sunflowers in the garden, mornings in each other\'s arms, and a lifetime of adventures together.',
    photoUrl: 'https://placehold.co/400x300/FFD700/333?text=🌻+Our+Future',
    flirtyMessage:
      'Every dream I have starts and ends with you. I can\'t wait to build our forever, one sunflower at a time. 🌻💛',
    ukrainianEndearment: 'Назавжди твій / твоя — Forever yours 💛',
    puzzle: {
      type: 'scramble',
      question: 'Unscramble — what I\'ll do with you:',
      scrambled: 'SALWYA',
      correctAnswer: 'ALWAYS',
      hint: 'Without end, without pause… 💛',
    },
  },
];
