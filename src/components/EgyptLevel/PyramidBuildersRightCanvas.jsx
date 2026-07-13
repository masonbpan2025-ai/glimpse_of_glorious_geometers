import React from 'react';

const SVG_W = 900;
const SVG_H = 580;
const GROUND_Y = 490;
const CENTER_X = 450;

export default function PyramidBuildersRightCanvas({
  baseWidth,
  height,
  slope,
  seked,
  integrity,
  onBaseChange,
  onHeightChange,
}) {
  // Dynamic scale so pyramid always fits
  const scaleX = 700 / baseWidth;
  const scaleY = 440 / height;
  const scale = Math.min(scaleX, scaleY);

  const basePx = baseWidth * scale;
  const heightPx = height * scale;
  const halfBasePx = basePx / 2;
  const halfBaseCubits = baseWidth / 2;

  const xLeft = CENTER_X - halfBasePx;
  const xRight = CENTER_X + halfBasePx;
  const yApex = GROUND_Y - heightPx;

  const rad = Math.atan2(height, halfBaseCubits);

  // --- Masonry layer calculation ---
  const layerCubits = 10;
  const totalLayers = Math.max(1, Math.floor(height / layerCubits));
  const layerPx = heightPx / totalLayers;

  const BLOCK_W = 20; // fixed pixel block width

  // --- Integrity colors ---
  const integrityColors = {
    collapse: { stroke: '#f43f5e', overlay: 'rgba(244,63,94,0.12)', label: 'COLLAPSE' },
    perfect: { stroke: '#10b981', overlay: 'rgba(16,185,129,0.10)', label: 'GOLDEN ANGLE' },
    stable: { stroke: '#f59e0b', overlay: 'rgba(245,158,11,0.08)', label: 'STABLE' },
    shallow: { stroke: '#6b7280', overlay: 'rgba(107,114,128,0.06)', label: 'SHALLOW' },
  };
  const ic = integrityColors[integrity];

  // --- Crack lines for collapse state ---
  const renderCracks = () => {
    if (integrity !== 'collapse') return null;
    const paths = [];
    // Generate deterministic zigzag cracks
    const crackPoints = (startX, startY, endX, endY, segments) => {
      let d = `M ${startX} ${startY}`;
      for (let i = 1; i <= segments; i++) {
        const t = i / segments;
        const x = startX + (endX - startX) * t;
        const y = startY + (endY - startY) * t;
        const jitter = (i % 2 === 0 ? 1 : -1) * 8 * (1 - Math.abs(t - 0.5) * 2);
        d += ` L ${x + jitter} ${y}`;
      }
      return d;
    };

    // Several crack paths across the pyramid face
    paths.push(crackPoints(CENTER_X - halfBasePx * 0.6, yApex + 20, CENTER_X + halfBasePx * 0.1, GROUND_Y - 40, 12));
    paths.push(crackPoints(CENTER_X - halfBasePx * 0.2, yApex + 60, CENTER_X + halfBasePx * 0.5, GROUND_Y - 80, 10));
    paths.push(crackPoints(CENTER_X + halfBasePx * 0.3, yApex + 30, CENTER_X - halfBasePx * 0.4, GROUND_Y - 20, 8));

    return paths.map((d, i) => (
      <path key={`crack-${i}`} d={d} stroke="#f43f5e" strokeWidth="2.5" fill="none" opacity="0.8"
        strokeLinecap="round" strokeLinejoin="round" />
    ));
  };

  // --- Render masonry layers ---
  const renderMasonry = () => {
    const layers = [];
    for (let i = 0; i < totalLayers; i++) {
      const yTop = GROUND_Y - (i + 1) * layerPx;
      const yBottom = GROUND_Y - i * layerPx;
      const wAtBottom = basePx * (1 - i / totalLayers);
      const hwBottom = wAtBottom / 2;
      const layerHeight = yBottom - yTop;
      const xLeftLayer = CENTER_X - hwBottom;

      // Course of stone: colored body
      const stoneFill = i % 2 === 0 ? '#c4a46c' : '#b8955a';

      layers.push(
        <rect
          key={`layer-${i}`}
          x={xLeftLayer}
          y={yTop}
          width={wAtBottom}
          height={layerHeight}
          fill={stoneFill}
          stroke="rgba(0,0,0,0.2)"
          strokeWidth="0.5"
        />
      );

      // Vertical joint lines (staggered on alternating rows)
      const stagger = i % 2 === 0 ? 0 : BLOCK_W / 2;
      const numBlocks = Math.ceil(wAtBottom / BLOCK_W) + 1;
      for (let j = 0; j < numBlocks; j++) {
        const jx = xLeftLayer + stagger + j * BLOCK_W;
        if (jx > xLeftLayer && jx < xLeftLayer + wAtBottom) {
          layers.push(
            <line
              key={`joint-${i}-${j}`}
              x1={jx} y1={yTop}
              x2={jx} y2={yBottom}
              stroke="rgba(0,0,0,0.3)"
              strokeWidth="0.8"
            />
          );
        }
      }
    }
    return layers;
  };

  // --- Seked inset diagram ---
  const renderSekedInset = () => {
    const insetX = SVG_W - 220;
    const insetY = 15;
    const insetW = 200;
    const insetH = 155;
    const risePx = 80;  // 1 cubit = 7 palms
    const runPx = (seked / 7) * risePx; // run in px proportional to seked

    const blockX = insetX + 30;
    const blockY = insetY + insetH - 30 - risePx;
    const blockW = 40;

    return (
      <g>
        {/* Background */}
        <rect x={insetX} y={insetY} width={insetW} height={insetH} rx="10"
          fill="rgba(7,9,14,0.92)" stroke="rgba(233,196,106,0.3)" strokeWidth="1" />

        <text x={insetX + insetW / 2} y={insetY + 18} textAnchor="middle"
          fill="#e9c46a" fontSize="10" fontWeight="bold">How Seked Works</text>

        {/* Rise block */}
        <rect x={blockX} y={blockY} width={blockW} height={risePx}
          fill="#a07840" stroke="#e9c46a" strokeWidth="1" rx="2" />
        <text x={blockX - 8} y={blockY + risePx / 2} textAnchor="end" dominantBaseline="middle"
          fill="#f4ebd0" fontSize="9" fontWeight="bold">1</text>
        <text x={blockX - 8} y={blockY + risePx / 2 + 11} textAnchor="end" dominantBaseline="middle"
          fill="#f4ebd0" fontSize="7">cubit</text>

        {/* 7 palm tick marks on rise */}
        {Array.from({ length: 7 }).map((_, i) => {
          const ty = blockY + ((i + 1) / 7) * risePx;
          return (
            <g key={`rise-tick-${i}`}>
              <line x1={blockX + blockW} y1={ty} x2={blockX + blockW + 6} y2={ty}
                stroke="#e9c46a" strokeWidth="0.8" />
              <text x={blockX + blockW + 9} y={ty + 3} fill="#e9c46a" fontSize="6">{i + 1}</text>
            </g>
          );
        })}

        {/* Horizontal setback (the Run) */}
        <line x1={blockX + blockW} y1={blockY + risePx}
          x2={blockX + blockW + runPx} y2={blockY + risePx}
          stroke="#38bdf8" strokeWidth="2" strokeDasharray="4 2" />
        <line x1={blockX + blockW + runPx} y1={blockY + risePx - 4}
          x2={blockX + blockW + runPx} y2={blockY + risePx + 4}
          stroke="#38bdf8" strokeWidth="1.5" />

        {/* Dynamic palm ticks on run */}
        {Array.from({ length: Math.min(Math.floor(seked), 10) }).map((_, i) => {
          const tx = blockX + blockW + ((i + 1) / seked) * runPx;
          return (
            <g key={`run-tick-${i}`}>
              <line x1={tx} y1={blockY + risePx - 5} x2={tx} y2={blockY + risePx + 5}
                stroke="#38bdf8" strokeWidth="0.8" />
              <text x={tx} y={blockY + risePx + 16} textAnchor="middle"
                fill="#38bdf8" fontSize="6">{i + 1}</text>
            </g>
          );
        })}

        {/* Run label */}
        <text x={blockX + blockW + runPx / 2} y={blockY + risePx + 28} textAnchor="middle"
          fill="#38bdf8" fontSize="8" fontWeight="bold">
          Run: {seked.toFixed(1)} palms
        </text>

        {/* Vertical guide line */}
        <line x1={blockX + blockW} y1={blockY} x2={blockX + blockW} y2={blockY + risePx}
          stroke="#e9c46a" strokeWidth="0.5" strokeDasharray="3 3" />

        {/* "7 palms rise" label */}
        <text x={blockX + blockW + 4} y={blockY + risePx / 2 - 4}
          fill="#f4ebd0" fontSize="8" fontWeight="bold">7</text>
        <text x={blockX + blockW + 4} y={blockY + risePx / 2 + 7}
          fill="#f4ebd0" fontSize="6">palms</text>
      </g>
    );
  };

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center select-none"
      style={{ background: 'radial-gradient(ellipse at 70% 20%, rgba(233,196,106,0.06) 0%, transparent 60%), radial-gradient(ellipse at 30% 80%, rgba(231,111,81,0.04) 0%, transparent 50%), #07090e' }}>

      {/* --- Sliders overlay at top --- */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 flex gap-4 bg-slate-950/85 border border-slate-800/60 rounded-xl px-5 py-3 backdrop-blur-md shadow-lg">
        <div className="flex flex-col gap-0.5 min-w-[160px]">
          <div className="flex justify-between text-[10px] font-semibold">
            <span className="text-slate-400">Base Width</span>
            <span className="text-white font-mono">{baseWidth} cubits</span>
          </div>
          <input type="range" min="100" max="500" step="5" value={baseWidth}
            onChange={(e) => onBaseChange(parseInt(e.target.value))}
            className="w-full h-1 accent-egypt-gold cursor-pointer" />
        </div>
        <div className="flex flex-col gap-0.5 min-w-[160px]">
          <div className="flex justify-between text-[10px] font-semibold">
            <span className="text-slate-400">Height</span>
            <span className="text-white font-mono">{height} cubits</span>
          </div>
          <input type="range" min="50" max="400" step="1" value={height}
            onChange={(e) => onHeightChange(parseInt(e.target.value))}
            className="w-full h-1 accent-egypt-gold cursor-pointer" />
        </div>
        {/* Real-time readout */}
        <div className="flex items-center gap-3 pl-3 border-l border-slate-700/50">
          <div className="flex flex-col items-center">
            <span className="text-[9px] text-slate-500 uppercase">Angle</span>
            <span className="text-sm font-mono font-bold" style={{ color: ic.stroke }}>{slope.toFixed(1)}°</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-[9px] text-slate-500 uppercase">Seked</span>
            <span className="text-sm font-mono font-bold" style={{ color: ic.stroke }}>{seked.toFixed(1)}</span>
          </div>
        </div>
      </div>

      {/* --- SVG Canvas --- */}
      <svg viewBox={`0 0 ${SVG_W} ${SVG_H}`} className="w-full h-full"
        preserveAspectRatio="xMidYMid meet">

        {/* Sky gradient */}
        <defs>
          <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0b172a" />
            <stop offset="60%" stopColor="#1a2a40" />
            <stop offset="100%" stopColor="#c4956a" />
          </linearGradient>
        </defs>
        <rect x="0" y="0" width={SVG_W} height={GROUND_Y} fill="url(#skyGrad)" />

        {/* Sun */}
        <circle cx={SVG_W - 120} cy={80} r="45" fill="#e9c46a" opacity="0.9" />
        <circle cx={SVG_W - 120} cy={80} r="60" fill="#e9c46a" opacity="0.1" />
        <circle cx={SVG_W - 120} cy={80} r="80" fill="#e9c46a" opacity="0.04" />

        {/* Desert ground */}
        <rect x="0" y={GROUND_Y} width={SVG_W} height={SVG_H - GROUND_Y} fill="#c4956a" />
        <rect x="0" y={GROUND_Y} width={SVG_W} height="3" fill="#d4a574" opacity="0.6" />
        {/* Ground texture lines */}
        {[0.2, 0.5, 0.8].map((t, i) => (
          <line key={`sand-${i}`} x1={SVG_W * t - 100} y1={GROUND_Y + 10 + i * 8}
            x2={SVG_W * t + 120} y2={GROUND_Y + 10 + i * 8}
            stroke="rgba(180,130,90,0.3)" strokeWidth="1" />
        ))}

        {/* --- Masonry pyramid --- */}
        {renderMasonry()}

        {/* Integrity overlay */}
        <polygon points={`${CENTER_X},${yApex} ${xRight},${GROUND_Y} ${xLeft},${GROUND_Y}`}
          fill={ic.overlay} pointerEvents="none" />

        {/* Collapse crack lines */}
        {renderCracks()}

        {/* --- Geometric overlay: right triangle on right half --- */}
        <g>
          {/* Vertical rise (height) — green dashed */}
          <line x1={CENTER_X} y1={GROUND_Y} x2={CENTER_X} y2={yApex}
            stroke="#10b981" strokeWidth="2" strokeDasharray="6 4" />

          {/* Horizontal run (half-base) — green dashed */}
          <line x1={CENTER_X} y1={GROUND_Y} x2={xRight} y2={GROUND_Y}
            stroke="#10b981" strokeWidth="2" strokeDasharray="6 4" />

          {/* Hypotenuse — green solid */}
          <line x1={CENTER_X} y1={yApex} x2={xRight} y2={GROUND_Y}
            stroke="#10b981" strokeWidth="2.5" />

          {/* Right-angle square marker */}
          <rect x={CENTER_X} y={GROUND_Y - 12} width="12" height="12"
            fill="none" stroke="#10b981" strokeWidth="1.5" />

          {/* Angle arc at bottom right */}
          <g>
            {(() => {
              const arcR = 30;
              const ax = xRight - arcR * Math.cos(rad);
              const ay = GROUND_Y - arcR * Math.sin(rad);
              const largeArc = rad > Math.PI / 2 ? 1 : 0;
              return (
                <path
                  d={`M ${xRight - arcR} ${GROUND_Y} A ${arcR} ${arcR} 0 ${largeArc} 0 ${ax} ${ay}`}
                  fill="none" stroke="#10b981" strokeWidth="2" />
              );
            })()}
            {/* Angle label */}
            <text x={xRight - 42} y={GROUND_Y - 18}
              fill="#10b981" fontSize="13" fontWeight="bold">
              {slope.toFixed(1)}°
            </text>
          </g>

          {/* Measurement labels */}
          <text x={CENTER_X - 8} y={GROUND_Y - heightPx / 2}
            fill="#10b981" fontSize="11" fontWeight="bold" textAnchor="end">
            Rise: {height} cb
          </text>
          <text x={CENTER_X + halfBasePx / 2} y={GROUND_Y + 15}
            fill="#10b981" fontSize="11" fontWeight="bold" textAnchor="middle">
            Run: {halfBaseCubits} cb
          </text>
        </g>

        {/* --- Integrity status badge --- */}
        <g transform={`translate(${CENTER_X - 60}, ${GROUND_Y + 25})`}>
          <rect x="0" y="0" width="120" height="22" rx="4"
            fill="rgba(7,9,14,0.85)" stroke={ic.stroke} strokeWidth="1" />
          <text x="60" y="15" textAnchor="middle"
            fill={ic.stroke} fontSize="10" fontWeight="bold">{ic.label}</text>
        </g>

        {/* --- Seked inset diagram --- */}
        {renderSekedInset()}

        {/* Tip text */}
        <text x={CENTER_X} y={GROUND_Y + 60} textAnchor="middle"
          fill="rgba(255,255,255,0.25)" fontSize="10">
          Drag sliders to adjust base & height — watch the angle and seked update in real time
        </text>
      </svg>
    </div>
  );
}
