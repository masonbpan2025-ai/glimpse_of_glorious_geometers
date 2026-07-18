import React from 'react';
import { useGameState } from '../../context/GameStateContext';
import Pyramid from './Pyramid';
import Cone from './Cone';

export default function EudoxusLevel() {
  const { activeSubtask } = useGameState();

  if (activeSubtask === 2) {
    return <Cone />;
  }

  return <Pyramid />;
}
