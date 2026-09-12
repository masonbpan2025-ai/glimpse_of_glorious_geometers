import React, { createContext, useContext, useState, useEffect } from 'react';

const GameStateContext = createContext();

export const GameStateProvider = ({ children }) => {
  // Unlocked levels: 1 = Egypt, 2 = Greece, 3 = Pythagoras, 4 = Eudoxus, 5 = Aristotle, 6 = Euclid, 7 = Archimedes
  const [unlockedLevels, setUnlockedLevels] = useState([1, 2, 3, 4, 5, 6, 7]);
  const [activeLevel, setActiveLevel] = useState(null);
  const [activeSubtask, setActiveSubtask] = useState(1);
  const [completedSubtasks, setCompletedSubtasks] = useState([]);

  // Load state from localStorage on startup if available
  useEffect(() => {
    const saved = localStorage.getItem('glimpse_geometers_state');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.unlockedLevels) setUnlockedLevels(parsed.unlockedLevels);
        if (parsed.completedSubtasks) setCompletedSubtasks(parsed.completedSubtasks);
      } catch (e) {
        console.error('Error loading game state', e);
      }
    }
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(
      'glimpse_geometers_state',
      JSON.stringify({ unlockedLevels, completedSubtasks })
    );
  }, [unlockedLevels, completedSubtasks]);

  const startLevel = (levelId) => {
    setActiveLevel(levelId);
    setActiveSubtask(1);
  };

  const exitToMenu = () => {
    setActiveLevel(null);
  };

  const selectSubtask = (subtaskId) => {
    setActiveSubtask(subtaskId);
  };

  const completeSubtask = (levelId, subtaskId) => {
    const taskKey = `${levelId}-${subtaskId}`;
    if (!completedSubtasks.includes(taskKey)) {
      const nextCompleted = [...completedSubtasks, taskKey];
      setCompletedSubtasks(nextCompleted);

      // If Level 1 Subtask 2 is completed, we complete the entire level and unlock Level 2
      if (levelId === 1 && subtaskId === 2) {
        unlockLevel(2);
      }

      // If Level 2 Subtask 4 is completed, we complete the entire level and unlock Level 3
      if (levelId === 2 && subtaskId === 4) {
        unlockLevel(3);
      }

      // If Level 3 Subtask 4 is completed, we complete the entire level and unlock Level 4
      if (levelId === 3 && subtaskId === 4) {
        unlockLevel(4);
      }

      // If Level 4 Subtask 3 is completed, we complete the entire level and unlock Level 5
      if (levelId === 4 && subtaskId === 3) {
        unlockLevel(5);
      }

      // If Level 5 Subtask 5 is completed, we complete the entire level and unlock Level 6
      if (levelId === 5 && subtaskId === 5) {
        unlockLevel(6);
      }

      // If Level 6 Subtask 5 is completed, we complete the entire level and unlock Level 7
      if (levelId === 6 && subtaskId === 5) {
        unlockLevel(7);
      }
    }
  };

  const unlockLevel = (levelId) => {
    if (!unlockedLevels.includes(levelId)) {
      setUnlockedLevels([...unlockedLevels, levelId]);
    }
  };

  const resetGame = () => {
    setUnlockedLevels([1, 2, 3, 4, 5, 6, 7]);
    setActiveLevel(null);
    setActiveSubtask(1);
    setCompletedSubtasks([]);
    localStorage.removeItem('glimpse_geometers_state');
  };

  return (
    <GameStateContext.Provider
      value={{
        unlockedLevels,
        activeLevel,
        activeSubtask,
        completedSubtasks,
        startLevel,
        exitToMenu,
        selectSubtask,
        completeSubtask,
        unlockLevel,
        resetGame,
      }}
    >
      {children}
    </GameStateContext.Provider>
  );
};

export const useGameState = () => {
  const context = useContext(GameStateContext);
  if (!context) {
    throw new Error('useGameState must be used within a GameStateProvider');
  }
  return context;
};
