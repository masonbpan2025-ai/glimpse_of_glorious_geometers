import React, { useState, useMemo, useEffect } from 'react';
import { useGameState } from '../../context/GameStateContext';
import { RotateCcw, BookOpen, Scale, Sparkles, ChevronRight } from 'lucide-react';
import LevelShell from '../LevelShell';

/* ───────────────────── Oliver Byrne Color Palette ─────────────────── */
const OB = {
  red: '#e74c3c', blue: '#2980b9', yellow: '#f1c40f', gold: '#e9c46a',
  green: '#10b981', purple: '#a855f7', cyan: '#06b6d4', slate: '#64748b',
  dim: '#334155', bg: '#0f172a',
};

export default function ArchimedesLevel() {
  const { activeSubtask, completedSubtasks, completeSubtask } = useGameState();

  /* ─── Task 1 State (Surface Area of Sphere) ─── */
  const [task1Step, setTask1Step] = useState(0);
  const sphereR = 55;
  const zoneN = 8;

  /* ─── Task 2 State (Triangle Centroid & Lever) ─── */
  const [task2Step, setTask2Step] = useState(0);
  const [w1, setW1] = useState(40);
  const [d1, setD1] = useState(60);
  const [w2, setW2] = useState(60);
  const [d2, setD2] = useState(40);

  /* ─── Task 3 State (Centroid & Quadrature of Parabola) ─── */
  const [task3Step, setTask3Step] = useState(0);
  const [parabolaAreaMode, setParabolaAreaMode] = useState('series'); // 'lever' | 'series'
  const [parabolaSliceT, setParabolaSliceT] = useState(0.55); // scrub slice along axis
  const [parabolaExhaustionStage, setParabolaExhaustionStage] = useState(2); // 1, 2, 3
  const [seriesDetailMode, setSeriesDetailMode] = useState('proof'); // 'proof' | 'layers'

  /* ─── Quiz State ─── */
  const [qIdx, setQIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [feedback, setFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [success, setSuccess] = useState(false);

  /* ═══════════════════════════════ QUESTIONS ═══════════════════════ */
  const task1Questions = [
    { id: 1, concept: 'Surface Area of a Sphere',
      question: 'What is the surface area of a sphere of radius R, as proved by Archimedes?',
      options: ['A = 4πR² (four great circles)', 'A = 2πR²', 'A = (4/3)πR³', 'A = 6πR²'],
      correct: 0, explanation: 'Archimedes proved in On the Sphere and Cylinder that the sphere\'s surface area equals exactly 4 great-circle areas: A = 4πR².' },
    { id: 2, concept: 'Sphere vs Cylinder Lateral Area',
      question: 'How does the sphere area compare to the lateral (side) area of its circumscribed cylinder?',
      options: ['They are exactly equal (both 4πR²).', 'The sphere is twice as large.', 'The cylinder lateral is twice as large.', 'The sphere is 3/4 of the cylinder.'],
      correct: 0, explanation: 'Lateral area of the circumscribed cylinder = 2πR · 2R = 4πR², identical to the sphere!' },
    { id: 3, concept: 'The Tombstone Ratio 2∶3',
      question: 'What is the ratio of the sphere surface area to the TOTAL surface area of its circumscribed cylinder?',
      options: ['2 : 3 (Sphere 4πR² / Cylinder 6πR²)', '1 : 2', '3 : 4', '1 : 1'],
      correct: 0, explanation: 'Cylinder total = 4πR² (sides) + 2πR² (caps) = 6πR². Ratio = 4/6 = 2/3.' },
    { id: 4, concept: 'Spherical Zone Area',
      question: 'Archimedes proved that the area of a spherical zone between two parallel planes depends only on…',
      options: ['The vertical height h of the zone (Area = 2πRh).', 'The distance from the center.', 'The curvature angle θ.', 'The volume of the slice.'],
      correct: 0, explanation: 'Any belt of vertical height h has area 2πRh, matching the cylinder\'s corresponding belt regardless of latitude.' },
    { id: 5, concept: 'Archimedes\' Tombstone',
      question: 'Why did Archimedes request a sphere inscribed in a cylinder on his tombstone?',
      options: ['He considered the 2:3 ratio his greatest discovery.', 'It was the seal of Syracuse.', 'It represented his war catapults.', 'Roman law required it.'],
      correct: 0, explanation: 'He was so proud of the 2:3 ratio of volume and surface area that he requested it engraved on his tombstone, later identified by Cicero in 75 BC.' },
  ];

  const task2Questions = [
    { id: 1, concept: 'Law of the Lever',
      question: 'When are weights W₁ and W₂ in equilibrium on a lever with fulcrum distances d₁ and d₂?',
      options: ['When W₁·d₁ = W₂·d₂ (torques balance)', 'When W₁/d₁ = W₂/d₂', 'When W₁ + d₁ = W₂ + d₂', 'When W₁² + W₂² = d₁² + d₂²'],
      correct: 0, explanation: 'Archimedes proved in On the Equilibrium of Planes that magnitudes balance at distances inversely proportional to their weights: W₁·d₁ = W₂·d₂.' },
    { id: 2, concept: 'Medians & Center of Gravity',
      question: 'Why must the centroid of a triangle lie on its medians?',
      options: ['Every parallel strip\'s midpoint lies on the median, balancing each strip individually.', 'Because medians are perpendicular to the sides.', 'Because medians bisect the vertex angles.', 'Because medians have equal lengths.'],
      correct: 0, explanation: 'Slicing △ABC into thin strips parallel to side BC shows each strip balances at its midpoint, which lies on median AD. Hence the centroid must lie on AD, and similarly on BE and CF.' },
    { id: 3, concept: 'Triangle Centroid Division Ratio',
      question: 'In what ratio does the centroid G divide each median?',
      options: ['2 : 1 from vertex to midpoint (AG = 2/3 AD)', '1 : 1 (midpoint of median)', '3 : 1 from vertex to midpoint', '√2 : 1'],
      correct: 0, explanation: 'The centroid divides every median in ratio 2 : 1, meaning the vertex is twice as far from G as the midpoint of the opposite side.' },
    { id: 4, concept: 'Midline Theorem in Centroid Proof',
      question: 'How does the midline DE connecting midpoints of BC and AC prove the 2:1 ratio?',
      options: ['DE ∥ AB and DE = 1/2 AB, creating similar triangles △ABG ∼ △DEG with side ratio 2:1.', 'It divides the triangle into two congruent halves.', 'It forms a right triangle with the median.', 'It proves the medians are equal in length.'],
      correct: 0, explanation: 'Since DE ∥ AB and DE = 1/2 AB, alternate interior angles match, making △ABG ∼ △DEG (AA similarity). Therefore AG/GD = AB/DE = 2/1.' },
    { id: 5, concept: 'Six Equal Areas Alternative Proof',
      question: 'How does area division prove the centroid divides each median in ratio 2:1?',
      options: ['The 3 medians create 6 equal areas of ⅙ Δ; △ABG has area 2/6 Δ and △BGD has area 1/6 Δ, sharing altitude from B so AG:GD = 2:1.', 'By calculating the perimeter of each sub-triangle.', 'By proving the medians are perpendicular bisectors.', 'By inscribing a circle inside each sub-triangle.'],
      correct: 0, explanation: 'Every median bisects triangle area. The 3 medians form 6 triangles of equal area ⅙ Δ. △ABG has area 2/6 Δ and △BGD has 1/6 Δ; sharing the same altitude from B onto AD, base ratio AG/GD = (2/6)/(1/6) = 2:1.' },
  ];

  const task3Questions = [
    { id: 1, concept: 'Parabolic Segment Area',
      question: 'How did Archimedes relate the area of a parabolic segment with base 2b and height h to the inscribed triangle of area bh?',
      options: ['Area = 4/3 of the inscribed triangle (Area = 4/3 bh)', 'Area = 2/3 of the inscribed triangle', 'Area = 3/2 of the inscribed triangle', 'Area = 1/2 of the inscribed triangle'],
      correct: 0, explanation: 'Archimedes proved Area = 4/3 bh (exactly 4/3 of the inscribed triangle of area bh) using both lever cross-sections and geometric exhaustion without calculus.' },
    { id: 2, concept: 'The Method: Tangent Triangle Balance',
      question: 'In Proposition 1 of The Method, how did Archimedes prove Area = 4/3 bh without calculus?',
      options: ['By balancing each parabolic slice at distance h against a slice of a circumscribed tangent triangle of area 4bh at distance x on a lever.', 'By computing an integral of powers.', 'By rolling a wheel along the parabola.', 'By approximating the parabola with a hemisphere.'],
      correct: 0, explanation: 'The tangent property gives (slice in △)/(slice in P) = h/x. Placing the parabolic slice at arm h balances the triangle slice at distance x. Summing gives Area(P)·h = (4bh)·(1/3 h) ⟹ Area = 4/3 bh.' },
    { id: 3, concept: 'Geometric Series of Inscribed Triangles',
      question: 'In Archimedes\' geometric exhaustion proof (Quadrature of the Parabola), by what factor does each subsequent layer of inscribed triangles decrease?',
      options: ['Each layer has 1/4 the combined area of the previous layer: T(1 + 1/4 + 1/16 + ...) = 4/3 T.', 'Each layer has 1/2 the area of the previous layer.', 'Each layer has 1/3 the area of the previous layer.', 'Each layer has 1/8 the area of the previous layer.'],
      correct: 0, explanation: 'Each new stage adds triangles with 1/4 of the previous stage\'s total area: T(1 + 1/4 + 1/16 + 1/64 + ...) = 4/3 T = 4/3 bh.' },
    { id: 4, concept: 'Total Rotational Moment (Lever Torque)',
      question: 'Without calculus, how did Archimedes determine that the total moment of the parabolic slices is 4/5 bh²?',
      options: ['Using sum-of-squares step polygons and lever exhaustion, proving the slices strictly balance a counterweight of 4/5 bh suspended at arm length h.', 'By measuring water displacement in a vessel.', 'By assuming gravity is uniform and measuring time.', 'By using Kepler\'s harmonic laws.'],
      correct: 0, explanation: 'Using his lemma on the sum of squares (On Conoids and Spheroids Prop 10) and step-polygon exhaustion, Archimedes proved the sum of slice moments strictly equals (4/5 bh) · h = 4/5 bh².' },
    { id: 5, concept: 'Parabolic Centroid Location & Ratio',
      question: 'Where does the centroid of a parabolic segment lie along its axis of height h, and in what ratio does it divide the axis?',
      options: ['At 3/5 h from the vertex (x̄ = 3/5 h), dividing the axis in ratio 3 : 2 from vertex to base.', 'At 2/3 h from the vertex (ratio 2:1).', 'At 1/2 h from the vertex (ratio 1:1).', 'At 3/4 h from the vertex (ratio 3:1).'],
      correct: 0, explanation: 'Center of gravity x̄ = Total Moment / Area = (4/5 bh²) / (4/3 bh) = 3/5 h. The axis is divided into 3 parts from the vertex and 2 parts from the base (ratio 3 : 2).' },
  ];

  const questions = activeSubtask === 1 ? task1Questions : activeSubtask === 2 ? task2Questions : task3Questions;
  const curQ = questions[qIdx] || questions[0];

  useEffect(() => {
    setQIdx(0);
    setAnswers({});
    setFeedback('');
    setSubmitted(false);
    setSuccess(false);
  }, [activeSubtask]);

  const selectOpt = (i) => { setAnswers({...answers, [qIdx]: i}); setFeedback(''); };
  const nextQ = () => {
    if (answers[qIdx] === undefined) { setFeedback('Select an answer.'); return; }
    if (qIdx < questions.length - 1) { setQIdx(qIdx + 1); setFeedback(''); }
    else {
      let c = 0; questions.forEach((q, i) => { if (answers[i] === q.correct) c++; });
      if (c === questions.length) {
        setSuccess(true); setSubmitted(true); completeSubtask(7, activeSubtask);
        setFeedback(`Task ${activeSubtask} Complete! Perfect mastery of Archimedes!`);
      } else setFeedback(`${c}/${questions.length} correct. Review the proofs and retry.`);
    }
  };
  const prevQ = () => { if (qIdx > 0) { setQIdx(qIdx - 1); setFeedback(''); } };
  const resetQuiz = () => { setAnswers({}); setQIdx(0); setSubmitted(false); setSuccess(false); setFeedback(''); };

  /* ═══════════ COMPUTED VALUES ═══════════ */
  const R = sphereR;

  /* Lever torque for Task 2 */
  const torque1 = w1 * d1, torque2 = w2 * d2;
  const balanced = Math.abs(torque1 - torque2) < 0.5;
  const tiltDeg = balanced ? 0 : Math.max(-12, Math.min(12, (torque1 - torque2) / -180));

  /* Triangle Geometry for Task 2 */
  const triGeo = useMemo(() => {
    const _A = { x: 300, y: 75 };
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
  }, []);
  const { A, B, C, G, midBC, midAC, midAB } = triGeo;

  /* Parabola SVG path for Task 3 */
  const parabolaPath = useMemo(() => {
    const vx = 300, vy = 75, h = 270, b = 130;
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

  /* Parabola SVG path for Task 3 Detailed Proof View (Offset left to fit proof card) */
  const proofParabolaPath = useMemo(() => {
    const vx = 200, vy = 95, h = 225, b = 115;
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

  const step = activeSubtask === 1 ? task1Step : activeSubtask === 2 ? task2Step : task3Step;
  const setStep = activeSubtask === 1 ? setTask1Step : activeSubtask === 2 ? setTask2Step : setTask3Step;

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
          <linearGradient id="sphereGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.4" />
            <stop offset="60%" stopColor="#0284c7" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#0369a1" stopOpacity="0.1" />
          </linearGradient>
          <linearGradient id="tombGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#334155" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>
        </defs>

        {/* ── STEP 0: Inscribed Sphere in Cylinder ── */}
        {step === 0 && (
          <g>
            <rect x="30" y="12" width="540" height="32" rx="6" fill="rgba(6,182,212,0.12)" stroke={OB.cyan} strokeWidth="1.5" />
            <text x="300" y="34" fill={OB.cyan} fontSize="13" fontWeight="bold" textAnchor="middle">
              Step 1 — A Sphere of Radius R Inscribed Inside a Cylinder of Height 2R
            </text>

            <rect x={cylLeft} y={cylTop} width={2 * r} height={cylH} fill="rgba(233,196,106,0.06)" stroke={OB.gold} strokeWidth="1.5" strokeDasharray="6,4" />
            <ellipse cx={cx} cy={cylTop} rx={r} ry={ellipseRy} fill="rgba(233,196,106,0.15)" stroke={OB.gold} strokeWidth="1.5" />
            <ellipse cx={cx} cy={cylBot} rx={r} ry={ellipseRy} fill="none" stroke={OB.gold} strokeWidth="1.5" />

            <circle cx={cx} cy={cy} r={r} fill="url(#sphereGrad)" stroke={OB.cyan} strokeWidth="2.5" />
            <ellipse cx={cx} cy={cy} rx={r} ry={ellipseRy} fill="none" stroke={OB.cyan} strokeWidth="1.5" strokeDasharray="4,3" />

            <circle cx={cx} cy={cy} r="4" fill={OB.cyan} />
            <text x={cx + 8} y={cy - 8} fill={OB.cyan} fontSize="13" fontWeight="bold">O</text>
            <line x1={cx} y1={cy} x2={cx + r} y2={cy} stroke={OB.red} strokeWidth="2.5" />
            <text x={cx + r / 2} y={cy - 8} fill={OB.red} fontSize="13" fontWeight="bold">R</text>

            <line x1={cylLeft - 25} y1={cylTop} x2={cylLeft - 25} y2={cylBot} stroke={OB.gold} strokeWidth="1.5" />
            <polyline points={`${cylLeft - 30},${cylTop + 8} ${cylLeft - 25},${cylTop} ${cylLeft - 20},${cylTop + 8}`} fill="none" stroke={OB.gold} strokeWidth="1.5" />
            <polyline points={`${cylLeft - 30},${cylBot - 8} ${cylLeft - 25},${cylBot} ${cylLeft - 20},${cylBot - 8}`} fill="none" stroke={OB.gold} strokeWidth="1.5" />
            <text x={cylLeft - 35} y={cy + 4} fill={OB.gold} fontSize="13" fontWeight="bold" textAnchor="end">H = 2R</text>

            <rect x="30" y="400" width="540" height="44" rx="8" fill="rgba(15,23,42,0.85)" stroke={OB.dim} strokeWidth="1.5" />
            <text x="300" y="420" fill={OB.gold} fontSize="13" fontWeight="bold" textAnchor="middle">
              Cylinder: Radius = R, Height = 2R. Lateral Area = 2πR · 2R = 4πR²
            </text>
            <text x="300" y="438" fill="#94a3b8" fontSize="11" textAnchor="middle">
              Archimedes sets out to prove: Sphere Surface Area is ALSO exactly 4πR²!
            </text>
          </g>
        )}

        {/* ── STEP 1: Similar Triangles Proof ── */}
        {step === 1 && (() => {
          const scx = 210, scy = 230, sr = 120;
          const theta = 0.85;
          const px = scx + sr * Math.sin(theta);
          const py = scy - sr * Math.cos(theta);
          const dTheta = 0.12;
          const px2 = scx + sr * Math.sin(theta + dTheta);
          const py2 = scy - sr * Math.cos(theta + dTheta);
          const midPx = (px + px2) / 2;
          const midPy = (py + py2) / 2;

          return (
            <g>
              <rect x="15" y="12" width="570" height="32" rx="6" fill="rgba(99,102,241,0.15)" stroke="#6366f1" strokeWidth="1.5" />
              <text x="300" y="34" fill="#818cf8" fontSize="13" fontWeight="bold" textAnchor="middle">
                Step 2 — WHY each zone has area 2πR·d: The Similar Triangles Argument
              </text>

              <rect x={scx - sr} y={scy - sr} width={2 * sr} height={2 * sr}
                fill="rgba(233,196,106,0.08)" stroke={OB.gold} strokeWidth="2" strokeDasharray="5,4" />
              <circle cx={scx} cy={scy} r={sr} fill="rgba(6,182,212,0.08)" stroke={OB.cyan} strokeWidth="2" />
              <line x1={scx - sr - 10} y1={scy} x2={scx + sr + 10} y2={scy} stroke={OB.dim} strokeWidth="1" strokeDasharray="3,3" />

              {(() => {
                const lx1 = scx - sr * Math.sin(theta);
                const lx2 = scx - sr * Math.sin(theta + dTheta);
                return (
                  <g>
                    <path d={`M ${lx1} ${py} L ${px} ${py} L ${px2} ${py2} L ${lx2} ${py2} Z`}
                      fill="rgba(244,63,94,0.3)" stroke={OB.red} strokeWidth="1.5" />
                    <rect x={scx - sr} y={py} width={2 * sr} height={py2 - py}
                      fill="rgba(233,196,106,0.12)" stroke={OB.gold} strokeWidth="1" strokeDasharray="3,3" />
                  </g>
                );
              })()}

              <circle cx={scx} cy={scy} r="4" fill={OB.cyan} />
              <text x={scx - 12} y={scy + 5} fill="#e2e8f0" fontSize="13" fontWeight="bold" textAnchor="end">O</text>

              <line x1={scx} y1={scy} x2={px} y2={py} stroke={OB.blue} strokeWidth="2.5" />
              <text x={(scx + px) / 2 + 6} y={(scy + py) / 2 - 6} fill={OB.blue} fontSize="14" fontWeight="bold">R</text>

              <line x1={scx} y1={py} x2={px} y2={py} stroke={OB.purple} strokeWidth="2.5" />
              <text x={(scx + px) / 2} y={py - 8} fill={OB.purple} fontSize="14" fontWeight="bold" textAnchor="middle">r</text>

              <line x1={px} y1={py} x2={px2} y2={py2} stroke={OB.red} strokeWidth="3" />
              <circle cx={px} cy={py} r="3.5" fill={OB.red} />
              <circle cx={px2} cy={py2} r="3.5" fill={OB.red} />
              <text x={midPx + 14} y={midPy - 2} fill={OB.red} fontSize="15" fontWeight="bold">D</text>

              <line x1={px} y1={py} x2={px2} y2={py2} stroke={OB.green} strokeWidth="2.5" />
              <text x={px + 14} y={(py + py2) / 2 + 4} fill={OB.green} fontSize="14" fontWeight="bold">d</text>

              <rect x="385" y="60" width="195" height="190" rx="10" fill="rgba(15,23,42,0.7)" stroke={OB.dim} strokeWidth="1" />
              <text x="482" y="86" fill="#818cf8" fontSize="12" fontWeight="bold" textAnchor="middle">Similar Triangles</text>
              <text x="400" y="112" fill="#94a3b8" fontSize="11">Slant element: <tspan fill={OB.red} fontWeight="bold">D</tspan></text>
              <text x="400" y="132" fill="#94a3b8" fontSize="11">Vertical drop: <tspan fill={OB.green} fontWeight="bold">d</tspan></text>
              <text x="400" y="152" fill="#94a3b8" fontSize="11">Local radius: <tspan fill={OB.purple} fontWeight="bold">r</tspan></text>
              <text x="400" y="172" fill="#94a3b8" fontSize="11">Sphere radius: <tspan fill={OB.blue} fontWeight="bold">R</tspan></text>
              <text x="482" y="202" fill={OB.gold} fontSize="13" fontWeight="bold" textAnchor="middle">d / D = r / R</text>
              <text x="482" y="226" fill="#38bdf8" fontSize="12" fontWeight="bold" textAnchor="middle">⟹ D = d · R / r</text>

              <rect x="30" y="400" width="540" height="44" rx="8" fill="rgba(15,23,42,0.85)" stroke={OB.dim} strokeWidth="1.5" />
              <text x="300" y="418" fill="#c4b5fd" fontSize="13" fontWeight="bold" textAnchor="middle">
                Zone Area = 2πr · D = 2πr · (d·R / r) = 2πR · d
              </text>
              <text x="300" y="436" fill="#94a3b8" fontSize="11" textAnchor="middle">
                The local radius r perfectly cancels out! Every zone of height d has area 2πRd.
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

            <circle cx="180" cy="230" r="100" fill="url(#sphereGrad)" stroke={OB.cyan} strokeWidth="2.5" />
            <ellipse cx="180" cy="230" rx="100" ry="22" fill="none" stroke={OB.cyan} strokeWidth="1.5" strokeDasharray="4,3" />
            <text x="180" y="225" fill="#e2e8f0" fontSize="16" fontWeight="bold" textAnchor="middle">Sphere</text>
            <text x="180" y="245" fill={OB.cyan} fontSize="15" fontWeight="bold" textAnchor="middle">A = 4πR²</text>

            <text x="310" y="230" fill="#94a3b8" fontSize="28" fontWeight="bold" textAnchor="middle">=</text>

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

            <path d="M 170 400 L 170 140 A 130 130 0 0 1 430 140 L 430 400 Z" fill="url(#tombGrad)" stroke={OB.gold} strokeWidth="2.5" />
            <path d="M 190 390 L 190 160 A 110 110 0 0 1 410 160 L 410 390 Z" fill="none" stroke={OB.gold} strokeWidth="1" strokeDasharray="4,3" opacity="0.5" />

            <rect x="250" y="150" width="100" height="100" fill="none" stroke={OB.gold} strokeWidth="2" strokeDasharray="5,4" />
            <ellipse cx="300" cy="150" rx="50" ry="12" fill="rgba(233,196,106,0.15)" stroke={OB.gold} strokeWidth="1.5" />
            <ellipse cx="300" cy="250" rx="50" ry="12" fill="none" stroke={OB.gold} strokeWidth="1.5" />

            <circle cx="300" cy="200" r="50" fill="rgba(6,182,212,0.2)" stroke={OB.cyan} strokeWidth="2" />
            <ellipse cx="300" cy="200" rx="50" ry="12" fill="none" stroke={OB.cyan} strokeWidth="1" strokeDasharray="3,3" />

            <text x="300" y="290" fill={OB.gold} fontSize="18" fontWeight="bold" textAnchor="middle">2 : 3</text>
            <text x="300" y="312" fill="#cbd5e1" fontSize="12" textAnchor="middle">Sphere : Cylinder</text>
            <text x="300" y="332" fill="#94a3b8" fontSize="11" textAnchor="middle">Surface Area and Volume</text>

            <text x="300" y="365" fill={OB.gold} fontSize="11" fontWeight="bold" textAnchor="middle" fontStyle="italic">
              "Archimedes' Tombstone — Syracuse, c. 212 BC"
            </text>

            <rect x="30" y="400" width="540" height="44" rx="8" fill="rgba(15,23,42,0.85)" stroke={OB.dim} strokeWidth="1.5" />
            <text x="300" y="420" fill={OB.green} fontSize="13" fontWeight="bold" textAnchor="middle">
              Cicero found this tombstone overgrown with bushes in 75 BC, confirming Archimedes' wish.
            </text>
          </g>
        )}
      </svg>
    );
  }, [step, R]);

  /* ═══════════════════════ TASK 2 SVG: TRIANGLE CENTROID & LEVER ═══════════════════ */
  const task2Canvas = useMemo(() => {
    return (
      <svg viewBox="0 0 600 460" className="w-full h-full" style={{background:'#0a0e1a'}}>
        {/* ── STEP 0: Law of the Lever ── */}
        {step === 0 && (
          <g>
            <rect x="30" y="12" width="540" height="32" rx="6" fill="rgba(6,182,212,0.12)" stroke={OB.cyan} strokeWidth="1.5" />
            <text x="300" y="34" fill={OB.cyan} fontSize="13" fontWeight="bold" textAnchor="middle">
              Step 1 — Law of the Lever: W₁ · d₁ = W₂ · d₂  (On the Equilibrium of Planes)
            </text>

            <line x1="60" y1="360" x2="540" y2="360" stroke={OB.dim} strokeWidth="2" />
            <polygon points="300,280 270,360 330,360" fill={OB.gold} fillOpacity="0.8" stroke="#d97706" strokeWidth="2" />
            <text x="300" y="380" fill={OB.gold} fontSize="14" fontWeight="bold" textAnchor="middle">Fulcrum F</text>

            <g transform={`rotate(${tiltDeg}, 300, 280)`}>
              <rect x="80" y="268" width="440" height="14" rx="4" fill="#475569" stroke="#94a3b8" strokeWidth="1.5" />

              <g>
                <rect x="100" y="200" width="60" height="68" rx="6" fill="rgba(244,63,94,0.8)" stroke={OB.red} strokeWidth="2.5" />
                <text x="130" y="232" fill="#fff" fontSize="14" fontWeight="bold" textAnchor="middle">W₁</text>
                <text x="130" y="252" fill="rgba(255,255,255,0.7)" fontSize="12" textAnchor="middle">{w1}N</text>
              </g>

              <g>
                <rect x="440" y="200" width="60" height="68" rx="6" fill="rgba(16,185,129,0.8)" stroke={OB.green} strokeWidth="2.5" />
                <text x="470" y="232" fill="#fff" fontSize="14" fontWeight="bold" textAnchor="middle">W₂</text>
                <text x="470" y="252" fill="rgba(255,255,255,0.7)" fontSize="12" textAnchor="middle">{w2}N</text>
              </g>

              <line x1="130" y1="290" x2="300" y2="290" stroke={OB.red} strokeWidth="2" strokeDasharray="4,3" />
              <line x1="300" y1="290" x2="470" y2="290" stroke={OB.green} strokeWidth="2" strokeDasharray="4,3" />
              <text x="215" y="310" fill={OB.red} fontSize="14" fontWeight="bold" textAnchor="middle">d₁ = {d1}</text>
              <text x="385" y="310" fill={OB.green} fontSize="14" fontWeight="bold" textAnchor="middle">d₂ = {d2}</text>
            </g>

            {/* Interactive levers controls */}
            <g transform="translate(60, 80)">
              <rect x="0" y="0" width="130" height="65" rx="8" fill="rgba(15,23,42,0.9)" stroke="#334155" />
              <text x="65" y="20" fill={OB.red} fontSize="11" fontWeight="bold" textAnchor="middle">Weight W₁: {w1}N</text>
              <g className="cursor-pointer" onClick={() => setW1(Math.max(10, w1 - 10))}>
                <rect x="15" y="30" width="40" height="22" rx="4" fill="#1e293b" stroke="#64748b" />
                <text x="35" y="45" fill="#fff" fontSize="12" fontWeight="bold" textAnchor="middle">-10</text>
              </g>
              <g className="cursor-pointer" onClick={() => setW1(Math.min(100, w1 + 10))}>
                <rect x="75" y="30" width="40" height="22" rx="4" fill="#1e293b" stroke="#64748b" />
                <text x="95" y="45" fill="#fff" fontSize="12" fontWeight="bold" textAnchor="middle">+10</text>
              </g>
            </g>

            <g transform="translate(410, 80)">
              <rect x="0" y="0" width="130" height="65" rx="8" fill="rgba(15,23,42,0.9)" stroke="#334155" />
              <text x="65" y="20" fill={OB.green} fontSize="11" fontWeight="bold" textAnchor="middle">Weight W₂: {w2}N</text>
              <g className="cursor-pointer" onClick={() => setW2(Math.max(10, w2 - 10))}>
                <rect x="15" y="30" width="40" height="22" rx="4" fill="#1e293b" stroke="#64748b" />
                <text x="35" y="45" fill="#fff" fontSize="12" fontWeight="bold" textAnchor="middle">-10</text>
              </g>
              <g className="cursor-pointer" onClick={() => setW2(Math.min(100, w2 + 10))}>
                <rect x="75" y="30" width="40" height="22" rx="4" fill="#1e293b" stroke="#64748b" />
                <text x="95" y="45" fill="#fff" fontSize="12" fontWeight="bold" textAnchor="middle">+10</text>
              </g>
            </g>

            <rect x="30" y="400" width="540" height="44" rx="8" fill="rgba(15,23,42,0.85)" stroke={OB.dim} strokeWidth="1.5" />
            <text x="170" y="420" fill={OB.red} fontSize="13" fontWeight="bold" textAnchor="middle">τ₁ = W₁·d₁ = {torque1}</text>
            <text x="430" y="420" fill={OB.green} fontSize="13" fontWeight="bold" textAnchor="middle">τ₂ = W₂·d₂ = {torque2}</text>
            <text x="300" y="438" fill={balanced ? OB.green : OB.gold} fontSize="13" fontWeight="bold" textAnchor="middle">
              {balanced ? '✓ EQUILIBRIUM — W₁d₁ = W₂d₂ (Torques Balance!)' : `⚠ Unbalanced — Δτ = ${Math.abs(torque1 - torque2)}`}
            </text>
          </g>
        )}

        {/* ── STEP 1: Strip Method → Centroid on Medians ── */}
        {step === 1 && (
          <g>
            <rect x="25" y="10" width="550" height="34" rx="6" fill="rgba(99,102,241,0.15)" stroke="#6366f1" strokeWidth="1.5" />
            <text x="300" y="32" fill="#818cf8" fontSize="13" fontWeight="bold" textAnchor="middle">
              Step 2 — Strip Method: Centroid Lies on Median AD (and Medians BE &amp; CF)
            </text>

            <polygon points={`${A.x},${A.y} ${B.x},${B.y} ${C.x},${C.y}`}
              fill="rgba(99,102,241,0.08)" stroke="#6366f1" strokeWidth="2.5" />

            <line x1={B.x} y1={B.y} x2={midAC.x} y2={midAC.y} stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="4,4" opacity="0.45" />
            <line x1={C.x} y1={C.y} x2={midAB.x} y2={midAB.y} stroke="#a855f7" strokeWidth="1.5" strokeDasharray="4,4" opacity="0.45" />

            <line x1={A.x} y1={A.y} x2={midBC.x} y2={midBC.y} stroke={OB.red} strokeWidth="3" />

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

            <circle cx={G.x} cy={G.y} r="7" fill={OB.purple} stroke="#fff" strokeWidth="2" />
            <text x={G.x + 14} y={G.y + 4} fill={OB.purple} fontSize="15" fontWeight="bold">G (Centroid)</text>

            <circle cx={A.x} cy={A.y} r="5" fill="#6366f1" />
            <text x={A.x} y={A.y - 12} fill="#e2e8f0" fontSize="15" fontWeight="bold" textAnchor="middle">A</text>
            <circle cx={B.x} cy={B.y} r="5" fill="#6366f1" />
            <text x={B.x - 14} y={B.y + 8} fill="#e2e8f0" fontSize="15" fontWeight="bold" textAnchor="middle">B</text>
            <circle cx={C.x} cy={C.y} r="5" fill="#6366f1" />
            <text x={C.x + 14} y={C.y + 8} fill="#e2e8f0" fontSize="15" fontWeight="bold" textAnchor="middle">C</text>
            <circle cx={midBC.x} cy={midBC.y} r="5" fill={OB.red} />
            <text x={midBC.x} y={midBC.y + 20} fill={OB.red} fontSize="13" fontWeight="bold" textAnchor="middle">D (midpoint of BC)</text>

            <text x={A.x - 14} y={(A.y + G.y) / 2} fill={OB.red} fontSize="12" fontWeight="bold" textAnchor="end">Median AD</text>

            <rect x="25" y="385" width="550" height="66" rx="8" fill="rgba(15,23,42,0.92)" stroke={OB.dim} strokeWidth="1.5" />
            <text x="300" y="405" fill={OB.gold} fontSize="12" fontWeight="bold" textAnchor="middle">
              1. Slicing parallel to BC: every strip's center of gravity is its midpoint, all lying on AD.
            </text>
            <text x="300" y="423" fill="#38bdf8" fontSize="12" fontWeight="bold" textAnchor="middle">
              2. Slicing parallel to AC &amp; AB: centroid must also lie on medians BE &amp; CF.
            </text>
            <text x="300" y="441" fill="#34d399" fontSize="12" fontWeight="bold" textAnchor="middle">
              Conclusion: Centroid G is the intersection of all 3 medians! (Next: Proving the 2:1 ratio)
            </text>
          </g>
        )}

        {/* ── STEP 2: Midline Theorem & Similar Triangles (Proof of 2:1) ── */}
        {step === 2 && (
          <g>
            <rect x="25" y="10" width="550" height="34" rx="6" fill="rgba(16,185,129,0.15)" stroke={OB.green} strokeWidth="1.5" />
            <text x="300" y="32" fill={OB.green} fontSize="13" fontWeight="bold" textAnchor="middle">
              Step 3 — Proving the 2 : 1 Ratio: Midline Theorem &amp; Similar Triangles
            </text>

            {/* Base Triangle ABC */}
            <polygon points={`${A.x},${A.y} ${B.x},${B.y} ${C.x},${C.y}`}
              fill="rgba(15,23,42,0.35)" stroke="#475569" strokeWidth="1.5" />

            {/* Shaded similar triangle 1: △ABG */}
            <polygon points={`${A.x},${A.y} ${B.x},${B.y} ${G.x},${G.y}`}
              fill="rgba(59,130,246,0.22)" stroke="#3b82f6" strokeWidth="2.5" />

            {/* Shaded similar triangle 2: △DEG */}
            <polygon points={`${midBC.x},${midBC.y} ${midAC.x},${midAC.y} ${G.x},${G.y}`}
              fill="rgba(16,185,129,0.25)" stroke="#10b981" strokeWidth="2.5" />

            {/* Midline DE */}
            <line x1={midBC.x} y1={midBC.y} x2={midAC.x} y2={midAC.y}
              stroke={OB.gold} strokeWidth="3" strokeDasharray="6,3" />

            {/* Medians */}
            <line x1={A.x} y1={A.y} x2={midBC.x} y2={midBC.y} stroke={OB.red} strokeWidth="2.5" />
            <line x1={B.x} y1={B.y} x2={midAC.x} y2={midAC.y} stroke={OB.blue} strokeWidth="2.5" />
            <line x1={C.x} y1={C.y} x2={midAB.x} y2={midAB.y} stroke="#a855f7" strokeWidth="1.5" strokeDasharray="4,4" opacity="0.35" />

            {/* Parallel marks on AB and DE */}
            <g transform="translate(220, 217.5) rotate(60.7)">
              <path d="M -8 -4 L 0 0 L -8 4 M 0 -4 L 8 0 L 0 4" fill="none" stroke="#38bdf8" strokeWidth="2" />
            </g>
            <g transform="translate(340, 288.75) rotate(60.7)">
              <path d="M -8 -4 L 0 0 L -8 4 M 0 -4 L 8 0 L 0 4" fill="none" stroke={OB.gold} strokeWidth="2" />
            </g>

            {/* Angle arcs indicating alternate interior angles */}
            <path d="M 300 102 A 28 28 0 0 1 286 99" fill="none" stroke="#f59e0b" strokeWidth="2" />
            <text x="282" y="114" fill="#f59e0b" fontSize="11" fontWeight="bold">α</text>
            <path d="M 300 332 A 28 28 0 0 1 314 336" fill="none" stroke="#f59e0b" strokeWidth="2" />
            <text x="318" y="330" fill="#f59e0b" fontSize="11" fontWeight="bold">α</text>

            <path d="M 166 332 A 28 28 0 0 1 170 348" fill="none" stroke="#38bdf8" strokeWidth="2" />
            <text x="180" y="340" fill="#38bdf8" fontSize="11" fontWeight="bold">β</text>
            <path d="M 354 246 A 28 28 0 0 1 350 230" fill="none" stroke="#38bdf8" strokeWidth="2" />
            <text x="336" y="240" fill="#38bdf8" fontSize="11" fontWeight="bold">β</text>

            <circle cx={G.x} cy={G.y} r="7" fill={OB.purple} stroke="#fff" strokeWidth="2" />
            <text x={G.x + 14} y={G.y + 4} fill="#e2e8f0" fontSize="15" fontWeight="bold">G</text>

            <rect x="135" y="155" width="68" height="20" rx="4" fill="rgba(2,132,199,0.85)" />
            <text x="169" y="169" fill="#ffffff" fontSize="10.5" fontWeight="bold" textAnchor="middle">Side AB = 2k</text>

            <rect x="345" y="295" width="82" height="20" rx="4" fill="rgba(217,119,6,0.9)" />
            <text x="386" y="309" fill="#ffffff" fontSize="10.5" fontWeight="bold" textAnchor="middle">Midline DE = 1k</text>

            <text x="282" y="170" fill={OB.red} fontSize="13" fontWeight="bold" textAnchor="end">AG = 2x</text>
            <text x="282" y="320" fill={OB.red} fontSize="13" fontWeight="bold" textAnchor="end">GD = 1x</text>

            <text x={A.x} y={A.y - 10} fill="#e2e8f0" fontSize="15" fontWeight="bold" textAnchor="middle">A</text>
            <text x={B.x - 14} y={B.y + 8} fill="#e2e8f0" fontSize="15" fontWeight="bold" textAnchor="middle">B</text>
            <text x={C.x + 14} y={C.y + 8} fill="#e2e8f0" fontSize="15" fontWeight="bold" textAnchor="middle">C</text>
            <text x={midBC.x} y={midBC.y + 20} fill={OB.gold} fontSize="13" fontWeight="bold" textAnchor="middle">D (mid BC)</text>
            <text x={midAC.x + 14} y={midAC.y} fill={OB.gold} fontSize="13" fontWeight="bold">E (mid AC)</text>

            <rect x="25" y="378" width="550" height="74" rx="8" fill="rgba(15,23,42,0.95)" stroke="#334155" strokeWidth="1.5" />
            <text x="300" y="398" fill="#38bdf8" fontSize="11.5" fontWeight="bold" textAnchor="middle">
              1. Midline DE connects midpoints ⟹ DE ∥ AB  and  DE = ½ AB (Midline Theorem)
            </text>
            <text x="300" y="418" fill="#34d399" fontSize="11.5" fontWeight="bold" textAnchor="middle">
              2. Alternate interior angles α &amp; β match ⟹ △ABG ∼ △DEG (AA Similar Triangles)
            </text>
            <text x="300" y="438" fill={OB.gold} fontSize="13" fontWeight="bold" textAnchor="middle">
              3. AG / GD = AB / DE = 2 / 1  ⟹  AG : GD = 2 : 1  (G divides median at ⅔ from vertex!)
            </text>
          </g>
        )}

        {/* ── STEP 3: Six Equal Areas Proof (Alternative Proof of 2:1) ── */}
        {step === 3 && (
          <g>
            <rect x="25" y="10" width="550" height="34" rx="6" fill="rgba(168,85,247,0.18)" stroke="#a855f7" strokeWidth="1.5" />
            <text x="300" y="32" fill="#d8b4fe" fontSize="13" fontWeight="bold" textAnchor="middle">
              Step 4 — Six Equal Areas Proof: Area(△ABG) = 2 · Area(△BGD) ⟹ AG : GD = 2 : 1
            </text>

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

            <line x1={A.x} y1={A.y} x2={midBC.x} y2={midBC.y} stroke={OB.red} strokeWidth="2.5" />
            <line x1={B.x} y1={B.y} x2={midAC.x} y2={midAC.y} stroke={OB.blue} strokeWidth="2" />
            <line x1={C.x} y1={C.y} x2={midAB.x} y2={midAB.y} stroke={OB.purple} strokeWidth="2" />

            {/* Altitude from B onto line AD */}
            <line x1={B.x} y1={B.y} x2="300" y2="360" stroke="#f43f5e" strokeWidth="2" strokeDasharray="3,3" />
            <text x="210" y="375" fill="#f43f5e" fontSize="11" fontWeight="bold">Shared Altitude h_B</text>

            <text x="260" y="170" fill="#fca5a5" fontSize="13" fontWeight="bold">⅙ Δ</text>
            <text x="210" y="270" fill="#fdba74" fontSize="13" fontWeight="bold">⅙ Δ</text>
            <text x="240" y="340" fill="#fde047" fontSize="13" fontWeight="bold">⅙ Δ</text>
            <text x="350" y="340" fill="#86efac" fontSize="13" fontWeight="bold">⅙ Δ</text>
            <text x="390" y="270" fill="#67e8f9" fontSize="13" fontWeight="bold">⅙ Δ</text>
            <text x="340" y="170" fill="#d8b4fe" fontSize="13" fontWeight="bold">⅙ Δ</text>

            <circle cx={A.x} cy={A.y} r="4" fill="#e2e8f0" />
            <text x={A.x} y={A.y - 10} fill="#e2e8f0" fontSize="14" fontWeight="bold" textAnchor="middle">A</text>
            <circle cx={B.x} cy={B.y} r="4" fill="#e2e8f0" />
            <text x={B.x - 14} y={B.y + 6} fill="#e2e8f0" fontSize="14" fontWeight="bold" textAnchor="middle">B</text>
            <circle cx={C.x} cy={C.y} r="4" fill="#e2e8f0" />
            <text x={C.x + 14} y={C.y + 6} fill="#e2e8f0" fontSize="14" fontWeight="bold" textAnchor="middle">C</text>
            <circle cx={midBC.x} cy={midBC.y} r="4" fill={OB.red} />
            <text x={midBC.x} y={midBC.y + 20} fill={OB.red} fontSize="13" fontWeight="bold" textAnchor="middle">D</text>

            <circle cx={G.x} cy={G.y} r="7" fill={OB.purple} stroke="#fff" strokeWidth="2" />
            <text x={G.x + 14} y={G.y - 6} fill={OB.purple} fontSize="15" fontWeight="bold">G</text>

            <rect x="25" y="378" width="550" height="74" rx="8" fill="rgba(15,23,42,0.95)" stroke="#334155" strokeWidth="1.5" />
            <text x="300" y="398" fill="#fde047" fontSize="11.5" fontWeight="bold" textAnchor="middle">
              Every median bisects area ⟹ The 3 medians partition △ABC into 6 equal areas of ⅙ Δ
            </text>
            <text x="300" y="418" fill="#38bdf8" fontSize="11.5" fontWeight="bold" textAnchor="middle">
              Area(△ABG) = ⅙ + ⅙ = 2/6 Δ   and   Area(△BGD) = ⅙ Δ
            </text>
            <text x="300" y="438" fill={OB.green} fontSize="13" fontWeight="bold" textAnchor="middle">
              Both share altitude from B onto line AD  ⟹  Base Ratio AG : GD = (2/6)/(1/6) = 2 : 1! (Q.E.D.)
            </text>
          </g>
        )}
      </svg>
    );
  }, [step, w1, w2, d1, d2, torque1, torque2, balanced, tiltDeg, A, B, C, G, midBC, midAC, midAB]);

  /* ═══════════════════════ TASK 3 SVG: CENTROID & QUADRATURE OF PARABOLA ═══════════════════ */
  const task3Canvas = useMemo(() => {
    const vx = 300, vy = 75, h = 270, b = 130;
    const sliceY = vy + parabolaSliceT * h;
    const sliceHalfW = b * Math.sqrt(parabolaSliceT);

    return (
      <svg viewBox="0 0 600 460" className="w-full h-full" style={{background:'#0a0e1a'}}>
        {/* ── STEP 0: Parabolic Segment & Mechanical Lever Setup ── */}
        {step === 0 && (
          <g>
            <rect x="25" y="10" width="550" height="34" rx="6" fill="rgba(6,182,212,0.15)" stroke={OB.cyan} strokeWidth="1.5" />
            <text x="300" y="32" fill={OB.cyan} fontSize="13" fontWeight="bold" textAnchor="middle">
              Step 1 — The Parabolic Segment &amp; Archimedes' Mechanical Lever (The Method)
            </text>

            {/* Parabola */}
            <path d={parabolaPath} fill="rgba(6,182,212,0.18)" stroke={OB.cyan} strokeWidth="2.5" />

            {/* Base chord */}
            <line x1={vx - b} y1={vy + h} x2={vx + b} y2={vy + h} stroke={OB.gold} strokeWidth="3" />
            <circle cx={vx - b} cy={vy + h} r="4" fill={OB.gold} />
            <circle cx={vx + b} cy={vy + h} r="4" fill={OB.gold} />
            <text x={vx - b - 10} y={vy + h + 5} fill={OB.gold} fontSize="12" fontWeight="bold" textAnchor="end">B (-b)</text>
            <text x={vx + b + 10} y={vy + h + 5} fill={OB.gold} fontSize="12" fontWeight="bold">C (+b)</text>
            <text x={vx} y={vy + h + 22} fill={OB.gold} fontSize="12" fontWeight="bold" textAnchor="middle">Base Chord Width = 2b</text>

            {/* Axis of symmetry */}
            <line x1={vx} y1={vy} x2={vx} y2={vy + h} stroke="#64748b" strokeWidth="2" strokeDasharray="4,4" />

            {/* Vertex V */}
            <circle cx={vx} cy={vy} r="5" fill={OB.cyan} stroke="#fff" strokeWidth="1.5" />
            <text x={vx} y={vy - 10} fill={OB.cyan} fontSize="14" fontWeight="bold" textAnchor="middle">Vertex V (x = 0)</text>

            {/* Highlighted scrubbable slice */}
            <line x1={vx - sliceHalfW} y1={sliceY} x2={vx + sliceHalfW} y2={sliceY} stroke="#f59e0b" strokeWidth="3.5" />
            <circle cx={vx - sliceHalfW} cy={sliceY} r="4" fill="#f59e0b" />
            <circle cx={vx + sliceHalfW} cy={sliceY} r="4" fill="#f59e0b" />
            <circle cx={vx} cy={sliceY} r="4" fill="#fff" />

            {/* Dimension indicators for slice */}
            <line x1={vx + b + 25} y1={vy} x2={vx + b + 25} y2={sliceY} stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="3,2" />
            <text x={vx + b + 32} y={(vy + sliceY) / 2 + 4} fill="#f59e0b" fontSize="11" fontWeight="bold">Distance x = {(parabolaSliceT * 100).toFixed(0)}% h</text>

            <rect x={vx - sliceHalfW} y={sliceY - 22} width={2 * sliceHalfW} height="18" rx="4" fill="rgba(15,23,42,0.85)" stroke="#f59e0b" strokeWidth="1" />
            <text x={vx} y={sliceY - 9} fill="#fde047" fontSize="10.5" fontWeight="bold" textAnchor="middle">
              Slice Width w(x) = 2b · √(x/h)
            </text>

            {/* Inscribed reference triangle △VBC */}
            <polygon points={`${vx},${vy} ${vx - b},${vy + h} ${vx + b},${vy + h}`}
              fill="none" stroke="rgba(59,130,246,0.5)" strokeWidth="1.5" strokeDasharray="4,3" />
            <text x="210" y="270" fill="#60a5fa" fontSize="11" fontStyle="italic">Inscribed △: Area = bh</text>

            {/* Interactive slice scrubber hint */}
            <g transform="translate(60, 110)">
              <rect x="0" y="0" width="130" height="75" rx="8" fill="rgba(15,23,42,0.85)" stroke="#334155" strokeWidth="1.5" />
              <text x="65" y="20" fill="#38bdf8" fontSize="11" fontWeight="bold" textAnchor="middle">Explore Slices</text>
              <text x="65" y="38" fill="#94a3b8" fontSize="10" textAnchor="middle">Click to change position:</text>
              <g className="cursor-pointer" onClick={() => setParabolaSliceT(Math.max(0.15, parabolaSliceT - 0.2))}>
                <rect x="15" y="46" width="40" height="20" rx="4" fill="#1e293b" stroke="#64748b" />
                <text x="35" y="60" fill="#fff" fontSize="11" fontWeight="bold" textAnchor="middle">◀ Up</text>
              </g>
              <g className="cursor-pointer" onClick={() => setParabolaSliceT(Math.min(0.95, parabolaSliceT + 0.2))}>
                <rect x="75" y="46" width="40" height="20" rx="4" fill="#1e293b" stroke="#64748b" />
                <text x="95" y="60" fill="#fff" fontSize="11" fontWeight="bold" textAnchor="middle">Down ▶</text>
              </g>
            </g>

            {/* Bottom explanation */}
            <rect x="25" y="378" width="550" height="74" rx="8" fill="rgba(15,23,42,0.95)" stroke="#334155" strokeWidth="1.5" />
            <text x="300" y="398" fill="#38bdf8" fontSize="11.5" fontWeight="bold" textAnchor="middle">
              1. Greek Geometry of Parabola: Any chord parallel to base satisfies y² = (b²/h) · x.
            </text>
            <text x="300" y="418" fill="#fde047" fontSize="11.5" fontWeight="bold" textAnchor="middle">
              2. Archimedes sliced the shape into infinite thin line-segments parallel to base, each of width w(x).
            </text>
            <text x="300" y="438" fill={OB.green} fontSize="12.5" fontWeight="bold" textAnchor="middle">
              3. Archimedes' Genius: Balancing each slice individually on a lever against a known triangle!
            </text>
          </g>
        )}

        {/* ── STEP 1: Proof: Area = 4/3 bh (NO CALCULUS) ── */}
        {step === 1 && (
          <g>
            <rect x="25" y="8" width="550" height="28" rx="6" fill="rgba(16,185,129,0.18)" stroke={OB.green} strokeWidth="1.5" />
            <text x="300" y="27" fill={OB.green} fontSize="13" fontWeight="bold" textAnchor="middle">
              Step 2 — Proof: Area = ⁴⁄₃ bh  (Archimedes' Authentic Proofs — NO CALCULUS)
            </text>

            {/* Unified Top Navigation Bar on a Single Row (y = 40 to y = 62) */}
            <g transform="translate(25, 40)">
              {/* Button 1: Tangent Lever Method */}
              <rect
                x="0" y="0" width={parabolaAreaMode === 'lever' ? 260 : 135} height="22" rx="5"
                fill={parabolaAreaMode === 'lever' ? '#0891b2' : '#1e293b'}
                stroke={parabolaAreaMode === 'lever' ? '#22d3ee' : '#334155'}
                strokeWidth="1.5"
                className="cursor-pointer"
                onClick={() => setParabolaAreaMode('lever')}
              />
              <text
                x={parabolaAreaMode === 'lever' ? 130 : 67} y="15"
                fill={parabolaAreaMode === 'lever' ? '#ffffff' : '#94a3b8'}
                fontSize="10" fontWeight="bold" textAnchor="middle"
                className="cursor-pointer"
                onClick={() => setParabolaAreaMode('lever')}
              >
                ⚖️ The Method: Tangent Lever
              </text>

              {/* Button 2: Quadrature / Inscribed Triangles */}
              <rect
                x={parabolaAreaMode === 'lever' ? 280 : 145} y="0" width={parabolaAreaMode === 'lever' ? 270 : 170} height="22" rx="5"
                fill={parabolaAreaMode === 'series' ? '#059669' : '#1e293b'}
                stroke={parabolaAreaMode === 'series' ? '#34d399' : '#334155'}
                strokeWidth="1.5"
                className="cursor-pointer"
                onClick={() => setParabolaAreaMode('series')}
              />
              <text
                x={parabolaAreaMode === 'lever' ? 415 : 230} y="15"
                fill={parabolaAreaMode === 'series' ? '#ffffff' : '#94a3b8'}
                fontSize="10" fontWeight="bold" textAnchor="middle"
                className="cursor-pointer"
                onClick={() => setParabolaAreaMode('series')}
              >
                📐 Quadrature: Inscribed Triangles
              </text>

              {/* When Quadrature is active: Sub-view buttons right on the same row! */}
              {parabolaAreaMode === 'series' && (
                <>
                  <rect
                    x="325" y="0" width="130" height="22" rx="5"
                    fill={seriesDetailMode === 'proof' ? '#0284c7' : '#0f172a'}
                    stroke={seriesDetailMode === 'proof' ? '#38bdf8' : '#334155'}
                    strokeWidth="1.5"
                    className="cursor-pointer"
                    onClick={() => setSeriesDetailMode('proof')}
                  />
                  <text
                    x="390" y="15"
                    fill={seriesDetailMode === 'proof' ? '#ffffff' : '#94a3b8'}
                    fontSize="9.5" fontWeight="bold" textAnchor="middle"
                    className="cursor-pointer"
                    onClick={() => setSeriesDetailMode('proof')}
                  >
                    🔍 Prove △ABE = ⅛ T
                  </text>

                  <rect
                    x="465" y="0" width="85" height="22" rx="5"
                    fill={seriesDetailMode === 'layers' ? '#0284c7' : '#0f172a'}
                    stroke={seriesDetailMode === 'layers' ? '#38bdf8' : '#334155'}
                    strokeWidth="1.5"
                    className="cursor-pointer"
                    onClick={() => setSeriesDetailMode('layers')}
                  />
                  <text
                    x="507" y="15"
                    fill={seriesDetailMode === 'layers' ? '#ffffff' : '#94a3b8'}
                    fontSize="9.5" fontWeight="bold" textAnchor="middle"
                    className="cursor-pointer"
                    onClick={() => setSeriesDetailMode('layers')}
                  >
                    📊 All Layers
                  </text>
                </>
              )}
            </g>

            {/* 1. TANGENT TRIANGLE LEVER BALANCE VIEW */}
            {parabolaAreaMode === 'lever' && (
              <g>
                <polygon points="270,180 250,230 290,230" fill={OB.gold} fillOpacity="0.85" stroke="#d97706" strokeWidth="2" />
                <rect x="70" y="172" width="460" height="10" rx="3" fill="#475569" stroke="#94a3b8" strokeWidth="1.5" />
                <text x="270" y="246" fill={OB.gold} fontSize="11" fontWeight="bold" textAnchor="middle">Fulcrum V</text>

                <line x1={110} y1={177} x2={110} y2={105} stroke="#f43f5e" strokeWidth="2" strokeDasharray="3,3" />
                <line x1={110} y1={155} x2={270} y2={155} stroke="#f43f5e" strokeWidth="1.5" strokeDasharray="3,3" />
                <text x="190" y="150" fill="#f43f5e" fontSize="11" fontWeight="bold" textAnchor="middle">Fixed Arm Length = h</text>

                <g transform="translate(75, 80)">
                  <rect x="0" y="0" width="70" height="48" rx="6" fill="rgba(6,182,212,0.85)" stroke="#67e8f9" strokeWidth="1.5" />
                  <text x="35" y="18" fill="#fff" fontSize="10" fontWeight="bold" textAnchor="middle">Parabola Slice</text>
                  <text x="35" y="34" fill="#cffafe" fontSize="12" fontWeight="extrabold" textAnchor="middle">w(x)</text>
                  <text x="35" y="58" fill="#f43f5e" fontSize="9.5" fontWeight="bold" textAnchor="middle">At Distance h</text>
                </g>

                <g transform="translate(270, 177)">
                  <line x1="0" y1="0" x2="160" y2="0" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="4,2" />

                  <polygon points="0,0 160,-55 160,55" fill="rgba(234,179,8,0.15)" stroke={OB.gold} strokeWidth="2" />
                  <text x="165" y="-55" fill={OB.gold} fontSize="11" fontWeight="bold">D</text>
                  <text x="165" y="55" fill={OB.gold} fontSize="11" fontWeight="bold">C (Tangent)</text>
                  <text x="165" y="5" fill={OB.gold} fontSize="10" fontWeight="bold">Base = 4b</text>

                  <path d="M 0 0 Q 80 0 160 38 L 160 0 Z" fill="rgba(6,182,212,0.2)" stroke={OB.cyan} strokeWidth="1.5" />

                  <line x1="90" y1="-31" x2="90" y2="31" stroke="#f59e0b" strokeWidth="2.5" />
                  <circle cx="90" cy="0" r="3.5" fill="#f59e0b" />
                  <text x="90" y="-36" fill="#fde047" fontSize="9.5" fontWeight="bold" textAnchor="middle">Slice L(x)</text>
                  <text x="90" y="14" fill="#fde047" fontSize="9.5" textAnchor="middle">x</text>

                  <circle cx="53.3" cy="0" r="5" fill="#a855f7" stroke="#fff" strokeWidth="1.5" />
                  <text x="53.3" y="-10" fill="#d8b4fe" fontSize="10" fontWeight="bold" textAnchor="middle">Centroid (⅓ h)</text>
                </g>

                <rect x="25" y="378" width="550" height="74" rx="8" fill="rgba(15,23,42,0.95)" stroke="#334155" strokeWidth="1.5" />
                <text x="300" y="398" fill="#22d3ee" fontSize="11" fontWeight="bold" textAnchor="middle">
                  1. Tangent Property: Length in △ / Length in Parabola = h / x  ⟹  w(x) · h = L(x) · x (Lever Law!)
                </text>
                <text x="300" y="418" fill="#fde047" fontSize="11" fontWeight="bold" textAnchor="middle">
                  2. Sum of all slices: Area(Parabola) · h = Area(△ACD) · (⅓ h)   where Area(△ACD) = 4bh
                </text>
                <text x="300" y="438" fill={OB.green} fontSize="13" fontWeight="bold" textAnchor="middle">
                  3. Area(Parabola) · h = (4bh) · (⅓ h)  ⟹  Area = ⁴⁄₃ bh = ⁴⁄₃ Inscribed Triangle! (Q.E.D.)
                </text>
              </g>
            )}

            {/* 2. GEOMETRIC INSCRIBED TRIANGLES VIEW */}
            {parabolaAreaMode === 'series' && (
              <g>
                {/* 2A. DETAILED PROOF VIEW: WHY △ABE = 1/8 T */}
                {seriesDetailMode === 'proof' && (
                  <g>
                    {/* Parabola curve */}
                    <path d={proofParabolaPath} fill="rgba(6,182,212,0.06)" stroke={OB.cyan} strokeWidth="2.5" />

                    {/* Main Inscribed Triangle AEF (Dashed reference) */}
                    <polygon points="200,95 85,320 315,320" fill="rgba(30,58,138,0.18)" stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="4,4" />
                    <text x="250" y="314" fill="#60a5fa" fontSize="9.5" fontWeight="bold">Main △AEF (Area T)</text>

                    {/* Horizontal Base line of AEF */}
                    <line x1="85" y1="320" x2="315" y2="320" stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="3,3" />

                    {/* Top Triangle ABC */}
                    <polygon points="200,95 142.5,151.25 257.5,151.25" fill="rgba(245,158,11,0.18)" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="3,2" />
                    <text x="200" y="126" fill="#fde047" fontSize="10" fontWeight="bold" textAnchor="middle">Top △ABC = ⅛ T</text>
                    
                    {/* Horizontal Chord BC */}
                    <line x1="142.5" y1="151.25" x2="257.5" y2="151.25" stroke="#f59e0b" strokeWidth="2" strokeDasharray="4,2" />
                    <text x="200" y="142" fill="#fde047" fontSize="8" fontWeight="bold" textAnchor="middle">Base BC = b (½ Base of AEF)</text>

                    {/* Vertical height drop for △ABC */}
                    <line x1="200" y1="95" x2="200" y2="151.25" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="2,2" />
                    <text x="206" y="110" fill="#fde047" fontSize="8" fontStyle="italic">H = ¼ h</text>

                    {/* ── GREEN TRIANGLE ABE: SUB-TRIANGLES & ALTITUDES ── */}
                    {/* Upper sub-triangle △ABM1 */}
                    <polygon points="200,95 142.5,151.25 142.5,207.5" fill="rgba(6,182,212,0.45)" stroke="#06b6d4" strokeWidth="2" />
                    <text x="168" y="160" fill="#67e8f9" fontSize="9" fontWeight="bold">△ABM₁ = ⅟₁₆ T</text>

                    {/* Lower sub-triangle △EBM1 */}
                    <polygon points="85,320 142.5,151.25 142.5,207.5" fill="rgba(16,185,129,0.45)" stroke="#10b981" strokeWidth="2" />
                    <text x="122" y="240" fill="#6ee7b7" fontSize="9" fontWeight="bold">△EBM₁ = ⅟₁₆ T</text>

                    {/* Chord AE */}
                    <line x1="200" y1="95" x2="85" y2="320" stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="4,3" />

                    {/* Vertical line through x = 142.5 (extended guide) */}
                    <line x1="142.5" y1="95" x2="142.5" y2="320" stroke="#475569" strokeWidth="1" strokeDasharray="2,2" opacity="0.6" />

                    {/* Alt 1: Horizontal drop from A(200,95) to x = 142.5 */}
                    <line x1="200" y1="95" x2="142.5" y2="95" stroke="#06b6d4" strokeWidth="2" strokeDasharray="3,2" />
                    {/* Right angle symbol at (142.5,95) */}
                    <polyline points="150.5,95 150.5,103 142.5,103" fill="none" stroke="#06b6d4" strokeWidth="1.5" />
                    <text x="171" y="88" fill="#67e8f9" fontSize="9" fontWeight="bold" textAnchor="middle">Alt₁ = ½ b</text>

                    {/* Alt 2: Horizontal drop from E(85,320) to x = 142.5 */}
                    <line x1="85" y1="320" x2="142.5" y2="320" stroke="#10b981" strokeWidth="2" strokeDasharray="3,2" />
                    {/* Right angle symbol at (142.5,320) */}
                    <polyline points="134.5,320 134.5,312 142.5,312" fill="none" stroke="#10b981" strokeWidth="1.5" />
                    <text x="114" y="314" fill="#6ee7b7" fontSize="9" fontWeight="bold" textAnchor="middle">Alt₂ = ½ b</text>

                    {/* Total Horizontal Span dimension line */}
                    <g transform="translate(0, 338)">
                      <line x1="85" y1="0" x2="200" y2="0" stroke="#f1f5f9" strokeWidth="1.5" />
                      <polygon points="85,0 91,-3 91,3" fill="#f1f5f9" />
                      <polygon points="200,0 194,-3 194,3" fill="#f1f5f9" />
                      <line x1="85" y1="-5" x2="85" y2="5" stroke="#f1f5f9" strokeWidth="1.5" />
                      <line x1="200" y1="-5" x2="200" y2="5" stroke="#f1f5f9" strokeWidth="1.5" />
                      <text x="142.5" y="14" fill="#f1f5f9" fontSize="8.5" fontWeight="bold" textAnchor="middle">
                        Total Horizontal Span = Alt₁ + Alt₂ = ½ b + ½ b = b
                      </text>
                    </g>

                    {/* Vertical Sagitta BM1 (Vertical Base of △ABE) */}
                    <line x1="142.5" y1="151.25" x2="142.5" y2="207.5" stroke="#f43f5e" strokeWidth="3.5" />
                    <polygon points="142.5,148 138.5,156 146.5,156" fill="#f43f5e" />
                    <polygon points="142.5,210.5 138.5,202.5 146.5,202.5" fill="#f43f5e" />
                    <text x="136" y="175" fill="#fb7185" fontSize="9" fontWeight="bold" textAnchor="end">
                      Sagitta BM₁ = ¼ h
                    </text>
                    <text x="136" y="187" fill="#fca5a5" fontSize="7.5" textAnchor="end">
                      (Vertical Base)
                    </text>

                    {/* Symmetrical Right Triangle ACF */}
                    <polygon points="200,95 257.5,151.25 315,320" fill="rgba(16,185,129,0.22)" stroke="#10b981" strokeWidth="1.5" />
                    <line x1="257.5" y1="151.25" x2="257.5" y2="207.5" stroke="#f43f5e" strokeWidth="2" strokeDasharray="3,2" />
                    <text x="285" y="226" fill="#6ee7b7" fontSize="9" fontWeight="bold">△ACF = ⅛ T</text>
                    <text x="285" y="238" fill="#94a3b8" fontSize="7.5">(Symmetric)</text>

                    {/* Vertex Points & Coordinates */}
                    {/* A(0,0) */}
                    <circle cx="200" cy="95" r="4.5" fill="#38bdf8" stroke="#fff" strokeWidth="1.5" />
                    <text x="200" y="83" fill="#38bdf8" fontSize="11" fontWeight="bold" textAnchor="middle">A (0, 0)</text>

                    {/* B(-b/2, h/4) */}
                    <circle cx="142.5" cy="151.25" r="4.5" fill="#34d399" stroke="#fff" strokeWidth="1.5" />
                    <text x="136" y="146" fill="#34d399" fontSize="10" fontWeight="bold" textAnchor="end">B (-½b, ¼h)</text>

                    {/* C(+b/2, h/4) */}
                    <circle cx="257.5" cy="151.25" r="4.5" fill="#34d399" stroke="#fff" strokeWidth="1.5" />
                    <text x="264" y="146" fill="#34d399" fontSize="10" fontWeight="bold">C (+½b, ¼h)</text>

                    {/* M1(-b/2, h/2) */}
                    <circle cx="142.5" cy="207.5" r="4" fill="#f43f5e" stroke="#fff" strokeWidth="1" />
                    <text x="149" y="212" fill="#fb7185" fontSize="9" fontWeight="bold">M₁ (-½b, ½h)</text>

                    {/* E(-b, h) */}
                    <circle cx="85" cy="320" r="4.5" fill="#60a5fa" stroke="#fff" strokeWidth="1.5" />
                    <text x="78" y="326" fill="#60a5fa" fontSize="10.5" fontWeight="bold" textAnchor="end">E (-b, h)</text>

                    {/* F(+b, h) */}
                    <circle cx="315" cy="320" r="4.5" fill="#60a5fa" stroke="#fff" strokeWidth="1.5" />
                    <text x="322" y="326" fill="#60a5fa" fontSize="10.5" fontWeight="bold">F (+b, h)</text>

                    {/* ── CARD ON RIGHT: EXACT MATHEMATICAL PROOF ── */}
                    <g transform="translate(345, 68)">
                      <rect x="0" y="0" width="242" height="302" rx="8" fill="rgba(15,23,42,0.96)" stroke="#0284c7" strokeWidth="1.5" />
                      <text x="121" y="18" fill="#38bdf8" fontSize="11" fontWeight="bold" textAnchor="middle">
                        Proof: Area(△ABE) = ⅛ T
                      </text>

                      {/* 1. Sagitta */}
                      <rect x="8" y="26" width="226" height="48" rx="5" fill="rgba(244,63,94,0.12)" stroke="rgba(244,63,94,0.4)" />
                      <text x="14" y="39" fill="#fb7185" fontSize="9.5" fontWeight="bold">1. What is Sagitta ("Arrow") BM₁?</text>
                      <text x="14" y="52" fill="#e2e8f0" fontSize="8.5">• Chord AE midpoint: M₁(-½b, ½h)</text>
                      <text x="14" y="64" fill="#e2e8f0" fontSize="8.5">• Parabola vertex: B(-½b, ¼h) ⟹ <tspan fill="#fca5a5" fontWeight="bold">BM₁ = ¼ h</tspan></text>

                      {/* 2. Horizontal Span */}
                      <rect x="8" y="78" width="226" height="48" rx="5" fill="rgba(6,182,212,0.12)" stroke="rgba(6,182,212,0.4)" />
                      <text x="14" y="91" fill="#38bdf8" fontSize="9.5" fontWeight="bold">2. What is "Horizontal Span is b"?</text>
                      <text x="14" y="104" fill="#e2e8f0" fontSize="8.5">• Base BM₁ is vertical (x = -½b)</text>
                      <text x="14" y="116" fill="#e2e8f0" fontSize="8.5">• Alt from A = ½b, Alt from E = ½b ⟹ <tspan fill="#67e8f9" fontWeight="bold">Span = b</tspan></text>

                      {/* 3. Sub-Triangles */}
                      <rect x="8" y="130" width="226" height="58" rx="5" fill="rgba(16,185,129,0.12)" stroke="rgba(16,185,129,0.4)" />
                      <text x="14" y="143" fill="#34d399" fontSize="9.5" fontWeight="bold">3. Sub-Triangles Formula Proof:</text>
                      <text x="14" y="156" fill="#e2e8f0" fontSize="8.5">• Area(△ABM₁) = ½ · (¼h) · (½b) = <tspan fill="#67e8f9" fontWeight="bold">⅟₁₆ T</tspan></text>
                      <text x="14" y="168" fill="#e2e8f0" fontSize="8.5">• Area(△EBM₁) = ½ · (¼h) · (½b) = <tspan fill="#34d399" fontWeight="bold">⅟₁₆ T</tspan></text>
                      <text x="14" y="180" fill="#a7f3d0" fontSize="9" fontWeight="bold">⟹ Area(△ABE) = ⅟₁₆ T + ⅟₁₆ T = ⅛ T!</text>

                      {/* 4. Top vs Side */}
                      <rect x="8" y="192" width="226" height="52" rx="5" fill="rgba(245,158,11,0.12)" stroke="rgba(245,158,11,0.4)" />
                      <text x="14" y="205" fill="#fde047" fontSize="9.5" fontWeight="bold">4. Top △ABC vs Green △ABE:</text>
                      <text x="14" y="218" fill="#e2e8f0" fontSize="8.5">• Top △ABC: Base b, Height ¼h ⟹ <tspan fill="#fde047" fontWeight="bold">⅛ T</tspan></text>
                      <text x="14" y="230" fill="#e2e8f0" fontSize="8.5">• Side △ABE: Base ¼h, Span b ⟹ <tspan fill="#34d399" fontWeight="bold">⅛ T</tspan></text>
                      <text x="14" y="240" fill="#94a3b8" fontSize="8">(Identical area, base/height rotated 90°!)</text>

                      {/* 5. Stage 1 Total */}
                      <rect x="8" y="248" width="226" height="46" rx="5" fill="rgba(168,85,247,0.15)" stroke="rgba(168,85,247,0.4)" />
                      <text x="14" y="261" fill="#d8b4fe" fontSize="9.5" fontWeight="bold">5. Stage 1 Green Total = ¼ T:</text>
                      <text x="14" y="274" fill="#e2e8f0" fontSize="8.5">• Right △ACF is symmetric = ⅛ T</text>
                      <text x="14" y="287" fill="#f1f5f9" fontSize="9" fontWeight="extrabold">Total Green = ⅛ T + ⅛ T = <tspan fill="#34d399">¼ T</tspan> (2nd term!)</text>
                    </g>

                    {/* Bottom Summary Bar */}
                    <rect x="25" y="378" width="550" height="74" rx="8" fill="rgba(15,23,42,0.95)" stroke="#334155" strokeWidth="1.5" />
                    <text x="300" y="398" fill="#38bdf8" fontSize="11" fontWeight="bold" textAnchor="middle">
                      Formula: Area(△ABE) = ½ · Base(Sagitta BM₁) · Span = ½ · (¼ h) · b = ⅛ bh = ⅛ T
                    </text>
                    <text x="300" y="418" fill="#fde047" fontSize="11" fontWeight="bold" textAnchor="middle">
                      Two Halves: Area(△ABM₁) [⅟₁₆ T] + Area(△EBM₁) [⅟₁₆ T] = ⅛ T   |   Symmetric △ACF = ⅛ T
                    </text>
                    <text x="300" y="438" fill={OB.green} fontSize="12.5" fontWeight="bold" textAnchor="middle">
                      Stage 1 Green Total = ⅛ T + ⅛ T = ¼ T   ⟹   Infinite Series: T · [ 1 + ¼ + ⅟₁₆ + ... ] = ⁴⁄₃ T = ⁴⁄₃ bh! (Q.E.D.)
                    </text>
                  </g>
                )}

                {/* 2B. MULTI-LAYER EXHAUSTION VIEW */}
                {seriesDetailMode === 'layers' && (
                  <g>
                    <path d={parabolaPath} fill="rgba(6,182,212,0.12)" stroke={OB.cyan} strokeWidth="2" />

                    {/* Main Inscribed Triangle (Stage 0: Area T = bh) */}
                    <polygon points={`${vx},${vy} ${vx - b},${vy + h} ${vx + b},${vy + h}`}
                      fill="rgba(37,99,235,0.35)" stroke="#2563eb" strokeWidth="2" />
                    <text x={vx} y={vy + h * 0.65} fill="#93c5fd" fontSize="14" fontWeight="extrabold" textAnchor="middle">
                      Main △ AEF: Area T = bh
                    </text>

                    {/* Vertex labels A, E, F */}
                    <circle cx={vx} cy={vy} r="4" fill="#38bdf8" />
                    <text x={vx} y={vy - 10} fill="#38bdf8" fontSize="13" fontWeight="bold" textAnchor="middle">A</text>
                    <circle cx={vx - b} cy={vy + h} r="4" fill="#60a5fa" />
                    <text x={vx - b - 12} y={vy + h + 6} fill="#60a5fa" fontSize="13" fontWeight="bold" textAnchor="end">E</text>
                    <circle cx={vx + b} cy={vy + h} r="4" fill="#60a5fa" />
                    <text x={vx + b + 12} y={vy + h + 6} fill="#60a5fa" fontSize="13" fontWeight="bold">F</text>

                    {/* Stage 1: 2 Triangles of area 1/8 T each (combined 1/4 T) */}
                    {parabolaExhaustionStage >= 1 && (
                      <g>
                        <polygon points={`${vx},${vy} ${vx - b * 0.5},${vy + h * 0.25} ${vx - b},${vy + h}`}
                          fill="rgba(16,185,129,0.4)" stroke="#10b981" strokeWidth="1.5" />
                        <text x={vx - b * 0.5 - 28} y={vy + h * 0.38} fill="#6ee7b7" fontSize="11" fontWeight="bold">△ABE = ⅛ T</text>

                        <polygon points={`${vx},${vy} ${vx + b * 0.5},${vy + h * 0.25} ${vx + b},${vy + h}`}
                          fill="rgba(16,185,129,0.4)" stroke="#10b981" strokeWidth="1.5" />
                        <text x={vx + b * 0.5 + 16} y={vy + h * 0.42} fill="#6ee7b7" fontSize="10.5" fontWeight="bold">△ACF = ⅛ T</text>

                        <circle cx={vx - b * 0.5} cy={vy + h * 0.25} r="4.5" fill="#34d399" stroke="#fff" strokeWidth="1.5" />
                        <text x={vx - b * 0.5 - 10} y={vy + h * 0.25 - 6} fill="#34d399" fontSize="13" fontWeight="bold" textAnchor="end">B</text>

                        <circle cx={vx + b * 0.5} cy={vy + h * 0.25} r="4.5" fill="#34d399" stroke="#fff" strokeWidth="1.5" />
                        <text x={vx + b * 0.5 + 10} y={vy + h * 0.25 - 6} fill="#34d399" fontSize="13" fontWeight="bold">C</text>

                        <line x1={vx - b * 0.5} y1={vy + h * 0.25} x2={vx + b * 0.5} y2={vy + h * 0.25}
                          stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="4,3" opacity="0.8" />
                        <text x={vx} y={vy + h * 0.22} fill="#fde047" fontSize="9.5" fontWeight="bold" textAnchor="middle">
                          Line BC = b (½ base of AEF)
                        </text>

                        <circle cx={vx - b * 0.5} cy={vy + h * 0.5} r="4" fill="#f43f5e" />
                        <text x={vx - b * 0.5 + 12} y={vy + h * 0.5 + 4} fill="#f43f5e" fontSize="10" fontWeight="bold">M₁ (mid chord AE)</text>

                        <line x1={vx - b * 0.5} y1={vy + h * 0.25} x2={vx - b * 0.5} y2={vy + h * 0.5}
                          stroke="#f43f5e" strokeWidth="3" />
                        <polygon points={`${vx - b * 0.5},${vy + h * 0.25 - 2} ${vx - b * 0.5 - 4},${vy + h * 0.25 + 6} ${vx - b * 0.5 + 4},${vy + h * 0.25 + 6}`} fill="#f43f5e" />
                        <text x={vx - b * 0.5 - 12} y={vy + h * 0.40} fill="#fca5a5" fontSize="10" fontWeight="bold" textAnchor="end">
                          Sagitta BM₁ = ¼ h
                        </text>
                      </g>
                    )}

                    {/* Stage 2: 4 Triangles of area 1/64 T each (combined 1/16 T) */}
                    {parabolaExhaustionStage >= 2 && (
                      <g>
                        <polygon points={`${vx},${vy} ${vx - b * 0.25},${vy + h * 0.0625} ${vx - b * 0.5},${vy + h * 0.25}`} fill="rgba(234,179,8,0.5)" stroke="#eab308" strokeWidth="1" />
                        <polygon points={`${vx - b * 0.5},${vy + h * 0.25} ${vx - b * 0.75},${vy + h * 0.5625} ${vx - b},${vy + h}`} fill="rgba(234,179,8,0.5)" stroke="#eab308" strokeWidth="1" />
                        <polygon points={`${vx},${vy} ${vx + b * 0.25},${vy + h * 0.0625} ${vx + b * 0.5},${vy + h * 0.25}`} fill="rgba(234,179,8,0.5)" stroke="#eab308" strokeWidth="1" />
                        <polygon points={`${vx + b * 0.5},${vy + h * 0.25} ${vx + b * 0.75},${vy + h * 0.5625} ${vx + b},${vy + h}`} fill="rgba(234,179,8,0.5)" stroke="#eab308" strokeWidth="1" />
                        <text x={vx - b - 18} y={vy + h * 0.7} fill="#fde047" fontSize="9.5" fontWeight="bold">4 × ⅙₄ T = ⅟₁₆ T</text>
                      </g>
                    )}

                    {/* Stage 3: 8 Triangles of area 1/512 T each (combined 1/64 T) */}
                    {parabolaExhaustionStage >= 3 && (
                      <g>
                        <polygon points={`${vx},${vy} ${vx - b * 0.125},${vy + h * 0.0156} ${vx - b * 0.25},${vy + h * 0.0625}`} fill="rgba(168,85,247,0.55)" stroke="#a855f7" strokeWidth="0.8" />
                        <polygon points={`${vx - b * 0.25},${vy + h * 0.0625} ${vx - b * 0.375},${vy + h * 0.1406} ${vx - b * 0.5},${vy + h * 0.25}`} fill="rgba(168,85,247,0.55)" stroke="#a855f7" strokeWidth="0.8" />
                        <polygon points={`${vx - b * 0.5},${vy + h * 0.25} ${vx - b * 0.625},${vy + h * 0.3906} ${vx - b * 0.75},${vy + h * 0.5625}`} fill="rgba(168,85,247,0.55)" stroke="#a855f7" strokeWidth="0.8" />
                        <polygon points={`${vx - b * 0.75},${vy + h * 0.5625} ${vx - b * 0.875},${vy + h * 0.7656} ${vx - b},${vy + h}`} fill="rgba(168,85,247,0.55)" stroke="#a855f7" strokeWidth="0.8" />
                        <polygon points={`${vx},${vy} ${vx + b * 0.125},${vy + h * 0.0156} ${vx + b * 0.25},${vy + h * 0.0625}`} fill="rgba(168,85,247,0.55)" stroke="#a855f7" strokeWidth="0.8" />
                        <polygon points={`${vx + b * 0.25},${vy + h * 0.0625} ${vx + b * 0.375},${vy + h * 0.1406} ${vx + b * 0.5},${vy + h * 0.25}`} fill="rgba(168,85,247,0.55)" stroke="#a855f7" strokeWidth="0.8" />
                        <polygon points={`${vx + b * 0.5},${vy + h * 0.25} ${vx + b * 0.625},${vy + h * 0.3906} ${vx + b * 0.75},${vy + h * 0.5625}`} fill="rgba(168,85,247,0.55)" stroke="#a855f7" strokeWidth="0.8" />
                        <polygon points={`${vx + b * 0.75},${vy + h * 0.5625} ${vx + b * 0.875},${vy + h * 0.7656} ${vx + b},${vy + h}`} fill="rgba(168,85,247,0.55)" stroke="#a855f7" strokeWidth="0.8" />
                        <text x={vx + b + 18} y={vy + h * 0.7} fill="#d8b4fe" fontSize="9.5" fontWeight="bold">8 × ⅟₅₁₂ T = ⅟₆₄ T</text>
                      </g>
                    )}

                    {/* Stage controls */}
                    <g transform="translate(45, 95)">
                      <rect x="0" y="0" width="125" height="52" rx="6" fill="rgba(15,23,42,0.9)" stroke="#334155" />
                      <text x="62" y="16" fill="#38bdf8" fontSize="10" fontWeight="bold" textAnchor="middle">Exhaustion Layers:</text>
                      <g className="cursor-pointer" onClick={() => setParabolaExhaustionStage(1)}>
                        <rect x="8" y="24" width="32" height="20" rx="4" fill={parabolaExhaustionStage === 1 ? '#0284c7' : '#1e293b'} stroke="#64748b" />
                        <text x="24" y="38" fill="#fff" fontSize="10" fontWeight="bold" textAnchor="middle">1</text>
                      </g>
                      <g className="cursor-pointer" onClick={() => setParabolaExhaustionStage(2)}>
                        <rect x="46" y="24" width="32" height="20" rx="4" fill={parabolaExhaustionStage === 2 ? '#0284c7' : '#1e293b'} stroke="#64748b" />
                        <text x="62" y="38" fill="#fff" fontSize="10" fontWeight="bold" textAnchor="middle">2</text>
                      </g>
                      <g className="cursor-pointer" onClick={() => setParabolaExhaustionStage(3)}>
                        <rect x="84" y="24" width="32" height="20" rx="4" fill={parabolaExhaustionStage === 3 ? '#0284c7' : '#1e293b'} stroke="#64748b" />
                        <text x="100" y="38" fill="#fff" fontSize="10" fontWeight="bold" textAnchor="middle">3</text>
                      </g>
                    </g>

                    {/* Geometric ratio breakdown card */}
                    <g transform="translate(432, 70)">
                      <rect x="0" y="0" width="160" height="198" rx="8" fill="rgba(15,23,42,0.94)" stroke="#334155" strokeWidth="1.5" />
                      <text x="80" y="18" fill="#38bdf8" fontSize="10.5" fontWeight="bold" textAnchor="middle">Why Green Area = ¼ T</text>
                      
                      <text x="8" y="35" fill="#cbd5e1" fontSize="9">1. <tspan fill="#fde047" fontWeight="bold">Top △ABC</tspan> (horizontal base):</text>
                      <text x="14" y="48" fill="#94a3b8" fontSize="8.5">Base BC = b, Height = ¼ h</text>
                      <text x="14" y="60" fill="#fde047" fontSize="9" fontWeight="bold">⟹ Area(△ABC) = ⅛ T</text>
                      
                      <text x="8" y="77" fill="#cbd5e1" fontSize="9">2. <tspan fill="#34d399" fontWeight="bold">Green △ABE</tspan> (vertical base):</text>
                      <text x="14" y="90" fill="#94a3b8" fontSize="8.5">Sagitta BM₁ = ¼ h, Span = b</text>
                      <text x="14" y="102" fill="#34d399" fontSize="9" fontWeight="bold">⟹ Area(△ABE) = ⅛ T</text>

                      <text x="8" y="119" fill="#cbd5e1" fontSize="9">3. <tspan fill="#34d399" fontWeight="bold">Green △ACF</tspan> (symmetric):</text>
                      <text x="14" y="132" fill="#34d399" fontSize="9" fontWeight="bold">⟹ Area(△ACF) = ⅛ T</text>

                      <line x1="6" y1="140" x2="166" y2="140" stroke="#334155" strokeWidth="1" />
                      
                      <text x="8" y="154" fill="#fff" fontSize="9" fontWeight="bold">Stage 1 Green Total:</text>
                      <text x="8" y="169" fill="#34d399" fontSize="10.5" fontWeight="extrabold">⅛ T + ⅛ T = ¼ T</text>
                      <text x="8" y="183" fill="#fde047" fontSize="8.5" fontWeight="bold">Stage 2 (4 △s) = 4 × ⅟₆₄ T = ⅟₁₆ T</text>
                      <text x="8" y="195" fill="#38bdf8" fontSize="8" fontWeight="bold">General: 2ᵏ × (⅛)ᵏ T = (¼)ᵏ T</text>
                    </g>

                    <rect x="25" y="378" width="550" height="74" rx="8" fill="rgba(15,23,42,0.95)" stroke="#334155" strokeWidth="1.5" />
                    <text x="300" y="398" fill="#38bdf8" fontSize="11" fontWeight="bold" textAnchor="middle">
                      1. Prop 21: Each inscribed △ has ½ base × ¼ sagitta height = ⅛ of previous △ area!
                    </text>
                    <text x="300" y="418" fill="#fde047" fontSize="11" fontWeight="bold" textAnchor="middle">
                      2. Layer k has 2ᵏ triangles: Total = 2ᵏ · (⅛)ᵏ T = (¼)ᵏ T  ⟹  T + ¼ T + ⅟₁₆ T + ⅟₆₄ T + ...
                    </text>
                    <text x="300" y="438" fill={OB.green} fontSize="12.5" fontWeight="bold" textAnchor="middle">
                      3. Archimedes' Sum: T · [ 1 + ¼ + ⅟₁₆ + ... + ⅓(¼)ⁿ ] = ⁴⁄₃ T = ⁴⁄₃ bh! (Q.E.D.)
                    </text>
                  </g>
                )}
              </g>
            )}
          </g>
        )}

        {/* ── STEP 2: Proof: Total Moment = 4/5 bh² (NO CALCULUS) ── */}
        {step === 2 && (
          <g>
            <rect x="25" y="10" width="550" height="34" rx="6" fill="rgba(244,63,94,0.18)" stroke="#f43f5e" strokeWidth="1.5" />
            <text x="300" y="32" fill="#fb7185" fontSize="13" fontWeight="bold" textAnchor="middle">
              Step 3 — Proof: Total Moment = ⁴⁄₅ bh² (Sum of Squares &amp; Step-Polygon Exhaustion)
            </text>

            <path d={parabolaPath} fill="none" stroke="#475569" strokeWidth="1.5" strokeDasharray="3,3" />

            {[1, 2, 3, 4, 5].map((k) => {
              const n = 5;
              const yTop = vy + ((k - 1) / n) * h;
              const yBot = vy + (k / n) * h;
              const stripH = h / n;
              const halfW_in = b * Math.sqrt((k - 1) / n);
              const halfW_out = b * Math.sqrt(k / n);

              return (
                <g key={k}>
                  <rect x={vx - halfW_out} y={yTop} width={2 * halfW_out} height={stripH}
                    fill="none" stroke={OB.gold} strokeWidth="1" strokeDasharray="3,2" opacity="0.6" />

                  {halfW_in > 0 && (
                    <rect x={vx - halfW_in} y={yTop} width={2 * halfW_in} height={stripH}
                      fill="rgba(6,182,212,0.22)" stroke={OB.cyan} strokeWidth="1.5" />
                  )}

                  <circle cx={vx} cy={(yTop + yBot) / 2} r="3" fill="#f59e0b" />
                </g>
              );
            })}

            <line x1={vx} y1={vy} x2={vx} y2={vy + h} stroke="#64748b" strokeWidth="2" strokeDasharray="4,4" />
            <circle cx={vx} cy={vy} r="5" fill={OB.cyan} />
            <text x={vx} y={vy - 8} fill={OB.cyan} fontSize="12" fontWeight="bold" textAnchor="middle">Fulcrum V (x = 0)</text>

            <g transform="translate(420, 80)">
              <rect x="0" y="0" width="165" height="150" rx="8" fill="rgba(15,23,42,0.9)" stroke="#334155" strokeWidth="1.5" />
              <text x="82" y="20" fill="#fde047" fontSize="11" fontWeight="bold" textAnchor="middle">Archimedes' Lemma</text>
              <text x="12" y="42" fill="#cbd5e1" fontSize="10">• Slice at distance x has</text>
              <text x="12" y="56" fill="#38bdf8" fontSize="10">  torque τ = x · w(x)</text>
              <text x="12" y="76" fill="#cbd5e1" fontSize="10">• Along base y: x ∝ y²</text>
              <text x="12" y="94" fill="#cbd5e1" fontSize="10">• Strip moments sum as</text>
              <text x="12" y="110" fill={OB.gold} fontSize="10.5" fontWeight="bold">  squares 1² + 2² + ... + n²</text>
              <text x="82" y="134" fill="#34d399" fontSize="10.5" fontWeight="extrabold" textAnchor="middle">Ratio = ⁴⁄₅ (Proved in Prop 10)</text>
            </g>

            <g transform="translate(15, 80)">
              <rect x="0" y="0" width="160" height="150" rx="8" fill="rgba(15,23,42,0.9)" stroke="#334155" strokeWidth="1.5" />
              <text x="80" y="20" fill="#fb7185" fontSize="11" fontWeight="bold" textAnchor="middle">Torque Balance</text>
              <text x="10" y="44" fill="#cbd5e1" fontSize="10">• Inscribed strips &lt; True</text>
              <text x="10" y="62" fill="#cbd5e1" fontSize="10">• Circumscribed &gt; True</text>
              <text x="10" y="86" fill="#cbd5e1" fontSize="10">• The slices balance a</text>
              <text x="10" y="102" fill="#fb7185" fontSize="10.5" fontWeight="bold">  counterweight ⁴⁄₅ bh</text>
              <text x="10" y="118" fill="#fb7185" fontSize="10.5" fontWeight="bold">  placed at arm length h!</text>
              <text x="80" y="138" fill="#38bdf8" fontSize="10" fontWeight="bold" textAnchor="middle">τ = (⁴⁄₅ bh) · h = ⁴⁄₅ bh²</text>
            </g>

            <rect x="25" y="378" width="550" height="74" rx="8" fill="rgba(15,23,42,0.95)" stroke="#334155" strokeWidth="1.5" />
            <text x="300" y="398" fill="#fb7185" fontSize="11" fontWeight="bold" textAnchor="middle">
              1. In On Conoids &amp; Spheroids (Prop 10), Archimedes proved the sum of consecutive squares identity.
            </text>
            <text x="300" y="418" fill="#fde047" fontSize="11" fontWeight="bold" textAnchor="middle">
              2. Slicing into step-polygons: Σ(Inscribed Moments) &lt; Total Moment &lt; Σ(Circumscribed Moments).
            </text>
            <text x="300" y="438" fill={OB.green} fontSize="12.5" fontWeight="bold" textAnchor="middle">
              3. By double exhaustion, the unique balancing torque is strictly Total Moment = ⁴⁄₅ bh²! (No calculus)
            </text>
          </g>
        )}

        {/* ── STEP 3: Centroid Position at 3/5 h & Exact 3:2 Ratio ── */}
        {step === 3 && (
          <g>
            <rect x="25" y="10" width="550" height="34" rx="6" fill="rgba(6,182,212,0.18)" stroke={OB.cyan} strokeWidth="1.5" />
            <text x="300" y="32" fill={OB.cyan} fontSize="13" fontWeight="bold" textAnchor="middle">
              Step 4 — Centroid Position: x̄ = ⅗ h  (Ratio 3 : 2 from Vertex to Base)
            </text>

            <polygon points="260,210 240,270 280,270" fill={OB.gold} fillOpacity="0.85" stroke="#d97706" strokeWidth="2" />
            <line x1="60" y1="270" x2="540" y2="270" stroke={OB.dim} strokeWidth="2" />
            <text x="260" y="288" fill={OB.gold} fontSize="12" fontWeight="bold" textAnchor="middle">Fulcrum V</text>

            <rect x="70" y="200" width="460" height="12" rx="3" fill="#475569" stroke="#94a3b8" strokeWidth="1.5" />

            <line x1="100" y1="206" x2="100" y2="100" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="3,3" />
            <line x1="100" y1="180" x2="260" y2="180" stroke="#f43f5e" strokeWidth="2" strokeDasharray="4,3" />
            <text x="180" y="174" fill="#f43f5e" fontSize="11" fontWeight="bold" textAnchor="middle">Arm Length = h</text>

            <g transform="translate(65, 78)">
              <rect x="0" y="0" width="70" height="62" rx="8" fill="rgba(244,63,94,0.85)" stroke="#fb7185" strokeWidth="2" />
              <text x="35" y="22" fill="#fff" fontSize="10.5" fontWeight="bold" textAnchor="middle">Reference</text>
              <text x="35" y="42" fill="#fecdd3" fontSize="13" fontWeight="extrabold" textAnchor="middle">⁴⁄₅ bh</text>
              <text x="35" y="56" fill="#ffe4e6" fontSize="9.5" textAnchor="middle">At distance h</text>
            </g>

            <g transform="translate(260, 206)">
              <line x1="0" y1="0" x2="160" y2="0" stroke={OB.cyan} strokeWidth="2" strokeDasharray="4,2" />
              
              <path
                d="M 160 -45 Q 0 0 160 45 Z"
                fill="rgba(6,182,212,0.25)"
                stroke={OB.cyan}
                strokeWidth="2"
              />
              <line x1="160" y1="-45" x2="160" y2="45" stroke={OB.gold} strokeWidth="2.5" />
              <text x="165" y="4" fill={OB.gold} fontSize="11" fontWeight="bold">Base (2b)</text>

              <line x1="96" y1="0" x2="96" y2="-75" stroke="#a855f7" strokeWidth="2" strokeDasharray="3,3" />
              <circle cx="96" cy="0" r="6" fill="#a855f7" stroke="#fff" strokeWidth="2" />
              <text x="96" y="16" fill="#a855f7" fontSize="11" fontWeight="bold" textAnchor="middle">Centroid G</text>
            </g>

            <g transform="translate(320, 78)">
              <rect x="0" y="0" width="76" height="62" rx="8" fill="rgba(6,182,212,0.85)" stroke="#67e8f9" strokeWidth="2" />
              <text x="38" y="22" fill="#fff" fontSize="10.5" fontWeight="bold" textAnchor="middle">Parabola Area</text>
              <text x="38" y="42" fill="#cffafe" fontSize="13" fontWeight="extrabold" textAnchor="middle">⁴⁄₃ bh</text>
              <text x="38" y="56" fill="#ecfeff" fontSize="9.5" textAnchor="middle">At x̄ = ⅗ h</text>
            </g>

            <line x1="260" y1="180" x2="356" y2="180" stroke="#a855f7" strokeWidth="2" strokeDasharray="4,3" />
            <text x="308" y="174" fill="#a855f7" fontSize="11" fontWeight="bold" textAnchor="middle">x̄ = ⅗ h (60%)</text>

            <rect x="210" y="80" width="100" height="24" rx="6" fill="rgba(16,185,129,0.2)" stroke="#10b981" strokeWidth="1.5" />
            <text x="260" y="96" fill="#34d399" fontSize="11" fontWeight="extrabold" textAnchor="middle">✓ BALANCE</text>

            <g transform="translate(435, 170)">
              <rect x="0" y="0" width="145" height="58" rx="6" fill="rgba(15,23,42,0.9)" stroke="#334155" />
              <text x="72" y="18" fill="#38bdf8" fontSize="10.5" fontWeight="bold" textAnchor="middle">Division Along Axis:</text>
              <text x="72" y="34" fill="#a5f3fc" fontSize="10" textAnchor="middle">Vertex to G: 3 parts (⅗ h)</text>
              <text x="72" y="48" fill="#fde68a" fontSize="10" textAnchor="middle">G to Base: 2 parts (⅖ h)</text>
            </g>

            <rect x="25" y="378" width="550" height="74" rx="8" fill="rgba(15,23,42,0.95)" stroke="#334155" strokeWidth="1.5" />
            <text x="300" y="398" fill="#f43f5e" fontSize="11.5" fontWeight="bold" textAnchor="middle">
              Left Torque: τ_left = (Reference Counterweight) · h = (⁴⁄₅ bh) · h = ⁴⁄₅ bh²
            </text>
            <text x="300" y="418" fill="#22d3ee" fontSize="11.5" fontWeight="bold" textAnchor="middle">
              Right Torque: τ_right = (Total Parabola Area) · x̄ = (⁴⁄₃ bh) · x̄
            </text>
            <text x="300" y="438" fill={OB.gold} fontSize="13" fontWeight="bold" textAnchor="middle">
              Balance: (⁴⁄₃ bh) · x̄ = ⁴⁄₅ bh²  ⟹  x̄ = (⁴⁄₅) / (⁴⁄₃) · h = ⅗ h  ⟹  Axis Ratio is 3 : 2! (Q.E.D.)
            </text>
          </g>
        )}
      </svg>
    );
  }, [step, parabolaPath, proofParabolaPath, parabolaSliceT, parabolaAreaMode, parabolaExhaustionStage, seriesDetailMode]);

  /* ═══════════════════════ LEFT SIDEBAR ═══════════════════════ */
  const leftPanel = (
    <div className="flex flex-col gap-3 h-full">
      {/* Header card */}
      <div className="bg-slate-900/90 border border-cyan-500/40 rounded-2xl p-4 shadow-xl shrink-0">
        <div className="flex items-center justify-between text-xs font-mono text-cyan-400 uppercase tracking-wider mb-1">
          <span>
            {activeSubtask === 1
              ? 'TASK 1: ON THE SPHERE & CYLINDER'
              : activeSubtask === 2
              ? 'TASK 2: EQUILIBRIUM OF PLANES (TRIANGLE)'
              : 'TASK 3: THE METHOD & QUADRATURE (PARABOLA)'}
          </span>
          <span className="text-amber-400 font-bold">c. 250 BC</span>
        </div>
        <h2 className="text-base font-serif font-bold text-white flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-cyan-400" />
          <span>
            {activeSubtask === 1
              ? 'Surface Area of a Sphere'
              : activeSubtask === 2
              ? 'Triangle Centroid & Law of the Lever'
              : 'Centroid & Quadrature of the Parabola'}
          </span>
        </h2>
        <p className="text-xs text-slate-300 mt-1 leading-relaxed">
          {activeSubtask === 1
            ? 'Discover how Archimedes proved that a sphere\'s surface area is 4πR² — exactly 2/3 of its circumscribed cylinder.'
            : activeSubtask === 2
            ? 'Explore the Law of the Lever, median concurrence, and the exact geometric proofs of the 2:1 centroid ratio.'
            : 'Master Archimedes\' authentic geometric & mechanical proofs without calculus: Area = 4/3 bh, Moment = 4/5 bh², and Centroid at 3/5 h (ratio 3:2).'}
        </p>
      </div>

      {/* Proof Step Navigator */}
      <div className="bg-slate-900/90 border border-cyan-500/20 rounded-2xl p-3 shadow-xl shrink-0">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase">
            {activeSubtask === 1
              ? 'On the Sphere & Cylinder'
              : activeSubtask === 2
              ? 'Equilibrium of Planes'
              : 'The Method of Mechanical Theorems'} • Proof
          </span>
          <span className="text-[10px] font-mono text-emerald-400 font-bold">Q.E.D.</span>
        </div>
        <div className="flex gap-1 mb-2">
          {[0, 1, 2, 3].map(i => (
            <div key={i} className={`h-1.5 flex-1 rounded-full transition-all ${
              i === step ? 'bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.6)]' : i < step ? 'bg-emerald-500' : 'bg-slate-800'
            }`} />
          ))}
        </div>
        <div className="text-[11px] text-slate-300 leading-relaxed mb-2">
          {activeSubtask === 1 && (
            <>
              {step === 0 && 'Step 1: Enclose a sphere of radius R inside a cylinder of radius R and height H = 2R.'}
              {step === 1 && 'Step 2: At any point P, slant element D and vertical drop d form a triangle similar to radius r and sphere radius R (d/D = r/R ⟹ D = dR/r). Zone Area = 2πr · D = 2πR·d. The r cancels out!'}
              {step === 2 && 'Step 3: Sum all zones: Σ 2πR·Δh = 2πR·(2R) = 4πR². The sphere equals exactly 4 great circles.'}
              {step === 3 && 'Step 4: Sphere Area = 4πR², Cylinder Total = 6πR². Ratio = 4/6 = 2/3. (Q.E.D.)'}
            </>
          )}
          {activeSubtask === 2 && (
            <>
              {step === 0 && 'Step 1 (Law of the Lever): Magnitudes balance at distances inversely proportional to their weights: W₁·d₁ = W₂·d₂.'}
              {step === 1 && (
                <div>
                  <strong className="text-cyan-300">Step 2 (Strip Method &amp; Concurrence):</strong> Slicing △ABC into horizontal strips parallel to BC proves the centroid must lie on median AD (every strip balances at its midpoint). Slicing parallel to AC and AB similarly places it on medians BE and CF. Therefore, all 3 medians intersect concurrently at centroid G!
                </div>
              )}
              {step === 2 && (
                <div className="space-y-1 text-[11px]">
                  <div className="font-bold text-emerald-400">Step 3 (Proof of 2:1 Ratio via Midline &amp; Similarity):</div>
                  <div>
                    <span className="text-amber-300 font-semibold">1. Midline:</span> Connect midpoints D &amp; E. By Midline Theorem, <span className="font-mono text-cyan-300">DE ∥ AB</span> and <span className="font-mono text-cyan-300">DE = ½ AB</span>.
                  </div>
                  <div>
                    <span className="text-amber-300 font-semibold">2. Similar Triangles:</span> Alternate interior angles match (<span className="font-mono text-amber-200">∠GAB = ∠GDE</span>, <span className="font-mono text-cyan-200">∠GBA = ∠GED</span>), so <span className="font-mono text-emerald-300">△ABG ∼ △DEG</span>.
                  </div>
                  <div>
                    <span className="text-amber-300 font-semibold">3. Ratio:</span> <span className="font-mono text-amber-300">AG / GD = AB / DE = 2 : 1</span>!
                  </div>
                </div>
              )}
              {step === 3 && (
                <div className="space-y-1 text-[11px]">
                  <div className="font-bold text-purple-400">Step 4 (Alternative Proof via Six Equal Areas):</div>
                  <div>
                    <span className="text-amber-300 font-semibold">1. Equal Areas:</span> Every median bisects triangle area. The 3 medians partition △ABC into 6 equal areas of <span className="font-mono text-cyan-300">⅙ Δ</span>.
                  </div>
                  <div>
                    <span className="text-amber-300 font-semibold">2. Triangle Areas:</span> <span className="font-mono text-emerald-300">Area(△ABG) = 2/6 Δ</span> and <span className="font-mono text-emerald-300">Area(△BGD) = 1/6 Δ</span>.
                  </div>
                  <div>
                    <span className="text-amber-300 font-semibold">3. Ratio:</span> Both share altitude from B onto line AD ⟹ Base Ratio <span className="font-mono text-amber-300">AG / GD = (2/6)/(1/6) = 2 : 1</span>!
                  </div>
                </div>
              )}
            </>
          )}
          {activeSubtask === 3 && (
            <>
              {step === 0 && (
                <div>
                  <strong className="text-cyan-300">Step 1 (Parabolic Segment &amp; Mechanical Lever):</strong> In The Method, Archimedes considers a parabolic segment of base 2b and height h. By the parabolic property y² = (b²/h)x, each slice at distance x from the vertex has width w(x) = 2b√(x/h). Archimedes sets up a lever with fulcrum at V and arms of length h.
                </div>
              )}
              {step === 1 && (
                <div className="space-y-1.5 text-[11px]">
                  <div className="font-bold text-emerald-400">Step 2 (Proof: Area = ⁴⁄₃ bh without Calculus):</div>
                  <div className="space-y-1 text-slate-300 text-[10.5px]">
                    <div>
                      <span className="text-rose-400 font-bold">1. Sagitta Height (BM₁ = ¼ h):</span> Midpoint of chord AE is <span className="font-mono text-rose-300">M₁(-½b, ½h)</span>. The vertical line through M₁ hits the parabola at vertex <span className="font-mono text-emerald-300">B(-½b, ¼h)</span>. Vertical distance <span className="font-mono text-rose-300 font-bold">BM₁ = ½h - ¼h = ¼ h</span> is the <span className="text-amber-300 font-semibold">Sagitta</span> (Latin for "arrow").
                    </div>
                    <div>
                      <span className="text-cyan-300 font-bold">2. Horizontal Span is b:</span> Using vertical segment BM₁ as the base, the altitudes from A(0,0) and E(-b,h) are horizontal: <span className="font-mono text-cyan-200">Alt₁ = ½ b</span> and <span className="font-mono text-cyan-200">Alt₂ = ½ b</span>. Total horizontal span = <span className="font-mono text-cyan-300 font-bold">Alt₁ + Alt₂ = b</span>.
                    </div>
                    <div>
                      <span className="text-emerald-300 font-bold">3. Exact Area Formula for △ABE:</span>
                      <div className="bg-slate-950/80 p-1.5 rounded border border-slate-800 font-mono text-[10px] text-center my-0.5">
                        Area(△ABE) = ½ · Base(BM₁) · Span = ½ · (¼ h) · b = <span className="text-emerald-300 font-bold">⅛ bh = ⅛ T</span>
                      </div>
                      Vertical line BM₁ splits △ABE into two sub-triangles: <span className="font-mono text-cyan-300">△ABM₁ (⅟₁₆ T)</span> + <span className="font-mono text-emerald-300">△EBM₁ (⅟₁₆ T)</span> = <span className="font-mono text-emerald-400 font-bold">⅛ T</span>!
                    </div>
                    <div>
                      <span className="text-amber-300 font-bold">4. Top △ABC vs Side △ABE:</span> Top △ABC has horizontal base BC = b and vertical height ¼ h ⟹ <span className="font-mono text-amber-300">⅛ T</span>. Side △ABE has vertical base ¼ h and horizontal span b ⟹ <span className="font-mono text-emerald-300">⅛ T</span>. Both have area ⅛ T (rotated 90°)!
                    </div>
                    <div>
                      <span className="text-purple-300 font-bold">5. Stage 1 Green = ¼ T &amp; Series:</span> Symmetrical △ACF on right side also = ⅛ T. Green Total = <span className="font-mono text-white font-bold">⅛ T + ⅛ T = ¼ T</span>. Each subsequent layer scales by (¼)ᵏ:
                      <div className="font-mono text-cyan-300 text-center text-[10px] font-semibold mt-0.5">
                        T · [ 1 + ¼ + ⅟₁₆ + ⅟₆₄ + ... ] = ⁴⁄₃ T = ⁴⁄₃ bh! (Q.E.D.)
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {step === 2 && (
                <div className="space-y-1 text-[11px]">
                  <div className="font-bold text-rose-400">Step 3 (Proof: Total Moment = ⁴⁄₅ bh² without Calculus):</div>
                  <div>
                    <span className="text-amber-300 font-semibold">1. Slice Torque:</span> Slice at distance x exerts torque <span className="font-mono text-cyan-200">x · w(x)</span> about vertex V.
                  </div>
                  <div>
                    <span className="text-amber-300 font-semibold">2. Sum of Squares:</span> Since x ∝ y², strip moments sum as integer squares 1² + 2² + ... + n². Archimedes' lemma in On Conoids and Spheroids (Prop 10) rigorously bounds the sum.
                  </div>
                  <div>
                    <span className="text-amber-300 font-semibold">3. Lever Balance:</span> By step-polygon exhaustion, the sum of all slice moments strictly equals <span className="font-mono text-amber-300">(⁴⁄₅ bh) · h = ⁴⁄₅ bh²</span>!
                  </div>
                </div>
              )}
              {step === 3 && (
                <div className="space-y-1 text-[11px]">
                  <div className="font-bold text-cyan-400">Step 4 (Centroid Position &amp; Exact 3 : 2 Ratio):</div>
                  <div>
                    <span className="text-amber-300 font-semibold">1. Center of Gravity:</span> Concentrating total weight ⁴⁄₃ bh at centroid x̄ must balance counterweight ⁴⁄₅ bh at distance h:
                  </div>
                  <div className="font-mono text-emerald-300 font-bold text-center">
                    (⁴⁄₃ bh) · x̄ = (⁴⁄₅ bh) · h  ⟹  x̄ = ⅗ h (60%)
                  </div>
                  <div>
                    <span className="text-amber-300 font-semibold">2. Ratio:</span> Distance from vertex is ⅗ h; distance from base is ⅖ h. The centroid divides the axis in the exact ratio <span className="font-bold text-amber-400">3 : 2</span>!
                  </div>
                </div>
              )}
            </>
          )}
        </div>
        <div className="flex items-center justify-between">
          <button onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0}
            className="px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-950 border border-slate-800 text-slate-300 disabled:opacity-40 transition cursor-pointer">
            ‹ Prev
          </button>
          <span className="text-xs font-mono font-bold text-cyan-400">Step {step + 1}/4</span>
          <button onClick={() => setStep(Math.min(3, step + 1))} disabled={step === 3}
            className="px-2.5 py-1 rounded-lg text-xs font-extrabold bg-cyan-500 text-slate-950 disabled:opacity-40 transition cursor-pointer">
            Next ›
          </button>
        </div>
      </div>

      {/* Quiz Panel */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3 shadow-xl flex-1 flex flex-col justify-between overflow-y-auto custom-scrollbar">
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-mono font-bold text-cyan-400">Q{qIdx + 1}/{questions.length}</span>
            <span className="text-[10px] font-mono text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">{curQ.concept}</span>
          </div>
          <div className="flex gap-1 mb-2">
            {questions.map((_, i) => (
              <div key={i} className={`h-1.5 flex-1 rounded-full transition-all ${
                i === qIdx ? 'bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.6)]' : answers[i] !== undefined ? 'bg-emerald-500' : 'bg-slate-800'
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
                    {String.fromCharCode(65 + i)}
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
          <button onClick={prevQ} disabled={qIdx === 0}
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
      {activeSubtask === 1 ? task1Canvas : activeSubtask === 2 ? task2Canvas : task3Canvas}
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
