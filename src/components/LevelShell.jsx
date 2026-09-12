import React from 'react';
import { useGameState } from '../context/GameStateContext';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function LevelShell({ title, activeSubtask, completedSubtasks, children, canvas, leftPanelClass }) {
  const { exitToMenu, selectSubtask, activeLevel } = useGameState();

  const levelTasksConfig = {
    1: [
      { id: 1, label: 'Task 1: Rope Stretchers', key: '1-1', unlockKey: null },
      { id: 2, label: 'Task 2: Pyramid Builders', key: '1-2', unlockKey: '1-1' }
    ],
    2: [
      { id: 1, label: 'Task 1: Theorem Visualizer', key: '2-1', unlockKey: null },
      { id: 2, label: 'Task 2: Pyramid Shadows', key: '2-2', unlockKey: '2-1' },
      { id: 3, label: 'Task 3: Distance at Sea', key: '2-3', unlockKey: '2-2' },
      { id: 4, label: 'Task 4: Circle Theorem', key: '2-4', unlockKey: '2-3' }
    ],
    3: [
      { id: 1, label: 'Task 1: Rearrangement Proof', key: '3-1', unlockKey: null },
      { id: 2, label: 'Task 2: Irrational Numbers', key: '3-2', unlockKey: '3-1' },
      { id: 3, label: 'Task 3: Pythagorean Tuning', key: '3-3', unlockKey: '3-2' },
      { id: 4, label: 'Task 4: Equal Temperament', key: '3-4', unlockKey: '3-3' }
    ],
    4: [
      { id: 1, label: 'Task 1: Pyramid', key: '4-1', unlockKey: null },
      { id: 2, label: 'Task 2: Cone', key: '4-2', unlockKey: '4-1' },
      { id: 3, label: 'Task 3: Sphere', key: '4-3', unlockKey: '4-2' }
    ],
    5: [
      { id: 1, label: 'Task 1: Formal Logic', key: '5-1', unlockKey: null },
      { id: 2, label: 'Task 2: Axiomatic Science', key: '5-2', unlockKey: '5-1' },
      { id: 3, label: 'Task 3: First Principles', key: '5-3', unlockKey: '5-2' },
      { id: 4, label: 'Task 4: Demonstration', key: '5-4', unlockKey: '5-3' },
      { id: 5, label: 'Task 5: Science Classes', key: '5-5', unlockKey: '5-4' }
    ],
    6: [
      { id: 1, label: 'Task 1: Basics', key: '6-1', unlockKey: null },
      { id: 2, label: 'Task 2: Book I: plane geometry', key: '6-2', unlockKey: '6-1' },
      { id: 3, label: 'Task 3: Book III: Circles and Angles', key: '6-3', unlockKey: '6-2' },
      { id: 4, label: 'Task 4: Book II & IV: Geometric Algebra & Polygons', key: '6-4', unlockKey: '6-3' },
      { id: 5, label: 'Task 5: Book V & VI: Proportions & Similarities', key: '6-5', unlockKey: '6-4' }
    ],
    7: [
      { id: 1, label: 'Task 1: Surface Area of Sphere', key: '7-1', unlockKey: null },
      { id: 2, label: 'Task 2: Triangle Centroid & Lever', key: '7-2', unlockKey: '7-1' },
      { id: 3, label: 'Task 3: Centroid of Parabola', key: '7-3', unlockKey: '7-2' }
    ]
  };

  const tasks = levelTasksConfig[activeLevel] || [];
  const activeColorClass = activeLevel === 1
    ? 'bg-egypt-terracotta text-white shadow-[0_0_10px_rgba(231,111,81,0.3)]'
    : activeLevel === 3
    ? 'bg-purple-600 text-white shadow-[0_0_10px_rgba(147,51,234,0.3)]'
    : activeLevel === 4
    ? 'bg-emerald-600 text-white shadow-[0_0_10px_rgba(16,185,129,0.3)]'
    : activeLevel === 5
    ? 'bg-amber-600 text-white shadow-[0_0_10px_rgba(217,119,6,0.3)]'
    : activeLevel === 6
    ? 'bg-indigo-600 text-white shadow-[0_0_10px_rgba(99,102,241,0.3)]'
    : activeLevel === 7
    ? 'bg-cyan-600 text-white shadow-[0_0_10px_rgba(6,182,212,0.4)]'
    : 'bg-blue-600 text-white shadow-[0_0_10px_rgba(59,130,246,0.3)]';

  return (
    <div className="w-full h-screen flex flex-col bg-[#07090e] select-none text-slate-200">
      {/* 1. Navigation Header */}
      <header className="h-16 border-b border-slate-800/60 bg-[#0a0f1d] px-6 flex items-center justify-between z-20 shrink-0">
        <div className="flex items-center gap-4">
          <button
            onClick={exitToMenu}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-blue-500 text-xs font-semibold hover:text-blue-400 transition cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Map View</span>
          </button>
          
          <div className="h-4 w-[1px] bg-slate-800" />

          <div className="flex items-center gap-2">
            <span className="font-serif font-extrabold text-sm md:text-base bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
              {title}
            </span>
          </div>
        </div>

        {/* Subtask Tabs */}
        <div className="flex gap-2">
          {tasks.map((task) => {
            const isCompleted = completedSubtasks.includes(task.key);
            const isActive = activeSubtask === task.id;

            return (
              <button
                key={task.id}
                onClick={() => selectSubtask(task.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  isActive
                    ? `${activeColorClass}`
                    : 'bg-slate-900 hover:bg-slate-800 text-slate-400 border border-slate-800 hover:border-slate-700'
                }`}
              >
                {isCompleted && (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                )}
                <span>{task.label}</span>
              </button>
            );
          })}
        </div>
      </header>

      {/* 2. Main content split view */}
      <div className="flex-grow flex overflow-hidden">
        {/* Left Side: Instructions / Controls Panel */}
        <aside className={`${leftPanelClass || 'w-full md:w-[400px] lg:w-[440px]'} bg-[#090e1a]/80 backdrop-blur-md border-r border-slate-800/60 p-5 md:p-6 overflow-y-auto flex flex-col justify-between shrink-0 z-10 shadow-xl`}>
          {children}
        </aside>

        {/* Right Side: Large Interactive Canvas Area */}
        <main className="flex-grow h-full relative overflow-hidden bg-slate-950/20">
          {canvas}
        </main>
      </div>
    </div>
  );
}
