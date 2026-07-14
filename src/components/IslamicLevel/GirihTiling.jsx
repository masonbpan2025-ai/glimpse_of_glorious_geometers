import React, { useState } from 'react';
import { useGameState } from '../../context/GameStateContext';
import LevelShell from '../LevelShell';
import { Compass, Star, RotateCw } from 'lucide-react';

export default function GirihTiling() {
  const { completedSubtasks, activeSubtask, completeSubtask } = useGameState();

  // State: Rotations of the tiles (in degrees)
  // Decagon (center) can be rotated by 36 deg increments (10 positions)
  const [decagonRot, setDecagonRot] = useState(108); // Out of alignment
  
  // Pentagons (5 surrounding tiles) can be rotated by 72 deg increments
  const [pentagonRots, setPentagonRots] = useState([144, 72, 288, 144, 216]);

  const [isSuccess, setIsSuccess] = useState(false);
  const [showHelper, setShowHelper] = useState(false);

  // Constants for layout
  const cx = 250;
  const cy = 150;
  const Rd = 70; // Radius of decagon
  const Rp = 46; // Radius of pentagon
  const Dc = 114; // Distance of pentagon centers from decagon center

  // Decagon points generator
  const getDecagonPoints = (r) => {
    const pts = [];
    for (let i = 0; i < 10; i++) {
      const rad = (i * 36 * Math.PI) / 180;
      pts.push(`${r * Math.cos(rad)},${r * Math.sin(rad)}`);
    }
    return pts.join(' ');
  };

  // Pentagon points generator
  const getPentagonPoints = (r) => {
    const pts = [];
    for (let i = 0; i < 5; i++) {
      // Rotate by 90 deg so it points outward nicely
      const rad = (i * 72 * Math.PI) / 180 - Math.PI / 2;
      pts.push(`${r * Math.cos(rad)},${r * Math.sin(rad)}`);
    }
    return pts.join(' ');
  };

  // Star geometry generator (10-point star or 5-point star)
  const getStarPath = (rOuter, rInner, points) => {
    const pts = [];
    for (let i = 0; i < points * 2; i++) {
      const rad = (i * (360 / (points * 2)) * Math.PI) / 180 - Math.PI / 2;
      const r = i % 2 === 0 ? rOuter : rInner;
      pts.push(`${r * Math.cos(rad)},${r * Math.sin(rad)}`);
    }
    return pts.join(' ') + ' z';
  };

  // Rotate functions
  const rotateDecagon = () => {
    if (isSuccess) return;
    setDecagonRot((prev) => (prev + 36) % 360);
  };

  const rotatePentagon = (index) => {
    if (isSuccess) return;
    setPentagonRots((prev) => {
      const next = [...prev];
      next[index] = (next[index] + 72) % 360;
      return next;
    });
  };

  const handleVerify = () => {
    // Puzzle is solved if all rotations modulo 360 are 0
    const decagonAligned = decagonRot % 360 === 0;
    const pentagonsAligned = pentagonRots.every((rot) => rot % 360 === 0);

    if (decagonAligned && pentagonsAligned) {
      setIsSuccess(true);
      completeSubtask(4, 2); // Complete Level 4 Subtask 2 (completes game)
    } else {
      // Auto shake or show visual tip
      setShowHelper(true);
    }
  };

  const strapColor = isSuccess ? '#10b981' : '#f59e0b';
  const strapOpacity = isSuccess ? 0.95 : 0.65;
  const isAligned = (decagonRot % 360 === 0) && pentagonRots.every((rot) => rot % 360 === 0);

  return (
    <LevelShell
      title="Level 4: Islamic Golden Age"
      activeSubtask={activeSubtask}
      completedSubtasks={completedSubtasks}
      canvas={
        <div className="absolute inset-0 flex flex-col items-center justify-center p-4 md:p-6 pb-2 bg-slate-900/5 select-none">
          {/* Info Header */}
          <div className="absolute top-6 left-6 text-xs bg-slate-950/80 border border-slate-800 px-3 py-1.5 rounded-lg flex items-center gap-2 z-10">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-slate-400">Click tiles to rotate and align the Girih lines</span>
          </div>

          {/* SVG Frame */}
          <div className="w-[95%] h-[88%] max-w-4xl max-h-[450px] border border-slate-800/80 rounded-2xl bg-gradient-to-b from-[#111622]/80 to-slate-950/90 shadow-2xl relative overflow-hidden flex flex-col justify-center items-center">
            <div className="w-full flex-grow flex items-center justify-center relative">
              <svg viewBox="0 0 500 300" className="w-full max-w-md drop-shadow-lg">
                <defs>
                  <filter id="emerald-glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="3.5" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                  <filter id="gold-glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="2" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>

                {/* 1. Surrounding Pentagons */}
                {pentagonRots.map((rot, i) => {
                  const angle = (i * 72 * Math.PI) / 180 - Math.PI / 2;
                  const px = cx + Dc * Math.cos(angle);
                  const py = cy + Dc * Math.sin(angle);
                  const isPentagonAligned = rot % 360 === 0;

                  return (
                    <g 
                      key={i} 
                      transform={`translate(${px}, ${py}) rotate(${rot})`}
                      onClick={() => rotatePentagon(i)}
                      className="cursor-pointer group"
                    >
                      {/* Polygon base */}
                      <polygon 
                        points={getPentagonPoints(Rp)} 
                        fill="rgba(15, 23, 42, 0.75)" 
                        stroke={isPentagonAligned && isSuccess ? '#059669' : '#334155'} 
                        strokeWidth="1.5" 
                        className="group-hover:stroke-emerald-500/50 transition duration-300"
                      />

                      {/* Helper hint */}
                      {showHelper && !isPentagonAligned && (
                        <polygon 
                          points={getPentagonPoints(Rp + 4)} 
                          fill="none" 
                          stroke="rgba(239, 68, 68, 0.3)" 
                          strokeWidth="1" 
                          strokeDasharray="2 2"
                        />
                      )}

                      {/* Strap lines inside pentagon (5-point star design) */}
                      <polygon 
                        points={getStarPath(Rp * 0.9, Rp * 0.45, 5)} 
                        fill="none" 
                        stroke={strapColor} 
                        strokeWidth={isSuccess ? "2" : "1.5"}
                        opacity={strapOpacity}
                        filter={isSuccess ? "url(#emerald-glow)" : ""}
                        className="transition duration-300"
                      />
                      
                      {/* Rotate icon visual indicator */}
                      {!isSuccess && (
                        <circle cx="0" cy="0" r="8" fill="rgba(30, 41, 59, 0.9)" className="opacity-0 group-hover:opacity-100 transition" />
                      )}
                    </g>
                  );
                })}

                {/* 2. Central Decagon */}
                <g 
                  transform={`translate(${cx}, ${cy}) rotate(${decagonRot})`}
                  onClick={rotateDecagon}
                  className="cursor-pointer group"
                >
                  {/* Polygon base */}
                  <polygon 
                    points={getDecagonPoints(Rd)} 
                    fill="rgba(30, 41, 59, 0.4)" 
                    stroke={(decagonRot % 360 === 0) && isSuccess ? '#059669' : '#475569'} 
                    strokeWidth="2" 
                    className="group-hover:stroke-emerald-500/60 transition duration-300"
                  />

                  {/* Helper hint */}
                  {showHelper && (decagonRot % 360 !== 0) && (
                    <polygon 
                      points={getDecagonPoints(Rd + 4)} 
                      fill="none" 
                      stroke="rgba(239, 68, 68, 0.3)" 
                      strokeWidth="1" 
                      strokeDasharray="2 2"
                    />
                  )}

                  {/* Star strap lines (10-point star design) */}
                  <polygon 
                    points={getStarPath(Rd * 0.9, Rd * 0.5, 10)} 
                    fill="none" 
                    stroke={strapColor} 
                    strokeWidth={isSuccess ? "2.5" : "1.8"}
                    opacity={strapOpacity}
                    filter={isSuccess ? "url(#emerald-glow)" : ""}
                    className="transition duration-300"
                  />

                  {/* Rotate icon visual indicator */}
                  {!isSuccess && (
                    <circle cx="0" cy="0" r="10" fill="rgba(30, 41, 59, 0.9)" className="opacity-0 group-hover:opacity-100 transition" />
                  )}
                </g>
              </svg>
            </div>

            {/* Verification details */}
            <div className="w-full max-w-md bg-slate-950/60 p-4 rounded-xl border border-slate-800 mb-2">
              <div className="flex justify-between items-center text-xs text-slate-400">
                <span>Pentagons Aligned:</span>
                <span className={pentagonRots.every(r => r % 360 === 0) ? 'text-emerald-400 font-bold' : 'text-amber-500 font-bold'}>
                  {pentagonRots.filter(r => r % 360 === 0).length} / 5
                </span>
              </div>
              <div className="flex justify-between items-center text-xs text-slate-400 mt-1">
                <span>Decagon Aligned:</span>
                <span className={(decagonRot % 360 === 0) ? 'text-emerald-400 font-bold' : 'text-amber-500 font-bold'}>
                  {(decagonRot % 360 === 0) ? 'Yes ✓' : 'No'}
                </span>
              </div>
              
              <div className="flex gap-4 justify-between mt-3">
                <button
                  onClick={() => setShowHelper(!showHelper)}
                  className="px-3 py-1.5 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 rounded text-[9px] uppercase tracking-wider font-semibold cursor-pointer"
                >
                  {showHelper ? 'Hide Help Outlines' : 'Show Help Outlines'}
                </button>
                <button
                  onClick={() => {
                    setDecagonRot(0);
                    setPentagonRots([0, 0, 0, 0, 0]);
                  }}
                  className="px-3 py-1.5 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 rounded text-[9px] uppercase tracking-wider font-semibold cursor-pointer"
                >
                  Reset Orientations
                </button>
              </div>
            </div>
          </div>
        </div>
      }
    >
      <div className="flex flex-col gap-4 text-slate-300 text-xs">
        <p className="leading-relaxed text-slate-400">
          Islamic artisans and mathematicians designed mesmerizing infinite geometric tiling patterns known as <strong>Girih</strong>. 
        </p>

        {/* Tiling principles */}
        <div className="bg-slate-900/60 border border-slate-800/40 rounded-xl p-3.5 flex flex-col gap-2">
          <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Girih Symmetry Principles</h4>
          <p className="text-[11px] leading-relaxed text-slate-300">
            Girih relies on five standard tile shapes: the decagon, the pentagon, the hexagon, the bowtie, and the rhombus.
          </p>
          <ul className="list-disc pl-4 flex flex-col gap-1.5 text-[11px] text-slate-400">
            <li>Each tile has internal strap lines drawn at exact angles (usually 72° or 144°).</li>
            <li>When aligned, these strap lines form a continuous, infinite network of interlacing ribbons that create star configurations.</li>
            <li>In this workshop, a central **decagon** (10-fold symmetry) is surrounded by five **pentagons** (5-fold symmetry).</li>
          </ul>
        </div>

        {/* Verification Card */}
        <div className="bg-slate-950/40 border border-slate-800/80 p-4 rounded-xl flex flex-col gap-3">
          <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
            <Compass className="w-4 h-4" /> 2. Girih Tiling
          </h3>
          <p className="text-[11px] leading-relaxed text-slate-300">
            Rotate the tiles by clicking on them. Align all six tiles so that their internal yellow strap lines match continuously at the borders to construct the 10-point star.
          </p>

          <div className="border-t border-slate-800/80 pt-3 flex flex-col gap-2.5">
            {isSuccess ? (
              <div className="text-[11px] text-emerald-400 font-bold bg-emerald-950/20 border border-emerald-900/50 p-2.5 rounded flex items-center gap-1.5 mt-1">
                <Star className="w-4 h-4 text-emerald-400 fill-current animate-spin" />
                <span>Magnificent! Glimpse of Glorious Geometers Complete! You have unlocked all levels.</span>
              </div>
            ) : (
              <div className="flex justify-end mt-1">
                <button
                  onClick={handleVerify}
                  disabled={!isAligned}
                  className={`font-bold px-4 py-2 rounded-lg text-xs transition cursor-pointer ${
                    isAligned 
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_0_10px_rgba(16,185,129,0.3)]' 
                      : 'bg-slate-900 text-slate-500 border border-slate-800 cursor-not-allowed'
                  }`}
                >
                  Verify Alignment
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </LevelShell>
  );
}
