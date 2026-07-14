import React from 'react';
import { useGameState } from '../../context/GameStateContext';
import RearrangementProof from './RearrangementProof';
import IrrationalNumbers from './IrrationalNumbers';

export default function PythagorasLevel() {
  const { activeSubtask } = useGameState();

  if (activeSubtask === 2) {
    return <IrrationalNumbers />;
  }

  return <RearrangementProof />;
}
