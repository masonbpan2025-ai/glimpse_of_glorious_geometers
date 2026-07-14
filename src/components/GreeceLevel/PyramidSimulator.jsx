import React, { useState } from 'react';
import { useGameState } from '../../context/GameStateContext';
import LevelShell from '../LevelShell';
import { Sun, Compass, Star } from 'lucide-react';

export default function PyramidSimulator() {
  const { completedSubtasks, activeSubtask, completeSubtask } = useGameState();
  const [sunAngleDeg, setSunAngleDeg] = useState(60);

  // Form Verification State
  const [shadowAnswer, setShadowAnswer] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const groundY = 320;
  const H_pyramid = 146;
  const W_pyramid = 230;
  const P_center = 250;

  const h_stick = 30;
  const S_center = 600;

  const sunAngleRad = (sunAngleDeg * Math.PI) / 180;

  const shadow_pyramid = H_pyramid / Math.tan(sunAngleRad);
  const shadow_stick = h_stick / Math.tan(sunAngleRad);

  const isMagicMoment = Math.abs(sunAngleDeg - 45) < 0.5;

  const handleVerify = (e) => {
    e.preventDefault();
    const ans = parseInt(shadowAnswer.trim(), 10);
    if (isNaN(ans)) {
      setErrorMsg('Please enter a valid height.');
      return;
    }
    // Correct answer is 146 (since at 45 deg, shadow = height = 146)
    if (ans === 146) {
      setIsSuccess(true);
      setErrorMsg('');
      completeSubtask(2, 2); // Complete Level 2 Subtask 2
    } else {
      setErrorMsg('Incorrect shadow length. Move the sun angle slider to exactly 45° to read the length!');
    }
  };

  return (
    <LevelShell
      title="Level 2: Thales and Intercept Theorem"
      activeSubtask={activeSubtask}
      completedSubtasks={completedSubtasks}
      canvas={
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-slate-900/5 select-none">
          {/* Magic moment alert */}
          <div className={`absolute top-6 left-6 right-6 text-center max-w-md mx-auto px-4 py-2 rounded-full font-bold shadow-lg border border-amber-500/30 transition-all duration-500 z-10 ${
            isMagicMoment
              ? 'bg-amber-500 text-slate-950 scale-100 opacity-100'
              : 'bg-slate-950/80 text-slate-500 opacity-0 scale-95 pointer-events-none'
          }`}>
            ✨ The Magic Moment! Sun angle is 45°: Shadow = Height! ✨
          </div>

          {/* SVG Frame */}
          <div className="w-[95%] h-[80%] max-w-4xl max-h-[480px] border border-slate-800/80 rounded-2xl bg-gradient-to-b from-sky-900/80 via-sky-950/90 to-slate-950 shadow-2xl relative overflow-hidden flex flex-col justify-center items-center">
            {/* Sun indicator */}
            <div className="w-full flex-grow flex items-center justify-center relative">
              <svg viewBox="0 0 800 420" className="w-full h-full">
                {/* Sky gradient background */}
                <defs>
                  <linearGradient id="skyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#1e293b" />
                    <stop offset="70%" stopColor="#0f172a" />
                    <stop offset="100%" stopColor="#020617" />
                  </linearGradient>
                  <linearGradient id="pyramidSide" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#b45309" />
                    <stop offset="100%" stopColor="#78350f" />
                  </linearGradient>
                  <linearGradient id="pyramidMain" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#d97706" />
                    <stop offset="100%" stopColor="#b45309" />
                  </linearGradient>
                  <marker id="arrowHead" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                    <path d="M 0 0 L 10 5 L 0 10 z" fill="#fbbf24" />
                  </marker>
                </defs>

                {/* Sky */}
                <rect x="0" y="0" width="800" height={groundY} fill="url(#skyGrad)" opacity="0.3" />

                {/* Ground */}
                <rect x="0" y={groundY} width="800" height="100" fill="#2d1c07" opacity="0.75" />
                <line x1="0" y1={groundY} x2="800" y2={groundY} stroke="#b45309" strokeWidth="2.5" />

                {/* Animated Sun */}
                <g transform={`translate(${P_center + 180}, ${groundY - H_pyramid - 180 * Math.tan(sunAngleRad)})`}>
                  <circle cx="0" cy="0" r="22" fill="#f59e0b" className="animate-pulse" />
                  <circle cx="0" cy="0" r="30" fill="#fcd34d" opacity="0.25" />
                </g>

                {/* Pyramid shadow */}
                {shadow_pyramid > (W_pyramid / 2) && (
                  <polygon
                    points={`
                      ${P_center + W_pyramid / 2},${groundY} 
                      ${P_center + shadow_pyramid},${groundY} 
                      ${P_center + shadow_pyramid - 15},${groundY + 12}
                      ${P_center + W_pyramid / 2 - 15},${groundY + 12}
                    `}
                    fill="#020617" opacity="0.45"
                  />
                )}

                {/* Pyramid body */}
                <polygon
                  points={`
                    ${P_center - W_pyramid / 2},${groundY} 
                    ${P_center},${groundY - H_pyramid} 
                    ${P_center + W_pyramid / 2},${groundY}
                  `}
                  fill="url(#pyramidMain)"
                  stroke="#92400e"
                  strokeWidth="0.5"
                />
                
                {/* Pyramid shadow edge divisor */}
                <polygon
                  points={`
                    ${P_center},${groundY - H_pyramid} 
                    ${P_center + W_pyramid / 2},${groundY}
                    ${P_center},${groundY}
                  `}
                  fill="url(#pyramidSide)"
                  opacity="0.8"
                />

                {/* Vertical height axis indicator inside pyramid */}
                <line x1={P_center} y1={groundY} x2={P_center} y2={groundY - H_pyramid} stroke="#f8fafc" strokeDasharray="3 3" strokeWidth="1.5" />

                {/* Sun ray line of sight (Apex -> Shadow end) */}
                <line
                  x1={P_center} y1={groundY - H_pyramid}
                  x2={P_center + shadow_pyramid} y2={groundY}
                  stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="5 3"
                />

                {/* Stick and its shadow */}
                <g>
                  {/* Stick shadow */}
                  <line
                    x1={S_center} y1={groundY}
                    x2={S_center + shadow_stick} y2={groundY}
                    stroke="#020617" strokeWidth="5" opacity="0.5"
                  />
                  {/* Stick */}
                  <line
                    x1={S_center} y1={groundY}
                    x2={S_center} y2={groundY - h_stick}
                    stroke="#451a03" strokeWidth="3" strokeLinecap="round"
                  />
                  {/* Stick sun ray */}
                  <line
                    x1={S_center} y1={groundY - h_stick}
                    x2={S_center + shadow_stick} y2={groundY}
                    stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="5 3"
                  />
                </g>

                {/* Labels and Measurements */}
                {/* Pyramid labels */}
                <text x={P_center - 15} y={groundY - H_pyramid / 2} fill="#ffffff" fontSize="12" fontWeight="bold" textAnchor="end">H = ?</text>
                
                <path d={`M ${P_center} ${groundY + 22} L ${P_center + shadow_pyramid} ${groundY + 22}`} stroke="#fbbf24" strokeWidth="1" markerEnd="url(#arrowHead)" markerStart="url(#arrowHead)" />
                <text x={P_center + shadow_pyramid / 2} y={groundY + 38} fill="#fcd34d" fontSize="11" fontWeight="bold" textAnchor="middle">
                  S = {shadow_pyramid.toFixed(1)}m
                </text>

                {/* Stick labels */}
                <text x={S_center - 12} y={groundY - h_stick / 2 + 3} fill="#a1a1aa" fontSize="11" fontWeight="bold" textAnchor="end">h = {h_stick}m</text>
                
                <path d={`M ${S_center} ${groundY + 22} L ${S_center + shadow_stick} ${groundY + 22}`} stroke="#fbbf24" strokeWidth="1" markerEnd="url(#arrowHead)" markerStart="url(#arrowHead)" />
                <text x={S_center + shadow_stick / 2} y={groundY + 38} fill="#fcd34d" fontSize="11" fontWeight="bold" textAnchor="middle">
                  s = {shadow_stick.toFixed(1)}m
                </text>
              </svg>
            </div>

            {/* Slider frame */}
            <div className="w-full max-w-md bg-slate-950/60 p-4 rounded-xl border border-slate-800 mb-2">
              <div className="flex justify-between text-xs font-semibold text-slate-400 mb-2">
                <span>Adjust Sun Angle (Time of Day)</span>
                <span className="text-amber-400 font-bold">{sunAngleDeg.toFixed(1)}°</span>
              </div>
              <input
                type="range"
                min="25"
                max="75"
                step="0.1"
                value={sunAngleDeg}
                onChange={(e) => setSunAngleDeg(parseFloat(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer h-1.5 bg-slate-800 rounded"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                <span>Afternoon</span>
                <button 
                  onClick={() => setSunAngleDeg(45)}
                  className="px-3 py-1 bg-amber-600 hover:bg-amber-500 active:bg-amber-700 text-slate-950 font-extrabold rounded-md transition-all shadow-md text-[9px] uppercase tracking-wider cursor-pointer border border-amber-500 hover:border-amber-400"
                >
                  Set to 45°
                </button>
                <span>Midday</span>
              </div>
            </div>
          </div>
        </div>
      }
    >
      <div className="flex flex-col justify-between h-full text-slate-300 text-xs">
        <div className="flex flex-col gap-4">
          <p className="leading-relaxed text-slate-400">
            Thales of Miletus astounded Egypt's priests by measuring the height of the Great Pyramid using shadows and proportional similar triangles.
          </p>

          {/* Theoretical formula panel */}
          <div className="bg-slate-900/60 border border-slate-800/40 rounded-xl p-3 flex flex-col gap-2.5">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">The Proportional Relation</h4>
            
            <div className="flex justify-center items-center gap-5 font-mono text-xs text-slate-200">
              <div className="flex flex-col items-center">
                <span className="text-amber-400">Pyramid Height (H)</span>
                <div className="h-px w-full bg-slate-700 my-0.5"></div>
                <span>Pyramid Shadow (S)</span>
              </div>
              <span>=</span>
              <div className="flex flex-col items-center">
                <span className="text-amber-400">Stick Height (h)</span>
                <div className="h-px w-full bg-slate-700 my-0.5"></div>
                <span>Stick Shadow (s)</span>
              </div>
            </div>

            <div className="text-center font-mono font-bold text-[11px] bg-slate-950/80 p-2 rounded border border-slate-800 text-slate-300">
              <span>H = S * (h / s)</span>
              <span className="block mt-1 text-[10px] text-slate-500">
                H = {shadow_pyramid.toFixed(1)} * ({h_stick} / {shadow_stick.toFixed(1)}) = {Math.round(shadow_pyramid * (h_stick / shadow_stick))}m
              </span>
            </div>
          </div>

          {/* Verification Card */}
          <div className="bg-slate-950/40 border border-slate-800/80 p-4 rounded-xl flex flex-col gap-3">
            <h3 className="text-xs font-bold text-blue-400 uppercase tracking-wider flex items-center gap-2">
              <Compass className="w-4 h-4" /> 2. Pyramid Shadows
            </h3>
            <p className="text-[11px] leading-relaxed text-slate-300">
              Thales realized that when the sun angle hits exactly 45 degrees, a vertical object's shadow length is exactly equal to its vertical height.
            </p>
            
            <div className="border-t border-slate-800/80 pt-3 flex flex-col gap-2.5">
              <span className="text-[11px] font-semibold text-slate-200">
                Set the sun angle slider to exactly **45°** to reach the Magic Moment. What is the length of the pyramid shadow S at this position?
              </span>
              
              <div className="flex flex-col gap-1 mt-1">
                <span className="text-[9px] uppercase font-bold tracking-wider text-slate-400">Shadow Length S (meters)</span>
                <input
                  type="number"
                  value={shadowAnswer}
                  onChange={(e) => {
                    setShadowAnswer(e.target.value);
                    setErrorMsg('');
                  }}
                  disabled={isSuccess}
                  placeholder="e.g. 150"
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
                  <span>Correct! Shadow equals height (146m). Task 3 is unlocked.</span>
                </div>
              ) : (
                <div className="flex justify-end mt-1">
                  <button
                    onClick={handleVerify}
                    className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-2 rounded-lg text-xs transition cursor-pointer"
                  >
                    Verify Shadow
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
