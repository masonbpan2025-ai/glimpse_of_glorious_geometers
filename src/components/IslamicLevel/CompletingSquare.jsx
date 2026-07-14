import React, { useState } from 'react';
import { useGameState } from '../../context/GameStateContext';
import LevelShell from '../LevelShell';
import { Compass, Star, Grid } from 'lucide-react';

export default function CompletingSquare() {
  const { completedSubtasks, activeSubtask, completeSubtask } = useGameState();
  
  // x slider state (units from 1 to 8, defaults to 3)
  const [xVal, setXVal] = useState(4);
  
  // Interactive overlays toggles
  const [showRects, setShowRects] = useState(true);
  const [showCorners, setShowCorners] = useState(false);

  // Form states
  const [answer, setAnswer] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  // Layout math:
  // Center is at (250, 150)
  // Scale: 1 unit = 20 pixels
  const u = 20; 
  const w = xVal * u; // Side of the central x^2 square
  const rectW = 2.5 * u; // 50px (each rectangle width is 2.5 units)

  const x0 = 250 - w / 2;
  const y0 = 150 - w / 2;

  const handleVerify = (e) => {
    e.preventDefault();
    const ans = parseInt(answer.trim());
    if (isNaN(ans)) {
      setErrorMsg('Please enter a valid integer.');
      return;
    }

    // Solve x^2 + 10x = 39:
    // (x + 5)^2 = 39 + 25 = 64
    // x + 5 = 8 => x = 3
    if (ans === 3) {
      setIsSuccess(true);
      setErrorMsg('');
      completeSubtask(4, 1); // Complete Level 4 Subtask 1 (unlocks Task 2)
    } else {
      setErrorMsg('Incorrect solution. Work out the square: (x + 5)² = 39 + 25 = 64.');
    }
  };

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
            <span className="text-slate-400">Visual Equation Solver: x² + 10x = 39</span>
          </div>

          {/* SVG Frame */}
          <div className="w-[95%] h-[88%] max-w-4xl max-h-[450px] border border-slate-800/80 rounded-2xl bg-gradient-to-b from-[#111622]/80 to-slate-950/90 shadow-2xl relative overflow-hidden flex flex-col justify-center items-center">
            <div className="w-full flex-grow flex items-center justify-center relative">
              <svg viewBox="0 0 500 300" className="w-full max-w-md drop-shadow-lg">
                {/* 1. Central x^2 Square */}
                <rect 
                  x={x0} 
                  y={y0} 
                  width={w} 
                  height={w} 
                  fill="rgba(59, 130, 246, 0.15)" 
                  stroke="#3b82f6" 
                  strokeWidth="2.5" 
                />
                <text 
                  x={250} 
                  y={150 + 4} 
                  fontSize="12" 
                  fontWeight="bold" 
                  fill="#60a5fa" 
                  textAnchor="middle"
                >
                  x² = {(xVal * xVal).toFixed(0)}
                </text>

                {/* Dimension Label for Central Square (height x) */}
                <line x1={x0 - 8} y1={y0} x2={x0 - 8} y2={y0 + w} stroke="#475569" strokeWidth="1" />
                <line x1={x0 - 12} y1={y0} x2={x0 - 4} y2={y0} stroke="#475569" strokeWidth="1" />
                <line x1={x0 - 12} y1={y0 + w} x2={x0 - 4} y2={y0 + w} stroke="#475569" strokeWidth="1" />
                <text x={x0 - 14} y={y0 + w / 2 + 3} fontSize="9" fill="#94a3b8" textAnchor="end">x = {xVal}</text>

                {/* 2. Side Rectangles (4 pieces of size x * 2.5) */}
                {showRects && (
                  <>
                    {/* Top rectangle */}
                    <rect 
                      x={x0} 
                      y={y0 - rectW} 
                      width={w} 
                      height={rectW} 
                      fill="rgba(245, 158, 11, 0.15)" 
                      stroke="#f59e0b" 
                      strokeWidth="2" 
                    />
                    <text x={250} y={y0 - rectW / 2 + 4} fontSize="9" fontWeight="semibold" fill="#fbbf24" textAnchor="middle">2.5x</text>

                    {/* Bottom rectangle */}
                    <rect 
                      x={x0} 
                      y={y0 + w} 
                      width={w} 
                      height={rectW} 
                      fill="rgba(245, 158, 11, 0.15)" 
                      stroke="#f59e0b" 
                      strokeWidth="2" 
                    />
                    <text x={250} y={y0 + w + rectW / 2 + 4} fontSize="9" fontWeight="semibold" fill="#fbbf24" textAnchor="middle">2.5x</text>

                    {/* Left rectangle */}
                    <rect 
                      x={x0 - rectW} 
                      y={y0} 
                      width={rectW} 
                      height={w} 
                      fill="rgba(245, 158, 11, 0.15)" 
                      stroke="#f59e0b" 
                      strokeWidth="2" 
                    />
                    <text x={x0 - rectW / 2} y={150 + 4} fontSize="9" fontWeight="semibold" fill="#fbbf24" textAnchor="middle">2.5x</text>

                    {/* Right rectangle */}
                    <rect 
                      x={x0 + w} 
                      y={y0} 
                      width={rectW} 
                      height={w} 
                      fill="rgba(245, 158, 11, 0.15)" 
                      stroke="#f59e0b" 
                      strokeWidth="2" 
                    />
                    <text x={x0 + w + rectW / 2} y={150 + 4} fontSize="9" fontWeight="semibold" fill="#fbbf24" textAnchor="middle">2.5x</text>

                    {/* Width indicator for side rectangle (2.5) */}
                    <line x1={x0} y1={y0 - rectW - 8} x2={x0 + w} y2={y0 - rectW - 8} stroke="#475569" strokeWidth="1" />
                    <line x1={x0} y1={y0 - rectW - 12} x2={x0} y2={y0 - rectW - 4} stroke="#475569" strokeWidth="1" />
                    <line x1={x0 + w} y1={y0 - rectW - 12} x2={x0 + w} y2={y0 - rectW - 4} stroke="#475569" strokeWidth="1" />
                    <text x={250} y={y0 - rectW - 14} fontSize="9" fill="#94a3b8" textAnchor="middle">x = {xVal}</text>

                    <line x1={x0 + w + 8} y1={y0} x2={x0 + w + 8} y2={y0 - rectW} stroke="#475569" strokeWidth="1" />
                    <line x1={x0 + w + 4} y1={y0} x2={x0 + w + 12} y2={y0} stroke="#475569" strokeWidth="1" />
                    <line x1={x0 + w + 4} y1={y0 - rectW} x2={x0 + w + 12} y2={y0 - rectW} stroke="#475569" strokeWidth="1" />
                    <text x={x0 + w + 14} y={y0 - rectW / 2 + 3} fontSize="9" fill="#94a3b8">2.5</text>
                  </>
                )}

                {/* 3. Corner Squares (Completing the Square) */}
                {showCorners && (
                  <>
                    {/* Top-Left Corner */}
                    <rect 
                      x={x0 - rectW} 
                      y={y0 - rectW} 
                      width={rectW} 
                      height={rectW} 
                      fill="rgba(16, 185, 129, 0.18)" 
                      stroke="#10b981" 
                      strokeWidth="2" 
                      strokeDasharray="3 3" 
                    />
                    <text x={x0 - rectW / 2} y={y0 - rectW / 2 + 4} fontSize="8" fontWeight="bold" fill="#34d399" textAnchor="middle">6.25</text>

                    {/* Top-Right Corner */}
                    <rect 
                      x={x0 + w} 
                      y={y0 - rectW} 
                      width={rectW} 
                      height={rectW} 
                      fill="rgba(16, 185, 129, 0.18)" 
                      stroke="#10b981" 
                      strokeWidth="2" 
                      strokeDasharray="3 3" 
                    />
                    <text x={x0 + w + rectW / 2} y={y0 - rectW / 2 + 4} fontSize="8" fontWeight="bold" fill="#34d399" textAnchor="middle">6.25</text>

                    {/* Bottom-Left Corner */}
                    <rect 
                      x={x0 - rectW} 
                      y={y0 + w} 
                      width={rectW} 
                      height={rectW} 
                      fill="rgba(16, 185, 129, 0.18)" 
                      stroke="#10b981" 
                      strokeWidth="2" 
                      strokeDasharray="3 3" 
                    />
                    <text x={x0 - rectW / 2} y={y0 + w + rectW / 2 + 4} fontSize="8" fontWeight="bold" fill="#34d399" textAnchor="middle">6.25</text>

                    {/* Bottom-Right Corner */}
                    <rect 
                      x={x0 + w} 
                      y={y0 + w} 
                      width={rectW} 
                      height={rectW} 
                      fill="rgba(16, 185, 129, 0.18)" 
                      stroke="#10b981" 
                      strokeWidth="2" 
                      strokeDasharray="3 3" 
                    />
                    <text x={x0 + w + rectW / 2} y={y0 + w + rectW / 2 + 4} fontSize="8" fontWeight="bold" fill="#34d399" textAnchor="middle">6.25</text>

                    {/* Total Completed Outer square border */}
                    <rect 
                      x={x0 - rectW} 
                      y={y0 - rectW} 
                      width={w + 2 * rectW} 
                      height={w + 2 * rectW} 
                      fill="none" 
                      stroke="#34d399" 
                      strokeWidth="1.5" 
                    />
                  </>
                )}
              </svg>
            </div>

            {/* Stepper details */}
            <div className="w-full max-w-md bg-slate-950/60 p-4 rounded-xl border border-slate-800 mb-2">
              <label className="flex justify-between text-xs font-semibold text-slate-400 mb-2">
                <span>Visual Equation Solver (Leg x)</span>
                <span className="text-emerald-400 font-bold">{xVal} units</span>
              </label>
              <input
                type="range"
                min="1"
                max="8"
                step="1"
                value={xVal}
                onChange={(e) => setXVal(parseInt(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer h-1.5 bg-slate-800 rounded mb-3"
              />
              
              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => setShowRects(!showRects)}
                  className={`px-3 py-1.5 rounded border text-[10px] uppercase font-bold tracking-wider transition cursor-pointer ${
                    showRects 
                      ? 'bg-amber-600/20 text-amber-300 border-amber-500/50' 
                      : 'bg-slate-900 text-slate-500 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {showRects ? 'Hide Rectangles' : 'Add 10x Rectangles'}
                </button>
                
                <button
                  onClick={() => setShowCorners(!showCorners)}
                  className={`px-3 py-1.5 rounded border text-[10px] uppercase font-bold tracking-wider transition cursor-pointer ${
                    showCorners 
                      ? 'bg-emerald-600/20 text-emerald-300 border-emerald-500/50 shadow-[0_0_10px_rgba(16,185,129,0.15)]' 
                      : 'bg-slate-900 text-slate-500 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {showCorners ? 'Clear Corners' : 'Complete the Square'}
                </button>
              </div>
            </div>
          </div>
        </div>
      }
    >
      <div className="flex flex-col gap-4 text-slate-300 text-xs">
        <p className="leading-relaxed text-slate-400">
          Islamic scholars, notably <strong>Al-Khwarizmi</strong>, developed systematic geometric methods to solve quadratic algebraic equations. To solve $x^2 + 10x = 39$:
        </p>

        {/* Visual explanation list */}
        <div className="bg-slate-900/60 border border-slate-800/40 rounded-xl p-3.5 flex flex-col gap-2">
          <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Geometric Completion</h4>
          <ol className="list-decimal pl-4 flex flex-col gap-1.5 text-[11px] text-slate-400">
            <li>Start with a central square of area $x^2$.</li>
            <li>Take the $10x$ term, divide it by 4 (to get $2.5$), and add four rectangles of size $x \times 2.5$ on the edges. The total area of this cross is $x^2 + 10x = 39$.</li>
            <li>To "complete" the outer square, fill in the 4 corners. Each corner has area $2.5 \times 2.5 = 6.25$.</li>
            <li>The total area added is $4 \times 6.25 = 25$ units.</li>
            <li>The total area of the completed large square is $39 + 25 = 64$ units.</li>
            <li>Therefore, the side of the completed square is $\sqrt{64} = 8$ units.</li>
            <li>Since the side is $x + 2.5 + 2.5 = x + 5$, we have $x + 5 = 8$.</li>
          </ol>
        </div>

        {/* Verification Card */}
        <div className="bg-slate-950/40 border border-slate-800/80 p-4 rounded-xl flex flex-col gap-3">
          <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
            <Compass className="w-4 h-4" /> 1. Completing the Square
          </h3>
          <p className="text-[11px] leading-relaxed text-slate-300">
            Toggle the geometric rectangles and complete the corners. Find the positive integer value of $x$ that satisfies $x^2 + 10x = 39$:
          </p>

          <div className="border-t border-slate-800/80 pt-3 flex flex-col gap-2.5">
            <div className="flex flex-col gap-1">
              <span className="text-[9px] uppercase font-bold tracking-wider text-slate-400">Value of x</span>
              <input
                type="number"
                value={answer}
                onChange={(e) => {
                  setAnswer(e.target.value);
                  setErrorMsg('');
                }}
                disabled={isSuccess}
                placeholder="e.g. 5"
                className="bg-slate-900 border border-slate-800 text-white text-xs px-3 py-2 rounded-lg outline-none focus:border-emerald-500 transition text-center font-mono"
              />
            </div>

            {errorMsg && (
              <div className="text-[11px] text-rose-400 font-bold bg-rose-950/20 border border-rose-900/50 p-2 rounded mt-1">
                {errorMsg}
              </div>
            )}

            {isSuccess ? (
              <div className="text-[11px] text-emerald-400 font-bold bg-emerald-950/20 border border-emerald-900/50 p-2.5 rounded flex items-center gap-1.5 mt-1">
                <Star className="w-4 h-4 text-emerald-400 fill-current" />
                <span>Superb! Algebra solved (x = 3). Task 1 complete!</span>
              </div>
            ) : (
              <div className="flex justify-end mt-1">
                <button
                  onClick={handleVerify}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2 rounded-lg text-xs transition cursor-pointer"
                >
                  Verify Answer
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </LevelShell>
  );
}
