import { create } from 'zustand';
import { milestones } from './data/milestones';

const TOTAL = milestones.length;
const COMPLETION_STORAGE_KEY = 'vira_journey_completion_v1';

const readCompletionFromStorage = () => {
  if (typeof window === 'undefined') {
    return { completed: false, bloomedFlowers: [] };
  }

  try {
    const raw = window.localStorage.getItem(COMPLETION_STORAGE_KEY);
    if (!raw) {
      return { completed: false, bloomedFlowers: [] };
    }

    const parsed = JSON.parse(raw);
    const completed = Boolean(parsed?.completed);
    const bloomedFlowers = Array.isArray(parsed?.bloomedFlowers) ? parsed.bloomedFlowers : [];
    return { completed, bloomedFlowers };
  } catch (_error) {
    return { completed: false, bloomedFlowers: [] };
  }
};

const writeCompletionToStorage = (completed, bloomedFlowers = []) => {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    if (!completed) {
      window.localStorage.removeItem(COMPLETION_STORAGE_KEY);
      return;
    }

    window.localStorage.setItem(
      COMPLETION_STORAGE_KEY,
      JSON.stringify({
        completed: true,
        bloomedFlowers,
      }),
    );
  } catch (_error) {
    // Ignore persistence failures.
  }
};

const persistedCompletion = readCompletionFromStorage();

const useGameStore = create((set, get) => ({
  gameState: persistedCompletion.completed ? 'final' : 'welcome',   // 'welcome' | 'playing' | 'final'
  currentMilestone: persistedCompletion.completed ? TOTAL - 1 : 0,
  bloomedFlowers: persistedCompletion.completed ? persistedCompletion.bloomedFlowers : [],
  pendingBloom: null,
  bloomSplash: {
    active: false,
    milestoneIndex: null,
    variant: 0,
  },
  lastUnlockedMilestone: null,
  showTimelineModal: false,
  currentModalData: null,
  puzzleShake: false,

  startGame: () => set({ gameState: 'playing' }),

  solvePuzzle: () => {
    const s = get();
    if (s.bloomSplash.active) return;

    const milestone = milestones[s.currentMilestone];
    const types = ['sunflower', 'rose', 'poppy'];
    const pendingBloom = {
      id: s.bloomedFlowers.length,
      type: types[s.bloomedFlowers.length % 3],
      milestoneIndex: s.currentMilestone,
    };

    set({
      pendingBloom,
      bloomSplash: {
        active: true,
        milestoneIndex: s.currentMilestone,
        variant: (s.currentMilestone + s.bloomedFlowers.length) % 8,
      },
      lastUnlockedMilestone: milestone,
      showTimelineModal: false,
      currentModalData: milestone,
      puzzleShake: false,
    });
  },

  completeBloomSplash: () => {
    const s = get();
    if (!s.bloomSplash.active) return;

    const next = s.currentMilestone + 1;
    if (next >= TOTAL) {
      const nextBloomedFlowers = s.pendingBloom
        ? [...s.bloomedFlowers, s.pendingBloom]
        : s.bloomedFlowers;
      writeCompletionToStorage(true, nextBloomedFlowers);
      set({
        bloomedFlowers: nextBloomedFlowers,
        pendingBloom: null,
        bloomSplash: { active: false, milestoneIndex: null, variant: 0 },
        gameState: 'final',
      });
      return;
    }

    set({
      bloomSplash: { active: false, milestoneIndex: null, variant: 0 },
      currentMilestone: next,
      showTimelineModal: Boolean(s.lastUnlockedMilestone),
      currentModalData: s.lastUnlockedMilestone,
    });
  },

  triggerShake: () => {
    set({ puzzleShake: true });
    setTimeout(() => set({ puzzleShake: false }), 600);
  },

  openTimeline: () => {
    const s = get();
    if (!s.lastUnlockedMilestone) return;
    set({
      showTimelineModal: true,
      currentModalData: s.lastUnlockedMilestone,
    });
  },

  closeModal: () => {
    const s = get();
    const nextBloomedFlowers = s.pendingBloom
      ? [...s.bloomedFlowers, s.pendingBloom]
      : s.bloomedFlowers;

    set({
      bloomedFlowers: nextBloomedFlowers,
      pendingBloom: null,
      showTimelineModal: false,
    });
  },

  get progress() {
    return (get().bloomedFlowers.length / TOTAL) * 100;
  },

  resetGame: () =>
    (writeCompletionToStorage(false),
    set({
      gameState: 'welcome',
      currentMilestone: 0,
      bloomedFlowers: [],
      pendingBloom: null,
      bloomSplash: { active: false, milestoneIndex: null, variant: 0 },
      lastUnlockedMilestone: null,
      showTimelineModal: false,
      currentModalData: null,
      puzzleShake: false,
    })),
}));

export { TOTAL };
export default useGameStore;
