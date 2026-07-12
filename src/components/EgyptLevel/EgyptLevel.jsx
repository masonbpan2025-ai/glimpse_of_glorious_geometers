import React from 'react';
import { useGameState } from '../../context/GameStateContext';
import RopeStretchers from './RopeStretchers';
import PyramidBuilders from './PyramidBuilders';

export default function EgyptLevel() {
  const { activeSubtask } = useGameState();

  return activeSubtask === 2 ? <PyramidBuilders /> : <RopeStretchers />;
}
