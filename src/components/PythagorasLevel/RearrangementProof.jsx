import React, { useState } from 'react';
import { useGameState } from '../../context/GameStateContext';
import LevelShell from '../LevelShell';
import { Compass, Star } from 'lucide-react';

export default function RearrangementProof() {
  const { completedSubtasks, activeSubtask, completeSubtask } = useGameState();
  
  // Interactive variables
  const [aVal, setAVal] = useState(12); // Leg a (in units)
  const [bVal, setBVal] = useState(9);   // Leg b (in units)
  const [transitionPct, setTransitionPct] = useState(0); // Transition ratio (0 to 100)

  // Verification Form State
  const [areaAnswer, setAreaAnswer] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  // Layout calculations
  const L = 250; // Side length of outer square in pixels
  const scale = L / (aVal + bVal); // pixels per unit
  const a = aVal * scale;
  const b = bVal * scale;
  const t = transitionPct / 100; // transition parameter (0 to 1)

  // Coordinates of outer square
  const X0 = 250 - L / 2;
  const Y0 = 160 - L / 2;

  // Rigid Triangle Coordinate Generator (Clockwise Winding)
  // v0 is the right angle, v1 is at leg a (angle theta), v2 is at leg b (angle theta + 90 deg)
  const getTrianglePoints = (p0_x, p0_y, theta) => {
    const v0_x = X0 + p0_x;
    const v0_y = Y0 + p0_y;
    const v1_x = v0_x + a * Math.cos(theta);
    const v1_y = v0_y + a * Math.sin(theta);
    const v2_x = v0_x + b * Math.cos(theta + Math.PI / 2);
    const v2_y = v0_y + b * Math.sin(theta + Math.PI / 2);
    return `${v0_x},${v0_y} ${v1_x},${v1_y} ${v2_x},${v2_y}`;
  };

  const getCentroid = (p0_x, p0_y, theta) => {
    const v0_x = X0 + p0_x;
    const v0_y = Y0 + p0_y;
    const v1_x = v0_x + a * Math.cos(theta);
    const v1_y = v0_y + a * Math.sin(theta);
    const v2_x = v0_x + b * Math.cos(theta + Math.PI / 2);
    const v2_y = v0_y + b * Math.sin(theta + Math.PI / 2);
    return {
      x: (v0_x + v1_x + v2_x) / 3,
      y: (v0_y + v1_y + v2_y) / 3
    };
  };

  // 1. Triangle 1 (T1) - slides and rotates
  const p0_x_1 = 0;
  const p0_y_1 = t * a;
  const theta_1 = t * (-Math.PI / 2);
  const pts1 = getTrianglePoints(p0_x_1, p0_y_1, theta_1);
  const c1 = getCentroid(p0_x_1, p0_y_1, theta_1);

  // 2. Triangle 2 (T2) - slides horizontally along the top edge
  const p0_x_2 = (1 - t) * L + t * b;
  const p0_y_2 = 0;
  const theta_2 = Math.PI / 2;
  const pts2 = getTrianglePoints(p0_x_2, p0_y_2, theta_2);
  const c2 = getCentroid(p0_x_2, p0_y_2, theta_2);

  // 3. Triangle 3 (T3) - stays fixed
  const p0_x_3 = L;
  const p0_y_3 = L;
  const theta_3 = Math.PI;
  const pts3 = getTrianglePoints(p0_x_3, p0_y_3, theta_3);
  const c3 = getCentroid(p0_x_3, p0_y_3, theta_3);

  // 4. Triangle 4 (T4) - slides and rotates
  const p0_x_4 = t * b;
  const p0_y_4 = (1 - t) * L + t * a;
  const theta_4 = -Math.PI / 2 + t * (Math.PI / 2);
  const pts4 = getTrianglePoints(p0_x_4, p0_y_4, theta_4);
  const c4 = getCentroid(p0_x_4, p0_y_4, theta_4);

  // Real lengths
  const cVal = Math.hypot(aVal, bVal);
  const areaA = aVal * aVal;
  const areaB = bVal * bVal;
  const areaC = areaA + areaB;

  const handleVerify = (e) => {
    e.preventDefault();
    const ans = parseFloat(areaAnswer.trim());
    if (isNaN(ans)) {
      setErrorMsg('Please enter a valid area.');
      return;
    }

    // Checking area for a=12, b=9 -> c^2 = 144 + 81 = 225
    if (aVal === 12 && bVal === 9) {
      if (Math.abs(ans - 225) < 0.1) {
        setIsSuccess(true);
        setErrorMsg('');
        completeSubtask(3, 1); // Complete Level 3 Subtask 1 (unlocks Level 4)
      } else {
        setErrorMsg('Incorrect area. Set a=12, b=9 and re-calculate c² (a² + b²)!');
      }
    } else {
      setErrorMsg('Please adjust the sliders to the target values: Leg a = 12 and Leg b = 9 first.');
    }
  };

  return (
    <LevelShell
      title="Level 3: Pythagoras"
      activeSubtask={activeSubtask}
      completedSubtasks={completedSubtasks}
      canvas={
        <div className="absolute inset-0 flex flex-col items-center justify-center p-4 md:p-6 pb-2 bg-slate-900/5 select-none">
          {/* Informative Header */}
          <div className="absolute top-6 left-6 text-xs bg-slate-950/80 border border-slate-800 px-3 py-1.5 rounded-lg flex items-center gap-2 z-10">
            <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
            <span className="text-slate-400">Interactive Rearrangement: Slide transition to rearrange the triangles</span>
          </div>

          {/* SVG Frame */}
          <div className="w-[95%] h-[88%] max-w-4xl max-h-[450px] border border-slate-800/80 rounded-2xl bg-gradient-to-b from-[#111622]/80 to-slate-950/90 shadow-2xl relative overflow-hidden flex flex-col justify-center items-center">
            <div className="w-full flex-grow flex items-center justify-center relative">
              <svg viewBox="0 0 500 320" className="w-full max-w-md drop-shadow-lg">
                {/* 1. Uncovered Squares Backdrops */}
                {/* c² square (Config 1) */}
                <polygon 
                  points={`${X0 + a},${Y0} ${X0 + L},${Y0 + a} ${X0 + b},${Y0 + L} ${X0},${Y0 + b}`} 
                  fill="rgba(168, 85, 247, 0.12)" 
                  stroke="#a855f7" 
                  strokeWidth="2" 
                  strokeDasharray="4 4" 
                  opacity={1 - t} 
                />
                <text 
                  x={X0 + L / 2} 
                  y={Y0 + L / 2 + 5} 
                  fontSize="14" 
                  fontWeight="extrabold" 
                  fill="#c084fc" 
                  textAnchor="middle" 
                  opacity={1 - t}
                >
                  c² = {areaC.toFixed(0)}
                </text>

                {/* a² square (Config 2) */}
                <rect 
                  x={X0 + b} 
                  y={Y0} 
                  width={a} 
                  height={a} 
                  fill="rgba(244, 63, 94, 0.12)" 
                  stroke="#f43f5e" 
                  strokeWidth="2" 
                  strokeDasharray="4 4" 
                  opacity={t} 
                />
                <text 
                  x={X0 + b + a / 2} 
                  y={Y0 + a / 2 + 5} 
                  fontSize="14" 
                  fontWeight="extrabold" 
                  fill="#f43f5e" 
                  textAnchor="middle" 
                  opacity={t}
                >
                  a² = {areaA.toFixed(0)}
                </text>

                {/* b² square (Config 2) */}
                <rect 
                  x={X0} 
                  y={Y0 + a} 
                  width={b} 
                  height={b} 
                  fill="rgba(245, 158, 11, 0.12)" 
                  stroke="#f59e0b" 
                  strokeWidth="2" 
                  strokeDasharray="4 4" 
                  opacity={t} 
                />
                <text 
                  x={X0 + b / 2} 
                  y={Y0 + a + b / 2 + 5} 
                  fontSize="13" 
                  fontWeight="extrabold" 
                  fill="#fbbf24" 
                  textAnchor="middle" 
                  opacity={t}
                >
                  b² = {areaB.toFixed(0)}
                </text>

                {/* 2. Triangles */}
                {/* Triangle 1 */}
                <polygon 
                  points={pts1} 
                  fill="rgba(59, 130, 246, 0.2)" 
                  stroke="#3b82f6" 
                  strokeWidth="2.5" 
                />
                <text x={c1.x} y={c1.y + 3} fontSize="9" fontWeight="bold" fill="#60a5fa" textAnchor="middle">T1</text>

                {/* Triangle 2 */}
                <polygon 
                  points={pts2} 
                  fill="rgba(16, 185, 129, 0.2)" 
                  stroke="#10b981" 
                  strokeWidth="2.5" 
                />
                <text x={c2.x} y={c2.y + 3} fontSize="9" fontWeight="bold" fill="#34d399" textAnchor="middle">T2</text>

                {/* Triangle 3 */}
                <polygon 
                  points={pts3} 
                  fill="rgba(236, 72, 153, 0.2)" 
                  stroke="#ec4899" 
                  strokeWidth="2.5" 
                />
                <text x={c3.x} y={c3.y + 3} fontSize="9" fontWeight="bold" fill="#f472b6" textAnchor="middle">T3</text>

                {/* Triangle 4 */}
                <polygon 
                  points={pts4} 
                  fill="rgba(245, 158, 11, 0.2)" 
                  stroke="#f59e0b" 
                  strokeWidth="2.5" 
                />
                <text x={c4.x} y={c4.y + 3} fontSize="9" fontWeight="bold" fill="#fbbf24" textAnchor="middle">T4</text>

                {/* Outer frame */}
                <rect x={X0} y={Y0} width={L} height={L} fill="none" stroke="#475569" strokeWidth="2.5" />
              </svg>
            </div>

            {/* Transition controller */}
            <div className="w-full max-w-md bg-slate-950/60 p-4 rounded-xl border border-slate-800 mb-2">
              <label className="flex justify-between text-xs font-semibold text-slate-400 mb-2">
                <span>Rearrange Triangles (Transition)</span>
                <span className="text-purple-400 font-bold">{transitionPct}%</span>
              </label>
              <input
                type="range"
                min="0"
                max="100"
                step="1"
                value={transitionPct}
                onChange={(e) => setTransitionPct(parseInt(e.target.value))}
                className="w-full accent-purple-500 cursor-pointer h-1.5 bg-slate-800 rounded"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-1.5">
                <button 
                  onClick={() => setTransitionPct(0)}
                  className="px-2.5 py-1 bg-purple-900/60 hover:bg-purple-800 active:bg-purple-950 text-purple-200 border border-purple-800 rounded text-[9px] uppercase tracking-wider font-semibold cursor-pointer"
                >
                  Config 1 (c²)
                </button>
                <button 
                  onClick={() => setTransitionPct(100)}
                  className="px-2.5 py-1 bg-purple-900/60 hover:bg-purple-800 active:bg-purple-950 text-purple-200 border border-purple-800 rounded text-[9px] uppercase tracking-wider font-semibold cursor-pointer"
                >
                  Config 2 (a² + b²)
                </button>
              </div>
            </div>
          </div>
        </div>
      }
    >
      <div className="flex flex-col gap-4 text-slate-300 text-xs">
        <p className="leading-relaxed text-slate-400">
          The rearrangement proof is one of the oldest visual proofs. Since the total outer area (<i>a</i> + <i>b</i>)² is fixed, and the four triangles remain inside, the uncovered area in the middle must be equivalent. In Config 1, the uncovered area is a single square <i>c</i>². In Config 2, it splits into two squares <i>a</i>² and <i>b</i>².
        </p>

        {/* Triangles & leg side length adjustment sliders */}
        <div className="bg-slate-900/60 border border-slate-800/40 rounded-xl p-3.5 flex flex-col gap-3">
          <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Leg Dimensions</h4>
          
          {/* a Slider */}
          <div className="flex flex-col gap-1">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400 font-medium">Leg a:</span>
              <span className={aVal === 12 ? 'text-emerald-400 font-bold' : 'text-purple-400 font-bold'}>
                {aVal} units {aVal === 12 && '✓'}
              </span>
            </div>
            <input
              type="range"
              min="6"
              max="14"
              step="1"
              value={aVal}
              onChange={(e) => setAVal(parseInt(e.target.value))}
              className="w-full accent-purple-500 cursor-pointer h-1.5 bg-slate-800 rounded"
            />
          </div>

          {/* b Slider */}
          <div className="flex flex-col gap-1">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400 font-medium">Leg b:</span>
              <span className={bVal === 9 ? 'text-emerald-400 font-bold' : 'text-purple-400 font-bold'}>
                {bVal} units {bVal === 9 && '✓'}
              </span>
            </div>
            <input
              type="range"
              min="6"
              max="14"
              step="1"
              value={bVal}
              onChange={(e) => setBVal(parseInt(e.target.value))}
              className="w-full accent-purple-500 cursor-pointer h-1.5 bg-slate-800 rounded"
            />
          </div>

          {/* Mathematical calculations readout */}
          <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-mono border-t border-slate-850 pt-2.5 mt-1">
            <div>
              <span className="text-slate-500 block text-[9px] uppercase">a² area</span>
              <span className="text-white font-bold">{areaA}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[9px] uppercase">b² area</span>
              <span className="text-white font-bold">{areaB}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[9px] uppercase">c² sum</span>
              <span className="text-purple-400 font-bold">{areaC}</span>
            </div>
          </div>
        </div>

        {/* Verification Card */}
        <div className="bg-slate-950/40 border border-slate-800/80 p-4 rounded-xl flex flex-col gap-3">
          <h3 className="text-xs font-bold text-purple-400 uppercase tracking-wider flex items-center gap-2">
            <Compass className="w-4 h-4" /> 1. Rearrangement Proof
          </h3>
          <p className="text-[11px] leading-relaxed text-slate-300">
            Set <strong>Leg a = 12</strong> and <strong>Leg b = 9</strong> using the sliders. Rearrange the triangles by moving the transition slider to see how the uncovered area changes shape.
          </p>
          
          <div className="border-t border-slate-800/80 pt-3 flex flex-col gap-2.5">
            <span className="text-[11px] font-semibold text-slate-200">
              Calculate or read the area of the central square <i>c</i>² when Leg a = 12 and Leg b = 9:
            </span>
            
            <div className="flex flex-col gap-1 mt-1">
              <span className="text-[9px] uppercase font-bold tracking-wider text-slate-400">Square Area c²</span>
              <input
                type="number"
                value={areaAnswer}
                onChange={(e) => {
                  setAreaAnswer(e.target.value);
                  setErrorMsg('');
                }}
                disabled={isSuccess}
                placeholder="e.g. 100"
                className="bg-slate-900 border border-slate-800 text-white text-xs px-3 py-2 rounded-lg outline-none focus:border-purple-500 transition text-center font-mono"
              />
            </div>

            {errorMsg && (
              <div className="text-[11px] text-rose-400 font-bold bg-rose-950/20 border border-rose-900/50 p-2 rounded mt-1">
                {errorMsg}
              </div>
            )}

            {isSuccess ? (
              <div className="text-[11px] text-emerald-400 font-bold bg-emerald-950/20 border border-emerald-900/50 p-2.5 rounded flex items-center gap-1.5 mt-1">
                <Star className="w-4 h-4 text-purple-400 fill-current" />
                <span>Excellent! Areas verified (225). Level 3 Complete!</span>
              </div>
            ) : (
              <div className="flex justify-end mt-1">
                <button
                  onClick={handleVerify}
                  className="bg-purple-600 hover:bg-purple-500 text-white font-bold px-4 py-2 rounded-lg text-xs transition cursor-pointer"
                >
                  Verify Area
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </LevelShell>
  );
}
