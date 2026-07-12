import React, { useState, useRef } from 'react';
import { useGameState } from '../../context/GameStateContext';
import LevelShell from '../LevelShell';
import { Scissors, Star, Compass } from 'lucide-react';

// --- Constants & Config ---
const KNOT_PX = 50; // 1 knot = 50 pixels
const SVG_WIDTH = 900;
const SVG_HEIGHT = 600;
const SNAP_TOLERANCE = 15; // Pixel tolerance for snapping to 3,4,5

const COLORS = {
  bg: '#161d2d',          // Slate dark blue background
  field: '#5c3a21',       // Fertile dark brown mud soil
  fieldStroke: '#8c5a3c', // Sand terracotta stroke
  rope: '#d97706',        // Orange/Gold rope
  successRope: '#10b981', // Emerald green when snapped
  peg: '#78350f',         // Dark wood brown
  ruler: '#38bdf8',       // Light blue guide ruler
  rulerText: '#0ea5e9'
};

// The irregular five-sided field (Trapezoid + Triangle on top)
// 1. Bottom Base: from (150, 500) to (750, 500) -> Length = 600px (12 knots)
// 2. Trapezoid Top/Triangle Base: from (300, 200) to (600, 200) -> Length = 300px (6 knots)
// 3. Trapezoid Height: from y=500 to y=200 -> Height = 300px (6 knots)
// 4. Triangle Apex: (450, 100) -> Height = 100px (2 knots)
// Area = Trapezoid Area + Triangle Area
//      = ((12 + 6) / 2 * 6) + (6 * 2 / 2) = 54 + 6 = 60 square knots
const FIELD_POINTS = "150,500 750,500 600,200 450,100 300,200";

export default function RopeStretchers() {
  const { completedSubtasks, activeSubtask, completeSubtask } = useGameState();
  
  // A, B, C represent the three pegs
  const [pegs, setPegs] = useState({
    A: { x: 80, y: 180 },
    B: { x: 230, y: 160 },
    C: { x: 150, y: 280 }
  });
  const [draggingId, setDraggingId] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  
  // Right Angle Tool State
  const [isRigid, setIsRigid] = useState(false);
  const [rigidConfig, setRigidConfig] = useState(null); // { center, p1, p2, orientation }

  // Measurement Form State
  const [areaAnswer, setAreaAnswer] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const svgRef = useRef(null);

  // --- Math Helpers ---
  const getDist = (p1, p2) => Math.hypot(p1.x - p2.x, p1.y - p2.y);
  
  // Check if pegs snap to right angle
  const checkAndSnapToRightAngle = (currentPegs) => {
    const perms = [
      ['A', 'B', 'C'], ['A', 'C', 'B'],
      ['B', 'A', 'C'], ['B', 'C', 'A'],
      ['C', 'A', 'B'], ['C', 'B', 'A']
    ];

    for (let p of perms) {
      const center = p[0];
      const p1 = p[1];
      const p2 = p[2];

      const d1 = getDist(currentPegs[center], currentPegs[p1]);
      const d2 = getDist(currentPegs[center], currentPegs[p2]);
      const d3 = getDist(currentPegs[p1], currentPegs[p2]);

      if (
        Math.abs(d1 - 3 * KNOT_PX) < SNAP_TOLERANCE &&
        Math.abs(d2 - 4 * KNOT_PX) < SNAP_TOLERANCE &&
        Math.abs(d3 - 5 * KNOT_PX) < SNAP_TOLERANCE
      ) {
        const angle1 = Math.atan2(currentPegs[p1].y - currentPegs[center].y, currentPegs[p1].x - currentPegs[center].x);
        let angle2 = Math.atan2(currentPegs[p2].y - currentPegs[center].y, currentPegs[p2].x - currentPegs[center].x);

        let diff = angle2 - angle1;
        while (diff > Math.PI) diff -= 2 * Math.PI;
        while (diff < -Math.PI) diff += 2 * Math.PI;

        const orientation = diff > 0 ? 1 : -1;
        angle2 = angle1 + orientation * (Math.PI / 2);

        const snappedPegs = { ...currentPegs };
        snappedPegs[p1] = {
          x: currentPegs[center].x + 3 * KNOT_PX * Math.cos(angle1),
          y: currentPegs[center].y + 3 * KNOT_PX * Math.sin(angle1)
        };
        snappedPegs[p2] = {
          x: currentPegs[center].x + 4 * KNOT_PX * Math.cos(angle2),
          y: currentPegs[center].y + 4 * KNOT_PX * Math.sin(angle2)
        };

        return { success: true, pegs: snappedPegs, config: { center, p1, p2, orientation } };
      }
    }
    return { success: false };
  };

  // --- Event Handlers ---
  const handlePointerDown = (id) => (e) => {
    e.stopPropagation();
    if (!svgRef.current) return;
    const pt = svgRef.current.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const svgP = pt.matrixTransform(svgRef.current.getScreenCTM().inverse());
    
    setDraggingId(id);
    setDragOffset({
      x: svgP.x - pegs[id].x,
      y: svgP.y - pegs[id].y
    });
  };

  const handlePointerMove = (e) => {
    if (!draggingId || !svgRef.current) return;
    
    const pt = svgRef.current.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const svgP = pt.matrixTransform(svgRef.current.getScreenCTM().inverse());
    
    const targetX = svgP.x - dragOffset.x;
    const targetY = svgP.y - dragOffset.y;

    if (!isRigid) {
      const newPegs = { ...pegs, [draggingId]: { x: targetX, y: targetY } };
      setPegs(newPegs);
      
      const snapResult = checkAndSnapToRightAngle(newPegs);
      if (snapResult.success) {
        setPegs(snapResult.pegs);
        setRigidConfig(snapResult.config);
        setIsRigid(true);
        setDraggingId(null);
      }
    } else {
      const { center, p1, p2, orientation } = rigidConfig;
      
      if (draggingId === center) {
        const dx = targetX - pegs[center].x;
        const dy = targetY - pegs[center].y;
        setPegs(prev => ({
          [center]: { x: prev[center].x + dx, y: prev[center].y + dy },
          [p1]: { x: prev[p1].x + dx, y: prev[p1].y + dy },
          [p2]: { x: prev[p2].x + dx, y: prev[p2].y + dy }
        }));
      } else {
        const draggedIsP1 = draggingId === p1;
        const newAngle = Math.atan2(svgP.y - pegs[center].y, svgP.x - pegs[center].x);

        const angle1 = draggedIsP1 ? newAngle : newAngle - orientation * (Math.PI / 2);
        const angle2 = draggedIsP1 ? newAngle + orientation * (Math.PI / 2) : newAngle;

        setPegs(prev => ({
          ...prev,
          [p1]: {
            x: prev[center].x + 3 * KNOT_PX * Math.cos(angle1),
            y: prev[center].y + 3 * KNOT_PX * Math.sin(angle1)
          },
          [p2]: {
            x: prev[center].x + 4 * KNOT_PX * Math.cos(angle2),
            y: prev[center].y + 4 * KNOT_PX * Math.sin(angle2)
          }
        }));
      }
    }
  };

  const handlePointerUp = () => setDraggingId(null);

  const handleVerify = (e) => {
    e.preventDefault();
    if (areaAnswer.trim() === '60') {
      setIsSuccess(true);
      setErrorMsg('');
      completeSubtask(1, 1);
    } else {
      setErrorMsg('Incorrect calculated area. Double-check your measurements!');
    }
  };

  const handleUntie = () => {
    setIsRigid(false);
    setRigidConfig(null);
    setPegs({
      A: { x: 80, y: 180 },
      B: { x: 230, y: 160 },
      C: { x: 150, y: 280 }
    });
  };

  const renderRopeLine = (pId1, pId2) => {
    const p1 = pegs[pId1];
    const p2 = pegs[pId2];
    const d = getDist(p1, p2);
    const knots = d / KNOT_PX;
    
    const mx = (p1.x + p2.x) / 2;
    const my = (p1.y + p2.y) / 2;
    
    let angle = Math.atan2(p2.y - p1.y, p2.x - p1.x) * (180 / Math.PI);
    if (angle > 90 || angle < -90) angle += 180;

    return (
      <g key={`line-${pId1}-${pId2}`}>
        <line 
          x1={p1.x} 
          y1={p1.y} 
          x2={p2.x} 
          y2={p2.y} 
          stroke={isRigid ? COLORS.successRope : COLORS.rope} 
          strokeWidth={isRigid ? 6 : 4} 
        />
        {!isRigid && (
          <g transform={`translate(${mx}, ${my}) rotate(${angle})`}>
            <rect x="-35" y="-18" width="70" height="16" fill="rgba(7, 9, 14, 0.85)" stroke="rgba(233,196,106,0.2)" strokeWidth="0.5" rx="3" />
            <text x="0" y="-6" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#e9c46a">
              {knots.toFixed(1)} knots
            </text>
          </g>
        )}
      </g>
    );
  };

  const renderRulerExtension = (centerId, targetId, lengthKnots) => {
    if (!isRigid) return null;
    const center = pegs[centerId];
    const target = pegs[targetId];
    const angle = Math.atan2(target.y - center.y, target.x - center.x);
    
    const RULER_LENGTH = 800;
    const endX = center.x + RULER_LENGTH * Math.cos(angle);
    const endY = center.y + RULER_LENGTH * Math.sin(angle);

    const ticks = [];
    for (let i = 1; i <= Math.floor(RULER_LENGTH / KNOT_PX); i++) {
      const tx = center.x + (i * KNOT_PX) * Math.cos(angle);
      const ty = center.y + (i * KNOT_PX) * Math.sin(angle);
      const px = -Math.sin(angle) * 8;
      const py = Math.cos(angle) * 8;
      ticks.push(
        <g key={`tick-${i}`}>
          <line x1={tx - px} y1={ty - py} x2={tx + px} y2={ty + py} stroke={COLORS.ruler} strokeWidth="1.5" />
          {i > Math.max(3, 4) && (
            <text 
              x={tx - px*2} 
              y={ty - py*2} 
              fontSize="10" 
              fontWeight="bold"
              fill="#e9c46a" 
              textAnchor="middle" 
              transform={`rotate(${angle * 180 / Math.PI + (angle > Math.PI/2 || angle < -Math.PI/2 ? 180 : 0)}, ${tx - px*2}, ${ty - py*2})`}
            >
              {i}
            </text>
          )}
        </g>
      );
    }

    return (
      <g>
        <line x1={center.x} y1={center.y} x2={endX} y2={endY} stroke={COLORS.ruler} strokeWidth="1.5" strokeDasharray="5 5" />
        {ticks}
      </g>
    );
  };

  return (
    <LevelShell
      title="Level 1: Ancient Egypt"
      activeSubtask={activeSubtask}
      completedSubtasks={completedSubtasks}
      canvas={
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-slate-900/5 select-none">
          {/* Informative Header */}
          <div className="absolute top-6 left-6 text-xs bg-slate-950/80 border border-slate-800 px-3 py-1.5 rounded-lg flex items-center gap-2 z-10">
            <span className="w-2 h-2 rounded-full bg-egypt-gold animate-pulse" />
            <span className="text-slate-400">Interactive Map: Stretch rope to snap right angle, drag center peg to base</span>
          </div>

          {/* Reset/Untie Button */}
          {isRigid && (
            <button 
              onClick={handleUntie}
              className="absolute top-6 right-6 bg-rose-950/80 border border-rose-900/50 hover:bg-rose-900 text-rose-200 px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-lg transition-all cursor-pointer z-10"
            >
              <Scissors className="w-3.5 h-3.5" /> Untie Right Angle
            </button>
          )}

          {/* Canvas SVG Box */}
          <div className="w-[95%] h-[85%] max-w-4xl max-h-[520px] border border-slate-800/80 rounded-2xl bg-gradient-to-b from-[#111622]/80 to-slate-950/90 shadow-2xl relative overflow-hidden flex items-center justify-center">
            <svg 
              ref={svgRef}
              width="100%" 
              height="100%" 
              viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerLeave={handlePointerUp}
              className="w-full h-full cursor-crosshair touch-none"
              style={{ backgroundColor: COLORS.bg, touchAction: 'none' }}
            >
              {/* Nile Fertile Land Mud polygon - FIVE SIDED IRREGULAR PENTAGON */}
              <polygon 
                points={FIELD_POINTS} 
                fill={COLORS.field} 
                stroke={COLORS.fieldStroke} 
                strokeWidth="5" 
                strokeLinejoin="round" 
              />
              <path d="M 250 350 Q 350 300 450 360 T 650 320" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="3" />
              <path d="M 200 450 Q 320 420 440 460 T 680 430" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="3" />

              {/* Rulers tick extension */}
              {isRigid && rigidConfig && (
                <>
                  {renderRulerExtension(rigidConfig.center, rigidConfig.p1, 3)}
                  {renderRulerExtension(rigidConfig.center, rigidConfig.p2, 4)}
                  
                  {/* Right angle corner box marker */}
                  <g stroke={COLORS.successRope} strokeWidth="1.5" fill="rgba(16, 185, 129, 0.15)">
                    <path d={`
                      M ${pegs[rigidConfig.center].x + 15 * Math.cos(Math.atan2(pegs[rigidConfig.p1].y - pegs[rigidConfig.center].y, pegs[rigidConfig.p1].x - pegs[rigidConfig.center].x))} 
                        ${pegs[rigidConfig.center].y + 15 * Math.sin(Math.atan2(pegs[rigidConfig.p1].y - pegs[rigidConfig.center].y, pegs[rigidConfig.p1].x - pegs[rigidConfig.center].x))}
                      L ${pegs[rigidConfig.center].x + 15 * Math.cos(Math.atan2(pegs[rigidConfig.p1].y - pegs[rigidConfig.center].y, pegs[rigidConfig.p1].x - pegs[rigidConfig.center].x)) + 15 * Math.cos(Math.atan2(pegs[rigidConfig.p2].y - pegs[rigidConfig.center].y, pegs[rigidConfig.p2].x - pegs[rigidConfig.center].x))} 
                        ${pegs[rigidConfig.center].y + 15 * Math.sin(Math.atan2(pegs[rigidConfig.p1].y - pegs[rigidConfig.center].y, pegs[rigidConfig.p1].x - pegs[rigidConfig.center].x)) + 15 * Math.sin(Math.atan2(pegs[rigidConfig.p2].y - pegs[rigidConfig.center].y, pegs[rigidConfig.p2].x - pegs[rigidConfig.center].x))}
                      L ${pegs[rigidConfig.center].x + 15 * Math.cos(Math.atan2(pegs[rigidConfig.p2].y - pegs[rigidConfig.center].y, pegs[rigidConfig.p2].x - pegs[rigidConfig.center].x))} 
                        ${pegs[rigidConfig.center].y + 15 * Math.sin(Math.atan2(pegs[rigidConfig.p2].y - pegs[rigidConfig.center].y, pegs[rigidConfig.p2].x - pegs[rigidConfig.center].x))}
                      L ${pegs[rigidConfig.center].x} ${pegs[rigidConfig.center].y} Z
                    `} />
                  </g>
                </>
              )}

              {/* Rope area polygon highlights */}
              {isRigid && (
                <polygon 
                  points={`${pegs.A.x},${pegs.A.y} ${pegs.B.x},${pegs.B.y} ${pegs.C.x},${pegs.C.y}`}
                  fill="rgba(16, 185, 129, 0.12)"
                  pointerEvents="none"
                />
              )}

              {/* Rope segments */}
              {renderRopeLine('A', 'B')}
              {renderRopeLine('B', 'C')}
              {renderRopeLine('C', 'A')}

              {/* Draggable Wooden Pegs */}
              {['A', 'B', 'C'].map((id) => (
                <g 
                  key={id} 
                  transform={`translate(${pegs[id].x}, ${pegs[id].y})`}
                  onPointerDown={handlePointerDown(id)}
                  className="cursor-grab active:cursor-grabbing group pointer-events-auto"
                >
                  <circle cx="0" cy="0" r="22" fill="transparent" />
                  <circle cx="1" cy="2" r="10" fill="rgba(0, 0, 0, 0.4)" />
                  <circle 
                    cx="0" 
                    cy="0" 
                    r="9" 
                    fill={isRigid && rigidConfig.center === id ? COLORS.successRope : COLORS.peg} 
                    stroke={isRigid ? '#ffffff' : '#f4ebd0'} 
                    strokeWidth="2" 
                    className="transition-colors duration-300"
                  />
                  {isRigid && rigidConfig.center === id ? (
                    <circle cx="0" cy="0" r="3" fill="#ffffff" />
                  ) : (
                    <path d="M -3.5 -3.5 L 3.5 3.5 M 3.5 -3.5 L -3.5 3.5" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" strokeLinecap="round" />
                  )}
                  
                  <text x="0" y="-14" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle" filter="drop-shadow(0 1px 2px rgba(0,0,0,0.8))">
                    {id}
                  </text>
                </g>
              ))}
            </svg>
          </div>

          <div className="mt-4 text-[10px] text-slate-400 bg-slate-950/40 p-2.5 rounded-lg border border-slate-900/60 max-w-lg text-center">
            Rope length is measured in **knots** (1 knot = 50px). Create a right triangle (sides 3, 4, 5 knots) to activate the projection rulers.
          </div>
        </div>
      }
    >
      <div className="flex flex-col justify-between h-full text-slate-300 text-xs">
        <div className="flex flex-col gap-4">
          <p className="leading-relaxed text-slate-400">
            Early Egyptian geometry was purely practical rather than theoretical. Each year, the Nile River flooded its banks, washing away boundary markers between farms. The Pharaoh's <strong>harpedonaptai</strong> — literally "rope stretchers" — were royal surveyors who used loops of rope with knots tied at 3, 4, and 5 unit intervals. When stretched taut, these knots form a perfect right triangle, allowing the surveyors to construct precise perpendicular lines. With this simple tool, they could re-measure and fairly redistribute farmland, and lay out the foundations of temples and pyramids with astonishing accuracy — all without any formal concept of angles or algebra.
          </p>

          {/* Verification Card exactly like the astronomers screenshot */}
          <div className="bg-slate-950/40 border border-slate-800/80 p-4 rounded-xl flex flex-col gap-3">
            <h3 className="text-xs font-bold text-egypt-gold uppercase tracking-wider">
              1. The Rope Stretchers
            </h3>
            <p className="text-[11px] leading-relaxed text-slate-300">
              After the annual Nile floods recede, surveyors stretch knotted ropes into a 3-4-5 right triangle. This creates a perpendicular alignment to measure land boundaries fairly.
            </p>
            
            <div className="border-t border-slate-800/80 pt-3 flex flex-col gap-2.5">
              <span className="text-[11px] font-semibold text-slate-200">
                Measure the dimensions of the composite land (the bottom trapezoidal section and the top triangular peak) using the right-angle ruler. Calculate the total area:
              </span>
              
              <div className="flex flex-col gap-1 mt-1">
                <span className="text-[9px] uppercase font-bold tracking-wider text-slate-400">Total Area (sq knots)</span>
                <input
                  type="number"
                  value={areaAnswer}
                  onChange={(e) => {
                    setAreaAnswer(e.target.value);
                    setErrorMsg('');
                  }}
                  disabled={isSuccess}
                  placeholder="e.g. 50"
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
                  <span>Success! Task 2: Pyramid Builders is now unlocked.</span>
                </div>
              ) : (
                <div className="flex justify-end mt-1">
                  <button
                    onClick={handleVerify}
                    className="bg-egypt-gold hover:bg-[#dfba5b] text-slate-950 font-bold px-4 py-2 rounded-lg text-xs transition cursor-pointer"
                  >
                    Verify Area
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
