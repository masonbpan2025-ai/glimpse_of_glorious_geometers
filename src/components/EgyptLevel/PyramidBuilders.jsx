import React, { useState, useEffect } from 'react';
import { useGameState } from '../../context/GameStateContext';
import LevelShell from '../LevelShell';
import { Star, Compass, Info } from 'lucide-react';

export default function PyramidBuilders() {
  const { completedSubtasks, activeSubtask, completeSubtask } = useGameState();
  const [baseWidth, setBaseWidth] = useState(360);
  const [height, setHeight] = useState(160);
  const [slope, setSlope] = useState(0);
  const [seked, setSeked] = useState(0);
  
  // Verification State
  const [heightAnswer, setHeightAnswer] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  // Challenge target parameters
  const targetBase = 360;
  const targetAngle = 51.84; // Slope angle of the Great Pyramid of Giza
  const targetHeight = 229;  // Correct height in cubits

  useEffect(() => {
    // Calculate slope angle in degrees
    const halfBase = baseWidth / 2;
    const rad = Math.atan2(height, halfBase);
    const deg = (rad * 180) / Math.PI;
    setSlope(deg);

    // Calculate Seked (horizontal run in palms per 1 cubit rise; 1 cubit = 7 palms)
    const sek = 7 * (halfBase / height);
    setSeked(sek);
  }, [baseWidth, height]);

  const handleVerify = (e) => {
    e.preventDefault();
    const ans = parseInt(heightAnswer.trim(), 10);
    
    if (isNaN(ans)) {
      setErrorMsg('Please enter a valid height.');
      return;
    }

    if (ans === targetHeight) {
      setIsSuccess(true);
      setErrorMsg('');
      completeSubtask(1, 2); // Mark Subtask 2 as complete
    } else {
      setErrorMsg('Incorrect height. Adjust the sliders to find where the slope hits exactly 51.8°!');
    }
  };

  // Rad value for drawing
  const halfBase = baseWidth / 2;
  const rad = Math.atan2(height, halfBase);

  return (
    <LevelShell
      title="Level 1: Ancient Egypt"
      activeSubtask={activeSubtask}
      completedSubtasks={completedSubtasks}
      canvas={
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 select-none bg-radial from-slate-900 via-[#07090e] to-[#07090e]">
          {/* Legend block */}
          <div className="absolute top-6 left-6 text-xs bg-slate-950/80 border border-slate-800 px-3 py-1.5 rounded-lg flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-egypt-gold rounded" />
            <span className="text-slate-400">Interactive 2D Builder Model</span>
          </div>

          {/* Main SVG Render Box */}
          <div className="w-[85%] h-[75%] max-w-xl max-h-[400px] border border-slate-800/80 rounded-2xl bg-gradient-to-b from-[#090e1a]/80 to-slate-950/90 shadow-2xl relative overflow-hidden flex items-center justify-center">
            {/* Sun glowing backdrop */}
            <div className="absolute top-10 right-10 w-24 h-24 rounded-full bg-egypt-gold/5 blur-2xl pointer-events-none" />

            <svg viewBox="0 0 500 400" className="w-full h-full text-egypt-gold">
              {/* Ground sand horizon */}
              <line x1="20" y1="320" x2="480" y2="320" stroke="rgba(233,196,106,0.3)" strokeWidth="3" />

              {/* Styled construction grid dots */}
              {Array.from({ length: 9 }).map((_, i) => (
                <line
                  key={i}
                  x1="20"
                  y1={50 + i * 30}
                  x2="480"
                  y2={50 + i * 30}
                  stroke="rgba(255,255,255,0.015)"
                  strokeWidth="1"
                />
              ))}

              {/* Morphing Pyramid Shadow Profile */}
              {(() => {
                const scaleX = 0.65;
                const scaleY = 0.8;
                const w = baseWidth * scaleX;
                const h = height * scaleY;
                const x1 = 250 - w / 2;
                const x2 = 250 + w / 2;
                const yBase = 320;
                const yApex = yBase - h;

                const hb = baseWidth / 2;

                return (
                  <g>
                    {/* Main solid pyramid body */}
                    <polygon
                      points={`250,${yApex} ${x2},${yBase} ${x1},${yBase}`}
                      fill="url(#pyramidGrad)"
                      stroke="rgba(233,196,106,0.25)"
                      strokeWidth="1.5"
                    />

                    {/* Horizontal limestone layers grid simulation */}
                    {Array.from({ length: Math.min(10, Math.floor(h / 15)) }).map((_, idx) => {
                      const yLayer = yBase - (idx + 1) * 15;
                      const ratio = (yLayer - yApex) / (yBase - yApex);
                      const wLayer = w * ratio;
                      const xl = 250 - wLayer / 2;
                      const xr = 250 + wLayer / 2;
                      return (
                        <line
                          key={idx}
                          x1={xl}
                          y1={yLayer}
                          x2={xr}
                          y2={yLayer}
                          stroke="rgba(233,196,106,0.06)"
                          strokeWidth="1"
                        />
                      );
                    })}

                    {/* Mathematical Right Triangle Overlay */}
                    <g>
                      {/* Height line (Rise) */}
                      <line
                        x1="250"
                        y1={yBase}
                        x2="250"
                        y2={yApex}
                        stroke="#e76f51"
                        strokeWidth="2.5"
                        strokeDasharray="2 2"
                      />
                      {/* Half Base line (Run) */}
                      <line
                        x1="250"
                        y1={yBase}
                        x2={x2}
                        y2={yBase}
                        stroke="#38bdf8"
                        strokeWidth="2.5"
                      />
                      {/* Hypotenuse line */}
                      <line
                        x1="250"
                        y1={yApex}
                        x2={x2}
                        y2={yBase}
                        stroke="#e9c46a"
                        strokeWidth="3.5"
                      />

                      {/* Right-angle indicator box */}
                      <rect
                        x="240"
                        y={yBase - 10}
                        width="10"
                        height="10"
                        fill="none"
                        stroke="#e76f51"
                        strokeWidth="1.5"
                      />

                      {/* Corner Slope Angle Arc */}
                      {(() => {
                        const radius = 25;
                        const arcX = x2 - radius * Math.cos(rad);
                        const arcY = yBase - radius * Math.sin(rad);
                        return (
                          <path
                            d={`M ${x2 - radius} ${yBase} A ${radius} ${radius} 0 0 0 ${arcX} ${arcY}`}
                            fill="none"
                            stroke="#e9c46a"
                            strokeWidth="2"
                          />
                        );
                      })()}

                      {/* Measurements Labels */}
                      <text
                        x="235"
                        y={yBase - h / 2}
                        fill="#e76f51"
                        fontSize="11"
                        fontWeight="bold"
                        textAnchor="end"
                      >
                        Height: {height} cubits
                      </text>
                      <text
                        x={250 + w / 4}
                        y={yBase + 16}
                        fill="#38bdf8"
                        fontSize="11"
                        fontWeight="bold"
                        textAnchor="middle"
                      >
                        Run: {hb} cubits
                      </text>
                      
                      {/* Angle Label */}
                      <text
                        x={x2 - 40}
                        y={yBase - 12}
                        fill="#e9c46a"
                        fontSize="12"
                        fontWeight="extrabold"
                      >
                        {slope.toFixed(1)}°
                      </text>
                    </g>
                  </g>
                );
              })()}

              {/* Gradients declarations */}
              <defs>
                <linearGradient id="pyramidGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="rgba(233, 196, 106, 0.3)" />
                  <stop offset="100%" stopColor="rgba(15, 42, 74, 0.7)" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          <div className="mt-4 text-[10px] text-slate-400 bg-slate-950/40 p-2.5 rounded-lg border border-slate-900/60 max-w-md text-center">
            Set the base width to **360** cubits and find the height where the slope equals exactly **51.84°**.
          </div>
        </div>
      }
    >
      <div className="flex flex-col justify-between h-full text-slate-300 text-xs gap-4">
        <div className="flex flex-col gap-3">
          <p className="leading-relaxed text-slate-400">
            Monumental construction demanded strict slope rules. To build pyramids that rose stably without collapsing, Egyptian master builders relied on the <strong>seked</strong> — a measure of horizontal run (in palms) per cubit of vertical rise. Think of it as the ancient Egyptian equivalent of our modern "slope" or "gradient." The Great Pyramid of Giza, built for Pharaoh Khufu around 2560 BCE, has a seked of 5½ palms per cubit, corresponding to a slope angle of about 51.84° — a proportion so precisely executed across 230 meters of base that modern engineers still marvel at the achievement.
          </p>

          {/* Sliders in sidebar */}
          <div className="bg-slate-900/40 border border-slate-800/40 rounded-xl p-3 flex flex-col gap-3">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Interactive Sliders</h4>
            
            {/* Base Slider */}
            <div className="flex flex-col gap-1">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-400">Base Width:</span>
                <span className={baseWidth === targetBase ? 'text-emerald-400 font-bold' : 'text-egypt-gold font-bold'}>
                  {baseWidth} cubits {baseWidth === targetBase && '✓'}
                </span>
              </div>
              <input
                type="range"
                min="100"
                max="500"
                step="10"
                value={baseWidth}
                onChange={(e) => setBaseWidth(parseInt(e.target.value))}
                className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-egypt-gold"
              />
            </div>

            {/* Height Slider */}
            <div className="flex flex-col gap-1">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-400">Vertical Height:</span>
                <span className="text-egypt-gold font-bold">{height} cubits</span>
              </div>
              <input
                type="range"
                min="100"
                max="300"
                step="1"
                value={height}
                onChange={(e) => setHeight(parseInt(e.target.value))}
                className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-egypt-gold"
              />
            </div>
            
            {/* Live readout */}
            <div className="grid grid-cols-2 gap-2 text-xs border-t border-slate-800/40 pt-2">
              <div>
                <span className="text-slate-500 block text-[9px] uppercase">Slope Angle:</span>
                <span className="text-xs font-mono font-bold text-white">{slope.toFixed(2)}°</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[9px] uppercase">Seked:</span>
                <span className="text-xs font-mono font-bold text-white">{seked.toFixed(2)} palms</span>
              </div>
            </div>
          </div>

          {/* Unified Card exactly like the astronomers screenshot */}
          <div className="bg-slate-950/40 border border-slate-800/80 p-4 rounded-xl flex flex-col gap-3">
            <h3 className="text-xs font-bold text-egypt-gold uppercase tracking-wider">
              2. The Pyramid Builders
            </h3>
            <p className="text-[11px] leading-relaxed text-slate-300">
              Pharaoh Khufu demands a pyramid with a base of 360 cubits and a slope angle of exactly 51.84° (the slope of the Great Pyramid).
            </p>
            
            <div className="border-t border-slate-800/80 pt-3 flex flex-col gap-2">
              <span className="text-[11px] font-semibold text-slate-200">
                Adjust the sliders so that the base width is exactly 360. Move the height slider until the slope matches 51.84°. What vertical height is required?
              </span>

              <div className="flex flex-col gap-1 mt-1">
                <span className="text-[9px] uppercase font-bold tracking-wider text-slate-400">Required Vertical Height (cubits)</span>
                <input
                  type="number"
                  value={heightAnswer}
                  onChange={(e) => {
                    setHeightAnswer(e.target.value);
                    setErrorMsg('');
                  }}
                  disabled={isSuccess}
                  placeholder="e.g. 200"
                  className="bg-slate-900 border border-slate-800 text-white text-xs px-3 py-2 rounded-lg outline-none focus:border-egypt-gold transition text-center font-mono"
                />
              </div>

              {errorMsg && (
                <div className="text-[11px] text-rose-400 font-bold bg-rose-950/20 border border-rose-900/50 p-2 rounded mt-1">
                  {errorMsg}
                </div>
              )}

              {isSuccess ? (
                <div className="text-[11px] text-emerald-400 font-bold bg-emerald-950/20 border border-emerald-900/50 p-2.5 rounded flex items-center gap-1.5 mt-1">
                  <Star className="w-4 h-4 text-egypt-gold fill-current" />
                  <span>Pyramid approved by the Pharaoh! Level Complete.</span>
                </div>
              ) : (
                <div className="flex justify-end mt-1">
                  <button
                    onClick={handleVerify}
                    className="bg-egypt-gold hover:bg-[#dfba5b] text-slate-950 font-bold px-4 py-2 rounded-lg text-xs transition cursor-pointer"
                  >
                    Verify
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
