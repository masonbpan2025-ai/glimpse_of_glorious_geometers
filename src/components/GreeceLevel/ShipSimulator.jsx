import React, { useState } from 'react';
import { useGameState } from '../../context/GameStateContext';
import LevelShell from '../LevelShell';
import { Anchor, Compass, Star } from 'lucide-react';

export default function ShipSimulator() {
  const { completedSubtasks, activeSubtask, completeSubtask } = useGameState();
  const [shipDist, setShipDist] = useState(180); // Distance AS (Ship to shore point A)
  const [baseAB, setBaseAB] = useState(160);     // Distance AB (First shore leg)

  // Form State
  const [targetAnswer, setTargetAnswer] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  // Constants
  const baseBC = 60; // Fixed small leg on shore
  const shoreY = 220; // Y coordinate of shoreline
  const startX = 120; // X coordinate of A

  // Proportional inland walk calculation
  const distCD = shipDist * (baseBC / baseAB);

  // SVG coordinates
  const A = { x: startX, y: shoreY };
  const B = { x: startX + baseAB, y: shoreY };
  const C = { x: startX + baseAB + baseBC, y: shoreY };
  const S = { x: startX, y: shoreY - shipDist };
  const D = { x: startX + baseAB + baseBC, y: shoreY + distCD };

  const handleVerify = (e) => {
    e.preventDefault();
    const ans = parseInt(targetAnswer.trim(), 10);
    if (isNaN(ans)) {
      setErrorMsg('Please enter a valid distance.');
      return;
    }
    
    // Correct answer is 150 (since AS = 150, AB = 200, CD = 45 -> 150 = 200 * (45/60))
    if (ans === 150) {
      setIsSuccess(true);
      setErrorMsg('');
      completeSubtask(2, 3); // Complete Level 2 Subtask 3 (unlocks Level 3)
    } else {
      setErrorMsg('Incorrect ship distance. Verify your settings (AB=200, CD=45) and recompute!');
    }
  };

  return (
    <LevelShell
      title="Level 2: Thales and Intercept Theorem"
      activeSubtask={activeSubtask}
      completedSubtasks={completedSubtasks}
      canvas={
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-slate-900/5 select-none">
          {/* Informative Header */}
          <div className="absolute top-6 left-6 text-xs bg-slate-950/80 border border-slate-800 px-3 py-1.5 rounded-lg flex items-center gap-2 z-10">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-slate-400">Interactive Map: Adjust variables to align triangles</span>
          </div>

          {/* SVG Frame */}
          <div className="w-[95%] h-[80%] max-w-4xl max-h-[480px] border border-slate-800/80 rounded-2xl bg-gradient-to-b from-[#111622]/80 to-slate-950/90 shadow-2xl relative overflow-hidden flex flex-col justify-center items-center">
            <div className="w-full flex-grow relative">
              <svg viewBox="0 0 800 420" className="w-full h-full">
                {/* Defs for arrow heads */}
                <defs>
                  <marker id="arrowBlue" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                    <path d="M 0 0 L 10 5 L 0 10 z" fill="#3b82f6" />
                  </marker>
                  <marker id="arrowGreen" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                    <path d="M 0 0 L 10 5 L 0 10 z" fill="#10b981" />
                  </marker>
                </defs>

                {/* Water Ocean */}
                <rect x="0" y="0" width="800" height={shoreY} fill="#0c4a6e" opacity="0.4" />
                
                {/* Land Sandy Beach */}
                <rect x="0" y={shoreY} width="800" height={420 - shoreY} fill="#292524" opacity="0.8" />
                
                {/* Shoreline split line */}
                <line x1="0" y1={shoreY} x2="800" y2={shoreY} stroke="#78350f" strokeWidth="3" />

                {/* Sea Triangle (A-B-S) */}
                <polygon
                  points={`${A.x},${A.y} ${B.x},${B.y} ${S.x},${S.y}`}
                  fill="rgba(59, 130, 246, 0.08)"
                  stroke="#3b82f6"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                />

                {/* Land Triangle (C-B-D) */}
                <polygon
                  points={`${C.x},${C.y} ${B.x},${B.y} ${D.x},${D.y}`}
                  fill="rgba(16, 185, 129, 0.12)"
                  stroke="#10b981"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                />

                {/* Right angle indicator boxes */}
                <polyline points={`${A.x},${A.y - 12} ${A.x + 12},${A.y - 12} ${A.x + 12},${A.y}`} fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
                <polyline points={`${C.x},${C.y + 12} ${C.x - 12},${C.y + 12} ${C.x - 12},${C.y}`} fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />

                {/* Red Line of Sight (S -> B -> D) */}
                <line
                  x1={S.x} y1={S.y}
                  x2={D.x} y2={D.y}
                  stroke="#ef4444"
                  strokeWidth="2"
                  strokeDasharray="8 4"
                  opacity="0.8"
                />

                {/* Peg nodes & letters */}
                <g>
                  {/* Peg A */}
                  <circle cx={A.x} cy={A.y} r="5" fill="#f8fafc" stroke="#3b82f6" strokeWidth="1.5" />
                  <text x={A.x - 15} y={A.y + 18} fontSize="12" fontWeight="bold" fill="#94a3b8">A</text>

                  {/* Peg B */}
                  <circle cx={B.x} cy={B.y} r="5" fill="#f8fafc" stroke="#3b82f6" strokeWidth="1.5" />
                  <text x={B.x} y={B.y - 10} fontSize="12" fontWeight="bold" fill="#94a3b8" textAnchor="middle">B</text>

                  {/* Peg C */}
                  <circle cx={C.x} cy={C.y} r="5" fill="#f8fafc" stroke="#10b981" strokeWidth="1.5" />
                  <text x={C.x + 15} y={C.y - 10} fontSize="12" fontWeight="bold" fill="#94a3b8">C</text>
                  <text x={B.x + baseBC / 2} y={A.y + 18} fontSize="10" fill="#a1a1aa" textAnchor="middle">BC = {baseBC}m</text>
                  
                  {/* Observer D */}
                  <circle cx={D.x} cy={D.y} r="5" fill="#10b981" stroke="#6ee7b7" strokeWidth="1.5" />
                  <text x={D.x} y={D.y + 20} fontSize="12" fontWeight="bold" fill="#34d399" textAnchor="middle">D (Observer)</text>
                </g>

                {/* Measurements annotations */}
                {/* Shoreline Baseline (AB) measurement */}
                <line x1={A.x} y1={A.y + 25} x2={B.x} y2={B.y + 25} stroke="#3b82f6" strokeWidth="1.2" markerEnd="url(#arrowBlue)" markerStart="url(#arrowBlue)" />
                <text x={A.x + baseAB / 2} y={A.y + 40} fontSize="11" fontWeight="bold" fill="#60a5fa" textAnchor="middle">
                  Shoreline Baseline (AB) = {baseAB}m
                </text>

                {/* Inland walking (CD) */}
                <path d={`M ${C.x + 55} ${C.y} L ${C.x + 55} ${D.y}`} stroke="#10b981" strokeWidth="1.2" markerEnd="url(#arrowGreen)" markerStart="url(#arrowGreen)" />
                <text x={C.x + 67} y={C.y + distCD / 2} fontSize="11" fontWeight="bold" fill="#34d399" transform={`rotate(90 ${C.x + 67} ${C.y + distCD / 2})`} textAnchor="middle">
                  Inland Walk (CD) = {distCD.toFixed(1)}m
                </text>

                {/* The Ship */}
                <g transform={`translate(${S.x}, ${S.y - 4})`}>
                  <path d="M -18 -5 L 18 -5 L 12 8 L -12 8 Z" fill="#475569" stroke="#94a3b8" strokeWidth="1" />
                  <path d="M 0 -5 L 0 -26 L 14 -8 Z" fill="#f8fafc" opacity="0.9" />
                  <text x="24" y="-8" fontSize="11" fontWeight="bold" fill="#38bdf8" filter="drop-shadow(0 1px 2px rgba(0,0,0,0.8))">Ship (S)</text>
                </g>
              </svg>
            </div>
          </div>
        </div>
      }
    >
      <div className="flex flex-col justify-between h-full text-slate-300 text-xs">
        <div className="flex flex-col gap-4">
          <p className="leading-relaxed text-slate-400">
            Thales helped Greek generals measure the distance of enemy ships out at sea. By pacing inland along a line orthogonal to the shoreline, observers mapped similar triangles.
          </p>

          {/* Interactive controls in left panel */}
          <div className="bg-slate-900/60 border border-slate-800/40 rounded-xl p-3 flex flex-col gap-3">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Adjustment Sliders</h4>
            
            {/* Shoreline walk AB */}
            <div className="flex flex-col gap-1">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-400">Shoreline Baseline (AB):</span>
                <span className={baseAB === 200 ? 'text-emerald-400 font-bold' : 'text-blue-400 font-bold'}>
                  {baseAB}m {baseAB === 200 && '✓'}
                </span>
              </div>
              <input
                type="range"
                min="80"
                max="250"
                step="1"
                value={baseAB}
                onChange={(e) => setBaseAB(parseInt(e.target.value))}
                className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
            </div>

            {/* Ship Distance AS */}
            <div className="flex flex-col gap-1">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-400">Ship Distance (AS):</span>
                <span className="text-blue-400 font-bold">?</span>
              </div>
              <input
                type="range"
                min="100"
                max="230"
                step="1"
                value={shipDist}
                onChange={(e) => setShipDist(parseInt(e.target.value))}
                className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
            </div>
            
            {/* Live measurement outputs */}
            <div className="grid grid-cols-2 gap-2 text-xs border-t border-slate-800/40 pt-2 font-mono">
              <div>
                <span className="text-slate-500 block text-[9px] uppercase">Inland walk CD:</span>
                <span className="text-xs font-bold text-white">{distCD.toFixed(2)}m</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[9px] uppercase">Shore BC (fixed):</span>
                <span className="text-xs font-bold text-white">60.00m</span>
              </div>
            </div>
          </div>

          {/* Verification Card */}
          <div className="bg-slate-950/40 border border-slate-800/80 p-4 rounded-xl flex flex-col gap-3">
            <h3 className="text-xs font-bold text-blue-400 uppercase tracking-wider flex items-center gap-2">
              <Compass className="w-4 h-4" /> 3. Distance at Sea
            </h3>
            <p className="text-[11px] leading-relaxed text-slate-300">
              The observer CD and sea distance AS are proportional to their respective shoreline segments:
            </p>
            <span className="text-emerald-400 font-mono font-bold block text-center py-1 bg-slate-900 border border-slate-800 rounded text-[11px]">
              AS = AB * (CD / BC)
            </span>
            
            <div className="border-t border-slate-800/80 pt-3 flex flex-col gap-2.5">
              <span className="text-[11px] font-semibold text-slate-200">
                Set shoreline baseline (AB) to exactly **200m**. Slide the ship distance until the inland walk (CD) measures exactly **45.0m**. What is the target distance AS?
              </span>
              
              <div className="flex flex-col gap-1 mt-1">
                <span className="text-[9px] uppercase font-bold tracking-wider text-slate-400">Target Distance AS (meters)</span>
                <input
                  type="number"
                  value={targetAnswer}
                  onChange={(e) => {
                    setTargetAnswer(e.target.value);
                    setErrorMsg('');
                  }}
                  disabled={isSuccess}
                  placeholder="e.g. 120"
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
                  <span>Perfect! Target distance is verified (150m). Level 2 Complete!</span>
                </div>
              ) : (
                <div className="flex justify-end mt-1">
                  <button
                    onClick={handleVerify}
                    className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-2 rounded-lg text-xs transition cursor-pointer"
                  >
                    Verify Distance
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
