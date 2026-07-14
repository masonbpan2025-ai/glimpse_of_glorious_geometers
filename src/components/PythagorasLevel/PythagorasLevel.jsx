import React from 'react';
import { useGameState } from '../../context/GameStateContext';
import RearrangementProof from './RearrangementProof';

export default function PythagorasLevel() {
  const { activeSubtask } = useGameState();

  return <RearrangementProof />;
}
