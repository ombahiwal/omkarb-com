import { useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import useGameStore from './store';
import PetalParticles from './components/PetalParticles';
import WelcomeScreen from './components/WelcomeScreen';
import GameScreen from './components/GameScreen';
import TimelineModal from './components/TimelineModal';
import FinalScreen from './components/FinalScreen';
import './styles/vira.css';

export default function ViraJourneyApp() {
  const gameState = useGameStore((s) => s.gameState);

  /* Override portfolio body styles */
  useEffect(() => {
    document.documentElement.classList.add('vira-html');
    document.body.classList.add('vira-body');
    document.title = 'Our Eternal Sunflower Path 🌻';
    return () => {
      document.documentElement.classList.remove('vira-html');
      document.body.classList.remove('vira-body');
    };
  }, []);

  return (
    <div className="vira-app">
      {/* Persistent falling-petal background */}
      <PetalParticles />

      <AnimatePresence mode="wait">
        {gameState === 'welcome' && <WelcomeScreen key="welcome" />}
        {gameState === 'playing' && <GameScreen key="game" />}
        {gameState === 'final' && <FinalScreen key="final" />}
      </AnimatePresence>

      {/* Timeline modal renders on top of everything */}
      <TimelineModal />
    </div>
  );
}
