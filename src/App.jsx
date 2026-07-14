import React from 'react';
import { GameStateProvider, useGameState } from './context/GameStateContext';
import Background from './components/Background';
import MainMenu from './components/MainMenu';
import EgyptLevel from './components/EgyptLevel/EgyptLevel';
import GreeceLevel from './components/GreeceLevel/GreeceLevel';
import PythagorasLevel from './components/PythagorasLevel/PythagorasLevel';
import IslamicLevel from './components/IslamicLevel/IslamicLevel';

function AppContent() {
  const { activeLevel } = useGameState();

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Ambient Parallax Background */}
      <Background />

      {/* View routing */}
      {activeLevel === null ? (
        <MainMenu />
      ) : activeLevel === 1 ? (
        <EgyptLevel />
      ) : activeLevel === 2 ? (
        <GreeceLevel />
      ) : activeLevel === 3 ? (
        <PythagorasLevel />
      ) : activeLevel === 4 ? (
        <IslamicLevel />
      ) : (
        // Fallback for other levels if unlocked somehow
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/90 text-white z-50">
          <h2 className="text-xl font-bold font-serif mb-4 text-egypt-gold">Level under construction!</h2>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-egypt-terracotta text-white rounded font-bold text-xs"
          >
            Reload Menu
          </button>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <GameStateProvider>
      <AppContent />
    </GameStateProvider>
  );
}
