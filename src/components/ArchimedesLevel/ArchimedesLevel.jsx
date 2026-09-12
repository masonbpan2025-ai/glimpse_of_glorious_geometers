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
  const w1 = 40, d1 = 60, w2 = 60, d2 = 40;
  const triAy = 90, triAx = 0;

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
    const _A = { x: 300 + triAx, y: 80 - triAy };
    const _B = { x: 140, y: 370 };
    const _C = { x: 460, y: 370 };
    const _G = { x: (_A.x+_B.x+_C.x)/3, y: (_A.y+_B.y+_C.y)/3 };
    const _midBC = { x: (_B.x+_C.x)/2, y: (_B.y+_C.y)/2 };
    const _midAC = { x: (_A.x+_C.x)/2, y: (_A.y+_C.y)/2 };
    const _midAB = { x: (_A.x+_B.x)/2, y: (_A.y+_B.y)/2 };
    const _AG = Math.hypot(_G.x-_A.x, _G.y-_A.y);
    const _GD = Math.hypot(_midBC.x-_G.x, _midBC.y-_G.y);
    const _ratio = _GD > 0 ? (_AG/_GD).toFixed(2) : '2.00';
    return { A: _A, B: _B, C: _C, G: _G, midBC: _midBC, midAC: _midAC, midAB: _midAB, ratio: _ratio };
  }, []);
  const { A, B, C, G, midBC, midAC, midAB, ratio } = triGeo;

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

        {/* ── STEP 1: Strip Method → centroid on median ── */}
        {step === 1 && (
          <g>
            <rect x="30" y="12" width="540" height="32" rx="6" fill="rgba(99,102,241,0.15)" stroke="#6366f1" strokeWidth="1.5" />
            <text x="300" y="34" fill="#818cf8" fontSize="13" fontWeight="bold" textAnchor="middle">
              Step 2 — Strip Method: midpoints of horizontal strips lie on median AD
            </text>

            {/* Triangle ABC */}
            <polygon points={`${A.x},${A.y} ${B.x},${B.y} ${C.x},${C.y}`}
              fill="rgba(99,102,241,0.12)" stroke="#6366f1" strokeWidth="2.5" />

            {/* Median AD (to midpoint of BC) */}
            <line x1={A.x} y1={A.y} x2={midBC.x} y2={midBC.y} stroke={OB.red} strokeWidth="2.5" strokeDasharray="6,4" />

            {/* Parallel strips */}
            {[0.25, 0.45, 0.65, 0.85].map((t, i) => {
              const ly = A.y + t * (B.y - A.y);
              const lxL = A.x + t * (B.x - A.x);
              const lxR = A.x + t * (C.x - A.x);
              const midX = (lxL + lxR) / 2;
              return (
                <g key={i}>
                  <line x1={lxL} y1={ly} x2={lxR} y2={ly} stroke={OB.gold} strokeWidth="2" />
                  <circle cx={midX} cy={ly} r="4" fill={OB.gold} />
                </g>
              );
            })}

            {/* Vertex labels */}
            <circle cx={A.x} cy={A.y} r="5" fill="#6366f1" />
            <text x={A.x} y={A.y - 14} fill="#e2e8f0" fontSize="16" fontWeight="bold" textAnchor="middle">A</text>
            <circle cx={B.x} cy={B.y} r="5" fill="#6366f1" />
            <text x={B.x - 16} y={B.y + 6} fill="#e2e8f0" fontSize="16" fontWeight="bold" textAnchor="middle">B</text>
            <circle cx={C.x} cy={C.y} r="5" fill="#6366f1" />
            <text x={C.x + 16} y={C.y + 6} fill="#e2e8f0" fontSize="16" fontWeight="bold" textAnchor="middle">C</text>
            <circle cx={midBC.x} cy={midBC.y} r="5" fill={OB.red} />
            <text x={midBC.x} y={midBC.y + 22} fill={OB.red} fontSize="14" fontWeight="bold" textAnchor="middle">D (midpoint of BC)</text>

            {/* Label for median */}
            <text x={(A.x+midBC.x)/2 + 18} y={(A.y+midBC.y)/2} fill={OB.red} fontSize="13" fontWeight="bold">Median AD</text>

            <rect x="30" y="400" width="540" height="44" rx="8" fill="rgba(15,23,42,0.85)" stroke={OB.dim} strokeWidth="1.5" />
            <text x="300" y="418" fill={OB.gold} fontSize="13" fontWeight="bold" textAnchor="middle">
              Each strip's midpoint (gold dots) lies exactly on median AD
            </text>
            <text x="300" y="436" fill="#94a3b8" fontSize="11" textAnchor="middle">
              Therefore the center of gravity must lie somewhere on median AD
            </text>
          </g>
        )}

        {/* ── STEP 2: Three medians → centroid at 2:1 ── */}
        {step === 2 && (
          <g>
            <rect x="30" y="12" width="540" height="32" rx="6" fill="rgba(16,185,129,0.15)" stroke={OB.green} strokeWidth="1.5" />
            <text x="300" y="34" fill={OB.green} fontSize="13" fontWeight="bold" textAnchor="middle">
              Step 3 — All three medians intersect at centroid G, dividing each 2 : 1
            </text>

            {/* Triangle fill */}
            <polygon points={`${A.x},${A.y} ${B.x},${B.y} ${C.x},${C.y}`}
              fill="rgba(16,185,129,0.08)" stroke={OB.green} strokeWidth="2.5" />

            {/* Median AD (red) */}
            <line x1={A.x} y1={A.y} x2={midBC.x} y2={midBC.y} stroke={OB.red} strokeWidth="2.5" />
            {/* Median BE (blue) — B to midpoint(AC) */}
            <line x1={B.x} y1={B.y} x2={midAC.x} y2={midAC.y} stroke={OB.blue} strokeWidth="2" />
            {/* Median CF (gold) — C to midpoint(AB) */}
            <line x1={C.x} y1={C.y} x2={midAB.x} y2={midAB.y} stroke={OB.gold} strokeWidth="2" />

            {/* Centroid G */}
            <circle cx={G.x} cy={G.y} r="8" fill={OB.purple} stroke="#fff" strokeWidth="2" />
            <text x={G.x + 16} y={G.y - 6} fill={OB.purple} fontSize="16" fontWeight="bold">G</text>

            {/* AG and GD dimension marks */}
            <circle cx={A.x} cy={A.y} r="5" fill={OB.red} />
            <circle cx={midBC.x} cy={midBC.y} r="5" fill={OB.red} />
            {/* AG bracket */}
            <line x1={A.x - 14} y1={A.y} x2={G.x - 14} y2={G.y} stroke="#e2e8f0" strokeWidth="1.5" />
            <text x={A.x - 28} y={(A.y + G.y)/2 + 4} fill="#e2e8f0" fontSize="12" fontWeight="bold" textAnchor="end">AG</text>
            {/* GD bracket */}
            <line x1={G.x - 14} y1={G.y} x2={midBC.x - 14} y2={midBC.y} stroke="#94a3b8" strokeWidth="1.5" />
            <text x={G.x - 28} y={(G.y + midBC.y)/2 + 4} fill="#94a3b8" fontSize="12" fontWeight="bold" textAnchor="end">GD</text>

            {/* Vertex & midpoint labels */}
            <text x={A.x} y={A.y - 14} fill="#e2e8f0" fontSize="16" fontWeight="bold" textAnchor="middle">A</text>
            <text x={B.x - 16} y={B.y + 6} fill="#e2e8f0" fontSize="16" fontWeight="bold" textAnchor="middle">B</text>
            <text x={C.x + 16} y={C.y + 6} fill="#e2e8f0" fontSize="16" fontWeight="bold" textAnchor="middle">C</text>
            <circle cx={midBC.x} cy={midBC.y} r="4" fill={OB.red} />
            <text x={midBC.x} y={midBC.y + 20} fill={OB.red} fontSize="13" fontWeight="bold" textAnchor="middle">D</text>
            <circle cx={midAC.x} cy={midAC.y} r="4" fill={OB.blue} />
            <text x={midAC.x + 14} y={midAC.y - 6} fill={OB.blue} fontSize="13" fontWeight="bold">E</text>
            <circle cx={midAB.x} cy={midAB.y} r="4" fill={OB.gold} />
            <text x={midAB.x - 14} y={midAB.y - 6} fill={OB.gold} fontSize="13" fontWeight="bold" textAnchor="end">F</text>

            {/* Ratio callout */}
            <rect x="30" y="400" width="540" height="44" rx="8" fill="rgba(15,23,42,0.85)" stroke={OB.dim} strokeWidth="1.5" />
            <text x="300" y="418" fill={OB.green} fontSize="14" fontWeight="bold" textAnchor="middle">
              AG : GD = {ratio} : 1  (always exactly 2 : 1)
            </text>
            <text x="300" y="436" fill="#94a3b8" fontSize="11" textAnchor="middle">
              G = ((x_A+x_B+x_C)/3 , (y_A+y_B+y_C)/3) — the arithmetic mean of the vertices
            </text>
          </g>
        )}

        {/* ── STEP 3: Mechanical Method — parabola centroid ── */}
        {step === 3 && (
          <g>
            <rect x="30" y="12" width="540" height="32" rx="6" fill="rgba(16,185,129,0.85)" />
            <text x="300" y="34" fill="#fff" fontSize="13" fontWeight="bold" textAnchor="middle">
              ✓ Step 4 — Mechanical Method: parabolic centroid at 3/5 height (Q.E.D.)
            </text>

            {/* Parabolic segment */}
            <path d="M 150 370 Q 300 50 450 370 Z" fill="rgba(6,182,212,0.2)" stroke={OB.cyan} strokeWidth="2.5" />
            {/* Axis of symmetry */}
            <line x1="300" y1="68" x2="300" y2="370" stroke={OB.gold} strokeWidth="2" strokeDasharray="6,4" />

            {/* Height markers */}
            <line x1="140" y1="370" x2="140" y2="68" stroke={OB.dim} strokeWidth="1" strokeDasharray="3,3" />
            <line x1="134" y1="68" x2="146" y2="68" stroke={OB.gold} strokeWidth="1.5" />
            <line x1="134" y1="370" x2="146" y2="370" stroke={OB.gold} strokeWidth="1.5" />
            <text x="125" y="220" fill={OB.gold} fontSize="14" fontWeight="bold" textAnchor="end" transform="rotate(-90,125,220)">Height h</text>

            {/* Horizontal slices for mechanical method */}
            {[0.2, 0.4, 0.6, 0.8].map((t, i) => {
              const y = 68 + t * 302;
              const halfW = Math.sqrt(t) * 150;
              return (
                <line key={i} x1={300 - halfW} y1={y} x2={300 + halfW} y2={y}
                  stroke={OB.cyan} strokeWidth="1.5" strokeDasharray="4,3" opacity="0.5" />
              );
            })}

            {/* Vertex label */}
            <circle cx="300" cy="68" r="5" fill={OB.cyan} />
            <text x="300" y="56" fill={OB.cyan} fontSize="14" fontWeight="bold" textAnchor="middle">Vertex V</text>

            {/* Base */}
            <line x1="150" y1="370" x2="450" y2="370" stroke={OB.gold} strokeWidth="2" />
            <text x="300" y="392" fill={OB.gold} fontSize="13" fontWeight="bold" textAnchor="middle">Base</text>

            {/* Centroid at 3/5 h from vertex = 68 + 0.6*302 = 249.2 */}
            <circle cx="300" cy="249" r="8" fill={OB.red} stroke="#fff" strokeWidth="2" />
            <text x="320" y="245" fill={OB.red} fontSize="15" fontWeight="bold">Centroid</text>
            <text x="320" y="264" fill="#e2e8f0" fontSize="12">(at 3/5 h from vertex)</text>

            {/* 3:2 annotation */}
            <line x1="120" y1="68" x2="120" y2="249" stroke={OB.red} strokeWidth="2" />
            <text x="108" y="158" fill={OB.red} fontSize="12" fontWeight="bold" textAnchor="end">3</text>
            <line x1="120" y1="249" x2="120" y2="370" stroke={OB.blue} strokeWidth="2" />
            <text x="108" y="310" fill={OB.blue} fontSize="12" fontWeight="bold" textAnchor="end">2</text>

            {/* Lever analogy on right */}
            <rect x="460" y="120" width="120" height="220" rx="10" fill="rgba(15,23,42,0.6)" stroke={OB.dim} strokeWidth="1" />
            <text x="520" y="145" fill={OB.gold} fontSize="11" fontWeight="bold" textAnchor="middle">Mechanical</text>
            <text x="520" y="162" fill={OB.gold} fontSize="11" fontWeight="bold" textAnchor="middle">Method</text>
            <text x="520" y="190" fill="#94a3b8" fontSize="10" textAnchor="middle">Archimedes</text>
            <text x="520" y="206" fill="#94a3b8" fontSize="10" textAnchor="middle">balanced each</text>
            <text x="520" y="222" fill="#94a3b8" fontSize="10" textAnchor="middle">parabolic slice</text>
            <text x="520" y="238" fill="#94a3b8" fontSize="10" textAnchor="middle">on a lever against</text>
            <text x="520" y="254" fill="#94a3b8" fontSize="10" textAnchor="middle">a known triangle</text>
            <text x="520" y="280" fill={OB.green} fontSize="11" fontWeight="bold" textAnchor="middle">Ratio = 3 : 2</text>
            <text x="520" y="298" fill={OB.green} fontSize="10" textAnchor="middle">from vertex</text>
            <text x="520" y="316" fill={OB.green} fontSize="10" textAnchor="middle">along axis</text>

            <rect x="30" y="400" width="540" height="44" rx="8" fill="rgba(15,23,42,0.85)" stroke={OB.dim} strokeWidth="1.5" />
            <text x="300" y="420" fill={OB.green} fontSize="13" fontWeight="bold" textAnchor="middle">
              Archimedes' Mechanical Method — the first use of integration by lever analogy!
            </text>
          </g>
        )}
      </svg>
    );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, triGeo, w1, w2, d1, d2, torque1, torque2, balanced, tiltDeg]);

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
            : 'Explore the Law of the Lever and how medians intersect at the centroid in a 2:1 ratio.'}
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
        <p className="text-[11px] text-slate-300 leading-relaxed mb-2">
          {activeSubtask === 1 ? (
            <>
              {step===0 && 'Step 1: Enclose a sphere of radius R inside a right cylinder of radius R and height H = 2R.'}
              {step===1 && 'Step 2: At any point P on the sphere, the slant height D of a thin zone and the vertical drop d form a right triangle similar to the triangle of local radius r and sphere radius R. So d/D = r/R, giving D = dR/r. Zone Area = 2πr · D = 2πr · dR/r = 2πR·d. The r cancels!'}
              {step===2 && 'Step 3: Sum all zones: Σ 2πR·Δh = 2πR·(2R) = 4πR². The sphere equals exactly 4 great circles.'}
              {step===3 && 'Step 4: Sphere Area = 4πR², Cylinder Total = 6πR². Ratio = 4/6 = 2/3. (Q.E.D.)'}
            </>
          ) : (
            <>
              {step===0 && 'Step 1: Magnitudes balance at distances inversely proportional to their weights: W₁·d₁ = W₂·d₂.'}
              {step===1 && 'Step 2: Cut △ABC into thin strips parallel to BC. Each strip\'s midpoint lies on median AD, so the centroid lies on AD.'}
              {step===2 && 'Step 3: By the same argument for all three medians (AD, BE, CF), the centroid G lies on all three. G divides each median 2:1.'}
              {step===3 && 'Step 4: Archimedes used the lever to "weigh" parabolic slices against a triangle, proving the parabolic segment centroid lies at 3/5 of height. (Q.E.D.)'}
            </>
          )}
        </p>
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
