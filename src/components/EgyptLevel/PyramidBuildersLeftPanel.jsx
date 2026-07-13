import React, { useState } from 'react';
import { useGameState } from '../../context/GameStateContext';
import { Star, AlertTriangle, Calculator, Lightbulb } from 'lucide-react';

export default function PyramidBuildersLeftPanel({ slope, seked, integrity, challengeBase, challengeVolume, isSuccess, setIsSuccess, errorMsg, setErrorMsg, volumeAnswer, setVolumeAnswer }) {
  const { completeSubtask } = useGameState();
  const [wrongAttempts, setWrongAttempts] = useState(0);

  const idealHeight = (challengeBase / 2) * (7 / 5.5);

  const handleVerify = (e) => {
    e.preventDefault();
    const ans = parseFloat(volumeAnswer.trim());
    if (isNaN(ans)) {
      setErrorMsg('Please enter a valid number.');
      return;
    }
    const pctDiff = Math.abs(ans - challengeVolume) / challengeVolume * 100;
    if (pctDiff <= 1) {
      setIsSuccess(true);
      setErrorMsg('');
      completeSubtask(1, 2);
    } else {
      const next = wrongAttempts + 1;
      setWrongAttempts(next);
      if (next >= 3) {
        setErrorMsg('');
      } else {
        setErrorMsg(`Not quite. Hint: first compute the height using the Seked ratio: Height = (${challengeBase} / 2) × (7 / 5.5), then use V = ⅓ × Base² × Height. (${3 - next} attempt${next === 2 ? '' : 's'} remaining)`);
      }
    }
  };

  return (
    <div className="flex flex-col h-full text-slate-300 text-xs">
      {/* === Scrollable educational content === */}
      <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-3 min-h-0">
        {/* 1. The Engineering Limit */}
        <div className="bg-slate-950/40 border border-slate-800/60 rounded-xl p-3.5">
          <h3 className="text-xs font-bold text-egypt-gold uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-egypt-terracotta" />
            The Engineering Limit
          </h3>
          <p className="text-[11px] leading-relaxed text-slate-300">
            Early pyramids, like the <strong>Bent Pyramid</strong> at Dahshur, were abandoned mid-construction because builders discovered too late that steep slopes cause catastrophic collapse. Dry-stacked limestone blocks cannot withstand excessive outward shear force — the stones simply slide apart under their own weight. The lesson was hard-won: <span className="text-egypt-gold font-semibold">slope angle is everything.</span>
          </p>
        </div>

        {/* 2. The Seked */}
        <div className="bg-slate-950/40 border border-slate-800/60 rounded-xl p-3.5">
          <h3 className="text-xs font-bold text-egypt-gold uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <Calculator className="w-3.5 h-3.5" />
            The Seked
          </h3>
          <p className="text-[11px] leading-relaxed text-slate-300">
            Egyptian architects didn't use degrees — they used the <strong>seked</strong>: the horizontal <em>run</em> (in palms) for every 1 Royal Cubit (7 palms) of vertical <em>rise</em>. The "Golden Angle" that maximizes height without collapse is a <span className="text-emerald-400 font-bold">seked of 5½</span>, which corresponds to approximately <span className="text-emerald-400 font-bold">51.84°</span> — the slope of the Great Pyramid of Khufu.
          </p>
          <div className="mt-2 bg-slate-900/60 rounded-lg p-2.5 flex items-center justify-center gap-4 text-[10px]">
            <div className="flex flex-col items-center">
              <span className="text-slate-500 uppercase tracking-wider">Angle</span>
              <span className="text-base font-mono font-bold text-white">{slope.toFixed(2)}°</span>
            </div>
            <div className="w-px h-8 bg-slate-700" />
            <div className="flex flex-col items-center">
              <span className="text-slate-500 uppercase tracking-wider">Seked</span>
              <span className="text-base font-mono font-bold text-white">{seked.toFixed(1)} <span className="text-[10px] text-slate-400">palms</span></span>
            </div>
          </div>
          <div className={`mt-2 text-[10px] font-bold px-2 py-1 rounded text-center ${
            integrity === 'collapse' ? 'bg-rose-950/40 text-rose-400 border border-rose-900/50' :
            integrity === 'perfect' ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-900/50' :
            integrity === 'stable' ? 'bg-amber-950/40 text-amber-400 border border-amber-900/50' :
            'bg-slate-800/40 text-slate-500 border border-slate-700/50'
          }`}>
            {integrity === 'collapse' && '⚠ COLLAPSE — Angle too steep (> 54.5°)'}
            {integrity === 'perfect' && '★ GOLDEN ANGLE — Optimal stability (50.5° – 54.5°)'}
            {integrity === 'stable' && 'Stable but inefficient (43° – 50.4°)'}
            {integrity === 'shallow' && 'Too shallow — wasted stone (< 43°)'}
          </div>
        </div>

        {/* 3. Cubits vs. Blocks */}
        <div className="bg-slate-950/40 border border-slate-800/60 rounded-xl p-3.5">
          <h3 className="text-xs font-bold text-egypt-gold uppercase tracking-wider mb-1.5">
            Cubits vs. Blocks
          </h3>
          <p className="text-[11px] leading-relaxed text-slate-300">
            A <strong>Royal Cubit</strong> (≈ 52.4 cm, divided into 28 digits or 7 palms) is a measure of <em>length</em>, not a uniform 3D block. The stones of the Great Pyramid vary wildly in size — some weigh over 80 tons. Yet architects maintained a flawless slope by measuring the vertical height of each horizontal course of stones and applying the <strong>seked setback</strong> with every layer.
          </p>
        </div>
      </div>

      {/* === Fixed bottom: Engineer's Challenge === */}
      <div className="shrink-0 pt-3">
        <div className="bg-slate-950/40 border border-slate-800/80 p-4 rounded-xl flex flex-col gap-3">
          <h3 className="text-xs font-bold text-egypt-gold uppercase tracking-wider">
            ⚒ The Engineer's Challenge
          </h3>
          <p className="text-[11px] leading-relaxed text-slate-300">
            The Pharaoh has commissioned a new pyramid. Given a <strong className="text-white">base width of {challengeBase} meters</strong>, calculate the <strong>total volume of stone</strong> (in cubic meters) required to build the pyramid at the optimal Golden Angle (seked of 5.5).
          </p>

          {wrongAttempts >= 3 && !isSuccess ? (
            /* === 3-strikes solution reveal === */
            <div className="border-t border-slate-800/80 pt-3 flex flex-col gap-2">
              <div className="flex items-center gap-1.5 text-amber-400">
                <Lightbulb className="w-4 h-4" />
                <span className="text-[11px] font-bold uppercase tracking-wider">Solution Revealed</span>
              </div>
              <p className="text-[11px] leading-relaxed text-slate-300">
                After 3 attempts, here is the full calculation:
              </p>

              <div className="bg-slate-900/60 rounded-lg p-3 flex flex-col gap-1.5 font-mono text-[11px]">
                <div className="text-slate-400">
                  <span className="text-egypt-gold font-bold">Step 1 — Find Height:</span>
                </div>
                <div className="text-slate-300 pl-2 border-l-2 border-slate-700">
                  Height = (Base ÷ 2) × (7 ÷ 5.5)<br />
                  Height = ({challengeBase} ÷ 2) × (7 ÷ 5.5)<br />
                  Height = {challengeBase / 2} × {(7 / 5.5).toFixed(4)}<br />
                  <span className="text-emerald-400 font-bold">Height = {idealHeight.toFixed(2)} meters</span>
                </div>
                <div className="text-slate-400 mt-1">
                  <span className="text-egypt-gold font-bold">Step 2 — Find Volume:</span>
                </div>
                <div className="text-slate-300 pl-2 border-l-2 border-slate-700">
                  Volume = ⅓ × Base² × Height<br />
                  Volume = ⅓ × {challengeBase}² × {idealHeight.toFixed(2)}<br />
                  Volume = ⅓ × {challengeBase * challengeBase} × {idealHeight.toFixed(2)}<br />
                  <span className="text-emerald-400 font-bold">Volume = {Math.round(challengeVolume).toLocaleString()} m³</span>
                </div>
              </div>

              <button
                onClick={() => {
                  setIsSuccess(true);
                  completeSubtask(1, 2);
                }}
                className="bg-amber-600 hover:bg-amber-500 text-white font-bold px-4 py-2 rounded-lg text-xs transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Star className="w-3.5 h-3.5" />
                Continue
              </button>
            </div>
          ) : (
            /* === Normal challenge form === */
            <div className="border-t border-slate-800/80 pt-3 flex flex-col gap-2">
              <span className="text-[11px] font-semibold text-slate-200">
                Use the formulas: <br />
                <code className="text-egypt-gold bg-slate-900/60 px-1 py-0.5 rounded text-[10px]">Height = (Base ÷ 2) × (7 ÷ 5.5)</code><br />
                <code className="text-egypt-gold bg-slate-900/60 px-1 py-0.5 rounded text-[10px]">Volume = ⅓ × Base² × Height</code>
              </span>

              <div className="flex flex-col gap-1 mt-1">
                <span className="text-[9px] uppercase font-bold tracking-wider text-slate-400">Total Volume (cubic meters)</span>
                <input
                  type="number"
                  value={volumeAnswer}
                  onChange={(e) => {
                    setVolumeAnswer(e.target.value);
                    setErrorMsg('');
                  }}
                  disabled={isSuccess}
                  placeholder="e.g. 2500000"
                  className="bg-slate-900 border border-slate-800 text-white text-xs px-3 py-2 rounded-lg outline-none focus:border-egypt-gold transition text-center font-mono"
                />
              </div>

              {errorMsg && (
                <div className="text-[11px] text-rose-400 font-bold bg-rose-950/20 border border-rose-900/50 p-2 rounded mt-1 leading-relaxed">
                  {errorMsg}
                </div>
              )}

              {isSuccess ? (
                <div className="text-[11px] text-emerald-400 font-bold bg-emerald-950/20 border border-emerald-900/50 p-2.5 rounded flex items-center gap-1.5 mt-1">
                  <Star className="w-4 h-4 text-egypt-gold fill-current" />
                  <span>Pyramid approved by the Pharaoh! Level 1 Complete.</span>
                </div>
              ) : (
                <div className="flex justify-end mt-1">
                  <button
                    onClick={handleVerify}
                    className="bg-egypt-gold hover:bg-[#dfba5b] text-slate-950 font-bold px-4 py-2 rounded-lg text-xs transition cursor-pointer"
                  >
                    Verify Volume
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
