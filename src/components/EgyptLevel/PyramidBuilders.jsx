import React, { useState, useMemo } from 'react';
import { useGameState } from '../../context/GameStateContext';
import LevelShell from '../LevelShell';
import PyramidBuildersLeftPanel from './PyramidBuildersLeftPanel';
import PyramidBuildersRightCanvas from './PyramidBuildersRightCanvas';

export default function PyramidBuilders() {
  const { completedSubtasks, activeSubtask } = useGameState();

  // --- Slider state ---
  const [baseWidth, setBaseWidth] = useState(360);
  const [height, setHeight] = useState(229);

  // --- Derived math ---
  const halfBase = baseWidth / 2;
  const rad = Math.atan2(height, halfBase);
  const slope = (rad * 180) / Math.PI;
  const seked = 7 * (halfBase / height);

  // --- Structural integrity ---
  const integrity = useMemo(() => {
    if (slope > 54.5) return 'collapse';
    if (slope >= 50.5) return 'perfect';
    if (slope >= 43) return 'stable';
    return 'shallow';
  }, [slope]);

  // --- Challenge uses Great Pyramid of Giza base (230m) ---
  const challengeBase = 230;
  const challengeVolume = useMemo(() => {
    const idealHeight = (challengeBase / 2) * (7 / 5.5);
    return (1 / 3) * (challengeBase ** 2) * idealHeight;
  }, [challengeBase]);

  // --- Verification state ---
  const [volumeAnswer, setVolumeAnswer] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  return (
    <LevelShell
      title="Level 1: Ancient Egypt"
      activeSubtask={activeSubtask}
      completedSubtasks={completedSubtasks}
      leftPanelClass="w-full md:w-1/3"
      canvas={
        <PyramidBuildersRightCanvas
          baseWidth={baseWidth}
          height={height}
          slope={slope}
          seked={seked}
          integrity={integrity}
          onBaseChange={setBaseWidth}
          onHeightChange={setHeight}
        />
      }
    >
      <PyramidBuildersLeftPanel
        slope={slope}
        seked={seked}
        integrity={integrity}
        challengeBase={challengeBase}
        challengeVolume={challengeVolume}
        isSuccess={isSuccess}
        setIsSuccess={setIsSuccess}
        errorMsg={errorMsg}
        setErrorMsg={setErrorMsg}
        volumeAnswer={volumeAnswer}
        setVolumeAnswer={setVolumeAnswer}
      />
    </LevelShell>
  );
}
