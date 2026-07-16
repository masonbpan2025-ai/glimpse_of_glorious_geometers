import React, { useState, useEffect, useRef } from 'react';
import { useGameState } from '../../context/GameStateContext';
import LevelShell from '../LevelShell';
import { Compass, Star, Volume2, Music, Activity } from 'lucide-react';

const notes = [
  { note: "F", name: "Perfect 4th", m: -1, n: -1, num: 4, den: 3, category: "white" },
  { note: "C", name: "Root (Home)", m: 0, n: 0, num: 1, den: 1, isHome: true, category: "white" },
  { note: "G", name: "Perfect 5th", m: 1, n: 0, num: 3, den: 2, category: "white" },
  { note: "D", name: "Major 2nd", m: 2, n: 1, num: 9, den: 8, category: "white" },
  { note: "A", name: "Major 6th", m: 3, n: 1, num: 27, den: 16, category: "white" },
  { note: "E", name: "Major 3rd", m: 4, n: 2, num: 81, den: 64, category: "white" },
  { note: "B", name: "Major 7th", m: 5, n: 2, num: 243, den: 128, category: "white" },

  { note: "F#", name: "Augmented 4th", m: 6, n: 3, num: 729, den: 512, category: "sharp" },
  { note: "C#", name: "Minor 2nd", m: 7, n: 4, num: 2187, den: 2048, category: "sharp" },
  { note: "G#", name: "Minor 6th", m: 8, n: 4, num: 6561, den: 4096, category: "sharp" },
  { note: "D#", name: "Minor 3rd", m: 9, n: 5, num: 19683, den: 16384, category: "sharp" },
  { note: "A#", name: "Minor 7th", m: 10, n: 5, num: 59049, den: 32768, category: "sharp" },
  { note: "E#", name: "Major 3rd", m: 11, n: 6, num: 177147, den: 131072, category: "sharp" },

  { note: "C' (True Octave)", name: "Perfect 2.0x Multiplier", m: 0, n: -1, num: 2, den: 1, category: "comma", isPerfect: true },
  { note: "B# (~C')", name: "The 12th Fifth", m: 12, n: 6, num: 531441, den: 262144, category: "comma", isComma: true }
];

export default function PythagoreanTuning() {
  const { completedSubtasks, activeSubtask, completeSubtask } = useGameState();
  
  const [activeIndex, setActiveIndex] = useState(1); // Default to C (Home)
  const [soundEnabled, setSoundEnabled] = useState(false);
  
  // Verification states
  const [answer, setAnswer] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const activePathRef = useRef(null);
  const audioCtxRef = useRef(null);

  const activeNote = notes[activeIndex];
  const lengthPct = activeNote.den / activeNote.num;
  const freqRatio = activeNote.num / activeNote.den;

  // Handle String Vibration Animation
  useEffect(() => {
    let animationFrameId;
    let t = 0;

    const renderLoop = () => {
      // Vibrating speed proportional to the frequency ratio
      t += 0.08 * freqRatio;
      const amplitude = 10 * Math.sin(t);

      const midX = 100 * lengthPct / 2;
      const endX = 100 * lengthPct;

      const pathString = `M 0 50 Q ${midX} ${50 + amplitude} ${endX} 50`;

      if (activePathRef.current) {
        activePathRef.current.setAttribute('d', pathString);
      }

      animationFrameId = requestAnimationFrame(renderLoop);
    };

    renderLoop();
    return () => cancelAnimationFrame(animationFrameId);
  }, [freqRatio, lengthPct]);

  // Handle Audio Synthesis
  const playTone = (ratio) => {
    if (!soundEnabled) return;

    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }

    const ctx = audioCtxRef.current;
    if (ctx.state === 'suspended') ctx.resume();

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    // C4 base = 261.63 Hz
    osc.frequency.value = 261.63 * ratio;
    osc.type = 'sine';

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);
    osc.stop(ctx.currentTime + 1.2);
  };

  const handleNoteSelect = (index) => {
    setActiveIndex(index);
    playTone(notes[index].num / notes[index].den);
  };

  const handleVerify = (e) => {
    e.preventDefault();
    const val = parseFloat(answer.replace('%', '').trim());

    if (isNaN(val)) {
      setErrorMsg('Please enter a valid decimal number.');
      return;
    }

    // Pythagorean comma ratio difference percentage:
    // (B# frequency) / (C' frequency) = 2.0272865 / 2.0 = 1.0136432...
    // higher by: 1.36% (1.364%)
    if (Math.abs(val - 1.36) < 0.05) {
      setIsSuccess(true);
      setErrorMsg('');
      completeSubtask(3, 3); // Complete Pythagoras Task 3
    } else {
      setErrorMsg('Incorrect. Hint: Calculate ((531441 / 262144) - 2) / 2 as a percentage.');
    }
  };

  return (
    <LevelShell
      title="Level 3: Pythagoras"
      activeSubtask={activeSubtask}
      completedSubtasks={completedSubtasks}
      canvas={
        <div className="absolute inset-0 flex flex-col items-center justify-between p-4 md:p-6 pb-4 bg-slate-950/20 select-none overflow-y-auto">
          {/* Header */}
          <div className="w-full flex justify-between items-center bg-slate-900/80 border border-slate-800 px-4 py-2.5 rounded-xl z-10 shrink-0">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
              <span className="text-xs font-semibold text-slate-300">Pythagorean Monochord & Spirals</span>
            </div>
            
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`flex items-center gap-2 px-3 py-1 rounded-full border text-[10px] uppercase font-bold tracking-wider transition ${
                soundEnabled
                  ? 'bg-purple-500/10 border-purple-500 text-purple-400'
                  : 'bg-slate-950 border-slate-800 text-slate-500 hover:text-slate-300 cursor-pointer'
              }`}
            >
              <Volume2 className="w-3.5 h-3.5" />
              {soundEnabled ? 'Audio Enabled' : 'Enable Audio'}
            </button>
          </div>

          {/* Monochord String String Board */}
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800/80 rounded-2xl p-6 shadow-xl my-3 shrink-0">
            <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">
              <span>Nut (Fixed)</span>
              <span>Bridge (Movable)</span>
            </div>
            
            <div className="relative w-full h-24 bg-slate-950/50 rounded-xl border border-slate-850 shadow-inner flex items-center">
              <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full absolute inset-0">
                <line x1="0" y1="50" x2="100" y2="50" stroke="#1e293b" strokeWidth="0.5" />
                <line x1="50" y1="20" x2="50" y2="80" stroke="#1e293b" strokeWidth="0.5" strokeDasharray="1,2" />

                {/* Dead portion of the string */}
                <line x1={100 * lengthPct} y1="50" x2="100" y2="50" stroke="#2a3342" strokeWidth="1" strokeLinecap="round" />

                {/* Active vibrating string portion */}
                <path
                  ref={activePathRef}
                  d={`M 0 50 Q ${100 * lengthPct / 2} 50 ${100 * lengthPct} 50`}
                  fill="none"
                  stroke={activeNote.isHome ? "#f59e0b" : activeNote.isComma ? "#ef4444" : activeNote.isPerfect ? "#10b981" : "#a855f7"}
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  className="transition-all duration-300 ease-out"
                />

                {/* Bridge */}
                <g className="transition-all duration-500 ease-in-out" style={{ transform: `translateX(${100 * lengthPct}%)` }}>
                  <polygon points="-1.5,58 1.5,58 0,50" fill="#94a3b8" />
                  <line x1="0" y1="15" x2="0" y2="85" stroke="#475569" strokeWidth="0.5" strokeDasharray="2,2" />
                </g>

                <circle cx="0" cy="50" r="1.2" fill="#94a3b8" />
                <circle cx="100" cy="50" r="1.2" fill="#475569" />
              </svg>
            </div>
          </div>

          {/* Interactive Keyboard Selector */}
          <div className="w-full max-w-lg space-y-3.5 flex-grow overflow-y-auto">
            {/* White Keys */}
            <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
              <span className="text-[9px] uppercase font-bold text-slate-500 tracking-wider block mb-2">1. The Major Scale</span>
              <div className="grid grid-cols-7 gap-1.5">
                {notes.map((item, index) => {
                  if (item.category !== 'white') return null;
                  const isActive = index === activeIndex;
                  return (
                    <button
                      key={item.note}
                      onClick={() => handleNoteSelect(index)}
                      className={`py-2 rounded-lg text-xs font-bold transition border cursor-pointer ${
                        isActive
                          ? item.isHome
                            ? 'bg-amber-500/20 border-amber-500 text-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.2)]'
                            : 'bg-purple-600/20 border-purple-500 text-purple-300 shadow-[0_0_10px_rgba(168,85,247,0.2)]'
                          : item.isHome
                          ? 'bg-slate-900 border-amber-500/30 text-amber-500/80 hover:bg-slate-850'
                          : 'bg-slate-900 border-slate-850 text-slate-400 hover:bg-slate-850'
                      }`}
                    >
                      <div>{item.note}</div>
                      <div className="text-[8px] opacity-60 font-mono mt-0.5">{item.num}/{item.den}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Sharps */}
            <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
              <span className="text-[9px] uppercase font-bold text-slate-500 tracking-wider block mb-2">2. The Upward Spiral</span>
              <div className="grid grid-cols-6 gap-1.5">
                {notes.map((item, index) => {
                  if (item.category !== 'sharp') return null;
                  const isActive = index === activeIndex;
                  return (
                    <button
                      key={item.note}
                      onClick={() => handleNoteSelect(index)}
                      className={`py-2 rounded-lg text-xs font-bold transition border cursor-pointer ${
                        isActive
                          ? 'bg-purple-600/20 border-purple-500 text-purple-300 shadow-[0_0_10px_rgba(168,85,247,0.2)]'
                          : 'bg-[#0f172a] border-slate-850 text-slate-500 hover:bg-slate-850 hover:text-slate-350'
                      }`}
                    >
                      <div>{item.note}</div>
                      <div className="text-[8px] opacity-60 font-mono mt-0.5">{item.num}/{item.den}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Comma Collision */}
            <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
              <span className="text-[9px] uppercase font-bold text-slate-500 tracking-wider block mb-2">3. Octave vs 12th Fifth</span>
              <div className="grid grid-cols-2 gap-3">
                {notes.map((item, index) => {
                  if (item.category !== 'comma') return null;
                  const isActive = index === activeIndex;
                  return (
                    <button
                      key={item.note}
                      onClick={() => handleNoteSelect(index)}
                      className={`py-3 rounded-lg text-xs font-bold border transition flex flex-col items-center justify-center cursor-pointer ${
                        isActive
                          ? item.isPerfect
                            ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.2)]'
                            : 'bg-rose-500/20 border-rose-500 text-rose-300 shadow-[0_0_10px_rgba(239,68,68,0.2)]'
                          : 'bg-slate-900 border-slate-850 text-slate-400 hover:bg-slate-850'
                      }`}
                    >
                      <div className="text-sm">{item.note}</div>
                      <div className="text-[8px] opacity-60 mt-0.5 font-mono">{item.num} / {item.den}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Math details readout */}
          <div className="w-full max-w-lg grid grid-cols-3 gap-3 text-center border-t border-slate-800 pt-3.5 shrink-0">
            <div className="bg-slate-900/30 border border-slate-800/40 p-2.5 rounded-lg">
              <span className="text-[8px] uppercase tracking-wider text-slate-500 block mb-1">Formula</span>
              <span className="text-xs font-bold text-white font-mono">
                {activeNote.isPerfect ? '2.0' : `(3/2)^${activeNote.m} / 2^${activeNote.n}`}
              </span>
            </div>
            <div className="bg-slate-900/30 border border-slate-800/40 p-2.5 rounded-lg">
              <span className="text-[8px] uppercase tracking-wider text-slate-500 block mb-1">Ratio</span>
              <span className="text-xs font-bold text-purple-400 font-mono">
                {(activeNote.num / activeNote.den).toFixed(5)}x
              </span>
            </div>
            <div className="bg-slate-900/30 border border-slate-800/40 p-2.5 rounded-lg">
              <span className="text-[8px] uppercase tracking-wider text-slate-500 block mb-1">String Length</span>
              <span className="text-xs font-bold text-blue-400 font-mono">
                {(activeNote.den / activeNote.num * 100).toFixed(2)}%
              </span>
            </div>
          </div>
        </div>
      }
    >
      <div className="flex flex-col gap-4 text-slate-300 text-xs">
        <p className="leading-relaxed text-slate-400">
          Pythagoras is famous for the right triangle theorem, but he was also the first to mathematize music. He discovered that the physical dimensions of vibrating strings map directly to musical harmony.
        </p>

        {/* Informational Card */}
        <div className="bg-slate-900/60 border border-slate-800/40 rounded-xl p-3.5 flex flex-col gap-2.5">
          <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">The Hammers & Ratios</h4>
          <p className="text-[11px] leading-relaxed text-slate-350">
            Legend says Pythagoras walked by a blacksmith shop and heard anvil rings that created harmonious chords. Upon measuring the hammer weights, he found that:
          </p>
          <ul className="list-disc pl-4 flex flex-col gap-1.5 text-[11px] text-slate-400">
            <li>An octave is formed by the ratio <strong>2:1</strong> (halving the string length).</li>
            <li>A perfect fifth, the most consonant harmony, is formed by the ratio <strong>3:2</strong> (two-thirds of the string length).</li>
            <li>A perfect fourth is formed by the ratio <strong>4:3</strong> (three-quarters of the string length).</li>
          </ul>
        </div>

        {/* The Spiral of Fifths and Comma */}
        <div className="bg-slate-900/60 border border-slate-800/40 rounded-xl p-3.5 flex flex-col gap-2.5">
          <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">The Pythagorean Comma</h4>
          <p className="text-[11px] leading-relaxed text-slate-300">
            By stacking 12 fifths in a spiral (scaling frequency by 3/2 and dividing by 2 to stay in octave), one reaches the note <strong>B#</strong>. 
          </p>
          <p className="text-[11px] leading-relaxed text-slate-400">
            Ideally, 12 fifths should loop back to exactly C' (the 7th octave). But mathematically:
            <span className="block text-center font-mono my-1.5 text-rose-400">
              (3/2)¹² / 2⁶ = 531441 / 262144 ≈ 2.02728
            </span>
            This differs from the true octave (2.0) by a tiny gap of <strong>23.46 cents</strong>, called the <strong>Pythagorean Comma</strong>.
          </p>
        </div>

        {/* Verification Card */}
        <div className="bg-slate-950/40 border border-slate-800/80 p-4 rounded-xl flex flex-col gap-3">
          <h3 className="text-xs font-bold text-purple-400 uppercase tracking-wider flex items-center gap-2">
            <Compass className="w-4 h-4" /> 3. Pythagorean Tuning
          </h3>
          <p className="text-[11px] leading-relaxed text-slate-300">
            Using the ratio for B# (531441 / 262144) and the true octave C' (2.0), calculate the percentage that B#'s frequency is higher than C'.
          </p>

          <div className="border-t border-slate-800/80 pt-3 flex flex-col gap-2.5">
            <div className="flex flex-col gap-1">
              <span className="text-[9px] uppercase font-bold tracking-wider text-slate-400">Frequency Excess (%)</span>
              <input
                type="text"
                value={answer}
                onChange={(e) => {
                  setAnswer(e.target.value);
                  setErrorMsg('');
                }}
                disabled={isSuccess}
                placeholder="e.g. 1.36"
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
                <span>Superb! Percentage excess verified (1.36%). Pythagoras Level Complete!</span>
              </div>
            ) : (
              <div className="flex justify-end mt-1">
                <button
                  onClick={handleVerify}
                  className="bg-purple-600 hover:bg-purple-500 text-white font-bold px-4 py-2 rounded-lg text-xs transition cursor-pointer"
                >
                  Verify Percentage
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </LevelShell>
  );
}
