import React, { useState } from 'react';
import { useGameState } from '../context/GameStateContext';
import { Lock, Unlock, Compass, RotateCcw, ArrowRight, BookOpen, Star } from 'lucide-react';

export default function MainMenu() {
  const { unlockedLevels, startLevel, completedSubtasks, resetGame } = useGameState();
  const [selectedLevelId, setSelectedLevelId] = useState(1);

  const levels = [
    {
      id: 1,
      title: 'Level 1: Ancient Egypt',
      subtitle: 'The Nile Floodplains & Pyramids',
      desc: 'Survey land with knotted ropes and engineer monumental pyramids.',
      details: 'The Egyptians developed practical geometry to restore farm boundaries after Nile floods and construct stable pyramids that would endure for eternity.',
      civilization: 'Ancient Egypt',
      unlocked: true,
      subtasks: [
        { id: 1, title: 'The Rope Stretchers', desc: 'Create a rigid 3-4-5 right triangle to measure field heights.' },
        { id: 2, title: 'The Pyramid Builders', desc: 'Find the exact seked (51.84°) required by the Pharaoh.' }
      ]
    },
    {
      id: 2,
      title: 'Level 2: Thales and Intercept Theorem',
      subtitle: 'Thales & Intercept Theorem',
      desc: 'Explore similar triangles and calculate unreachable distances.',
      details: 'Greek thinkers like Thales of Miletus transitioned geometry from empirical measurements to deductive logic, showing how simple proportional ratios solve grand calculations.',
      civilization: 'Ancient Greece',
      unlocked: false,
      subtasks: [
        { id: 1, title: 'Theorem Visualizer', desc: 'Explore parallel intercepts and triangle ratios.' },
        { id: 2, title: 'Pyramid Shadows', desc: 'Determine pyramid heights using sun shadow ratios.' },
        { id: 3, title: 'Distance at Sea', desc: 'Calculate naval distances using shore triangulation.' },
        { id: 4, title: 'Circle Theorem', desc: 'Discover why angles inscribed in a semicircle are always 90°.' }
      ]
    },
    {
      id: 3,
      title: 'Level 3: Pythagoras',
      subtitle: 'Pythagorean Theorem & Rearrangement',
      desc: 'Explore the foundations of the Pythagorean theorem through constructed squares and visual rearrangements.',
      details: 'Visual rearrangements allow us to easily grasp why the sum of the areas of the two squares on the legs (a² + b²) equals the area of the square on the hypotenuse (c²).',
      civilization: 'Ancient Samos',
      unlocked: false,
      subtasks: [
        { id: 1, title: 'Rearrangement Proof', desc: 'Rearrange four right triangles inside a square to prove that a² + b² = c².' },
        { id: 2, title: 'Irrational Numbers', desc: 'Explore the geometric proof of the irrationality of √2 via infinite descent.' },
        { id: 3, title: 'Pythagorean Tuning', desc: 'Discover how Pythagoras derived the musical scale from pure geometric ratios.' }
      ]
    },
    {
      id: 4,
      title: 'Level 4: Islamic Golden Age',
      subtitle: 'Geometric Algebra & Tiling',
      desc: 'Algebra meets geometry in intricate visual form.',
      details: 'Islamic scholars solved equations through geometric constructions and created mesmerizing infinite tile patterns that adorn mosques to this day.',
      civilization: 'Islamic Golden Age',
      unlocked: false,
      subtasks: [
        { id: 1, title: 'Completing the Square', desc: 'Solve algebraic quadratic equations visually using square boxes.' },
        { id: 2, title: 'Girih Tiling Patterns', desc: 'Align pentagonal and decagonal decagrams to form infinite tilings.' }
      ]
    }
  ];

  const selectedLevel = levels.find((l) => l.id === selectedLevelId) || levels[0];
  const isLevelUnlocked = unlockedLevels.includes(selectedLevel.id);

  return (
    <div className="absolute inset-0 w-full h-full flex justify-between p-6 md:p-10 pointer-events-none z-10 overflow-hidden">
      {/* 1. Left Sidebar: Civilization selection list */}
      <div className="w-full md:w-96 glass-panel rounded-2xl p-6 flex flex-col justify-between pointer-events-auto h-full shadow-2xl select-none">
        <div className="flex flex-col gap-5 overflow-hidden">
          {/* Header decoration */}
          <div className="flex flex-col gap-2">
            <div className="flex gap-2.5 items-center text-egypt-gold">
              <Compass className="w-6 h-6 animate-pulse text-egypt-gold filter drop-shadow-[0_0_4px_rgba(233,196,106,0.5)]" />
              <div className="flex gap-1.5">
                <Star className="w-4 h-4 text-egypt-terracotta" />
                <Star className="w-4 h-4 text-egypt-gold" />
              </div>
            </div>
            <h1 className="font-serif font-extrabold text-2xl md:text-3xl leading-tight bg-gradient-to-r from-white via-egypt-gold to-egypt-terracotta bg-clip-text text-transparent filter drop-shadow-[0_0_15px_rgba(233,196,106,0.15)]">
              Glimpse of Glorious Geometers
            </h1>
            <p className="text-xs text-slate-300 leading-relaxed">
              Embark on a historical mathematical voyage. Solve geometric puzzles that shaped the wonders of our world.
            </p>
            <div className="w-full h-[1.5px] bg-gradient-to-r from-transparent via-egypt-gold/30 to-transparent mt-2" />
          </div>

          {/* Level List */}
          <div className="flex flex-col gap-3 overflow-y-auto pr-1">
            {levels.map((level) => {
              const isUnlocked = unlockedLevels.includes(level.id);
              const isActive = selectedLevelId === level.id;

              return (
                <button
                  key={level.id}
                  onClick={() => setSelectedLevelId(level.id)}
                  className={`w-full flex items-start gap-4 p-4 rounded-xl text-left border transition-all duration-300 relative group cursor-pointer ${
                    isActive
                      ? 'bg-egypt-lapis/40 border-egypt-gold shadow-[0_0_15px_rgba(233,196,106,0.15)] translate-x-1'
                      : 'bg-slate-900/40 border-slate-800/80 hover:bg-slate-900/60 hover:border-slate-700/80 hover:translate-x-1'
                  }`}
                >
                  <div className="mt-0.5">
                    {isUnlocked ? (
                      <Unlock className={`w-4 h-4 ${isActive ? 'text-egypt-gold' : 'text-slate-400'}`} />
                    ) : (
                      <Lock className="w-4 h-4 text-slate-600" />
                    )}
                  </div>
                  <div className="flex-grow">
                    <h3 className={`font-semibold text-sm ${isActive ? 'text-egypt-gold' : 'text-slate-200'}`}>
                      {level.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-1 group-hover:line-clamp-none transition-all">
                      {level.subtitle}
                    </p>
                  </div>
                  {!isUnlocked && (
                    <span className="text-[10px] bg-slate-950/60 text-slate-500 font-bold px-1.5 py-0.5 rounded border border-slate-800">
                      Locked
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Reset button at the bottom */}
        <div className="mt-4 pt-4 border-t border-slate-800/60 flex justify-between items-center text-xs text-slate-400">
          <span>Progress syncs locally</span>
          <button
            onClick={resetGame}
            className="flex items-center gap-1 hover:text-egypt-terracotta transition cursor-pointer"
            title="Reset All Progress"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset State
          </button>
        </div>
      </div>

      {/* 2. Right Briefing Panel: Selected civilization details */}
      <div className="hidden md:flex w-[420px] glass-panel rounded-2xl p-6 flex-col justify-between pointer-events-auto h-[85%] self-end shadow-2xl overflow-y-auto">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-egypt-gold" />
            <span className="text-xs uppercase font-bold tracking-widest text-egypt-gold">
              Civilization Briefing
            </span>
          </div>
          <h2 className="font-serif font-bold text-2xl text-egypt-gold">
            {selectedLevel.civilization}
          </h2>
          <p className="text-sm leading-relaxed text-slate-200">
            {selectedLevel.desc}
          </p>
          <div className="bg-slate-950/40 border border-slate-800/60 rounded-xl p-4 text-xs leading-relaxed text-slate-300">
            {selectedLevel.details}
          </div>
        </div>

        {/* Launch button container */}
        <div className="mt-6">
          {isLevelUnlocked ? (
            <button
              onClick={() => startLevel(selectedLevel.id)}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-egypt-terracotta to-egypt-gold text-slate-950 hover:text-black font-extrabold text-sm transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-[0_0_20px_rgba(231,111,81,0.4)] active:translate-y-0 cursor-pointer"
            >
              <span>Launch Core Puzzles</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <div className="w-full text-center py-3 px-4 rounded-xl bg-slate-950/30 border border-slate-800 text-slate-500 font-semibold text-xs flex items-center justify-center gap-2">
              <Lock className="w-3.5 h-3.5" />
              Complete previous civilization to unlock
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
