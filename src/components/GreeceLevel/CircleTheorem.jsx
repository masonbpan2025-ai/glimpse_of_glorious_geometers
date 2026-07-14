import React, { useState } from 'react';
import { useGameState } from '../../context/GameStateContext';
import LevelShell from '../LevelShell';
import { Compass, Star, Info } from 'lucide-react';

export default function CircleTheorem() {
  const { completedSubtasks, activeSubtask, completeSubtask } = useGameState();
  const [theta, setTheta] = useState(90); // Central angle of B in degrees (from C)

  // Verification Form State
  const [chordAnswer, setChordAnswer] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [showProof, setShowProof] = useState(false);

  // SVG Geometry Constants
  const R = 150; // Radius
  const O = { x: 250, y: 220 }; // Center
  const A = { x: O.x - R, y: O.y }; // Left diameter end
  const C = { x: O.x + R, y: O.y }; // Right diameter end

  const rad = (theta * Math.PI) / 180;
  const B = {
    x: O.x + R * Math.cos(rad),
    y: O.y - R * Math.sin(rad)
  };

  // Distance helper
  const dist = (p1, p2) => Math.hypot(p1.x - p2.x, p1.y - p2.y);

  // Math dimensions (Scaled for display: Diameter AC = 30.0 units)
  const displayScale = R / 15; // 1 unit = 10px
  const lenAC = 30.0;
  const lenAB = dist(A, B) / displayScale;
  const lenBC = dist(C, B) / displayScale;

  // Inscribed angles
  const angleBAC = theta / 2; // Angle at A
  const angleBCA = 90 - angleBAC; // Angle at C
  const angleABC = 90.0; // Inscribed angle at B (always 90)

  // Calculate coordinates for the rotating right-angle box at B
  // Unit vectors from B to A and B to C
  const dxA = A.x - B.x;
  const dyA = A.y - B.y;
  const lenBA = Math.hypot(dxA, dyA);
  const uAx = dxA / lenBA;
  const uAy = dyA / lenBA;

  const dxC = C.x - B.x;
  const dyC = C.y - B.y;
  const lenBC_px = Math.hypot(dxC, dyC);
  const uCx = dxC / lenBC_px;
  const uCy = dyC / lenBC_px;

  const boxSize = 14;
  const p1 = { x: B.x + boxSize * uAx, y: B.y + boxSize * uAy };
  const p2 = { x: B.x + boxSize * uCx, y: B.y + boxSize * uCy };
  const p3 = { x: B.x + boxSize * (uAx + uCx), y: B.y + boxSize * (uAy + uCy) };

  const handleVerify = (e) => {
    e.preventDefault();
    const ans = parseFloat(chordAnswer.trim());
    if (isNaN(ans)) {
      setErrorMsg('Please enter a valid chord length.');
      return;
    }

    // Correct answer is 15.0 (at ∠BAC = 30°, BC = 30 * sin(30) = 15)
    if (Math.abs(ans - 15) < 0.1) {
      setIsSuccess(true);
      setErrorMsg('');
      completeSubtask(2, 4); // Complete Level 2 Subtask 4
    } else {
      setErrorMsg('Incorrect length. Position the slider so ∠BAC is exactly 30° and measure chord BC!');
    }
  };

  return (
    <LevelShell
      title="Level 2: Thales and Intercept Theorem"
      activeSubtask={activeSubtask}
      completedSubtasks={completedSubtasks}
      canvas={
        <div className="absolute inset-0 flex flex-col items-center justify-center p-4 md:p-6 pb-2 bg-slate-900/5 select-none">
          {/* Informative Header */}
          <div className="absolute top-6 left-6 text-xs bg-slate-950/80 border border-slate-800 px-3 py-1.5 rounded-lg flex items-center gap-2 z-10">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-slate-400">Interactive Circle: Move the slider to position point B along the circle</span>
          </div>

          {/* SVG Frame */}
          <div className="w-[95%] h-[88%] max-w-4xl max-h-[450px] border border-slate-800/80 rounded-2xl bg-gradient-to-b from-[#111622]/80 to-slate-950/90 shadow-2xl relative overflow-hidden flex flex-col justify-center items-center">
            <div className="w-full flex-grow flex items-center justify-center relative">
              <svg viewBox="0 40 500 215" className="w-full max-w-md drop-shadow-lg">
                {/* Semicircle circumference line */}
                <path 
                  d={`M ${A.x} ${A.y} A ${R} ${R} 0 0 1 ${C.x} ${C.y}`} 
                  fill="none" 
                  stroke="rgba(96, 165, 250, 0.25)" 
                  strokeWidth="2.5" 
                  strokeDasharray="5 4" 
                />

                {/* Subtended chords forming triangle ABC */}
                <polygon 
                  points={`${A.x},${A.y} ${B.x},${B.y} ${C.x},${C.y}`} 
                  fill="rgba(59, 130, 246, 0.05)" 
                  stroke="#3b82f6" 
                  strokeWidth="2" 
                />

                {/* Dotted radiuses forming the proof basis (OA, OB, OC) */}
                <line x1={O.x} y1={O.y} x2={B.x} y2={B.y} stroke="rgba(245, 158, 11, 0.45)" strokeWidth="1.5" strokeDasharray="3 3" />
                <circle cx={O.x} cy={O.y} r="3" fill="#f59e0b" />
                <text x={O.x} y={O.y + 16} fontSize="11" fill="#f59e0b" fontWeight="bold" textAnchor="middle">O</text>

                {/* Dynamic Right angle indicator at point B */}
                <polyline 
                  points={`${p1.x},${p1.y} ${p3.x},${p3.y} ${p2.x},${p2.y}`} 
                  fill="none" 
                  stroke="#34d399" 
                  strokeWidth="1.5" 
                />

                {/* Diameter AC */}
                <line x1={A.x} y1={A.y} x2={C.x} y2={C.y} stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />

                {/* Node coordinates & labels */}
                {/* A */}
                <circle cx={A.x} cy={A.y} r="5" fill="#1e3b8a" stroke="#60a5fa" strokeWidth="1.5" />
                <text x={A.x - 12} y={A.y + 5} fontSize="12" fontWeight="bold" fill="#93c5fd" textAnchor="end">A</text>

                {/* C */}
                <circle cx={C.x} cy={C.y} r="5" fill="#1e3b8a" stroke="#60a5fa" strokeWidth="1.5" />
                <text x={C.x + 12} y={C.y + 5} fontSize="12" fontWeight="bold" fill="#93c5fd" textAnchor="start">C</text>

                {/* B */}
                <circle cx={B.x} cy={B.y} r="5" fill="#065f46" stroke="#34d399" strokeWidth="1.5" />
                <text x={B.x + (B.x > O.x ? 12 : -12)} y={B.y - 8} fontSize="12" fontWeight="bold" fill="#a7f3d0" textAnchor={B.x > O.x ? "start" : "end"}>B</text>

                {/* Live values overlaid on geometry */}
                <text x={(A.x + B.x) / 2 - 12} y={(A.y + B.y) / 2 - 8} fontSize="10" fill="#94a3b8" fontWeight="medium">
                  {lenAB.toFixed(1)}
                </text>
                <text x={(C.x + B.x) / 2 + 12} y={(C.y + B.y) / 2 - 8} fontSize="10" fill="#94a3b8" fontWeight="medium">
                  {lenBC.toFixed(1)}
                </text>
                <text x={O.x} y={O.y - 6} fontSize="10" fill="#94a3b8" fontWeight="medium" textAnchor="middle">
                  30.0
                </text>

                {showProof && (
                  <g opacity="0.9">
                    {/* Angle A label */}
                    <text x={A.x + 24} y={A.y - 8} fontSize="11" fontWeight="bold" fill="#f59e0b" textAnchor="middle">α</text>
                    
                    {/* Angle C label */}
                    <text x={C.x - 24} y={C.y - 8} fontSize="11" fontWeight="bold" fill="#f59e0b" textAnchor="middle">β</text>
                    
                    {/* Split angle at B labels */}
                    <text x={B.x + 0.14 * (A.x - B.x) - 4} y={B.y + 0.14 * (A.y - B.y) + 12} fontSize="11" fontWeight="bold" fill="#f59e0b" textAnchor="middle">α</text>
                    <text x={B.x + 0.14 * (C.x - B.x) + 4} y={B.y + 0.14 * (C.y - B.y) + 12} fontSize="11" fontWeight="bold" fill="#f59e0b" textAnchor="middle">β</text>
                  </g>
                )}
              </svg>
            </div>

            {/* Slider control */}
            <div className="w-full max-w-md bg-slate-950/60 p-4 rounded-xl border border-slate-800 mb-2">
              <label className="flex justify-between text-xs font-semibold text-slate-400 mb-2">
                <span>Inscribed Position of B (Angle θ)</span>
                <span className="text-blue-400 font-bold">{theta.toFixed(1)}°</span>
              </label>
              <input
                type="range"
                min="10"
                max="170"
                step="0.5"
                value={theta}
                onChange={(e) => setTheta(parseFloat(e.target.value))}
                className="w-full accent-blue-500 cursor-pointer h-1.5 bg-slate-800 rounded"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                <span>Near A</span>
                <button 
                  onClick={() => setTheta(60)}
                  className="px-3 py-1 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-bold rounded-md transition-all shadow-md text-[9px] uppercase tracking-wider cursor-pointer border border-blue-500 hover:border-blue-400"
                >
                  Snap to 60° (∠BAC = 30°)
                </button>
                <span>Near C</span>
              </div>
            </div>
          </div>
        </div>
      }
    >
      <div className="flex flex-col justify-between h-full text-slate-300 text-xs">
        <div className="flex flex-col gap-4">
          <p className="leading-relaxed text-slate-400">
            Thales proved his circle theorem using radial lines. By connecting the circle center <i>O</i> to <i>B</i>, he created two isosceles triangles (Δ<i>OAB</i> and Δ<i>OBC</i>) whose angles add up to prove ∠<i>ABC</i> = 90°.
          </p>

          {/* Dynamic angle readouts */}
          <div className="bg-slate-900/60 border border-slate-800/40 rounded-xl p-3 flex flex-col gap-3">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Dynamic Angles & Chords</h4>
            
            <div className="grid grid-cols-3 gap-2 text-center text-[11px] font-mono">
              <div className="bg-slate-950/40 p-2 rounded border border-slate-800/50">
                <span className="text-slate-500 block text-[9px] uppercase">Angle A (∠BAC)</span>
                <span className="text-blue-400 font-bold">{angleBAC.toFixed(1)}°</span>
                <span className="block border-t border-slate-800 mt-1 pt-1 text-slate-400">AB = {lenAB.toFixed(1)}</span>
              </div>
              <div className="bg-slate-950/40 p-2 rounded border border-slate-800/50">
                <span className="text-slate-500 block text-[9px] uppercase">Angle C (∠BCA)</span>
                <span className="text-blue-400 font-bold">{angleBCA.toFixed(1)}°</span>
                <span className="block border-t border-slate-800 mt-1 pt-1 text-slate-400">BC = {lenBC.toFixed(1)}</span>
              </div>
              <div className="bg-slate-950/40 p-2 rounded border border-slate-800/50">
                <span className="text-slate-500 block text-[9px] uppercase">Angle B (∠ABC)</span>
                <span className="text-emerald-400 font-bold">{angleABC.toFixed(1)}°</span>
                <span className="block border-t border-slate-800 mt-1 pt-1 text-slate-400">AC = 30.0</span>
              </div>
            </div>

            <div className="text-center font-mono font-bold text-[11px] bg-slate-950/80 py-2.5 rounded border border-slate-800 flex justify-center items-center gap-1">
              <span>∠BAC ({angleBAC.toFixed(1)}°) + ∠BCA ({angleBCA.toFixed(1)}°) = </span>
              <span className="text-emerald-400">∠ABC (90.0°)</span>
            </div>
          </div>

          {/* Expandable Mathematical Proof Card */}
          <div className="bg-slate-900/40 border border-slate-800/60 rounded-xl p-3 flex flex-col gap-2">
            <button
              onClick={() => setShowProof(!showProof)}
              className="w-full flex items-center justify-between text-xs font-semibold text-slate-300 hover:text-white transition cursor-pointer"
            >
              <span className="flex items-center gap-1.5">
                <Info className="w-4 h-4 text-blue-400" />
                <span>Show Geometric Proof (Wikipedia)</span>
              </span>
              <span className="text-[10px] text-slate-500 font-mono">
                {showProof ? '▲ Hide' : '▼ Expand'}
              </span>
            </button>

            {showProof && (
              <div className="mt-1 border-t border-slate-800/80 pt-3 flex flex-col gap-2.5 text-[11px] text-slate-400 leading-relaxed">
                <p>
                  Thales proved his Semicircle Theorem using basic geometry. By drawing the radius line <span className="text-amber-400 font-bold font-mono">OB</span>, the main triangle is split into two isosceles triangles (<span className="text-blue-400 font-semibold">ΔOAB</span> and <span className="text-emerald-400 font-semibold">ΔOBC</span>):
                </p>
                <ol className="list-decimal pl-4 flex flex-col gap-2">
                  <li>
                    Since <span className="text-slate-200">OA = OB = OC = 15.0</span> (all are radii of the circle), both sub-triangles are isosceles.
                  </li>
                  <li>
                    The base angles of an isosceles triangle are equal:
                    <div className="mt-1 space-y-1 pl-1 font-mono text-[10px] text-slate-300">
                      <div>∠OAB = ∠OBA = α = <span className="text-amber-400 font-bold">{angleBAC.toFixed(1)}°</span></div>
                      <div>∠OCB = ∠OBC = β = <span className="text-amber-400 font-bold">{angleBCA.toFixed(1)}°</span></div>
                    </div>
                  </li>
                  <li>
                    The total angle at B is the sum of these split angles:
                    <div className="pl-1 text-slate-300 font-mono text-[10px]">
                      ∠ABC = α + β
                    </div>
                  </li>
                  <li>
                    The sum of all angles in the large triangle ΔABC must be exactly 180°:
                    <div className="mt-1 font-mono text-[10px] bg-slate-950/80 border border-slate-800 p-2 rounded text-center text-slate-200">
                      α + (α + β) + β = 180° <br />
                      2α + 2β = 180° <br />
                      α + β = 90°
                    </div>
                  </li>
                </ol>
                <p className="border-t border-slate-800/60 pt-2 text-slate-300">
                  Therefore, the angle <span className="text-emerald-400 font-bold">∠ABC</span> is always a perfect right angle:
                  <span className="block text-center mt-1 font-mono font-bold text-emerald-400 bg-emerald-950/20 border border-emerald-900/40 py-1 rounded">
                    ∠ABC = α + β = {angleBAC.toFixed(1)}° + {angleBCA.toFixed(1)}° = 90.0°
                  </span>
                </p>
              </div>
            )}
          </div>

          {/* Verification Card */}
          <div className="bg-slate-950/40 border border-slate-800/80 p-4 rounded-xl flex flex-col gap-3">
            <h3 className="text-xs font-bold text-blue-400 uppercase tracking-wider flex items-center gap-2">
              <Compass className="w-4 h-4" /> 4. Thales' Circle Theorem
            </h3>
            <p className="text-[11px] leading-relaxed text-slate-300">
              When point B is placed on a circle's circumference, the angle ∠ABC formed by lines connecting B to the diameter endpoints A and C is always exactly 90.0°.
            </p>
            
            <div className="border-t border-slate-800/80 pt-3 flex flex-col gap-2.5">
              <span className="text-[11px] font-semibold text-slate-200">
                Move point B until the angle ∠BAC at A is exactly **30.0°** (at the 60.0° angle θ position). Measure or compute the length of chord BC:
              </span>
              
              <div className="flex flex-col gap-1 mt-1">
                <span className="text-[9px] uppercase font-bold tracking-wider text-slate-400">Chord Length BC (units)</span>
                <input
                  type="number"
                  value={chordAnswer}
                  onChange={(e) => {
                    setChordAnswer(e.target.value);
                    setErrorMsg('');
                  }}
                  disabled={isSuccess}
                  placeholder="e.g. 10"
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
                  <span>Excellent! Semicircle chords verified (15.0). Level 2 Complete!</span>
                </div>
              ) : (
                <div className="flex justify-end mt-1">
                  <button
                    onClick={handleVerify}
                    className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-2 rounded-lg text-xs transition cursor-pointer"
                  >
                    Verify Chord
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
