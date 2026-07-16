import React from 'react';
import { useGameState } from '../../context/GameStateContext';
import RearrangementProof from './RearrangementProof';
import IrrationalNumbers from './IrrationalNumbers';
import PythagoreanTuning from './PythagoreanTuning';
import EqualTemperament from './EqualTemperament';

export default function PythagorasLevel() {
  const { activeSubtask } = useGameState();

  if (activeSubtask === 4) {
    return <EqualTemperament />;
  }
  if (activeSubtask === 3) {
    return <PythagoreanTuning />;
  }
  if (activeSubtask === 2) {
    return <IrrationalNumbers />;
  }

  return <RearrangementProof />;
}
