import React from 'react';
import { useGameState } from '../../context/GameStateContext';
import CompletingSquare from './CompletingSquare';
import GirihTiling from './GirihTiling';

export default function IslamicLevel() {
  const { activeSubtask } = useGameState();

  if (activeSubtask === 2) {
    return <GirihTiling />;
  }

  return <CompletingSquare />;
}
