import React from 'react';
import { useGameState } from '../../context/GameStateContext';
import Pyramid from './Pyramid';
import Cone from './Cone';
import Sphere from './Sphere';

export default function EudoxusLevel() {
  const { activeSubtask } = useGameState();

  if (activeSubtask === 3) {
    return <Sphere />;
  }

  if (activeSubtask === 2) {
    return <Cone />;
  }

  return <Pyramid />;
}
