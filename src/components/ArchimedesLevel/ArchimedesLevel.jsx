import React, { useState, useMemo } from 'react';
import { useGameState } from '../../context/GameStateContext';
import { RotateCcw, BookOpen } from 'lucide-react';
import LevelShell from '../LevelShell';

/* ───────────────────── Oliver Byrne Color Palette ─────────────────── */
const OB = {
  red: '#e74c3c', blue: '#2980b9', yellow: '#f1c40f', gold: '#e9c46a',
  green: '#10b981', purple: '#a855f7', cyan: '#06b6d4', slate: '#64748b',
  dim: '#334155', bg: '#0f172a',
};

export default function ArchimedesLevel() {
  const { activeSubtask, completedSubtasks, completeSubtask } = useGameState();

  /* ─── Task 1 State ─── */
  const [task1Step, setTask1Step] = useState(0);
  const sphereR = 55;
  const zoneN = 8;

  /* ─── Task 2 State ─── */
  const [task2Step, setTask2Step] = useState(0);
  const [ratioProofMode, setRatioProofMode] = useState('similarity'); // 'similarity' | 'areas'
  const [parabolaProofMode, setParabolaProofMode] = useState('mechanical'); // 'mechanical' | 'derivation'
  const w1 = 40, d1 = 60, w2 = 60, d2 = 40;
  const triAy = 0, triAx = 0;

  /* ─── Quiz State ─── */
  const [qIdx, setQIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [feedback, setFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [success, setSuccess] = useState(false);

  /* ═══════════════════════════════ QUESTIONS ═══════════════════════ */
  const task1Questions = [
    { id:1, concept:'Surface Area of a Sphere',
      question:'What is the surface area of a sphere of radius R, as proved by Archimedes?',
      options:['A = 4πR² (four great circles)','A = 2πR²','A = (4/3)πR³','A = 6πR²'],
      correct:0, explanation:'Archimedes proved that the sphere\'s surface area equals exactly 4 great-circle areas: A = 4πR².' },
    { id:2, concept:'Sphere vs Cylinder Lateral Area',
      question:'How does the sphere area compare to the lateral (side) area of its circumscribed cylinder?',
      options:['They are exactly equal (both 4πR²).','The sphere is twice as large.','The cylinder lateral is twice as large.','The sphere is 3/4 of the cylinder.'],
      correct:0, explanation:'Lateral area of the cylinder = 2πR · 2R = 4πR², identical to the sphere!' },
    { id:3, concept:'The Tombstone Ratio 2∶3',
      question:'What is the ratio of the sphere surface area to the TOTAL surface area of its circumscribed cylinder?',
      options:['2 : 3 (Sphere 4πR² / Cylinder 6πR²)','1 : 2','3 : 4','1 : 1'],
      correct:0, explanation:'Cylinder total = 4πR² + 2πR² = 6πR². Ratio = 4/6 = 2/3.' },
    { id:4, concept:'Spherical Zone Area',
      question:'Archimedes proved that the area of a spherical zone between two parallel planes depends only on…',
      options:['The vertical height h of the zone (Area = 2πRh).','The distance from the center.','The curvature angle θ.','The volume of the slice.'],
      correct:0, explanation:'Any belt of height h has area 2πRh, matching the cylinder\'s corresponding belt.' },
    { id:5, concept:'Archimedes\' Tombstone',
      question:'Why did Archimedes request a sphere inscribed in a cylinder on his tombstone?',
      options:['He considered the 2:3 ratio his greatest discovery.','It was the seal of Syracuse.','It represented his catapults.','Roman law required it.'],
      correct:0, explanation:'He was so proud of the 2:3 ratio that he asked for it to be engraved on his tomb.' },
  ];

  const task2Questions = [
    { id:1, concept:'Law of the Lever',
      question:'When are weights W₁ and W₂ in equilibrium on a lever?',
      options:['When W₁·d₁ = W₂·d₂ (torques balance)','When W₁/d₁ = W₂/d₂','When W₁+d₁ = W₂+d₂','When W₁²+W₂² = d₁²+d₂²'],
      correct:0, explanation:'Archimedes proved magnitudes balance at distances inversely proportional to their weights.' },
    { id:2, concept:'Triangle Centroid Ratio',
      question:'In what ratio does the centroid G divide each median?',
      options:['2:1 from vertex to midpoint','1:1 (midpoint)','3:1','√2 : 1'],
      correct:0, explanation:'The centroid divides every median in ratio 2:1, so AG = (2/3)AD.' },
    { id:3, concept:'Medians & Center of Gravity',
      question:'Where is the center of gravity (centroid) of a triangle?',
      options:['At the unique intersection of its three medians.','At the intersection of angle bisectors.','At the midpoint of the longest side.','At the circumcenter.'],
      correct:0, explanation:'Archimedes proved the centroid lies on every median, hence at their unique intersection.' },
    { id:4, concept:'Centroid Coordinates',
      question:'What are the coordinates of the centroid of △(x₁,y₁)(x₂,y₂)(x₃,y₃)?',
      options:['((x₁+x₂+x₃)/3, (y₁+y₂+y₃)/3)','((x₁+x₂)/2, (y₁+y₂)/2)','(x₁+x₂+x₃, y₁+y₂+y₃)','(√(x₁x₂x₃), √(y₁y₂y₃))'],
      correct:0, explanation:'The centroid is the arithmetic mean of the three vertices.' },
    { id:5, concept:'Parabolic Segment Centroid',
      question:'Where is the centroid of a parabolic segment along its axis of height h?',
      options:['At 3/5 of h from vertex (ratio 3:2)','At h/2 (midpoint)','At 2h/3','At h/4'],
      correct:0, explanation:'Archimedes\' Mechanical Method proved the centroid divides the axis 3:2.' },
  ];

  const questions = activeSubtask === 1 ? task1Questions : task2Questions;
  const curQ = questions[qIdx] || questions[0];

  const selectOpt = (i) => { setAnswers({...answers,[qIdx]:i}); setFeedback(''); };
  const nextQ = () => {
    if (answers[qIdx] === undefined) { setFeedback('Select an answer.'); return; }
    if (qIdx < questions.length - 1) { setQIdx(qIdx+1); setFeedback(''); }
    else {
      let c = 0; questions.forEach((q,i) => { if (answers[i]===q.correct) c++; });
      if (c === questions.length) {
        setSuccess(true); setSubmitted(true); completeSubtask(7,activeSubtask);
        setFeedback(`Task ${activeSubtask} Complete! Perfect mastery!`);
      } else setFeedback(`${c}/${questions.length} correct. Review & retry.`);
    }
  };
  const prevQ = () => { if (qIdx > 0) { setQIdx(qIdx-1); setFeedback(''); } };
  const resetQuiz = () => { setAnswers({}); setQIdx(0); setSubmitted(false); setSuccess(false); setFeedback(''); };

  /* ═══════════ COMPUTED VALUES ═══════════ */
  const R = sphereR;

  const torque1 = w1 * d1, torque2 = w2 * d2;
  const balanced = Math.abs(torque1 - torque2) < 0.5;
  const tiltDeg = balanced ? 0 : Math.max(-12, Math.min(12, (torque1-torque2) / -180));

  const triGeo = useMemo(() => {
    const _A = { x: 300 + triAx, y: 75 - triAy };
    const _B = { x: 140, y: 360 };
    const _C = { x: 460, y: 360 };
    const _G = { x: (_A.x + _B.x + _C.x) / 3, y: (_A.y + _B.y + _C.y) / 3 };
    const _midBC = { x: (_B.x + _C.x) / 2, y: (_B.y + _C.y) / 2 };
    const _midAC = { x: (_A.x + _C.x) / 2, y: (_A.y + _C.y) / 2 };
    const _midAB = { x: (_A.x + _B.x) / 2, y: (_A.y + _B.y) / 2 };
    const _AG = Math.hypot(_G.x - _A.x, _G.y - _A.y);
    const _GD = Math.hypot(_midBC.x - _G.x, _midBC.y - _G.y);
    const _ratio = _GD > 0 ? (_AG / _GD).toFixed(2) : '2.00';
    return { A: _A, B: _B, C: _C, G: _G, midBC: _midBC, midAC: _midAC, midAB: _midAB, ratio: _ratio };
  }, [triAx, triAy]);
  const { A, B, C, G, midBC, midAC, midAB, ratio } = triGeo;

  /* ─── Parabola exact SVG path ─── */
  const parabolaPath = useMemo(() => {
    const vx = 300, vy = 75, h = 280, b = 140;
    const ptsLeft = [];
    const ptsRight = [];
    const steps = 30;
    for (let i = steps; i >= 0; i--) {
      const t = i / steps;
      const y = vy + t * h;
      const xLeft = vx - b * Math.sqrt(t);
      const xRight = vx + b * Math.sqrt(t);
      ptsLeft.push(`${xLeft.toFixed(1)},${y.toFixed(1)}`);
      ptsRight.push(`${xRight.toFixed(1)},${y.toFixed(1)}`);
    }
    return `M ${ptsLeft.join(' L ')} L ${ptsRight.reverse().join(' L ')} Z`;
  }, []);

  const step = activeSubtask === 1 ? task1Step : task2Step;
  const setStep = activeSubtask === 1 ? setTask1Step : setTask2Step;

  /* ─── Sphere zone slices for illustration ─── */
  const zoneSlices = useMemo(() => {
    const slices = [];
    const cx = 300, cy = 230, r = R * 1.6;
    for (let i = 0; i < zoneN; i++) {
      const y1 = cy - r + (2*r/zoneN)*i;
      const y2 = cy - r + (2*r/zoneN)*(i+1);
      const halfW1 = Math.sqrt(Math.max(0, r*r - (y1-cy)*(y1-cy)));
      const halfW2 = Math.sqrt(Math.max(0, r*r - (y2-cy)*(y2-cy)));
      slices.push({ y1, y2, halfW1, halfW2, cx });
    }
    return slices;
  }, [zoneN, R]);

  /* ═══════════════════════ TASK 1 SVG: SPHERE ═══════════════════ */
  const task1Canvas = useMemo(() => {
    const cx = 300, cy = 230, r = R * 1.6;
    const cylH = 2 * r;
    const cylTop = cy - r;
    const cylBot = cy + r;
    const cylLeft = cx - r;
    const ellipseRy = r * 0.22;

    return (
      <svg viewBox="0 0 600 460" className="w-full h-full" style={{background:'#0a0e1a'}}>
        <defs>
          <radialGradient id="sphereGrad" cx="40%" cy="35%">
            <stop offset="0%" stopColor="#67e8f9" stopOpacity="0.35" />
            <stop offset="60%" stopColor="#06b6d4" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#0e7490" stopOpacity="0.05" />
          </radialGradient>
          <linearGradient id="cylGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={OB.gold} stopOpacity="0.12" />
            <stop offset="50%" stopColor={OB.gold} stopOpacity="0.06" />
            <stop offset="100%" stopColor={OB.gold} stopOpacity="0.12" />
          </linearGradient>
          <linearGradient id="tombGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#334155" />
            <stop offset="100%" stopColor="#1e293b" />
          </linearGradient>
        </defs>

        {/* ── STEP 0: Sphere inscribed in Cylinder ── */}
        {step === 0 && (
          <g>
            {/* Title Banner */}
            <rect x="30" y="12" width="540" height="32" rx="6" fill="rgba(6,182,212,0.12)" stroke={OB.cyan} strokeWidth="1.5" />
            <text x="300" y="34" fill={OB.cyan} fontSize="13" fontWeight="bold" textAnchor="middle">
              Step 1 — Sphere of radius R inscribed in cylinder of height H = 2R
            </text>

            {/* Cylinder body */}
            <rect x={cylLeft} y={cylTop} width={2*r} height={cylH} fill="url(#cylGrad)" stroke={OB.gold} strokeWidth="2" strokeDasharray="6,4" />
            {/* Cylinder top ellipse */}
            <ellipse cx={cx} cy={cylTop} rx={r} ry={ellipseRy} fill="rgba(233,196,106,0.15)" stroke={OB.gold} strokeWidth="2" />
            {/* Cylinder bottom ellipse */}
            <ellipse cx={cx} cy={cylBot} rx={r} ry={ellipseRy} fill="rgba(233,196,106,0.08)" stroke={OB.gold} strokeWidth="2" />

            {/* Sphere */}
            <circle cx={cx} cy={cy} r={r} fill="url(#sphereGrad)" stroke={OB.cyan} strokeWidth="2.5" />
            {/* Equator ellipse */}
            <ellipse cx={cx} cy={cy} rx={r} ry={ellipseRy} fill="none" stroke={OB.cyan} strokeWidth="1.5" strokeDasharray="4,3" opacity="0.7" />

            {/* Radius line */}
            <line x1={cx} y1={cy} x2={cx+r} y2={cy} stroke={OB.red} strokeWidth="2.5" />
            <circle cx={cx} cy={cy} r="4" fill={OB.red} />
            <circle cx={cx+r} cy={cy} r="3" fill={OB.red} />
            <text x={cx-2} y={cy-10} fill="#e2e8f0" fontSize="13" fontWeight="bold" textAnchor="end">O</text>
            <text x={cx + r/2} y={cy-8} fill={OB.red} fontSize="14" fontWeight="bold" textAnchor="middle">R</text>

            {/* Height H annotation */}
            <line x1={cylLeft - 22} y1={cylTop} x2={cylLeft - 22} y2={cylBot} stroke={OB.gold} strokeWidth="2" markerStart="url(#arrowUp)" />
            <line x1={cylLeft - 26} y1={cylTop} x2={cylLeft - 18} y2={cylTop} stroke={OB.gold} strokeWidth="1.5" />
            <line x1={cylLeft - 26} y1={cylBot} x2={cylLeft - 18} y2={cylBot} stroke={OB.gold} strokeWidth="1.5" />
            <text x={cylLeft - 32} y={cy+4} fill={OB.gold} fontSize="14" fontWeight="bold" textAnchor="end" transform={`rotate(-90,${cylLeft-32},${cy})`}>H = 2R</text>

            {/* Labels */}
            <text x={cx} y={cylTop - 16} fill={OB.gold} fontSize="13" fontWeight="bold" textAnchor="middle">Circumscribed Cylinder</text>
            <text x={cx} y={cylBot + 32} fill={OB.cyan} fontSize="13" fontWeight="bold" textAnchor="middle">Sphere (radius R)</text>

            {/* Formula box */}
            <rect x="30" y="400" width="540" height="44" rx="8" fill="rgba(15,23,42,0.85)" stroke={OB.dim} strokeWidth="1.5" />
            <text x="300" y="420" fill="#94a3b8" fontSize="12" textAnchor="middle">
              Cylinder contains the sphere perfectly — both share radius R, cylinder height = diameter 2R
            </text>
            <text x="300" y="436" fill={OB.cyan} fontSize="12" fontWeight="bold" textAnchor="middle">
              Key insight: compare their surface areas!
            </text>
          </g>
        )}

        {/* ── STEP 1: WHY zone area = 2πRh — Similar Triangles Cross-Section ── */}
        {step === 1 && (() => {
          /* Cross-section coordinates */
          const scx = 200, scy = 230, sr = r;  /* sphere circle */
          const theta = 0.85; /* angle for the zone element (~49°) */
          /* Point P on sphere surface */
          const px = scx + sr * Math.sin(theta);
          const py = scy - sr * Math.cos(theta);
          /* Point P2 slightly below (for the zone element strip) */
          const dTheta = 0.12;
          const px2 = scx + sr * Math.sin(theta + dTheta);
          const py2 = scy - sr * Math.cos(theta + dTheta);
          /* Local horizontal radius r at this latitude */
          /* Annotations positions */
          const midPx = (px + px2) / 2;
          const midPy = (py + py2) / 2;

          return (
          <g>
            <rect x="15" y="12" width="570" height="32" rx="6" fill="rgba(99,102,241,0.15)" stroke="#6366f1" strokeWidth="1.5" />
            <text x="300" y="34" fill="#818cf8" fontSize="13" fontWeight="bold" textAnchor="middle">
              Step 2 — WHY each zone has area 2πRh: the Similar Triangles Argument
            </text>

            {/* ===== LEFT HALF: Cross-section diagram ===== */}
            {/* Cylinder cross-section (rectangle) */}
            <rect x={scx - sr} y={scy - sr} width={2 * sr} height={2 * sr}
              fill="rgba(233,196,106,0.08)" stroke={OB.gold} strokeWidth="2" strokeDasharray="5,4" />

            {/* Sphere cross-section (circle) */}
            <circle cx={scx} cy={scy} r={sr} fill="rgba(6,182,212,0.08)" stroke={OB.cyan} strokeWidth="2" />

            {/* Horizontal axis */}
            <line x1={scx - sr - 10} y1={scy} x2={scx + sr + 10} y2={scy} stroke={OB.dim} strokeWidth="1" strokeDasharray="3,3" />

            {/* The highlighted zone strip on the sphere (filled band) */}
            {/* Left arc side */}
            {(() => {
              const lx1 = scx - sr * Math.sin(theta);
              const lx2 = scx - sr * Math.sin(theta + dTheta);
              return (
                <g>
                  {/* Zone band on the sphere — filled trapezoid */}
                  <path d={`M ${lx1} ${py} L ${px} ${py} L ${px2} ${py2} L ${lx2} ${py2} Z`}
                    fill="rgba(244,63,94,0.3)" stroke={OB.red} strokeWidth="1.5" />
                  {/* Corresponding cylinder belt (dashed) */}
                  <rect x={scx - sr} y={py} width={2 * sr} height={py2 - py}
                    fill="rgba(233,196,106,0.12)" stroke={OB.gold} strokeWidth="1" strokeDasharray="3,3" />
                </g>
              );
            })()}

            {/* Center point O */}
            <circle cx={scx} cy={scy} r="4" fill={OB.cyan} />
            <text x={scx - 12} y={scy + 5} fill="#e2e8f0" fontSize="13" fontWeight="bold" textAnchor="end">O</text>

            {/* RADIUS R: line from center O to point P on sphere */}
            <line x1={scx} y1={scy} x2={px} y2={py} stroke={OB.blue} strokeWidth="2.5" />
            <text x={(scx + px) / 2 + 6} y={(scy + py) / 2 - 6} fill={OB.blue} fontSize="14" fontWeight="bold">R</text>

            {/* LOCAL RADIUS r: horizontal line from axis to point P */}
            <line x1={scx} y1={py} x2={px} y2={py} stroke={OB.purple} strokeWidth="2.5" />
            <text x={(scx + px) / 2} y={py - 8} fill={OB.purple} fontSize="14" fontWeight="bold" textAnchor="middle">r</text>

            {/* SLANT HEIGHT D: the surface element from P to P2 */}
            <line x1={px} y1={py} x2={px2} y2={py2} stroke={OB.red} strokeWidth="3" />
            <circle cx={px} cy={py} r="3.5" fill={OB.red} />
            <circle cx={px2} cy={py2} r="3.5" fill={OB.red} />
            <text x={midPx + 14} y={midPy - 2} fill={OB.red} fontSize="15" fontWeight="bold">D</text>

            {/* VERTICAL PROJECTION d: vertical drop from P to P2's y-level */}
            <line x1={px} y1={py} x2={px} y2={py2} stroke={OB.green} strokeWidth="2.5" />
            <text x={px + 14} y={(py + py2) / 2 + 4} fill={OB.green} fontSize="14" fontWeight="bold">d</text>

            {/* Right-angle mark at the corner of d and the horizontal */}
            <rect x={px - 6} y={py2 - 6} width="6" height="6" fill="none" stroke="#94a3b8" strokeWidth="1" />

            {/* Dashed vertical from P down to center height */}
            <line x1={px} y1={py2} x2={px} y2={scy} stroke={OB.dim} strokeWidth="1" strokeDasharray="3,3" />

            {/* Labels for P and P' */}
            <text x={px + 3} y={py - 12} fill="#e2e8f0" fontSize="12" fontWeight="bold">P</text>
            <text x={px2 + 3} y={py2 + 16} fill="#e2e8f0" fontSize="12" fontWeight="bold">P'</text>

            {/* Label: cross section */}
            <text x={scx} y={scy + sr + 20} fill={OB.cyan} fontSize="11" fontWeight="bold" textAnchor="middle">
              Sphere Cross-Section (radius R)
            </text>
            <text x={scx} y={scy + sr + 34} fill={OB.gold} fontSize="10" textAnchor="middle">
              inside Circumscribed Cylinder
            </text>

            {/* ===== RIGHT HALF: Similar Triangles + Derivation ===== */}
            {/* Box background */}
            <rect x="385" y="60" width="195" height="190" rx="10" fill="rgba(15,23,42,0.7)" stroke={OB.dim} strokeWidth="1" />
            <text x="482" y="82" fill={OB.gold} fontSize="13" fontWeight="bold" textAnchor="middle">Similar Triangles</text>

            {/* Small triangle (d, horizontal, D) — the surface element */}
            <g transform="translate(410, 100)">
              {/* The thin triangle from the zone element */}
              <line x1="0" y1="0" x2="0" y2="40" stroke={OB.green} strokeWidth="2.5" />
              <line x1="0" y1="0" x2="18" y2="40" stroke={OB.red} strokeWidth="2.5" />
              <line x1="0" y1="40" x2="18" y2="40" stroke="#94a3b8" strokeWidth="1.5" />
              <rect x="0" y="34" width="6" height="6" fill="none" stroke="#94a3b8" strokeWidth="1" />
              <text x="-12" y="24" fill={OB.green} fontSize="13" fontWeight="bold">d</text>
              <text x="14" y="18" fill={OB.red} fontSize="13" fontWeight="bold">D</text>
            </g>

            {/* Large triangle (r, vertical, R) — the radius triangle */}
            <g transform="translate(460, 100)">
              <line x1="0" y1="0" x2="80" y2="0" stroke={OB.purple} strokeWidth="2.5" />
              <line x1="0" y1="0" x2="0" y2="56" stroke="#94a3b8" strokeWidth="1.5" />
              <line x1="0" y1="56" x2="80" y2="0" stroke={OB.blue} strokeWidth="2.5" />
              <rect x="0" y="0" width="6" height="6" fill="none" stroke="#94a3b8" strokeWidth="1" />
              <text x="40" y="-8" fill={OB.purple} fontSize="13" fontWeight="bold" textAnchor="middle">r</text>
              <text x="44" y="38" fill={OB.blue} fontSize="14" fontWeight="bold">R</text>
            </g>

            {/* The key equation */}
            <text x="482" y="175" fill="#e2e8f0" fontSize="14" fontWeight="bold" textAnchor="middle">d / D = r / R</text>
            <text x="482" y="195" fill={OB.gold} fontSize="12" fontWeight="bold" textAnchor="middle">∴  D = d · R / r</text>
            <line x1="400" y1="205" x2="565" y2="205" stroke={OB.dim} strokeWidth="1" />
            <text x="482" y="222" fill="#94a3b8" fontSize="11" fontWeight="bold" textAnchor="middle">(perpendicular to tangent)</text>
            <text x="482" y="240" fill="#94a3b8" fontSize="11" fontWeight="bold" textAnchor="middle">(same angle at both)</text>

            {/* ===== BOTTOM: The derivation chain ===== */}
            <rect x="385" y="260" width="195" height="110" rx="10" fill="rgba(6,182,212,0.08)" stroke={OB.cyan} strokeWidth="1" />
            <text x="482" y="282" fill={OB.cyan} fontSize="12" fontWeight="bold" textAnchor="middle">Zone Area Derivation</text>

            <text x="482" y="302" fill="#e2e8f0" fontSize="12" textAnchor="middle">Zone = 2π<tspan fill={OB.purple} fontWeight="bold">r</tspan> · <tspan fill={OB.red} fontWeight="bold">D</tspan></text>
            <text x="482" y="322" fill="#e2e8f0" fontSize="12" textAnchor="middle">= 2π<tspan fill={OB.purple} fontWeight="bold">r</tspan> · <tspan fill={OB.green} fontWeight="bold">d</tspan>·<tspan fill={OB.blue} fontWeight="bold">R</tspan>/<tspan fill={OB.purple} fontWeight="bold">r</tspan></text>
            <text x="482" y="342" fill={OB.green} fontSize="14" fontWeight="bold" textAnchor="middle">= 2π<tspan fill={OB.blue}>R</tspan> · <tspan fill={OB.green}>d</tspan></text>
            <text x="482" y="362" fill={OB.gold} fontSize="11" fontWeight="bold" textAnchor="middle">r cancels! Depends only on d!</text>

            {/* Formula summary box */}
            <rect x="30" y="400" width="540" height="44" rx="8" fill="rgba(15,23,42,0.85)" stroke={OB.dim} strokeWidth="1.5" />
            <text x="300" y="418" fill="#c4b5fd" fontSize="13" fontWeight="bold" textAnchor="middle">
              Wider belt at equator × shorter slant = Narrow belt at pole × longer slant — always 2πR·d
            </text>
            <text x="300" y="436" fill="#94a3b8" fontSize="11" textAnchor="middle">
              The r in the circumference (2πr) perfectly cancels the r in the slant ratio (D = dR/r)!
            </text>
          </g>
          );
        })()}

        {/* ── STEP 2: Sum of zones = 4πR² ── */}
        {step === 2 && (
          <g>
            <rect x="30" y="12" width="540" height="32" rx="6" fill="rgba(16,185,129,0.15)" stroke={OB.green} strokeWidth="1.5" />
            <text x="300" y="34" fill={OB.green} fontSize="13" fontWeight="bold" textAnchor="middle">
              Step 3 — Sum all zones: Sphere Area = Σ 2πRΔh = 2πR · 2R = 4πR²
            </text>

            {/* Sphere with labeled total */}
            <circle cx="180" cy="230" r="100" fill="url(#sphereGrad)" stroke={OB.cyan} strokeWidth="2.5" />
            <ellipse cx="180" cy="230" rx="100" ry="22" fill="none" stroke={OB.cyan} strokeWidth="1.5" strokeDasharray="4,3" />
            <text x="180" y="225" fill="#e2e8f0" fontSize="16" fontWeight="bold" textAnchor="middle">Sphere</text>
            <text x="180" y="245" fill={OB.cyan} fontSize="15" fontWeight="bold" textAnchor="middle">A = 4πR²</text>

            {/* Equals sign */}
            <text x="310" y="230" fill="#94a3b8" fontSize="28" fontWeight="bold" textAnchor="middle">=</text>

            {/* 4 Great Circles */}
            <g transform="translate(370, 140)">
              <circle cx="45" cy="40" r="38" fill="rgba(244,63,94,0.25)" stroke={OB.red} strokeWidth="2" />
              <text x="45" y="44" fill="#fff" fontSize="12" fontWeight="bold" textAnchor="middle">πR²</text>
              <circle cx="135" cy="40" r="38" fill="rgba(233,196,106,0.25)" stroke={OB.gold} strokeWidth="2" />
              <text x="135" y="44" fill="#fff" fontSize="12" fontWeight="bold" textAnchor="middle">πR²</text>
              <circle cx="45" cy="130" r="38" fill="rgba(99,102,241,0.25)" stroke="#6366f1" strokeWidth="2" />
              <text x="45" y="134" fill="#fff" fontSize="12" fontWeight="bold" textAnchor="middle">πR²</text>
              <circle cx="135" cy="130" r="38" fill="rgba(16,185,129,0.25)" stroke={OB.green} strokeWidth="2" />
              <text x="135" y="134" fill="#fff" fontSize="12" fontWeight="bold" textAnchor="middle">πR²</text>
              <text x="90" y="-8" fill="#94a3b8" fontSize="12" fontWeight="bold" textAnchor="middle">4 Great Circles</text>
            </g>

            {/* Formula box */}
            <rect x="30" y="400" width="540" height="44" rx="8" fill="rgba(15,23,42,0.85)" stroke={OB.dim} strokeWidth="1.5" />
            <text x="300" y="418" fill={OB.green} fontSize="13" fontWeight="bold" textAnchor="middle">
              Total Sphere Area = Σ(2πR · Δh) = 2πR · (2R) = 4πR²
            </text>
            <text x="300" y="436" fill="#94a3b8" fontSize="11" textAnchor="middle">
              The surface of a sphere equals exactly four of its own great circles!
            </text>
          </g>
        )}

        {/* ── STEP 3: Tombstone Ratio 2:3 ── */}
        {step === 3 && (
          <g>
            <rect x="30" y="12" width="540" height="32" rx="6" fill="rgba(16,185,129,0.85)" />
            <text x="300" y="34" fill="#fff" fontSize="13" fontWeight="bold" textAnchor="middle">
              ✓ Step 4 — Tombstone Theorem: Sphere / Cylinder = 4πR² / 6πR² = 2 : 3 (Q.E.D.)
            </text>

            {/* Tombstone monument */}
            <path d="M 170 400 L 170 140 A 130 130 0 0 1 430 140 L 430 400 Z" fill="url(#tombGrad)" stroke={OB.gold} strokeWidth="2.5" />
            {/* Inner border */}
            <path d="M 190 390 L 190 160 A 110 110 0 0 1 410 160 L 410 390 Z" fill="none" stroke={OB.gold} strokeWidth="1" strokeDasharray="4,3" opacity="0.5" />

            {/* Engraved cylinder on tombstone */}
            <rect x="250" y="150" width="100" height="100" fill="none" stroke={OB.gold} strokeWidth="2" strokeDasharray="5,4" />
            <ellipse cx="300" cy="150" rx="50" ry="12" fill="rgba(233,196,106,0.15)" stroke={OB.gold} strokeWidth="1.5" />
            <ellipse cx="300" cy="250" rx="50" ry="12" fill="none" stroke={OB.gold} strokeWidth="1.5" />
            {/* Engraved sphere */}
            <circle cx="300" cy="200" r="50" fill="rgba(6,182,212,0.2)" stroke={OB.cyan} strokeWidth="2" />
            <ellipse cx="300" cy="200" rx="50" ry="12" fill="none" stroke={OB.cyan} strokeWidth="1" strokeDasharray="3,3" />

            {/* Ratio callout */}
            <text x="300" y="290" fill={OB.gold} fontSize="18" fontWeight="bold" textAnchor="middle">2 : 3</text>
            <text x="300" y="312" fill="#cbd5e1" fontSize="12" textAnchor="middle">Sphere : Cylinder</text>
            <text x="300" y="332" fill="#94a3b8" fontSize="11" textAnchor="middle">Surface Area and Volume</text>

            {/* Inscription */}
            <text x="300" y="365" fill={OB.gold} fontSize="11" fontWeight="bold" textAnchor="middle" fontStyle="italic">
              "Archimedes' Tombstone — Syracuse, c. 212 BC"
            </text>

            {/* Side annotations */}
            <rect x="30" y="160" width="120" height="70" rx="8" fill="rgba(6,182,212,0.1)" stroke={OB.cyan} strokeWidth="1" />
            <text x="90" y="182" fill={OB.cyan} fontSize="12" fontWeight="bold" textAnchor="middle">Sphere</text>
            <text x="90" y="200" fill="#e2e8f0" fontSize="11" textAnchor="middle">Area = 4πR²</text>
            <text x="90" y="218" fill="#94a3b8" fontSize="10" textAnchor="middle">Vol = (4/3)πR³</text>

            <rect x="450" y="160" width="120" height="70" rx="8" fill="rgba(233,196,106,0.1)" stroke={OB.gold} strokeWidth="1" />
            <text x="510" y="182" fill={OB.gold} fontSize="12" fontWeight="bold" textAnchor="middle">Cylinder</text>
            <text x="510" y="200" fill="#e2e8f0" fontSize="11" textAnchor="middle">Area = 6πR²</text>
            <text x="510" y="218" fill="#94a3b8" fontSize="10" textAnchor="middle">Vol = 2πR³</text>

            <rect x="30" y="400" width="540" height="44" rx="8" fill="rgba(15,23,42,0.85)" stroke={OB.dim} strokeWidth="1.5" />
            <text x="300" y="420" fill={OB.green} fontSize="13" fontWeight="bold" textAnchor="middle">
              Cicero found this tombstone overgrown with bushes in 75 BC, confirming Archimedes' wish.
            </text>
          </g>
        )}
      </svg>
    );
  }, [step, R, zoneSlices]);

  /* ═══════════════════════ TASK 2 SVG: CENTROID ═══════════════════ */
  const task2Canvas = useMemo(() => {
    return (
      <svg viewBox="0 0 600 460" className="w-full h-full" style={{background:'#0a0e1a'}}>
        <defs>
          <marker id="arrowR" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <path d="M 0 0 L 8 3 L 0 6 Z" fill={OB.gold} />
          </marker>
        </defs>

        {/* ── STEP 0: Law of the Lever ── */}
        {step === 0 && (
          <g>
            <rect x="30" y="12" width="540" height="32" rx="6" fill="rgba(6,182,212,0.12)" stroke={OB.cyan} strokeWidth="1.5" />
            <text x="300" y="34" fill={OB.cyan} fontSize="13" fontWeight="bold" textAnchor="middle">
              Step 1 — Law of the Lever: W₁ · d₁ = W₂ · d₂  (Equilibrium of Planes)
            </text>

            {/* Ground line */}
            <line x1="60" y1="360" x2="540" y2="360" stroke={OB.dim} strokeWidth="2" />

            {/* Fulcrum triangle */}
            <polygon points="300,280 270,360 330,360" fill={OB.gold} fillOpacity="0.8" stroke="#d97706" strokeWidth="2" />
            <text x="300" y="380" fill={OB.gold} fontSize="14" fontWeight="bold" textAnchor="middle">Fulcrum F</text>

            {/* Lever beam with tilt */}
            <g transform={`rotate(${tiltDeg}, 300, 280)`}>
              <rect x="80" y="268" width="440" height="14" rx="4" fill="#475569" stroke="#94a3b8" strokeWidth="1.5" />

              {/* Weight 1 (left) */}
              <g>
                <rect x="100" y="200" width="60" height="68" rx="6" fill="rgba(244,63,94,0.8)" stroke={OB.red} strokeWidth="2.5" />
                <text x="130" y="232" fill="#fff" fontSize="14" fontWeight="bold" textAnchor="middle">W₁</text>
                <text x="130" y="252" fill="rgba(255,255,255,0.7)" fontSize="12" textAnchor="middle">{w1}N</text>
              </g>

              {/* Weight 2 (right) */}
              <g>
                <rect x="440" y="200" width="60" height="68" rx="6" fill="rgba(16,185,129,0.8)" stroke={OB.green} strokeWidth="2.5" />
                <text x="470" y="232" fill="#fff" fontSize="14" fontWeight="bold" textAnchor="middle">W₂</text>
                <text x="470" y="252" fill="rgba(255,255,255,0.7)" fontSize="12" textAnchor="middle">{w2}N</text>
              </g>

              {/* Distance lines */}
              <line x1="130" y1="290" x2="300" y2="290" stroke={OB.red} strokeWidth="2" strokeDasharray="4,3" />
              <line x1="300" y1="290" x2="470" y2="290" stroke={OB.green} strokeWidth="2" strokeDasharray="4,3" />
              <text x="215" y="310" fill={OB.red} fontSize="14" fontWeight="bold" textAnchor="middle">d₁ = {d1}</text>
              <text x="385" y="310" fill={OB.green} fontSize="14" fontWeight="bold" textAnchor="middle">d₂ = {d2}</text>
            </g>

            {/* Torque readout */}
            <rect x="30" y="400" width="540" height="44" rx="8" fill="rgba(15,23,42,0.85)" stroke={OB.dim} strokeWidth="1.5" />
            <text x="170" y="420" fill={OB.red} fontSize="13" fontWeight="bold" textAnchor="middle">τ₁ = W₁·d₁ = {torque1}</text>
            <text x="430" y="420" fill={OB.green} fontSize="13" fontWeight="bold" textAnchor="middle">τ₂ = W₂·d₂ = {torque2}</text>
            <text x="300" y="438" fill={balanced ? OB.green : OB.gold} fontSize="13" fontWeight="bold" textAnchor="middle">
              {balanced ? '✓ EQUILIBRIUM — W₁d₁ = W₂d₂' : `⚠ Unbalanced — Δτ = ${Math.abs(torque1-torque2)}`}
            </text>
          </g>
        )}

        {/* ── STEP 1: Strip Method → centroid on medians ── */}
        {step === 1 && (
          <g>
            <rect x="25" y="10" width="550" height="34" rx="6" fill="rgba(99,102,241,0.15)" stroke="#6366f1" strokeWidth="1.5" />
            <text x="300" y="32" fill="#818cf8" fontSize="13" fontWeight="bold" textAnchor="middle">
              Step 2 — Strip Method: Centroid Lies on Median AD (and Medians BE &amp; CF)
            </text>

            {/* Triangle ABC */}
            <polygon points={`${A.x},${A.y} ${B.x},${B.y} ${C.x},${C.y}`}
              fill="rgba(99,102,241,0.08)" stroke="#6366f1" strokeWidth="2.5" />

            {/* Ghost medians for BE and CF to show intersection at G */}
            <line x1={B.x} y1={B.y} x2={midAC.x} y2={midAC.y} stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="4,4" opacity="0.45" />
            <line x1={C.x} y1={C.y} x2={midAB.x} y2={midAB.y} stroke="#a855f7" strokeWidth="1.5" strokeDasharray="4,4" opacity="0.45" />

            {/* Median AD (to midpoint of BC) */}
            <line x1={A.x} y1={A.y} x2={midBC.x} y2={midBC.y} stroke={OB.red} strokeWidth="3" />

            {/* Parallel horizontal strips */}
            {[0.22, 0.42, 0.62, 0.82].map((t, i) => {
              const ly = A.y + t * (B.y - A.y);
              const lxL = A.x + t * (B.x - A.x);
              const lxR = A.x + t * (C.x - A.x);
              const midX = (lxL + lxR) / 2;
              return (
                <g key={i}>
                  <line x1={lxL} y1={ly} x2={lxR} y2={ly} stroke={OB.gold} strokeWidth="2" strokeDasharray="4,3" />
                  <circle cx={midX} cy={ly} r="4.5" fill={OB.gold} stroke="#000" strokeWidth="1" />
                </g>
              );
            })}

            {/* Centroid intersection G */}
            <circle cx={G.x} cy={G.y} r="7" fill={OB.purple} stroke="#fff" strokeWidth="2" />
            <text x={G.x + 14} y={G.y + 4} fill={OB.purple} fontSize="15" fontWeight="bold">G (Centroid)</text>

            {/* Vertex labels */}
            <circle cx={A.x} cy={A.y} r="5" fill="#6366f1" />
            <text x={A.x} y={A.y - 12} fill="#e2e8f0" fontSize="15" fontWeight="bold" textAnchor="middle">A</text>
            <circle cx={B.x} cy={B.y} r="5" fill="#6366f1" />
            <text x={B.x - 14} y={B.y + 8} fill="#e2e8f0" fontSize="15" fontWeight="bold" textAnchor="middle">B</text>
            <circle cx={C.x} cy={C.y} r="5" fill="#6366f1" />
            <text x={C.x + 14} y={C.y + 8} fill="#e2e8f0" fontSize="15" fontWeight="bold" textAnchor="middle">C</text>
            <circle cx={midBC.x} cy={midBC.y} r="5" fill={OB.red} />
            <text x={midBC.x} y={midBC.y + 20} fill={OB.red} fontSize="13" fontWeight="bold" textAnchor="middle">D (midpoint of BC)</text>

            {/* Label for median */}
            <text x={A.x - 14} y={(A.y + G.y)/2} fill={OB.red} fontSize="12" fontWeight="bold" textAnchor="end">Median AD</text>

            {/* Bottom explanation card */}
            <rect x="25" y="385" width="550" height="66" rx="8" fill="rgba(15,23,42,0.92)" stroke={OB.dim} strokeWidth="1.5" />
            <text x="300" y="405" fill={OB.gold} fontSize="12" fontWeight="bold" textAnchor="middle">
              1. Slicing parallel to BC: every strip's center of gravity is its midpoint, all lying on AD.
            </text>
            <text x="300" y="423" fill="#38bdf8" fontSize="12" fontWeight="bold" textAnchor="middle">
              2. Slicing parallel to AC &amp; AB: centroid must also lie on medians BE &amp; CF.
            </text>
            <text x="300" y="441" fill="#34d399" fontSize="12" fontWeight="bold" textAnchor="middle">
              Conclusion: Centroid G is the intersection of all 3 medians! (Next: Prove the 2:1 ratio)
            </text>
          </g>
        )}

        {/* ── STEP 2: Three medians → PROVING THE 2:1 RATIO ── */}
        {step === 2 && (
          <g>
            <rect x="25" y="10" width="550" height="34" rx="6" fill="rgba(16,185,129,0.15)" stroke={OB.green} strokeWidth="1.5" />
            <text x="300" y="32" fill={OB.green} fontSize="13" fontWeight="bold" textAnchor="middle">
              Step 3 — Proving the 2 : 1 Ratio: Midline &amp; Similar Triangles
            </text>

            {/* Mode switch pills */}
            <g transform="translate(130, 48)">
              <rect
                x="0" y="0" width="165" height="22" rx="6"
                fill={ratioProofMode === 'similarity' ? '#0284c7' : '#1e293b'}
                stroke={ratioProofMode === 'similarity' ? '#38bdf8' : '#334155'}
                strokeWidth="1.5"
                className="cursor-pointer"
                onClick={() => setRatioProofMode('similarity')}
              />
              <text
                x="82" y="15"
                fill={ratioProofMode === 'similarity' ? '#ffffff' : '#94a3b8'}
                fontSize="10.5" fontWeight="bold" textAnchor="middle"
                className="cursor-pointer"
                onClick={() => setRatioProofMode('similarity')}
              >
                📐 Midline Similarity Proof
              </text>

              <rect
                x="175" y="0" width="165" height="22" rx="6"
                fill={ratioProofMode === 'areas' ? '#059669' : '#1e293b'}
                stroke={ratioProofMode === 'areas' ? '#34d399' : '#334155'}
                strokeWidth="1.5"
                className="cursor-pointer"
                onClick={() => setRatioProofMode('areas')}
              />
              <text
                x="257" y="15"
                fill={ratioProofMode === 'areas' ? '#ffffff' : '#94a3b8'}
                fontSize="10.5" fontWeight="bold" textAnchor="middle"
                className="cursor-pointer"
                onClick={() => setRatioProofMode('areas')}
              >
                ⚖️ Six Equal Areas Proof
              </text>
            </g>

            {/* 1. SIMILARITY PROOF VIEW */}
            {ratioProofMode === 'similarity' && (
              <g>
                {/* Base Triangle ABC */}
                <polygon points={`${A.x},${A.y} ${B.x},${B.y} ${C.x},${C.y}`}
                  fill="rgba(15,23,42,0.35)" stroke="#475569" strokeWidth="1.5" />

                {/* Shaded similar triangle 1: △ABG (Top-Left, base AB) */}
                <polygon points={`${A.x},${A.y} ${B.x},${B.y} ${G.x},${G.y}`}
                  fill="rgba(59,130,246,0.22)" stroke="#3b82f6" strokeWidth="2.5" />

                {/* Shaded similar triangle 2: △DEG (Bottom-Right, base DE) */}
                <polygon points={`${midBC.x},${midBC.y} ${midAC.x},${midAC.y} ${G.x},${G.y}`}
                  fill="rgba(16,185,129,0.25)" stroke="#10b981" strokeWidth="2.5" />

                {/* Midline DE connecting midpoints D & E */}
                <line x1={midBC.x} y1={midBC.y} x2={midAC.x} y2={midAC.y}
                  stroke={OB.gold} strokeWidth="3" strokeDasharray="6,3" />

                {/* Median AD (red) */}
                <line x1={A.x} y1={A.y} x2={midBC.x} y2={midBC.y} stroke={OB.red} strokeWidth="2.5" />

                {/* Median BE (blue) */}
                <line x1={B.x} y1={B.y} x2={midAC.x} y2={midAC.y} stroke={OB.blue} strokeWidth="2.5" />

                {/* Median CF (dashed light purple) */}
                <line x1={C.x} y1={C.y} x2={midAB.x} y2={midAB.y} stroke="#a855f7" strokeWidth="1.5" strokeDasharray="4,4" opacity="0.35" />

                {/* Parallel indicators on AB and DE */}
                <g transform="translate(220, 217.5) rotate(60.7)">
                  <path d="M -8 -4 L 0 0 L -8 4 M 0 -4 L 8 0 L 0 4" fill="none" stroke="#38bdf8" strokeWidth="2" />
                </g>
                <g transform="translate(340, 288.75) rotate(60.7)">
                  <path d="M -8 -4 L 0 0 L -8 4 M 0 -4 L 8 0 L 0 4" fill="none" stroke={OB.gold} strokeWidth="2" />
                </g>

                {/* Angle arcs indicating alternate interior angles */}
                {/* At A (∠GAB) */}
                <path d="M 300 102 A 28 28 0 0 1 286 99" fill="none" stroke="#f59e0b" strokeWidth="2" />
                <text x="282" y="114" fill="#f59e0b" fontSize="11" fontWeight="bold">α</text>

                {/* At D (∠GDE) */}
                <path d="M 300 332 A 28 28 0 0 1 314 336" fill="none" stroke="#f59e0b" strokeWidth="2" />
                <text x="318" y="330" fill="#f59e0b" fontSize="11" fontWeight="bold">α</text>

                {/* At B (∠GBA) */}
                <path d="M 166 332 A 28 28 0 0 1 170 348" fill="none" stroke="#38bdf8" strokeWidth="2" />
                <text x="180" y="340" fill="#38bdf8" fontSize="11" fontWeight="bold">β</text>

                {/* At E (∠GED) */}
                <path d="M 354 246 A 28 28 0 0 1 350 230" fill="none" stroke="#38bdf8" strokeWidth="2" />
                <text x="336" y="240" fill="#38bdf8" fontSize="11" fontWeight="bold">β</text>

                {/* Centroid G */}
                <circle cx={G.x} cy={G.y} r="7" fill={OB.purple} stroke="#fff" strokeWidth="2" />
                <text x={G.x + 14} y={G.y + 4} fill="#e2e8f0" fontSize="15" fontWeight="bold">G</text>

                {/* Base labels: AB = 2k, DE = 1k */}
                <rect x="135" y="155" width="68" height="20" rx="4" fill="rgba(2,132,199,0.85)" />
                <text x="169" y="169" fill="#ffffff" fontSize="10.5" fontWeight="bold" textAnchor="middle">Side AB = 2k</text>

                <rect x="345" y="295" width="82" height="20" rx="4" fill="rgba(217,119,6,0.9)" />
                <text x="386" y="309" fill="#ffffff" fontSize="10.5" fontWeight="bold" textAnchor="middle">Midline DE = 1k</text>

                {/* Dimension callouts along median AD: AG = 2x, GD = 1x */}
                <text x="282" y="170" fill={OB.red} fontSize="13" fontWeight="bold" textAnchor="end">AG = 2x</text>
                <text x="282" y="320" fill={OB.red} fontSize="13" fontWeight="bold" textAnchor="end">GD = 1x</text>

                {/* Vertex & midpoint labels */}
                <text x={A.x} y={A.y - 10} fill="#e2e8f0" fontSize="15" fontWeight="bold" textAnchor="middle">A</text>
                <text x={B.x - 14} y={B.y + 8} fill="#e2e8f0" fontSize="15" fontWeight="bold" textAnchor="middle">B</text>
                <text x={C.x + 14} y={C.y + 8} fill="#e2e8f0" fontSize="15" fontWeight="bold" textAnchor="middle">C</text>
                <text x={midBC.x} y={midBC.y + 20} fill={OB.gold} fontSize="13" fontWeight="bold" textAnchor="middle">D (mid BC)</text>
                <text x={midAC.x + 14} y={midAC.y} fill={OB.gold} fontSize="13" fontWeight="bold">E (mid AC)</text>

                {/* Detailed Proof Readout Panel */}
                <rect x="25" y="378" width="550" height="74" rx="8" fill="rgba(15,23,42,0.95)" stroke="#334155" strokeWidth="1.5" />
                <text x="300" y="398" fill="#38bdf8" fontSize="11.5" fontWeight="bold" textAnchor="middle">
                  1. Midline DE connects midpoints ⟹ DE ∥ AB  and  DE = ½ AB (Midline Theorem)
                </text>
                <text x="300" y="418" fill="#34d399" fontSize="11.5" fontWeight="bold" textAnchor="middle">
                  2. Alternate interior angles α &amp; β match ⟹ △ABG ∼ △DEG (AA Similar Triangles)
                </text>
                <text x="300" y="438" fill={OB.gold} fontSize="13" fontWeight="bold" textAnchor="middle">
                  3. AG / GD = AB / DE = 2 / 1  ⟹  AG : GD = 2 : 1  (G divides median 2:1!)
                </text>
              </g>
            )}

            {/* 2. EQUAL AREAS PROOF VIEW */}
            {ratioProofMode === 'areas' && (
              <g>
                {/* 6 Sub-triangles */}
                <polygon points={`${A.x},${A.y} ${G.x},${G.y} ${midAB.x},${midAB.y}`}
                  fill="rgba(239,68,68,0.22)" stroke="#ef4444" strokeWidth="1.5" />
                <polygon points={`${B.x},${B.y} ${G.x},${G.y} ${midAB.x},${midAB.y}`}
                  fill="rgba(249,115,22,0.22)" stroke="#f97316" strokeWidth="1.5" />
                <polygon points={`${B.x},${B.y} ${G.x},${G.y} ${midBC.x},${midBC.y}`}
                  fill="rgba(234,179,8,0.25)" stroke="#eab308" strokeWidth="1.5" />
                <polygon points={`${C.x},${C.y} ${G.x},${G.y} ${midBC.x},${midBC.y}`}
                  fill="rgba(34,197,94,0.22)" stroke="#22c55e" strokeWidth="1.5" />
                <polygon points={`${C.x},${C.y} ${G.x},${G.y} ${midAC.x},${midAC.y}`}
                  fill="rgba(6,182,212,0.22)" stroke="#06b6d4" strokeWidth="1.5" />
                <polygon points={`${A.x},${A.y} ${G.x},${G.y} ${midAC.x},${midAC.y}`}
                  fill="rgba(168,85,247,0.22)" stroke="#a855f7" strokeWidth="1.5" />

                {/* 3 Medians */}
                <line x1={A.x} y1={A.y} x2={midBC.x} y2={midBC.y} stroke={OB.red} strokeWidth="2.5" />
                <line x1={B.x} y1={B.y} x2={midAC.x} y2={midAC.y} stroke={OB.blue} strokeWidth="2" />
                <line x1={C.x} y1={C.y} x2={midAB.x} y2={midAB.y} stroke={OB.purple} strokeWidth="2" />

                {/* Area badges in each triangle */}
                <text x="260" y="170" fill="#fca5a5" fontSize="12" fontWeight="bold">⅙ Δ</text>
                <text x="210" y="270" fill="#fdba74" fontSize="12" fontWeight="bold">⅙ Δ</text>
                <text x="240" y="340" fill="#fde047" fontSize="12" fontWeight="bold">⅙ Δ</text>
                <text x="350" y="340" fill="#86efac" fontSize="12" fontWeight="bold">⅙ Δ</text>
                <text x="390" y="270" fill="#67e8f9" fontSize="12" fontWeight="bold">⅙ Δ</text>
                <text x="340" y="170" fill="#d8b4fe" fontSize="12" fontWeight="bold">⅙ Δ</text>

                {/* Vertices & Midpoints */}
                <circle cx={A.x} cy={A.y} r="4" fill="#e2e8f0" />
                <text x={A.x} y={A.y - 10} fill="#e2e8f0" fontSize="14" fontWeight="bold" textAnchor="middle">A</text>
                <circle cx={B.x} cy={B.y} r="4" fill="#e2e8f0" />
                <text x={B.x - 14} y={B.y + 6} fill="#e2e8f0" fontSize="14" fontWeight="bold" textAnchor="middle">B</text>
                <circle cx={C.x} cy={C.y} r="4" fill="#e2e8f0" />
                <text x={C.x + 14} y={C.y + 6} fill="#e2e8f0" fontSize="14" fontWeight="bold" textAnchor="middle">C</text>
                <circle cx={midBC.x} cy={midBC.y} r="4" fill={OB.red} />
                <text x={midBC.x} y={midBC.y + 20} fill={OB.red} fontSize="13" fontWeight="bold" textAnchor="middle">D</text>

                {/* Centroid G */}
                <circle cx={G.x} cy={G.y} r="7" fill={OB.purple} stroke="#fff" strokeWidth="2" />
                <text x={G.x + 14} y={G.y - 6} fill={OB.purple} fontSize="15" fontWeight="bold">G</text>

                {/* Bottom Readout for Areas */}
                <rect x="25" y="378" width="550" height="74" rx="8" fill="rgba(15,23,42,0.95)" stroke="#334155" strokeWidth="1.5" />
                <text x="300" y="398" fill="#fde047" fontSize="11.5" fontWeight="bold" textAnchor="middle">
                  Every median bisects area ⟹ Medians divide △ABC into 6 equal areas of ⅙ Δ
                </text>
                <text x="300" y="418" fill="#38bdf8" fontSize="11.5" fontWeight="bold" textAnchor="middle">
                  Area(△ABG) = ⅙ + ⅙ = 2/6 Δ   and   Area(△BGD) = ⅙ Δ
                </text>
                <text x="300" y="438" fill={OB.green} fontSize="13" fontWeight="bold" textAnchor="middle">
                  Both share altitude from B onto line AD  ⟹  Base Ratio AG : GD = (2/6)/(1/6) = 2 : 1!
                </text>
              </g>
            )}
          </g>
        )}

        {/* ── STEP 3: Mechanical Method & Exact Centroid at 3/5 h ── */}
        {step === 3 && (
          <g>
            <rect x="25" y="10" width="550" height="34" rx="6" fill="rgba(6,182,212,0.18)" stroke={OB.cyan} strokeWidth="1.5" />
            <text x="300" y="32" fill={OB.cyan} fontSize="13" fontWeight="bold" textAnchor="middle">
              Step 4 — Why Parabolic Centroid is at ⅗ Height (Ratio 3 : 2)
            </text>

            {/* Mode switch pills */}
            <g transform="translate(130, 48)">
              <rect
                x="0" y="0" width="165" height="22" rx="6"
                fill={parabolaProofMode === 'mechanical' ? '#0891b2' : '#1e293b'}
                stroke={parabolaProofMode === 'mechanical' ? '#22d3ee' : '#334155'}
                strokeWidth="1.5"
                className="cursor-pointer"
                onClick={() => setParabolaProofMode('mechanical')}
              />
              <text
                x="82" y="15"
                fill={parabolaProofMode === 'mechanical' ? '#ffffff' : '#94a3b8'}
                fontSize="10.5" fontWeight="bold" textAnchor="middle"
                className="cursor-pointer"
                onClick={() => setParabolaProofMode('mechanical')}
              >
                ⚖️ Archimedes' Lever Balance
              </text>

              <rect
                x="175" y="0" width="165" height="22" rx="6"
                fill={parabolaProofMode === 'derivation' ? '#059669' : '#1e293b'}
                stroke={parabolaProofMode === 'derivation' ? '#34d399' : '#334155'}
                strokeWidth="1.5"
                className="cursor-pointer"
                onClick={() => setParabolaProofMode('derivation')}
              />
              <text
                x="257" y="15"
                fill={parabolaProofMode === 'derivation' ? '#ffffff' : '#94a3b8'}
                fontSize="10.5" fontWeight="bold" textAnchor="middle"
                className="cursor-pointer"
                onClick={() => setParabolaProofMode('derivation')}
              >
                📐 Moment &amp; Area Derivation
              </text>
            </g>

            {/* 1. ARCHIMEDES' LEVER BALANCE VIEW */}
            {parabolaProofMode === 'mechanical' && (
              <g>
                {/* Fulcrum and Ground */}
                <polygon points="260,210 240,270 280,270" fill={OB.gold} fillOpacity="0.85" stroke="#d97706" strokeWidth="2" />
                <line x1="60" y1="270" x2="540" y2="270" stroke={OB.dim} strokeWidth="2" />
                <text x="260" y="288" fill={OB.gold} fontSize="12" fontWeight="bold" textAnchor="middle">Fulcrum V</text>

                {/* Lever Beam */}
                <rect x="70" y="200" width="460" height="12" rx="3" fill="#475569" stroke="#94a3b8" strokeWidth="1.5" />

                {/* Left Arm: Counterweight suspended at distance h */}
                <line x1="100" y1="206" x2="100" y2="100" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="3,3" />
                {/* Distance marker h on left arm */}
                <line x1="100" y1="180" x2="260" y2="180" stroke="#f43f5e" strokeWidth="2" strokeDasharray="4,3" />
                <text x="180" y="174" fill="#f43f5e" fontSize="11" fontWeight="bold" textAnchor="middle">Arm Length = h</text>

                {/* Left Weight block: Area = 4/5 bh */}
                <g transform="translate(65, 80)">
                  <rect x="0" y="0" width="70" height="60" rx="8" fill="rgba(244,63,94,0.85)" stroke="#fb7185" strokeWidth="2" />
                  <text x="35" y="24" fill="#fff" fontSize="10.5" fontWeight="bold" textAnchor="middle">Reference</text>
                  <text x="35" y="44" fill="#fecdd3" fontSize="13" fontWeight="extrabold" textAnchor="middle">⁴⁄₅ bh</text>
                  <text x="35" y="74" fill="#f43f5e" fontSize="10" fontWeight="bold" textAnchor="middle">At Distance h</text>
                </g>

                {/* Right Arm: Parabolic Segment mounted from x=260 to x=420 (length h = 160) */}
                <g transform="translate(260, 206)">
                  {/* Axis line of parabola */}
                  <line x1="0" y1="0" x2="160" y2="0" stroke={OB.cyan} strokeWidth="2" strokeDasharray="4,2" />
                  
                  {/* Miniature Parabola on lever */}
                  <path
                    d="M 160 -45 Q 0 0 160 45 Z"
                    fill="rgba(6,182,212,0.25)"
                    stroke={OB.cyan}
                    strokeWidth="2"
                  />
                  {/* Base chord */}
                  <line x1="160" y1="-45" x2="160" y2="45" stroke={OB.gold} strokeWidth="2.5" />
                  <text x="165" y="4" fill={OB.gold} fontSize="11" fontWeight="bold">Base (2b)</text>

                  {/* Slices representation */}
                  {[0.25, 0.5, 0.75].map((s, idx) => (
                    <line key={idx} x1={160 * s} y1={-45 * Math.sqrt(s)} x2={160 * s} y2={45 * Math.sqrt(s)}
                      stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeDasharray="2,2" />
                  ))}

                  {/* Centroid at 3/5 h = 0.6 * 160 = 96 */}
                  <line x1="96" y1="0" x2="96" y2="-75" stroke="#a855f7" strokeWidth="2" strokeDasharray="3,3" />
                  <circle cx="96" cy="0" r="6" fill="#a855f7" stroke="#fff" strokeWidth="2" />
                  <text x="96" y="16" fill="#a855f7" fontSize="11" fontWeight="bold" textAnchor="middle">Centroid G</text>
                </g>

                {/* Right Weight badge: Parabola total area = 4/3 bh suspended at G */}
                <g transform="translate(320, 80)">
                  <rect x="0" y="0" width="76" height="60" rx="8" fill="rgba(6,182,212,0.85)" stroke="#67e8f9" strokeWidth="2" />
                  <text x="38" y="24" fill="#fff" fontSize="10.5" fontWeight="bold" textAnchor="middle">Parabola Area</text>
                  <text x="38" y="44" fill="#cffafe" fontSize="13" fontWeight="extrabold" textAnchor="middle">⁴⁄₃ bh</text>
                  <text x="38" y="74" fill="#22d3ee" fontSize="10" fontWeight="bold" textAnchor="middle">At x̄ = ⅗ h</text>
                </g>

                {/* Distance marker x̄ = 3/5 h on right arm */}
                <line x1="260" y1="180" x2="356" y2="180" stroke="#a855f7" strokeWidth="2" strokeDasharray="4,3" />
                <text x="308" y="174" fill="#a855f7" fontSize="11" fontWeight="bold" textAnchor="middle">x̄ = ⅗ h</text>

                {/* Equilibrium indicator */}
                <rect x="210" y="80" width="100" height="24" rx="6" fill="rgba(16,185,129,0.2)" stroke="#10b981" strokeWidth="1.5" />
                <text x="260" y="96" fill="#34d399" fontSize="11" fontWeight="extrabold" textAnchor="middle">✓ BALANCE</text>

                {/* Mathematical torque balance card */}
                <rect x="25" y="378" width="550" height="74" rx="8" fill="rgba(15,23,42,0.95)" stroke="#334155" strokeWidth="1.5" />
                <text x="300" y="398" fill="#f43f5e" fontSize="11.5" fontWeight="bold" textAnchor="middle">
                  Left Arm Torque: τ_left = (Reference Weight) · h = (⁴⁄₅ bh) · h = ⁴⁄₅ bh²
                </text>
                <text x="300" y="418" fill="#22d3ee" fontSize="11.5" fontWeight="bold" textAnchor="middle">
                  Right Arm Torque: τ_right = (Parabola Area) · x̄ = (⁴⁄₃ bh) · x̄
                </text>
                <text x="300" y="438" fill={OB.gold} fontSize="13" fontWeight="bold" textAnchor="middle">
                  Equilibrium: (⁴⁄₃ bh) · x̄ = (⁴⁄₅ bh) · h  ⟹  x̄ = (⁴⁄₅) / (⁴⁄₃) · h = ⅗ h!  (Ratio 3 : 2)
                </text>
              </g>
            )}

            {/* 2. MATHEMATICAL INTEGRATION DERIVATION VIEW */}
            {parabolaProofMode === 'derivation' && (
              <g>
                {/* Full upright Parabola */}
                <path d={parabolaPath} fill="rgba(6,182,212,0.18)" stroke={OB.cyan} strokeWidth="2.5" />

                {/* Base line */}
                <line x1="160" y1="355" x2="440" y2="355" stroke={OB.gold} strokeWidth="2.5" />
                <text x="300" y="372" fill={OB.gold} fontSize="12" fontWeight="bold" textAnchor="middle">Base Chord (width = 2b)</text>

                {/* Axis of symmetry */}
                <line x1="300" y1="75" x2="300" y2="355" stroke="#64748b" strokeWidth="2" strokeDasharray="4,4" />

                {/* Vertex V */}
                <circle cx="300" cy="75" r="5" fill={OB.cyan} stroke="#fff" strokeWidth="1.5" />
                <text x="300" y="66" fill={OB.cyan} fontSize="13" fontWeight="bold" textAnchor="middle">Vertex V (x = 0)</text>

                {/* Sample horizontal slice at x = 140 (y = 215) */}
                <g>
                  {/* Slice bar */}
                  <rect x="200" y="212" width="200" height="6" fill="#f59e0b" fillOpacity="0.75" stroke="#d97706" strokeWidth="1" />
                  {/* Distance from vertex to slice */}
                  <line x1="425" y1="75" x2="425" y2="215" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="3,2" />
                  <text x="435" y="150" fill="#f59e0b" fontSize="11" fontWeight="bold">Distance x</text>

                  {/* Slice width label */}
                  <text x="300" y="208" fill="#fef08a" fontSize="10.5" fontWeight="bold" textAnchor="middle">
                    Slice Width w(x) = 2b√(x/h)
                  </text>
                </g>

                {/* Centroid G at y = 75 + 0.6 * 280 = 243 */}
                <circle cx="300" cy="243" r="7" fill="#ef4444" stroke="#fff" strokeWidth="2" />
                <text x="316" y="244" fill="#ef4444" fontSize="13" fontWeight="bold">Centroid G</text>
                <text x="316" y="258" fill="#fca5a5" fontSize="10.5" fontWeight="semibold">x̄ = ⅗ h (from V)</text>

                {/* 3:2 Ratio bracket along left */}
                {/* 3 parts (vertex to G) */}
                <line x1="135" y1="75" x2="135" y2="243" stroke="#22d3ee" strokeWidth="2.5" />
                <polyline points="130,75 135,75 135,243 130,243" fill="none" stroke="#22d3ee" strokeWidth="2" />
                <text x="122" y="164" fill="#22d3ee" fontSize="12" fontWeight="extrabold" textAnchor="end">3 parts</text>
                <text x="122" y="180" fill="#a5f3fc" fontSize="10" textAnchor="end">(⅗ h = 60%)</text>

                {/* 2 parts (G to base) */}
                <line x1="135" y1="243" x2="135" y2="355" stroke="#f59e0b" strokeWidth="2.5" />
                <polyline points="130,243 135,243 135,355 130,355" fill="none" stroke="#f59e0b" strokeWidth="2" />
                <text x="122" y="300" fill="#f59e0b" fontSize="12" fontWeight="extrabold" textAnchor="end">2 parts</text>
                <text x="122" y="316" fill="#fde68a" fontSize="10" textAnchor="end">(⅖ h = 40%)</text>

                {/* Step-by-step calculus / quadrature panel */}
                <rect x="25" y="378" width="550" height="74" rx="8" fill="rgba(15,23,42,0.95)" stroke="#334155" strokeWidth="1.5" />
                <text x="300" y="398" fill="#22d3ee" fontSize="11" fontWeight="bold" textAnchor="middle">
                  1. Total Area: A = ∫₀ʰ 2b√(x/h) dx = 2b/√h · [ ⅔ x^(3/2) ]₀ʰ = ⁴⁄₃ bh (Quadrature of Parabola)
                </text>
                <text x="300" y="418" fill="#f59e0b" fontSize="11" fontWeight="bold" textAnchor="middle">
                  2. First Moment (Torque): M = ∫₀ʰ x · (2b√(x/h)) dx = 2b/√h · [ ⅖ x^(5/2) ]₀ʰ = ⁴⁄₅ bh²
                </text>
                <text x="300" y="438" fill={OB.gold} fontSize="13" fontWeight="bold" textAnchor="middle">
                  3. Centroid: x̄ = M / A = (⁴⁄₅ bh²) / (⁴⁄₃ bh) = (4/5) / (4/3) · h = ⅗ h  ⟹  Ratio is 3 : 2!
                </text>
              </g>
            )}
          </g>
        )}
      </svg>
    );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, triGeo, w1, w2, d1, d2, torque1, torque2, balanced, tiltDeg, ratioProofMode, parabolaProofMode, parabolaPath]);

  /* ═══════════════════════ LEFT SIDEBAR ═══════════════════════ */
  const leftPanel = (
    <div className="flex flex-col gap-3 h-full">
      {/* Header card */}
      <div className="bg-slate-900/90 border border-cyan-500/40 rounded-2xl p-4 shadow-xl shrink-0">
        <div className="flex items-center justify-between text-xs font-mono text-cyan-400 uppercase tracking-wider mb-1">
          <span>{activeSubtask === 1 ? 'TASK 1: ON THE SPHERE & CYLINDER' : 'TASK 2: EQUILIBRIUM OF PLANES'}</span>
          <span className="text-amber-400 font-bold">c. 250 BC</span>
        </div>
        <h2 className="text-base font-serif font-bold text-white flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-cyan-400" />
          <span>{activeSubtask === 1 ? 'Surface Area of a Sphere' : 'The Centroid Theorem & Lever'}</span>
        </h2>
        <p className="text-xs text-slate-300 mt-1 leading-relaxed">
          {activeSubtask === 1
            ? 'Discover how Archimedes proved that a sphere\'s surface area is 4πR² — exactly 2/3 of its circumscribed cylinder.'
            : 'Explore the Law of the Lever, median concurrence, and the exact geometric proof of the 2:1 centroid ratio.'}
        </p>
      </div>

      {/* Proof Step Navigator (compact) */}
      <div className="bg-slate-900/90 border border-cyan-500/20 rounded-2xl p-3 shadow-xl shrink-0">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase">
            {activeSubtask === 1 ? 'On the Sphere & Cylinder' : 'Equilibrium of Planes'} • Proof
          </span>
          <span className="text-[10px] font-mono text-emerald-400 font-bold">Q.E.D.</span>
        </div>
        <div className="flex gap-1 mb-2">
          {[0,1,2,3].map(i => (
            <div key={i} className={`h-1.5 flex-1 rounded-full transition-all ${
              i === step ? 'bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.6)]' : i < step ? 'bg-emerald-500' : 'bg-slate-800'
            }`} />
          ))}
        </div>
        <div className="text-[11px] text-slate-300 leading-relaxed mb-2">
          {activeSubtask === 1 ? (
            <>
              {step===0 && 'Step 1: Enclose a sphere of radius R inside a right cylinder of radius R and height H = 2R.'}
              {step===1 && 'Step 2: At any point P on the sphere, the slant height D of a thin zone and the vertical drop d form a right triangle similar to the triangle of local radius r and sphere radius R. So d/D = r/R, giving D = dR/r. Zone Area = 2πr · D = 2πr · dR/r = 2πR·d. The r cancels!'}
              {step===2 && 'Step 3: Sum all zones: Σ 2πR·Δh = 2πR·(2R) = 4πR². The sphere equals exactly 4 great circles.'}
              {step===3 && 'Step 4: Sphere Area = 4πR², Cylinder Total = 6πR². Ratio = 4/6 = 2/3. (Q.E.D.)'}
            </>
          ) : (
            <>
              {step===0 && 'Step 1 (Law of the Lever): Magnitudes balance at distances inversely proportional to their weights: W₁·d₁ = W₂·d₂.'}
              {step===1 && (
                <div>
                  <strong className="text-cyan-300">Step 2 (Strip Method &amp; Concurrence):</strong> Slicing △ABC into horizontal strips parallel to BC proves the centroid must lie on median AD (every strip balances at its midpoint). Slicing parallel to AC and AB similarly places it on medians BE and CF. Therefore, all 3 medians intersect concurrently at centroid G!
                  <span className="block mt-1 text-emerald-400 font-semibold text-[10.5px]">Next: But WHERE along the median does G lie? Click Next to see the proof of the 2:1 ratio.</span>
                </div>
              )}
              {step===2 && (
                <div className="space-y-1 text-[11px]">
                  <div className="font-bold text-emerald-400">Step 3 (Proof of the 2:1 Centroid Ratio):</div>
                  <div>
                    <span className="text-amber-300 font-semibold">1. Midline:</span> Connect midpoints D (of BC) &amp; E (of AC). By the Midline Theorem, <span className="font-mono text-cyan-300">DE ∥ AB</span> and <span className="font-mono text-cyan-300">DE = ½ AB</span>.
                  </div>
                  <div>
                    <span className="text-amber-300 font-semibold">2. Similar Triangles:</span> Alternate interior angles match across parallel lines (<span className="font-mono text-amber-200">∠GAB = ∠GDE</span>, <span className="font-mono text-cyan-200">∠GBA = ∠GED</span>), so <span className="font-mono text-emerald-300">△ABG ∼ △DEG</span> (AA similarity).
                  </div>
                  <div>
                    <span className="text-amber-300 font-semibold">3. Ratio:</span> <span className="font-mono text-amber-300">AG / GD = AB / DE = AB / (½ AB) = 2 : 1</span>!
                  </div>
                  <div className="text-slate-400 text-[10px] italic">
                    Centroid G divides every median at ⅔ from the vertex and ⅓ from the base (AG = 2·GD). Toggle between Similarity and Equal Areas on the canvas!
                  </div>
                </div>
              )}
              {step===3 && (
                <div className="space-y-1 text-[11px]">
                  <div className="font-bold text-cyan-400">Step 4 (Proof: Parabolic Centroid at ⅗ Height):</div>
                  <div>
                    <span className="text-amber-300 font-semibold">1. Slice Width:</span> Parabola <span className="font-mono text-cyan-200">y² = (b²/h)x</span> gives slice width <span className="font-mono text-cyan-200">w(x) = 2b√(x/h)</span>.
                  </div>
                  <div>
                    <span className="text-amber-300 font-semibold">2. Total Area:</span> Archimedes' Quadrature proves <span className="font-mono text-emerald-300">Area = ⁴⁄₃ bh</span> (four-thirds of the inscribed triangle).
                  </div>
                  <div>
                    <span className="text-amber-300 font-semibold">3. Lever Torque / Moment:</span> Slice at distance x exerts torque <span className="font-mono text-amber-200">x · w(x) dx</span>. Summing gives <span className="font-mono text-emerald-300">Total Moment = ⁴⁄₅ bh²</span>.
                  </div>
                  <div>
                    <span className="text-amber-300 font-semibold">4. Centroid Location:</span> By center of gravity definition, <span className="font-mono text-amber-300">x̄ = Moment / Area = (⁴⁄₅ bh²) / (⁴⁄₃ bh) = ⅗ h</span>!
                  </div>
                  <div className="text-slate-400 text-[10px] italic">
                    Centroid G divides the axis into 3 parts from the vertex and 2 parts from the base (ratio 3 : 2). Toggle between the Lever Balance and Moment Derivation on the canvas!
                  </div>
                </div>
              )}
            </>
          )}
        </div>
        <div className="flex items-center justify-between">
          <button onClick={() => setStep(Math.max(0, step - 1))} disabled={step===0}
            className="px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-950 border border-slate-800 text-slate-300 disabled:opacity-40 transition cursor-pointer">
            ‹ Prev
          </button>
          <span className="text-xs font-mono font-bold text-cyan-400">Step {step+1}/4</span>
          <button onClick={() => setStep(Math.min(3, step + 1))} disabled={step===3}
            className="px-2.5 py-1 rounded-lg text-xs font-extrabold bg-cyan-500 text-slate-950 disabled:opacity-40 transition cursor-pointer">
            Next ›
          </button>
        </div>
      </div>

      {/* Quiz Panel */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3 shadow-xl flex-1 flex flex-col justify-between overflow-y-auto custom-scrollbar">
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-mono font-bold text-cyan-400">Q{qIdx+1}/{questions.length}</span>
            <span className="text-[10px] font-mono text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">{curQ.concept}</span>
          </div>
          <div className="flex gap-1 mb-2">
            {questions.map((_,i) => (
              <div key={i} className={`h-1.5 flex-1 rounded-full transition-all ${
                i===qIdx ? 'bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.6)]' : answers[i]!==undefined ? 'bg-emerald-500' : 'bg-slate-800'
              }`} />
            ))}
          </div>
          <h4 className="text-xs font-semibold text-white mb-2 leading-snug">{curQ.question}</h4>
          <div className="space-y-1.5 mb-2">
            {curQ.options.map((opt, i) => {
              const sel = answers[qIdx] === i;
              return (
                <button key={i} onClick={() => selectOpt(i)}
                  className={`w-full text-left p-2 rounded-xl text-xs transition border cursor-pointer flex items-start gap-2 ${
                    sel ? 'bg-cyan-950/70 border-cyan-400 text-cyan-200 font-semibold shadow-[0_0_10px_rgba(6,182,212,0.2)]'
                      : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800/60 hover:text-white'}`}>
                  <span className={`w-4 h-4 rounded-full border text-[10px] flex items-center justify-center font-mono shrink-0 mt-0.5 ${
                    sel ? 'border-cyan-400 bg-cyan-500 text-slate-950 font-bold' : 'border-slate-700 text-slate-400'}`}>
                    {String.fromCharCode(65+i)}
                  </span>
                  <span className="leading-tight">{opt}</span>
                </button>
              );
            })}
          </div>
          {feedback && (
            <div className={`p-2 rounded-xl text-xs mb-2 border leading-tight ${
              success ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300 font-semibold' : 'bg-amber-950/80 border-amber-500 text-amber-300'}`}>
              {feedback}
            </div>
          )}
          {answers[qIdx] !== undefined && (
            <div className="bg-slate-950/80 p-2 rounded-xl border border-slate-800 text-[11px] text-slate-300 leading-relaxed">
              <span className="text-cyan-400 font-bold font-mono">Explanation: </span>{curQ.explanation}
            </div>
          )}
        </div>
        <div className="flex items-center justify-between pt-2 border-t border-slate-800 mt-2">
          <button onClick={prevQ} disabled={qIdx===0}
            className="px-3 py-1 rounded-lg text-xs font-bold bg-slate-950 border border-slate-800 text-slate-300 disabled:opacity-40 transition cursor-pointer">Prev</button>
          {submitted ? (
            <button onClick={resetQuiz}
              className="px-3 py-1 rounded-lg text-xs font-bold bg-slate-800 text-white hover:bg-slate-700 transition flex items-center gap-1 cursor-pointer">
              <RotateCcw className="w-3.5 h-3.5" /> Retry
            </button>
          ) : (
            <button onClick={nextQ}
              className="px-4 py-1 rounded-lg text-xs font-extrabold bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-lg transition cursor-pointer">
              {qIdx === questions.length - 1 ? 'Submit' : 'Next'}
            </button>
          )}
        </div>
      </div>
    </div>
  );

  /* ═══════════════════════ CANVAS ═══════════════════════ */
  const canvas = (
    <div className="absolute inset-0 w-full h-full flex items-center justify-center p-4">
      {activeSubtask === 1 ? task1Canvas : task2Canvas}
    </div>
  );

  return (
    <LevelShell
      title="Level 7: Archimedes of Syracuse"
      activeSubtask={activeSubtask}
      completedSubtasks={completedSubtasks}
      canvas={canvas}
    >
      {leftPanel}
    </LevelShell>
  );
}
