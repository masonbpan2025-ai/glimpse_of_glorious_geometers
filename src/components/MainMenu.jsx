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
        { id: 3, title: 'Pythagorean Tuning', desc: 'Discover how Pythagoras derived the musical scale from pure geometric ratios.' },
        { id: 4, title: 'Equal Temperament', desc: 'Discover how Equal Temperament resolves the Pythagorean Comma by dividing the octave into 12 equal steps.' }
      ]
    },
    {
      id: 4,
      title: 'Level 4: Eudoxus',
      subtitle: '3D Volume and Method of Exhaustion',
      desc: 'Approximating the volume of a pyramid, cone, and sphere using the Method of Exhaustion.',
      details: 'Eudoxus of Cnidus developed the Method of Exhaustion, a rigorous precursor to integral calculus. By approximating 3D shapes with simpler slices, he proved that pyramids and cones have exactly one-third the volume of their containing prisms and cylinders, and laid the foundations to find the volume of a sphere.',
      civilization: 'Eudoxus of Cnidus',
      unlocked: false,
      subtasks: [
        { id: 1, title: 'Pyramid', desc: 'Approximate a pyramid\'s volume using rectangular prisms and find the limit.' },
        { id: 2, title: 'Cone', desc: 'Approximate a cone\'s volume using cylinder slices as detailed by Eudoxus.' },
        { id: 3, title: 'Sphere', desc: 'Approximate a sphere\'s volume using horizontal cylinder disks as detailed by Eudoxus.' }
      ]
    },
    {
      id: 5,
      title: 'Level 5: Aristotle',
      subtitle: 'Logic and the Axiomatic Method',
      desc: 'Discover formal logic, axiomatic science, and how Euclid built on Aristotelian philosophy.',
      details: 'Aristotle of Stagira laid the structural foundations of science. He defined the rules of syllogistic logic, first principles, and demonstrations, forming the exact methodological blueprints Euclid used to build the Elements.',
      civilization: 'Ancient Stagira',
      unlocked: false,
      subtasks: [
        { id: 1, title: 'Formal Logic', desc: 'Deduce valid conclusions from geometric premises.' },
        { id: 2, title: 'Axiomatic Science', desc: 'Explore the foundations and starting points of proof.' },
        { id: 3, title: 'First Principles', desc: 'Distinguish axioms, postulates, and common notions.' },
        { id: 4, title: 'Demonstration', desc: 'Understand explanatory proof and Posterior Analytics.' },
        { id: 5, title: 'Science Classes', desc: 'Separate physics, mathematics, and metaphysics.' }
      ]
    },
    {
      id: 6,
      title: "Level 6: Euclid's Elements",
      subtitle: 'Definitions, Axioms, Postulates & Propositions',
      desc: 'Master the logical structure of Euclid\'s Book I: definitions, postulates, common notions, problems, and theorems.',
      details: 'Euclid of Alexandria synthesized centuries of Greek geometry into the 13 books of the Elements. Book I establishes 23 definitions, 5 postulates, 5 common notions, and 48 propositions (split into construction Problems ending in Q.E.F. and deductive Theorems ending in Q.E.D.).',
      civilization: 'Alexandria (c. 300 BC)',
      unlocked: false,
      subtasks: [
        { id: 1, title: 'Basics', desc: 'Definitions, Axioms, Postulates, Problems & Theorems' },
        { id: 2, title: 'Book I: plane geometry', desc: 'Congruence Theorems, Triangle Properties & Constructions' },
        { id: 3, title: 'Book III: Circles and Angles', desc: 'Inscribed Angles, Cyclic Quadrilaterals & Power of a Point' },
        { id: 4, title: 'Book II & IV: Geometric Algebra & Polygons', desc: 'Law of Cosines, Golden Ratio, Golden Triangle (Prop IV.10) & Regular Pentagon (Prop IV.11-14)' },
        { id: 5, title: 'Book V & VI: Proportions & Similarities', desc: 'Thales Proportionality, Angle Bisector & Duplicate Area Ratios' }
      ]
    },
    {
      id: 7,
      title: 'Level 7: Archimedes of Syracuse',
      subtitle: 'Sphere Surface Area & Mechanical Centroids',
      desc: 'Discover Archimedes\' greatest theorems: sphere surface area (4πR²) and the Mechanical Centroid Theorem.',
      details: 'Archimedes of Syracuse (c. 287–212 BC) combined rigorous geometric proofs with mechanical levers to calculate the surface area of a sphere (4πR², ratio 2:3 to cylinder) and discover the centroids of triangles, levers, and parabolic segments.',
      civilization: 'Syracuse, Sicily (c. 250 BC)',
      unlocked: false,
      subtasks: [
        { id: 1, title: 'Surface Area of Sphere', desc: 'Prove A = 4πR² and the 2:3 ratio to circumscribed cylinder.' },
        { id: 2, title: 'Triangle Centroid & Lever', desc: 'Law of the Lever and the geometric 2:1 proof via midline similarity & equal areas.' },
        { id: 3, title: 'Area of Parabola', desc: 'Archimedes\' Mechanical Lever Method and Geometric Exhaustion: Inscribed triangles T + 1/4 T + 1/16 T + ... = 4/3 T.' }
      ]
    }
  ];

  const selectedLevel = levels.find((l) => l.id === selectedLevelId) || levels[0];
  const isLevelUnlocked = unlockedLevels.includes(selectedLevel.id);

  return (
    <div className="absolute inset-0 w-full h-full flex justify-between p-3 md:p-6 pointer-events-none z-10 overflow-hidden">
      {/* 1. Left Sidebar: Civilization selection list */}
      <div className="w-full md:w-[420px] glass-panel rounded-2xl p-4 md:p-5 flex flex-col justify-between pointer-events-auto h-full shadow-2xl select-none">
        
        {/* Header decoration - compact & pushed to top */}
        <div className="flex flex-col gap-1.5 shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex gap-2 items-center text-egypt-gold">
              <Compass className="w-5 h-5 animate-pulse text-egypt-gold filter drop-shadow-[0_0_4px_rgba(233,196,106,0.5)]" />
              <div className="flex gap-1">
                <Star className="w-3.5 h-3.5 text-egypt-terracotta" />
                <Star className="w-3.5 h-3.5 text-egypt-gold" />
              </div>
            </div>
            <span className="text-[10px] tracking-wider uppercase font-semibold text-egypt-gold/80 bg-slate-900/70 px-2 py-0.5 rounded border border-egypt-gold/25">
              Interactive Atlas
            </span>
          </div>

          <h1 className="font-serif font-extrabold text-lg md:text-xl leading-snug bg-gradient-to-r from-white via-egypt-gold to-egypt-terracotta bg-clip-text text-transparent filter drop-shadow-[0_0_10px_rgba(233,196,106,0.15)]">
            Glimpse of Glorious Geometers
          </h1>

          <p className="text-[11px] text-slate-300 leading-snug">
            Embark on a historical mathematical voyage through great geometric breakthroughs.
          </p>

          <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-egypt-gold/30 to-transparent my-1" />
        </div>

        {/* Level List - takes all available space */}
        <div className="flex-1 min-h-0 flex flex-col gap-2 overflow-y-auto pr-1 my-2">
          {levels.map((level) => {
            const isUnlocked = unlockedLevels.includes(level.id);
            const isActive = selectedLevelId === level.id;

            return (
              <button
                key={level.id}
                onClick={() => setSelectedLevelId(level.id)}
                className={`w-full flex items-center gap-3 p-2.5 md:p-3 rounded-xl text-left border transition-all duration-200 relative group cursor-pointer shrink-0 ${
                  isActive
                    ? 'bg-egypt-lapis/50 border-egypt-gold shadow-[0_0_12px_rgba(233,196,106,0.18)] translate-x-1'
                    : 'bg-slate-900/40 border-slate-800/80 hover:bg-slate-900/70 hover:border-slate-700/80 hover:translate-x-0.5'
                }`}
              >
                <div className="shrink-0">
                  {isUnlocked ? (
                    <Unlock className={`w-4 h-4 ${isActive ? 'text-egypt-gold' : 'text-slate-400'}`} />
                  ) : (
                    <Lock className="w-4 h-4 text-slate-600" />
                  )}
                </div>
                <div className="flex-grow min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <h3 className={`font-semibold text-xs md:text-sm truncate ${isActive ? 'text-egypt-gold' : 'text-slate-200'}`}>
                      {level.title}
                    </h3>
                    {!isUnlocked && (
                      <span className="text-[9px] bg-slate-950/70 text-slate-500 font-bold px-1.5 py-0.5 rounded border border-slate-800 shrink-0">
                        Locked
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 truncate mt-0.5">
                    {level.subtitle}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Reset button at the bottom */}
        <div className="pt-2 border-t border-slate-800/60 flex justify-between items-center text-[11px] text-slate-400 shrink-0">
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
      <div className="hidden md:flex w-[400px] lg:w-[440px] glass-panel rounded-2xl p-4 md:p-5 flex-col justify-between pointer-events-auto h-full shadow-2xl overflow-hidden">
        <div className="flex flex-col gap-3 min-h-0 overflow-y-auto pr-1">
          <div className="flex items-center gap-2 shrink-0">
            <BookOpen className="w-4 h-4 text-egypt-gold" />
            <span className="text-[10px] uppercase font-bold tracking-widest text-egypt-gold">
              Civilization Briefing
            </span>
          </div>
          <h2 className="font-serif font-bold text-xl md:text-2xl text-egypt-gold shrink-0 leading-tight">
            {selectedLevel.civilization}
          </h2>
          <p className="text-xs leading-relaxed text-slate-200 shrink-0">
            {selectedLevel.desc}
          </p>
          <div className="bg-slate-950/40 border border-slate-800/60 rounded-xl p-3 text-xs leading-relaxed text-slate-300">
            {selectedLevel.details}
          </div>

          {/* Display Subtasks list in briefing */}
          {selectedLevel.subtasks && selectedLevel.subtasks.length > 0 && (
            <div className="flex flex-col gap-1.5 mt-1">
              <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
                Included Challenges ({selectedLevel.subtasks.length})
              </span>
              <div className="flex flex-col gap-1.5">
                {selectedLevel.subtasks.map((task) => (
                  <div key={task.id} className="bg-slate-900/50 border border-slate-800/70 rounded-lg p-2 text-xs">
                    <div className="font-semibold text-slate-200 text-[11px]">{task.title}</div>
                    <div className="text-[10px] text-slate-400 leading-snug mt-0.5">{task.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Launch button container */}
        <div className="mt-3 pt-2 border-t border-slate-800/60 shrink-0">
          {isLevelUnlocked ? (
            <button
              onClick={() => startLevel(selectedLevel.id)}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-egypt-terracotta to-egypt-gold text-slate-950 hover:text-black font-extrabold text-xs md:text-sm transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-[0_0_20px_rgba(231,111,81,0.4)] active:translate-y-0 cursor-pointer"
            >
              <span>Launch Core Puzzles</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <div className="w-full text-center py-2.5 px-4 rounded-xl bg-slate-950/30 border border-slate-800 text-slate-500 font-semibold text-xs flex items-center justify-center gap-2">
              <Lock className="w-3.5 h-3.5" />
              Complete previous civilization to unlock
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
