import React, { useState } from 'react';
import { useGameState } from '../../context/GameStateContext';
import LevelShell from '../LevelShell';
import { Star, Compass, Info } from 'lucide-react';

export default function TheoremVisualizer() {
  const { completedSubtasks, activeSubtask, completeSubtask } = useGameState();
  const [t, setT] = useState(0.5);
  
  // Form State
  const [deAnswer, setDeAnswer] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const A = { x: 250, y: 50 };
  const B = { x: 50, y: 350 };
  const C = { x: 450, y: 350 };

  const D = { x: A.x + t * (B.x - A.x), y: A.y + t * (B.y - A.y) };
  const E = { x: A.x + t * (C.x - A.x), y: A.y + t * (C.y - A.y) };

  const dist = (p1, p2) => Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));

  const scale = 10;
  const lenAB = dist(A, B) / scale;
  const lenAC = dist(A, C) / scale;
  const lenBC = dist(B, C) / scale;

  const lenAD = dist(A, D) / scale;
  const lenAE = dist(A, E) / scale;
  const lenDE = dist(D, E) / scale;

  const handleVerify = (e) => {
    e.preventDefault();
    const ans = parseFloat(deAnswer.trim());
    if (isNaN(ans)) {
      setErrorMsg('Please enter a valid number.');
      return;
    }
    // Correct answer is 24 (since BC = 40, 60% of 40 = 24)
    if (Math.abs(ans - 24) < 0.1) {
      setIsSuccess(true);
      setErrorMsg('');
      completeSubtask(2, 1); // Mark Level 2 Subtask 1 completed
    } else {
      setErrorMsg('Incorrect length. Drag the slider to 60% and observe the segment DE length!');
    }
  };

  return (
    <LevelShell
      title="Level 2: Ancient Greece"
      activeSubtask={activeSubtask}
      completedSubtasks={completedSubtasks}
      canvas={
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-slate-900/5 select-none">
          {/* Informative Header */}
          <div className="absolute top-6 left-6 text-xs bg-slate-950/80 border border-slate-800 px-3 py-1.5 rounded-lg flex items-center gap-2 z-10">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-slate-400">Interactive Model: Drag the slider to scale the inner similar triangle</span>
          </div>

          {/* SVG Frame */}
          <div className="w-[95%] h-[80%] max-w-4xl max-h-[480px] border border-slate-800/80 rounded-2xl bg-gradient-to-b from-[#111622]/80 to-slate-950/90 shadow-2xl relative overflow-hidden flex flex-col items-center justify-center p-4">
            <div className="w-full flex-grow flex items-center justify-center">
              <svg viewBox="0 0 500 370" className="w-full max-w-md drop-shadow-lg">
                {/* Outer Triangle ABC */}
                <polygon points={`${A.x},${A.y} ${B.x},${B.y} ${C.x},${C.y}`} fill="rgba(59, 130, 246, 0.08)" stroke="#3b82f6" strokeWidth="2.5" />
                
                {/* Parallel Intercept Line DE */}
                <line x1={D.x - 20} y1={D.y} x2={E.x + 20} y2={E.y} stroke="#10b981" strokeWidth="3" strokeDasharray="6,4" />
                
                {/* Inner Similar Triangle ADE */}
                <polygon points={`${A.x},${A.y} ${D.x},${D.y} ${E.x},${E.y}`} fill="rgba(16, 185, 129, 0.15)" />

                {/* Nodes A, B, C */}
                <circle cx={A.x} cy={A.y} r="6" fill="#1e3b8a" stroke="#60a5fa" strokeWidth="1.5" />
                <text x={A.x} y={A.y - 12} fontSize="16" fontWeight="bold" textAnchor="middle" fill="#93c5fd" filter="drop-shadow(0 1px 2px rgba(0,0,0,0.8))">A</text>

                <circle cx={B.x} cy={B.y} r="6" fill="#1e3b8a" stroke="#60a5fa" strokeWidth="1.5" />
                <text x={B.x - 15} y={B.y + 10} fontSize="16" fontWeight="bold" textAnchor="middle" fill="#93c5fd" filter="drop-shadow(0 1px 2px rgba(0,0,0,0.8))">B</text>

                <circle cx={C.x} cy={C.y} r="6" fill="#1e3b8a" stroke="#60a5fa" strokeWidth="1.5" />
                <text x={C.x + 15} y={C.y + 10} fontSize="16" fontWeight="bold" textAnchor="middle" fill="#93c5fd" filter="drop-shadow(0 1px 2px rgba(0,0,0,0.8))">C</text>

                {/* Nodes D, E */}
                <circle cx={D.x} cy={D.y} r="6" fill="#065f46" stroke="#34d399" strokeWidth="1.5" />
                <text x={D.x - 18} y={D.y + 5} fontSize="16" fontWeight="bold" textAnchor="middle" fill="#a7f3d0" filter="drop-shadow(0 1px 2px rgba(0,0,0,0.8))">D</text>

                <circle cx={E.x} cy={E.y} r="6" fill="#065f46" stroke="#34d399" strokeWidth="1.5" />
                <text x={E.x + 18} y={E.y + 5} fontSize="16" fontWeight="bold" textAnchor="middle" fill="#a7f3d0" filter="drop-shadow(0 1px 2px rgba(0,0,0,0.8))">E</text>

                {/* Double parallel arrow heads to indicate parallelism */}
                <path d={`M ${B.x + 190} ${B.y} L ${B.x + 200} ${B.y - 10} L ${B.x + 210} ${B.y}`} fill="none" stroke="#3b82f6" strokeWidth="2.5" />
                <path d={`M ${D.x + (E.x - D.x) / 2 - 10} ${D.y} L ${D.x + (E.x - D.x) / 2} ${D.y - 10} L ${D.x + (E.x - D.x) / 2 + 10} ${D.y}`} fill="none" stroke="#10b981" strokeWidth="2.5" />
              </svg>
            </div>

            {/* Slider control underneath SVG */}
            <div className="w-full max-w-md bg-slate-950/60 p-4 rounded-xl border border-slate-800 mb-2">
              <label className="flex justify-between text-xs font-semibold text-slate-400 mb-2">
                <span>Move Parallel Intercept Line (DE)</span>
                <span className="text-emerald-400 font-bold">Ratio: {Math.round(t * 100)}%</span>
              </label>
              <input
                type="range"
                min="0.1" 
                max="0.9" 
                step="0.01"
                value={t}
                onChange={(e) => setT(parseFloat(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer h-1.5 bg-slate-800 rounded"
              />
            </div>
          </div>
        </div>
      }
    >
      <div className="flex flex-col justify-between h-full text-slate-300 text-xs">
        <div className="flex flex-col gap-4">
          <p className="leading-relaxed text-slate-400">
            Greek geometry transitioned mathematics from empirical measurement to logical proofs. Thales of Miletus proved that parallel intercepts slice triangles in constant, invariant ratios.
          </p>

          {/* Mathematical proportions panel */}
          <div className="bg-slate-900/60 border border-slate-800/40 rounded-xl p-3 flex flex-col gap-3">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Side Lengths & Proportions</h4>
            
            <div className="grid grid-cols-3 gap-2 text-center text-[11px] font-mono">
              <div className="bg-slate-950/40 p-2 rounded border border-slate-800/50">
                <span className="text-slate-500 block text-[9px] uppercase">Left Side</span>
                <span className="text-emerald-400 font-bold">AD = {lenAD.toFixed(1)}</span>
                <span className="block border-t border-slate-800 mt-1 pt-1 text-blue-400">AB = {lenAB.toFixed(1)}</span>
              </div>
              <div className="bg-slate-950/40 p-2 rounded border border-slate-800/50">
                <span className="text-slate-500 block text-[9px] uppercase">Right Side</span>
                <span className="text-emerald-400 font-bold">AE = {lenAE.toFixed(1)}</span>
                <span className="block border-t border-slate-800 mt-1 pt-1 text-blue-400">AC = {lenAC.toFixed(1)}</span>
              </div>
              <div className="bg-slate-950/40 p-2 rounded border border-slate-800/50">
                <span className="text-slate-500 block text-[9px] uppercase">Base Segment</span>
                <span className="text-emerald-400 font-bold">DE = {lenDE.toFixed(1)}</span>
                <span className="block border-t border-slate-800 mt-1 pt-1 text-blue-400">BC = {lenBC.toFixed(1)}</span>
              </div>
            </div>

            <div className="text-center font-mono font-bold text-xs bg-slate-950/80 py-2.5 rounded border border-slate-800 flex justify-center items-center gap-3">
              <span className="flex flex-col items-center">
                <span>{lenAD.toFixed(1)}</span>
                <span className="w-8 h-px bg-slate-600 my-0.5"></span>
                <span>{lenAB.toFixed(1)}</span>
              </span>
              <span>=</span>
              <span className="flex flex-col items-center">
                <span>{lenAE.toFixed(1)}</span>
                <span className="w-8 h-px bg-slate-600 my-0.5"></span>
                <span>{lenAC.toFixed(1)}</span>
              </span>
              <span>=</span>
              <span className="flex flex-col items-center">
                <span>{lenDE.toFixed(1)}</span>
                <span className="w-8 h-px bg-slate-600 my-0.5"></span>
                <span>{lenBC.toFixed(1)}</span>
              </span>
              <span className="ml-1.5 text-emerald-400 font-bold">
                ≈ {(lenAD / lenAB).toFixed(2)}
              </span>
            </div>
          </div>

          {/* Verification Card */}
          <div className="bg-slate-950/40 border border-slate-800/80 p-4 rounded-xl flex flex-col gap-3">
            <h3 className="text-xs font-bold text-blue-400 uppercase tracking-wider flex items-center gap-2">
              <Compass className="w-4 h-4" /> 1. The Intercept Theorem
            </h3>
            <p className="text-[11px] leading-relaxed text-slate-300">
              Observe that the ratios of the smaller triangle's side lengths to the larger triangle's side lengths remain perfectly equal under scaling.
            </p>
            
            <div className="border-t border-slate-800/80 pt-3 flex flex-col gap-2.5">
              <span className="text-[11px] font-semibold text-slate-200">
                Move the parallel line slider to exactly **60%** (0.60 ratio). Measure the length of line segment DE:
              </span>
              
              <div className="flex flex-col gap-1 mt-1">
                <span className="text-[9px] uppercase font-bold tracking-wider text-slate-400">Length of DE</span>
                <input
                  type="number"
                  value={deAnswer}
                  onChange={(e) => {
                    setDeAnswer(e.target.value);
                    setErrorMsg('');
                  }}
                  disabled={isSuccess}
                  placeholder="e.g. 20.0"
                  className="bg-slate-900 border border-slate-800 text-white text-xs px-3 py-2 rounded-lg outline-none focus:border-blue-500 transition text-center font-mono"
                />
              </div>

              {errorMsg && (
                <div className="text-[11px] text-rose-400 font-bold bg-rose-950/20 border border-rose-900/50 p-2 rounded mt-1">
                  {errorMsg}
                </div>
              )}

              {isSuccess ? (
                <div className="text-[11px] text-emerald-400 font-bold bg-emerald-950/20 border border-emerald-900/50 p-2.5 rounded flex items-center gap-1.5 mt-1">
                  <Star className="w-4 h-4 text-blue-400 fill-current" />
                  <span>Correct! Ratios are perfectly preserved. Task 2 is unlocked.</span>
                </div>
              ) : (
                <div className="flex justify-end mt-1">
                  <button
                    onClick={handleVerify}
                    className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-2 rounded-lg text-xs transition cursor-pointer"
                  >
                    Verify Theorem
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </LevelShell>
  );
}
