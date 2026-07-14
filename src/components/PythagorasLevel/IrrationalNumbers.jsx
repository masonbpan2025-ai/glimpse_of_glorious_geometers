import React, { useState } from 'react';
import { useGameState } from '../../context/GameStateContext';
import LevelShell from '../LevelShell';
import { Compass, Star, ChevronRight, ChevronLeft } from 'lucide-react';

export default function IrrationalNumbers() {
  const { completedSubtasks, activeSubtask, completeSubtask } = useGameState();
  
  // Step index for the construction (1 to 4)
  const [step, setStep] = useState(1);

  // Form input answers for q' and p'
  const [legAnswer, setLegAnswer] = useState('');
  const [hypAnswer, setHypAnswer] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  // SVG Coordinates for the construction
  // Triangle ABC is right-angled at B
  const B = { x: 150, y: 240 };
  const C = { x: 350, y: 240 }; // Horizontal leg BC of length 200
  const A = { x: 150, y: 40 };  // Vertical leg AB of length 200

  // CD = q = 200. Hypotenuse AC length = 200 * sqrt(2) ≈ 282.84
  // D lies on AC at distance 200 from C:
  // D = C + 200 * (A - C) / |A - C| = (350 - 141.42, 240 - 141.42) = (208.58, 98.58)
  const D = { x: 208.58, y: 98.58 };

  // DE is perpendicular to AC at D, meeting AB at E = (150, 157.16)
  const E = { x: 150, y: 157.16 };

  const handleVerify = (e) => {
    e.preventDefault();
    const qPrime = parseInt(legAnswer.trim());
    const pPrime = parseInt(hypAnswer.trim());

    if (isNaN(qPrime) || isNaN(pPrime)) {
      setErrorMsg('Please enter valid integers for both answers.');
      return;
    }

    // Correct answers for q = 17, p = 24:
    // q' = p - q = 24 - 17 = 7
    // p' = 2q - p = 34 - 24 = 10
    if (qPrime === 7 && pPrime === 10) {
      setIsSuccess(true);
      setErrorMsg('');
      completeSubtask(3, 2); // Complete Level 3 Subtask 2 (unlocks Level 4)
    } else {
      setErrorMsg('Incorrect values. Use the formulas: q\' = p - q and p\' = 2q - p.');
    }
  };

  return (
    <LevelShell
      title="Level 3: Pythagoras"
      activeSubtask={activeSubtask}
      completedSubtasks={completedSubtasks}
      canvas={
        <div className="absolute inset-0 flex flex-col items-center justify-center p-4 md:p-6 pb-2 bg-slate-900/5 select-none">
          {/* Info Header */}
          <div className="absolute top-6 left-6 text-xs bg-slate-950/80 border border-slate-800 px-3 py-1.5 rounded-lg flex items-center gap-2 z-10">
            <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
            <span className="text-slate-400">Step {step} of 4: Use the arrow buttons below to build the proof</span>
          </div>

          {/* SVG Frame */}
          <div className="w-[95%] h-[88%] max-w-4xl max-h-[450px] border border-slate-800/80 rounded-2xl bg-gradient-to-b from-[#111622]/80 to-slate-950/90 shadow-2xl relative overflow-hidden flex flex-col justify-center items-center">
            <div className="w-full flex-grow flex items-center justify-center relative">
              <svg viewBox="0 0 500 300" className="w-full max-w-md drop-shadow-lg">
                {/* Right angle marker at B */}
                <rect x={B.x} y={B.y - 12} width="12" height="12" fill="none" stroke="#475569" strokeWidth="1.5" />

                {/* Main Triangle ABC (Step 1+) */}
                <polygon 
                  points={`${A.x},${A.y} ${B.x},${B.y} ${C.x},${C.y}`} 
                  fill="none" 
                  stroke="#334155" 
                  strokeWidth="2.5" 
                />

                {/* Point Labels */}
                <text x={A.x - 12} y={A.y + 4} className="text-[11px] font-bold fill-slate-400">A</text>
                <text x={B.x - 12} y={B.y + 12} className="text-[11px] font-bold fill-slate-400">B</text>
                <text x={C.x + 8} y={C.y + 4} className="text-[11px] font-bold fill-slate-400">C</text>

                {/* Side Length Labels for ABC */}
                <text x={B.x - 15} y={(A.y + B.y) / 2} className="text-[9px] font-mono fill-slate-500" textAnchor="end">AB = q</text>
                <text x={(B.x + C.x) / 2} y={B.y + 15} className="text-[9px] font-mono fill-slate-500" textAnchor="middle">BC = q</text>
                <text x={(A.x + C.x) / 2 + 10} y={(A.y + C.y) / 2 - 10} className="text-[9px] font-mono fill-slate-500">AC = p</text>

                {/* Step 2: Draw the arc centered at C with radius q */}
                {step >= 2 && (
                  <>
                    {/* Radial Arc */}
                    <path 
                      d={`M ${C.x} ${C.y - 200} A 200 200 0 0 0 ${B.x} ${B.y}`} 
                      fill="none" 
                      stroke="#8b5cf6" 
                      strokeWidth="2" 
                      strokeDasharray="4 4" 
                      className="opacity-70"
                    />
                    
                    {/* Point D */}
                    <circle cx={D.x} cy={D.y} r="4.5" fill="#a855f7" />
                    <text x={D.x + 8} y={D.y - 4} className="text-[10px] font-extrabold fill-purple-400">D</text>

                    {/* Segment divisions */}
                    <text x={(C.x + D.x) / 2 + 12} y={(C.y + D.y) / 2 + 12} className="text-[9px] font-mono fill-purple-400" textAnchor="middle">CD = q</text>
                    <text x={(A.x + D.x) / 2 - 12} y={(A.y + D.y) / 2 - 12} className="text-[9px] font-mono fill-purple-300" textAnchor="middle">AD = p - q</text>
                  </>
                )}

                {/* Step 3: Draw perpendicular line DE */}
                {step >= 3 && (
                  <>
                    {/* Perpendicular marker at D */}
                    <g transform={`translate(${D.x},${D.y}) rotate(45)`}>
                      <rect x="-8" y="-8" width="8" height="8" fill="none" stroke="#64748b" strokeWidth="1.2" />
                    </g>
                    
                    {/* Line segment DE */}
                    <line x1={D.x} y1={D.y} x2={E.x} y2={E.y} stroke="#10b981" strokeWidth="2.5" />
                    
                    {/* Point E */}
                    <circle cx={E.x} cy={E.y} r="4.5" fill="#10b981" />
                    <text x={E.x - 12} y={E.y + 4} className="text-[10px] font-extrabold fill-emerald-400 text-right" textAnchor="end">E</text>

                    {/* Perpendicular segments labels */}
                    <text x={(D.x + E.x) / 2 + 12} y={(D.y + E.y) / 2 - 6} className="text-[9px] font-mono fill-emerald-400" textAnchor="middle">DE = p - q</text>
                    <text x={E.x - 15} y={(E.y + B.y) / 2} className="text-[9px] font-mono fill-emerald-500" textAnchor="end">EB = p - q</text>
                  </>
                )}

                {/* Step 4: Highlight the smaller isosceles triangle ADE */}
                {step === 4 && (
                  <polygon 
                    points={`${A.x},${A.y} ${D.x},${D.y} ${E.x},${E.y}`} 
                    fill="rgba(168, 85, 247, 0.15)" 
                    stroke="#a855f7" 
                    strokeWidth="3" 
                  />
                )}
              </svg>
            </div>

            {/* Stepper Controllers */}
            <div className="w-full max-w-md bg-slate-950/60 p-4 rounded-xl border border-slate-800 mb-2.5">
              <div className="flex justify-between items-center">
                <button
                  onClick={() => setStep(Math.max(1, step - 1))}
                  disabled={step === 1}
                  className="p-2 bg-slate-900 border border-slate-800 text-slate-300 rounded-lg hover:border-purple-500 hover:text-purple-400 disabled:opacity-30 disabled:hover:border-slate-800 disabled:hover:text-slate-300 transition cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                
                <span className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider">
                  {step === 1 && '1. Initial Triangle'}
                  {step === 2 && '2. Swing Arc from C'}
                  {step === 3 && '3. Perpendicular at D'}
                  {step === 4 && '4. Smaller Triangle Constructed'}
                </span>

                <button
                  onClick={() => setStep(Math.min(4, step + 1))}
                  disabled={step === 4}
                  className="p-2 bg-slate-900 border border-slate-800 text-slate-300 rounded-lg hover:border-purple-500 hover:text-purple-400 disabled:opacity-30 disabled:hover:border-slate-800 disabled:hover:text-slate-300 transition cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Progress bar dot markers */}
              <div className="flex justify-center gap-1.5 mt-3">
                {[1, 2, 3, 4].map((s) => (
                  <button
                    key={s}
                    onClick={() => setStep(s)}
                    className={`w-8 h-1.5 rounded-full transition cursor-pointer ${
                      s <= step ? 'bg-purple-500' : 'bg-slate-850 hover:bg-slate-800'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      }
    >
      <div className="flex flex-col gap-4 text-slate-300 text-xs">
        <p className="leading-relaxed text-slate-400">
          The Pythagorean followers believed that all quantities could be expressed as a ratio of whole numbers. However, when trying to measure the diagonal <i>p</i> of a square with side <i>q</i>, they discovered it was <strong>incommensurable</strong>—which we now call <strong>irrational</strong> (√2).
        </p>

        {/* Informational Card showing the Proof Steps */}
        <div className="bg-slate-900/60 border border-slate-800/40 rounded-xl p-3.5 flex flex-col gap-2.5">
          <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">The Infinite Descent Proof</h4>
          <p className="text-[11px] leading-relaxed text-slate-300">
            If <i>p</i> and <i>q</i> are integers, we can build a right isosceles triangle <i>ABC</i> with leg <i>q</i> and hypotenuse <i>p</i>. 
          </p>
          <ul className="list-decimal pl-4 flex flex-col gap-1.5 text-[11px] text-slate-400">
            <li>Swing an arc of radius <i>q</i> from <i>C</i> to find <i>D</i> on <i>AC</i>. Thus, <i>AD</i> = <i>p</i> - <i>q</i>.</li>
            <li>Draw a perpendicular to <i>AC</i> at <i>D</i> to meet <i>AB</i> at <i>E</i>. The tangents from <i>E</i> give <i>EB</i> = <i>DE</i> = <i>p</i> - <i>q</i>.</li>
            <li>This forms a new right isosceles triangle <i>ADE</i> with leg <i>q'</i> = <i>AD</i> = <i>p</i> - <i>q</i>.</li>
            <li>The hypotenuse of the new triangle is <i>p'</i> = <i>AE</i> = <i>q</i> - <i>EB</i> = 2<i>q</i> - <i>p</i>.</li>
            <li>Since <i>p</i> and <i>q</i> are integers, the new leg <i>q'</i> and hypotenuse <i>p'</i> are also smaller integers. By repeating this, we can construct infinitely smaller triangles with integer sides, which is a contradiction!</li>
          </ul>
        </div>

        {/* Verification Card */}
        <div className="bg-slate-950/40 border border-slate-800/80 p-4 rounded-xl flex flex-col gap-3">
          <h3 className="text-xs font-bold text-purple-400 uppercase tracking-wider flex items-center gap-2">
            <Compass className="w-4 h-4" /> 2. Incommensurability
          </h3>
          <p className="text-[11px] leading-relaxed text-slate-300">
            Use the formulas derived above to find the integer dimensions of the constructed smaller triangle if the initial triangle starts with leg <i>q</i> = 17 and hypotenuse <i>p</i> = 24.
          </p>

          <div className="border-t border-slate-800/80 pt-3 flex flex-col gap-3">
            {/* leg q' input */}
            <div className="flex flex-col gap-1">
              <span className="text-[9px] uppercase font-bold tracking-wider text-slate-400">Smaller Leg q' (p - q)</span>
              <input
                type="number"
                value={legAnswer}
                onChange={(e) => {
                  setLegAnswer(e.target.value);
                  setErrorMsg('');
                }}
                disabled={isSuccess}
                placeholder="Leg q'"
                className="bg-slate-900 border border-slate-800 text-white text-xs px-3 py-2 rounded-lg outline-none focus:border-purple-500 transition text-center font-mono"
              />
            </div>

            {/* hypotenuse p' input */}
            <div className="flex flex-col gap-1">
              <span className="text-[9px] uppercase font-bold tracking-wider text-slate-400">Smaller Hypotenuse p' (2q - p)</span>
              <input
                type="number"
                value={hypAnswer}
                onChange={(e) => {
                  setHypAnswer(e.target.value);
                  setErrorMsg('');
                }}
                disabled={isSuccess}
                placeholder="Hypotenuse p'"
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
                <span>Superb! Dimensions verified (q'=7, p'=10). Pythagoras Level Complete!</span>
              </div>
            ) : (
              <div className="flex justify-end mt-1">
                <button
                  onClick={handleVerify}
                  className="bg-purple-600 hover:bg-purple-500 text-white font-bold px-4 py-2 rounded-lg text-xs transition cursor-pointer"
                >
                  Verify Dimensions
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </LevelShell>
  );
}
