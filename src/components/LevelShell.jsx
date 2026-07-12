import React from 'react';
import { useGameState } from '../context/GameStateContext';
import { ArrowLeft, Lock, CheckCircle2, Star } from 'lucide-react';

export default function LevelShell({ title, activeSubtask, completedSubtasks, children, canvas }) {
  const { exitToMenu, selectSubtask } = useGameState();

  const isSubtask1Completed = completedSubtasks.includes('1-1');

  return (
    <div className="w-full h-screen flex flex-col bg-[#07090e] select-none text-slate-200">
      {/* 1. Navigation Header */}
      <header className="h-16 border-b border-slate-800/60 bg-[#0a0f1d] px-6 flex items-center justify-between z-20 shrink-0">
        <div className="flex items-center gap-4">
          <button
            onClick={exitToMenu}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-egypt-terracotta text-xs font-semibold hover:text-egypt-terracotta transition cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Map View</span>
          </button>
          
          <div className="h-4 w-[1px] bg-slate-800" />

          <div className="flex items-center gap-2">
            <span className="font-serif font-extrabold text-sm md:text-base bg-gradient-to-r from-egypt-gold to-egypt-terracotta bg-clip-text text-transparent">
              {title}
            </span>
          </div>
        </div>

        {/* Subtask Tabs */}
        <div className="flex gap-2">
          {/* Subtask 1 Tab */}
          <button
            onClick={() => selectSubtask(1)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeSubtask === 1
                ? 'bg-egypt-terracotta text-white shadow-[0_0_10px_rgba(231,111,81,0.3)]'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-400 border border-slate-800 hover:border-slate-700'
            }`}
          >
            {completedSubtasks.includes('1-1') && (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            )}
            <span>Task 1: Rope Stretchers</span>
          </button>

          {/* Subtask 2 Tab */}
          <button
            onClick={() => {
              if (isSubtask1Completed) selectSubtask(2);
            }}
            disabled={!isSubtask1Completed}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              activeSubtask === 2
                ? 'bg-egypt-terracotta text-white shadow-[0_0_10px_rgba(231,111,81,0.3)] cursor-pointer'
                : isSubtask1Completed
                ? 'bg-slate-900 hover:bg-slate-800 text-slate-400 border border-slate-800 hover:border-slate-700 cursor-pointer'
                : 'bg-slate-950 text-slate-600 border border-slate-900 cursor-not-allowed opacity-50'
            }`}
          >
            {!isSubtask1Completed ? (
              <Lock className="w-3 h-3 text-slate-600" />
            ) : completedSubtasks.includes('1-2') ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            ) : null}
            <span>Task 2: Pyramid Builders</span>
          </button>
        </div>
      </header>

      {/* 2. Main content split view */}
      <div className="flex-grow flex overflow-hidden">
        {/* Left Side: Instructions / Controls Panel */}
        <aside className="w-full md:w-[400px] lg:w-[440px] bg-[#090e1a]/80 backdrop-blur-md border-r border-slate-800/60 p-5 md:p-6 overflow-y-auto flex flex-col justify-between shrink-0 z-10 shadow-xl">
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
