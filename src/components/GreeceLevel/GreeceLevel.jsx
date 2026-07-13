import React from 'react';
import { useGameState } from '../../context/GameStateContext';
import TheoremVisualizer from './TheoremVisualizer';
import PyramidSimulator from './PyramidSimulator';
import ShipSimulator from './ShipSimulator';

export default function GreeceLevel() {
  const { activeSubtask } = useGameState();

  if (activeSubtask === 2) return <PyramidSimulator />;
  if (activeSubtask === 3) return <ShipSimulator />;
  return <TheoremVisualizer />;
}
