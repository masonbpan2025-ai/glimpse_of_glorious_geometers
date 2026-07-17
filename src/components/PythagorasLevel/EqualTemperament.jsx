import React, { useState } from 'react';
import { useGameState } from '../../context/GameStateContext';
import LevelShell from '../LevelShell';
import { Compass, Star, Settings2, ArrowRightLeft, AlertTriangle, CheckCircle2 } from 'lucide-react';

const scaleData = [
  { idx: 12, name: "C' (Octave)", isBlack: false, et: 1200, pythDev: 0 },
  { idx: 11, name: "B", isBlack: false, et: 1100, pythDev: 9.775 },
  { idx: 10, name: "A# / Bb", isBlack: true, et: 1000, sharpName: "A#", flatName: "Bb", sharpDev: 19.550, flatDev: -3.910 },
  { idx: 9, name: "A", isBlack: false, et: 900, pythDev: 5.865 },
  { idx: 8, name: "G# / Ab", isBlack: true, et: 800, sharpName: "G#", flatName: "Ab", sharpDev: 15.640, flatDev: -7.820 },
  { idx: 7, name: "G", isBlack: false, et: 700, pythDev: 1.955 },
  { idx: 6, name: "F# / Gb", isBlack: true, et: 600, sharpName: "F#", flatName: "Gb", sharpDev: 11.730, flatDev: -11.730 },
  { idx: 5, name: "F", isBlack: false, et: 500, pythDev: -1.955 },
  { idx: 4, name: "E", isBlack: false, et: 400, pythDev: 7.820 },
  { idx: 3, name: "D# / Eb", isBlack: true, et: 300, sharpName: "D#", flatName: "Eb", sharpDev: 17.595, flatDev: -5.865 },
  { idx: 2, name: "D", isBlack: false, et: 200, pythDev: 3.910 },
  { idx: 1, name: "C# / Db", isBlack: true, et: 100, sharpName: "C#", flatName: "Db", sharpDev: 13.685, flatDev: -9.775 },
  { idx: 0, name: "C (Root)", isBlack: false, et: 0, pythDev: 0 }
];

export default function EqualTemperament() {
  const { completedSubtasks, activeSubtask, completeSubtask } = useGameState();
  const [isET, setIsET] = useState(false);

  // Verification states
  const [answer, setAnswer] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleVerify = (e) => {
    e.preventDefault();
    const cleaned = answer.replace(/\s+/g, '').toLowerCase();

    // Check if close to 1.059463 (e.g. 1.059, 1.05946, 1.06) or expression 2^(1/12)
    const parsedVal = parseFloat(cleaned);
    const isCloseFloat = !isNaN(parsedVal) && Math.abs(parsedVal - 1.059463) < 0.002;
    const isExpression = cleaned.includes('2^(1/12)') || cleaned.includes('2**(1/12)') || cleaned.includes('2^{1/12}');

    if (isCloseFloat || isExpression) {
      setIsSuccess(true);
      setErrorMsg('');
      completeSubtask(3, 4); // Complete Pythagoras Task 4
    } else {
      setErrorMsg('Incorrect. Hint: An octave ratio of 2.0 is divided into 12 equal logarithmic steps. The step ratio is 2^(1/12) ≈ 1.059.');
    }
  };

  return (
    <LevelShell
      title="Level 3: Pythagoras"
      activeSubtask={activeSubtask}
      completedSubtasks={completedSubtasks}
      canvas={
        <div className="absolute inset-0 flex flex-col items-center justify-start p-3 gap-3 bg-slate-950/20 select-none overflow-hidden">
          
          {/* Controls Card */}
          <div className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 shadow-md shrink-0 flex items-center justify-between">
            <h3 className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 uppercase tracking-wide">
              <ArrowRightLeft size={14} className={isET ? "text-emerald-400" : "text-amber-400"} />
              Tuning System Plot
            </h3>
            
            <div className="flex bg-slate-950 rounded-lg p-0.5 border border-slate-850 w-64">
              <button
                onClick={() => setIsET(false)}
                className={`flex-1 py-1 text-[11px] font-semibold rounded transition-all cursor-pointer ${
                  !isET ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                Pure Pythagorean
              </button>
              <button
                onClick={() => setIsET(true)}
                className={`flex-1 py-1 text-[11px] font-semibold rounded transition-all cursor-pointer ${
                  isET ? 'bg-emerald-900/40 text-emerald-400 border border-emerald-800/40 shadow-sm' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                Equal Temperament
              </button>
            </div>
          </div>

          {/* Graph Display Area */}
          <div className="w-full flex-grow bg-slate-900 border border-slate-800/80 rounded-xl p-4 shadow-xl overflow-hidden flex flex-col justify-between">
            <div className="flex justify-between items-center text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-2 border-b border-slate-800 pb-2">
              <span>Piano Scale Notes (C to C')</span>
              <span>1200 Cents Logarithmic Grid</span>
            </div>

            {/* The Plot Grid with side-by-side flex layout */}
            <div className="relative flex-grow mt-2 flex overflow-hidden py-2">
              
              <div className="w-[80px] shrink-0 flex flex-col justify-between h-full font-bold text-[10px] md:text-xs tracking-wide select-none pr-2">
                {scaleData.map((note) => (
                  <div key={note.idx} className={`h-[18px] md:h-[22px] flex items-center ${note.isBlack ? 'text-slate-500' : 'text-slate-300'}`}>
                    {note.name}
                  </div>
                ))}
              </div>

              {/* Right Graph Plotting Area */}
              <div className="relative flex-grow h-full border-l border-b border-slate-700 bg-slate-950/30 rounded-r">
                
                {/* X-Axis Grid Lines */}
                <div className="absolute inset-0 right-2 pointer-events-none">
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(i => (
                    <div
                      key={i}
                      className="absolute top-0 bottom-0 border-l border-dashed border-slate-800/40"
                      style={{ left: `${(i / 12) * 100}%` }}
                    >
                      <div className="absolute -bottom-5 -left-2 text-[8px] text-slate-600 font-mono">
                        {i * 100}c
                      </div>
                    </div>
                  ))}
                </div>

                {/* Note Rows Tracks */}
                <div className="relative z-10 flex flex-col justify-between h-full mr-2">
                  {scaleData.map((note) => (
                    <div key={note.idx} className="relative flex items-center w-full h-[18px] md:h-[22px] group hover:bg-white/5 rounded-r">
                      
                      {/* Plot Line track with dashed grid lines */}
                      <div className="relative w-full h-full border-b border-dashed border-slate-800/40 group-hover:border-slate-700">
                        
                        {/* --- WHITE KEYS --- */}
                        {!note.isBlack && (
                          <div
                            className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-2 h-2 rounded-full border border-slate-950 transition-all duration-500
                              ${isET ? 'bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.6)]' : 'bg-slate-300'}
                            `}
                            style={{
                              left: `${isET ? (note.et / 1200) * 100 : ((note.et + note.pythDev) / 1200) * 100}%`
                            }}
                          >
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover:block z-20">
                              <div className="bg-slate-800 text-white text-[8px] px-1.5 py-0.5 rounded shadow-md border border-slate-700 font-mono">
                                {isET ? `${note.et} cents` : `${(note.et + note.pythDev).toFixed(2)} cents`}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* --- BLACK KEYS --- */}
                        {note.isBlack && (
                          <>
                            {/* Flat Point */}
                            <div
                              className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full border border-slate-950 transition-all duration-500
                                ${isET ? 'bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.6)] z-10' : 'bg-cyan-400 z-0'}
                              `}
                              style={{
                                left: `${isET ? (note.et / 1200) * 100 : ((note.et + note.flatDev) / 1200) * 100}%`
                              }}
                            >
                              {!isET && (
                                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 hidden group-hover:block z-20">
                                  <div className="bg-slate-800 text-cyan-300 font-mono text-[8px] px-1.5 py-0.5 rounded border border-slate-700">
                                    {note.flatName}: {(note.et + note.flatDev).toFixed(2)}c
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Sharp Point */}
                            <div
                              className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full border border-slate-950 transition-all duration-500
                                ${isET ? 'bg-emerald-400 opacity-0 scale-50 z-0' : 'bg-amber-400 opacity-100 scale-100 z-0'}
                              `}
                              style={{
                                left: `${isET ? (note.et / 1200) * 100 : ((note.et + note.sharpDev) / 1200) * 100}%`
                              }}
                            >
                              {!isET && (
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover:block z-20">
                                  <div className="bg-slate-800 text-amber-300 font-mono text-[8px] px-1.5 py-0.5 rounded border border-slate-700">
                                    {note.sharpName}: {(note.et + note.sharpDev).toFixed(2)}c
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Wolf Interval connection line */}
                            {!isET && (
                              <div
                                className="absolute top-1/2 -translate-y-1/2 h-[1px] bg-rose-500/40 hidden group-hover:block"
                                style={{
                                  left: `${((note.et + note.flatDev) / 1200) * 100}%`,
                                  width: `${((note.sharpDev - note.flatDev) / 1200) * 100}%`
                                }}
                              >
                                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 text-[7px] text-rose-400 font-bold whitespace-nowrap bg-slate-900 px-1 py-0.2 rounded border border-rose-900/30">
                                  ~23.46c wolf
                                </div>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            </div>
          </div>
        </div>
      }
    >
      <div className="flex flex-col gap-4 text-slate-300 text-xs">
        <p className="leading-relaxed text-slate-400">
          Pure mathematical tuning (Pythagorean Tuning) works beautifully for white keys, but it falls apart when trying to accommodate black keys. Stacking pure 3:2 ratios leads to a conflict.
        </p>

        {/* Informational Card */}
        <div className="bg-slate-900/60 border border-slate-800/40 rounded-xl p-3 flex flex-col gap-2 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-2 opacity-5">
            <Settings2 size={40} />
          </div>
          <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">The Pythagorean Dilemma</h4>
          <p className="text-[11px] leading-relaxed text-slate-350">
            Because a chain of 12 perfect fifths does not loop back cleanly to a true octave (off by 23.46 cents), sharp notes end up higher in pitch than flat notes:
          </p>
          <ul className="list-disc pl-4 flex flex-col gap-1 text-[11px] text-slate-400">
            <li><strong>C#</strong> is generated by spiral-up (+13.68 cents deviation).</li>
            <li><strong>Db</strong> is generated by spiral-down (-9.78 cents deviation).</li>
            <li>The resulting interval mismatch creates a highly dissonant <strong>Wolf Interval</strong>.</li>
          </ul>
        </div>

        {/* What is a Cent? */}
        <div className="bg-slate-900/60 border border-slate-800/40 rounded-xl p-3 flex flex-col gap-1.5">
          <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">What is a Cent?</h4>
          <p className="text-[11px] leading-relaxed text-slate-350">
            A <strong>cent</strong> is a logarithmic unit used to measure pitch intervals. By definition:
          </p>
          <div className="bg-slate-950/60 p-2 rounded border border-slate-850 text-center text-xs font-mono text-cyan-400 my-1">
            1 Octave = 1200 Cents
          </div>
          <p className="text-[11px] leading-relaxed text-slate-400">
            It represents 1/100th of an equal-tempered semitone. Since human hearing can generally distinguish pitch differences of 5-6 cents, this unit allows acoustic comparisons of minute deviations.
          </p>
        </div>

        {/* Equal Temperament Solution */}
        <div className="bg-slate-900/60 border border-slate-800/40 rounded-xl p-3 flex flex-col gap-1.5">
          <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">The Equal Temperament Compromise</h4>
          <p className="text-[11px] leading-relaxed text-slate-350">
            To solve the Wolf Interval and let keyboards play in any key, theorists abandoned the pure 3/2 fifth. They divided the 1200-cent octave into exactly <strong>12 equal semitone steps</strong>. Every perfect fifth is flattened by ~2 cents, but sharps and flats are merged, making C# and Db the exact same pitch.
          </p>
        </div>

        {/* Verification Card */}
        <div className="bg-slate-950/40 border border-slate-800/80 p-4 rounded-xl flex flex-col gap-3">
          <h3 className="text-xs font-bold text-purple-400 uppercase tracking-wider flex items-center gap-2">
            <Compass className="w-4 h-4" /> 4. Equal Temperament
          </h3>
          <p className="text-[11px] leading-relaxed text-slate-350">
            In equal temperament, what is the frequency ratio between two adjacent notes?
          </p>

          <div className="border-t border-slate-800/80 pt-3 flex flex-col gap-2.5">
            <div className="flex flex-col gap-1">
              <span className="text-[9px] uppercase font-bold tracking-wider text-slate-400">Frequency Ratio</span>
              <input
                type="text"
                value={answer}
                onChange={(e) => {
                  setAnswer(e.target.value);
                  setErrorMsg('');
                }}
                disabled={isSuccess}
                placeholder="e.g. 1.059 or 2^(1/12)"
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
                <span>Superb! Spacing verified (~1.059 or 2^(1/12)). Equal Temperament unlocked! Egypt, Greece, and Pythagoras are all complete!</span>
              </div>
            ) : (
              <div className="flex justify-end mt-1">
                <button
                  onClick={handleVerify}
                  className="bg-purple-600 hover:bg-purple-500 text-white font-bold px-4 py-2 rounded-lg text-xs transition cursor-pointer"
                >
                  Verify Ratio
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </LevelShell>
  );
}
