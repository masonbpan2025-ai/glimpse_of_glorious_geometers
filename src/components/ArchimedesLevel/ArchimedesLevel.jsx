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

  /* ─── Task 3 State (Area of Parabola) ─── */
  const [task3Step, setTask3Step] = useState(0);
  const [parabolaSliceT, setParabolaSliceT] = useState(0.55); // scrub slice along axis in Step 0
  const [leverActiveHighlight, setLeverActiveHighlight] = useState(null); // Step 1 (Lever): null | 'tangent_triangle' | 'slice_balance' | 'triangle_centroid' | 'total_equilibrium'
  const [leverHoverHighlight, setLeverHoverHighlight] = useState(null);
  const leverHighlight = leverHoverHighlight || leverActiveHighlight;
  const [leverSliceU, setLeverSliceU] = useState(0.55); // scrub slice along chord in Step 1 (0.15 to 0.85)
  const [activeHighlight, setActiveHighlight] = useState(null); // Step 2 (Layer 1): null | 'sagitta' | 'span' | 'subtriangles' | 'topvsside' | 'totalgreen'
  const [hoverHighlight, setHoverHighlight] = useState(null);
  const proofHighlight = hoverHighlight || activeHighlight;
  const [layer2ActiveHighlight, setLayer2ActiveHighlight] = useState(null); // Step 3 (Layer 2): null | 'four_triangles' | 'halved_span' | 'quartered_sagitta' | 'single_area' | 'total_third_term'
  const [layer2HoverHighlight, setLayer2HoverHighlight] = useState(null);
  const layer2Highlight = layer2HoverHighlight || layer2ActiveHighlight;

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
    { id: 3, concept: 'Layer 1 Inscribed Triangle Area',
      question: 'In Layer 1 of the Quadrature, why does the left inscribed triangle △ABE have area equal to ⅛ T?',
      options: ['Its vertical sagitta is ¼h and its horizontal span is b, so Area = ½ · (¼h) · b = ⅛ bh = ⅛ T.', 'Because its base is ½b and its height is ½h.', 'Because it is similar to the main triangle with ratio 1:8.', 'By measuring the angles with a protractor.'],
      correct: 0, explanation: 'Using the vertical sagitta BM₁ = ¼h as base and the horizontal distance between A and E (span = b) as total altitude, Area = ½ · (¼h) · b = ⅛ bh = ⅛ T. With symmetrical △ACF = ⅛ T, Layer 1 total is ¼ T.' },
    { id: 4, concept: 'Layer 2: Why 3rd Term is ⅟₁₆ T',
      question: 'In Layer 2 of the exhaustion, why is the total area of the new inscribed triangles exactly ⅟₁₆ T (the 3rd term)?',
      options: ['There are 4 new triangles; each has halved span (½b) and quartered sagitta (⅟₁₆h), so each is ⅟₆₄ T. 4 × (⅟₆₄ T) = ⅟₁₆ T.', 'There are 2 new triangles of area ⅟₃₂ T each.', 'Each of the 4 triangles has area ⅟₁₆ T, summing to ¼ T.', 'Because the parabola is divided into 16 equal strips.'],
      correct: 0, explanation: 'Each of the 2 Layer 1 triangles creates 2 new gaps (4 chords total). On each chord, halving the span to ½b causes the parabolic sagitta to quarter to ⅟₁₆h. Each triangle area = ½ · (⅟₁₆h) · (½b) = ⅟₆₄ T. The 4 triangles together sum to 4 × (⅟₆₄ T) = ⅟₁₆ T.' },
    { id: 5, concept: 'Geometric Series Sum to ⁴⁄₃ T',
      question: 'How did Archimedes sum the infinite series T + ¼ T + ⅟₁₆ T + ⅟₆₄ T + … to obtain ⁴⁄₃ T?',
      options: ['Using his finite geometric sum identity A + ¼A + … + (¼)ⁿA + ⅓(¼)ⁿA = ⁴⁄₃A, followed by double reductio ad absurdum.', 'By using Newton\'s binomial theorem.', 'By calculating decimal approximations to 10 places.', 'By measuring water overflow.'],
      correct: 0, explanation: 'In Quadrature of the Parabola (Prop. 23–24), Archimedes proved the exact finite identity: for any series scaling by 1/4, adding 1/3 of the last term yields exactly 4/3 of the first term. A double contradiction then proves the area is strictly 4/3 T.' },
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

        {/* ── STEP 1: Method 1 — The Mechanical Lever (The Method, Prop. 1) ── */}
        {step === 1 && (() => {
          const u = Math.min(0.85, Math.max(0.15, leverSliceU));
          const geomAx = 250, geomCx = 490, geomDx = 370;
          const geomBaseY = 195;
          const geomBx = 370, geomBy = 155; // vertex B of parabola (sagitta h = 40)
          const geomEy = 115; // E on extended diameter: EB = 40 = h, ED = 80 = 2h
          const geomFy = 35; // F = (250, 35): FA = 160 = 4h
          
          // Slice position along chord AC from C towards A
          const sliceX = geomCx - u * 240;
          const sliceTriH = 160 * u;
          const sliceTriTopY = geomBaseY - sliceTriH;
          const sliceParaH = 160 * u * (1 - u);
          const sliceParaTopY = geomBaseY - sliceParaH;
          
          // Lever parameters
          const fulcrumX = 300;
          const leverH_px = 180; // visual representation of lever arm H
          const leftHookX = fulcrumX - leverH_px; // 120
          const rightSliceX = fulcrumX + (1 - u) * leverH_px;
          const centroidX = fulcrumX + (leverH_px / 3); // 360 (at 1/3 H)

          return (
            <g>
              {/* Header banner */}
              <rect x="25" y="6" width="550" height="26" rx="6" fill="rgba(6,182,212,0.18)" stroke={OB.cyan} strokeWidth="1.5" />
              <text x="300" y="23" fill={OB.cyan} fontSize="12.5" fontWeight="bold" textAnchor="middle">
                Step 2 — Method 1: The Mechanical Lever (The Method, Prop. 1: Area = ⁴⁄₃ bh = ⁴⁄₃ T)
              </text>

              {/* ── UPPER SECTION: GEOMETRIC FIGURE (x: 22 to 580, y: 36 to 220) ── */}
              {/* Left explanation card (Dynamic based on leverHighlight) */}
              <g transform="translate(24, 38)">
                <rect x="0" y="0" width="205" height="175" rx="8" fill="rgba(15,23,42,0.95)" stroke={
                  leverHighlight === 'tangent_triangle' ? '#f59e0b' :
                  leverHighlight === 'slice_balance' ? '#06b6d4' :
                  leverHighlight === 'triangle_centroid' ? '#a855f7' :
                  leverHighlight === 'total_equilibrium' ? '#10b981' : '#334155'
                } strokeWidth="1.5" />

                {(!leverHighlight || leverHighlight === 'total_equilibrium') && (
                  <>
                    <text x="12" y="20" fill="#34d399" fontSize="11" fontWeight="bold">4. Grand Mechanical Balance:</text>
                    <text x="12" y="38" fill="#cbd5e1" fontSize="9.5">• All parabola slices hung at H on left</text>
                    <text x="12" y="54" fill="#cbd5e1" fontSize="9.5">• Total Left Torque = Area(P) · H</text>
                    <text x="12" y="70" fill="#cbd5e1" fontSize="9.5">• Entire triangle acts at ⅓ H on right</text>
                    <text x="12" y="86" fill="#cbd5e1" fontSize="9.5">• Total Right Torque = (4bh) · ⅓ H</text>
                    <line x1="12" y1="96" x2="193" y2="96" stroke="#334155" strokeWidth="1" />
                    <text x="12" y="112" fill="#38bdf8" fontSize="10" fontWeight="bold">Equilibrium of the Lever:</text>
                    <text x="12" y="128" fill="#fde047" fontSize="10" fontWeight="extrabold">Area(P) · H = (4bh) · ⅓ H</text>
                    <text x="12" y="146" fill="#6ee7b7" fontSize="11" fontWeight="extrabold">⟹ Area(P) = ⁴⁄₃ bh = ⁴⁄₃ T!</text>
                    <text x="12" y="164" fill="#94a3b8" fontSize="8.5" fontStyle="italic">Arm H cancels out! Strictly ⁴⁄₃ T.</text>
                  </>
                )}

                {leverHighlight === 'tangent_triangle' && (
                  <>
                    <text x="12" y="20" fill="#f59e0b" fontSize="11" fontWeight="bold">1. Tangent Triangle △AFC (4bh):</text>
                    <text x="12" y="38" fill="#cbd5e1" fontSize="9.5">• Tangent at C meets axis at E</text>
                    <text x="12" y="54" fill="#cbd5e1" fontSize="9.5">• Parabola law: EB = BD = h</text>
                    <text x="12" y="70" fill="#cbd5e1" fontSize="9.5">• Axis segment ED = 2h (80px)</text>
                    <text x="12" y="86" fill="#cbd5e1" fontSize="9.5">• Vertical line FA ∥ ED at A</text>
                    <text x="12" y="102" fill="#cbd5e1" fontSize="9.5">• Midline theorem: FA = 2·ED = 4h</text>
                    <line x1="12" y1="112" x2="193" y2="112" stroke="#334155" strokeWidth="1" />
                    <text x="12" y="128" fill="#fde047" fontSize="10" fontWeight="bold">Base AC = 2b, Height FA = 4h</text>
                    <text x="12" y="146" fill="#fbbf24" fontSize="11" fontWeight="extrabold">Area(△AFC) = ½·(2b)·(4h) = 4bh</text>
                    <text x="12" y="164" fill="#38bdf8" fontSize="9" fontWeight="bold">Exactly 4 × Inscribed △ (4T)!</text>
                  </>
                )}

                {leverHighlight === 'slice_balance' && (
                  <>
                    <text x="12" y="20" fill="#38bdf8" fontSize="11" fontWeight="bold">2. Law of the Lever on Slices:</text>
                    <text x="12" y="38" fill="#cbd5e1" fontSize="9.5">• Vertical slice at distance x from A</text>
                    <text x="12" y="54" fill="#cbd5e1" fontSize="9.5">• △ slice: L(x) = 4h · (x / 2b)</text>
                    <text x="12" y="70" fill="#cbd5e1" fontSize="9.5">• Parabola slice: w(x) ∝ x(2b - x)</text>
                    <line x1="12" y1="80" x2="193" y2="80" stroke="#334155" strokeWidth="1" />
                    <text x="12" y="96" fill="#fde047" fontSize="10" fontWeight="bold">Parabola Tangent Ratio:</text>
                    <text x="12" y="112" fill="#cffafe" fontSize="10.5" fontWeight="bold">L(x) / w(x) = H / x</text>
                    <text x="12" y="132" fill="#34d399" fontSize="11" fontWeight="extrabold">⟹ w(x) · H = L(x) · x</text>
                    <text x="12" y="150" fill="#e2e8f0" fontSize="9">• Left Torque = Right Torque</text>
                    <text x="12" y="164" fill="#a7f3d0" fontSize="8.5" fontWeight="bold">Every single slice balances!</text>
                  </>
                )}

                {leverHighlight === 'triangle_centroid' && (
                  <>
                    <text x="12" y="20" fill="#c084fc" fontSize="11" fontWeight="bold">3. Centroid at ⅓ H (No Calculus):</text>
                    <text x="12" y="38" fill="#cbd5e1" fontSize="9.5">• Why no integral calculus?</text>
                    <text x="12" y="54" fill="#cbd5e1" fontSize="9.5">• Slices L(x) remain in natural place</text>
                    <text x="12" y="70" fill="#cbd5e1" fontSize="9.5">• Σ L(x)·x = Moment of △AFC</text>
                    <text x="12" y="86" fill="#cbd5e1" fontSize="9.5">• Centroid G is at ⅓ distance from base</text>
                    <line x1="12" y1="96" x2="193" y2="96" stroke="#334155" strokeWidth="1" />
                    <text x="12" y="112" fill="#d8b4fe" fontSize="10" fontWeight="bold">Centroid Distance = ⅓ H</text>
                    <text x="12" y="130" fill="#f5d0fe" fontSize="10.5" fontWeight="extrabold">Total Torque = (4bh) · ⅓ H</text>
                    <text x="12" y="148" fill="#cbd5e1" fontSize="9">Entire triangle concentrated</text>
                    <text x="12" y="164" fill="#34d399" fontSize="9" fontWeight="bold">at a single point G!</text>
                  </>
                )}
              </g>

              {/* Geometric Figure on the Right */}
              <g>
                {/* Circumscribed Tangent Triangle △AFC */}
                <polygon
                  points={`${geomAx},${geomBaseY} ${geomAx},${geomFy} ${geomCx},${geomBaseY}`}
                  fill={leverHighlight === 'tangent_triangle' ? 'rgba(245,158,11,0.35)' : 'rgba(245,158,11,0.12)'}
                  stroke={OB.gold}
                  strokeWidth={leverHighlight === 'tangent_triangle' ? 2.5 : 1.5}
                />

                {/* Parabola segment (Exact quadratic curve) */}
                <path
                  d={`M ${geomAx} ${geomBaseY} Q ${geomDx} ${geomEy} ${geomCx} ${geomBaseY}`}
                  fill={leverHighlight === 'tangent_triangle' ? 'rgba(6,182,212,0.12)' : 'rgba(6,182,212,0.22)'}
                  stroke={OB.cyan}
                  strokeWidth="2.5"
                />

                {/* Inscribed Reference Triangle △ABC */}
                <polygon
                  points={`${geomAx},${geomBaseY} ${geomBx},${geomBy} ${geomCx},${geomBaseY}`}
                  fill="rgba(59,130,246,0.12)"
                  stroke="#3b82f6"
                  strokeWidth="1.5"
                  strokeDasharray="3,3"
                />
                <text x="335" y="185" fill="#60a5fa" fontSize="9" fontStyle="italic">Inscribed △ABC = T</text>

                {/* Base chord AC */}
                <line x1={geomAx} y1={geomBaseY} x2={geomCx} y2={geomBaseY} stroke={OB.gold} strokeWidth="2.5" />
                <circle cx={geomAx} cy={geomBaseY} r="3.5" fill={OB.gold} />
                <circle cx={geomDx} cy={geomBaseY} r="3" fill="#94a3b8" />
                <circle cx={geomCx} cy={geomBaseY} r="3.5" fill={OB.gold} />
                <text x={geomAx - 8} y={geomBaseY + 14} fill={OB.gold} fontSize="11" fontWeight="bold" textAnchor="end">A</text>
                <text x={geomCx + 8} y={geomBaseY + 14} fill={OB.gold} fontSize="11" fontWeight="bold">C (Tangent)</text>
                <text x={geomDx} y={geomBaseY + 14} fill="#94a3b8" fontSize="9.5" textAnchor="middle">D (Midpoint)</text>
                <text x="440" y={geomBaseY + 14} fill="#fde047" fontSize="9" textAnchor="middle">Base AC = 2b</text>

                {/* Vertical side FA = 4h */}
                <line x1={geomAx} y1={geomBaseY} x2={geomAx} y2={geomFy} stroke="#fb7185" strokeWidth={leverHighlight === 'tangent_triangle' ? 3 : 2} />
                <circle cx={geomAx} cy={geomFy} r="3.5" fill="#fb7185" />
                <text x={geomAx - 6} y={geomFy + 4} fill="#fb7185" fontSize="11" fontWeight="bold" textAnchor="end">F</text>
                <text x={geomAx - 8} y={(geomBaseY + geomFy) / 2} fill="#fb7185" fontSize="9.5" fontWeight="bold" textAnchor="end">FA = 4h</text>

                {/* Extended diameter line ED */}
                <line x1={geomDx} y1={geomBaseY} x2={geomDx} y2={geomEy} stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="3,2" />
                <circle cx={geomBx} cy={geomBy} r="3.5" fill={OB.cyan} />
                <circle cx={geomDx} cy={geomEy} r="3.5" fill="#38bdf8" />
                <text x={geomBx + 6} y={geomBy - 4} fill={OB.cyan} fontSize="9.5" fontWeight="bold">Vertex B (BD = h)</text>
                <text x={geomDx + 6} y={geomEy + 4} fill="#38bdf8" fontSize="9.5" fontWeight="bold">E (EB = h ⟹ ED = 2h)</text>

                {/* Tangent line CF */}
                <line x1={geomCx} y1={geomBaseY} x2={geomAx} y2={geomFy} stroke="#f59e0b" strokeWidth={leverHighlight === 'tangent_triangle' ? 2.5 : 1.5} />
                <text x="390" y="75" fill="#fde047" fontSize="9.5" fontStyle="italic">Tangent Line CF</text>

                {/* Centroid G marker in Upper Geometry */}
                {(leverHighlight === 'triangle_centroid' || leverHighlight === 'total_equilibrium') && (
                  <g>
                    <circle cx="330" cy="141.7" r="5.5" fill="#a855f7" stroke="#fff" strokeWidth="1.5" />
                    <text x="330" y="132" fill="#d8b4fe" fontSize="9.5" fontWeight="bold" textAnchor="middle">Centroid G (⅓ H)</text>
                    <line x1="330" y1="147" x2="330" y2="175" stroke="#c084fc" strokeWidth="1.5" strokeDasharray="2,2" />
                  </g>
                )}

                {/* Vertical Slice in Upper Geometry */}
                {(leverHighlight === 'slice_balance' || (!leverHighlight && !leverActiveHighlight)) && (
                  <g>
                    {/* Triangle slice segment */}
                    <line x1={sliceX} y1={geomBaseY} x2={sliceX} y2={sliceTriTopY} stroke="#f59e0b" strokeWidth="3" />
                    <circle cx={sliceX} cy={sliceTriTopY} r="3" fill="#f59e0b" />
                    
                    {/* Parabola slice segment */}
                    <line x1={sliceX} y1={geomBaseY} x2={sliceX} y2={sliceParaTopY} stroke="#06b6d4" strokeWidth="3.5" />
                    <circle cx={sliceX} cy={sliceParaTopY} r="3.5" fill="#06b6d4" />
                    <circle cx={sliceX} cy={geomBaseY} r="3" fill="#fff" />

                    <text x={sliceX} y={sliceTriTopY - 6} fill="#fde047" fontSize="9" fontWeight="bold" textAnchor="middle">
                      L(x) = {sliceTriH.toFixed(0)}
                    </text>
                    <text x={sliceX} y={sliceParaTopY + 12} fill="#67e8f9" fontSize="9" fontWeight="bold" textAnchor="middle">
                      w(x) = {sliceParaH.toFixed(0)}
                    </text>
                  </g>
                )}
              </g>

              {/* ── LOWER SECTION: ARCHIMEDES' MECHANICAL LEVER (y: 230 to 365) ── */}
              <g>
                {/* Fulcrum A at (300, 285) */}
                <polygon points="300,285 288,318 312,318" fill="#f59e0b" fillOpacity="0.9" stroke="#d97706" strokeWidth="2" />
                <text x="300" y="332" fill="#f59e0b" fontSize="10.5" fontWeight="bold" textAnchor="middle">Fulcrum (Pivot A)</text>

                {/* Lever Beam Bar */}
                <rect x="80" y="278" width="440" height="8" rx="3" fill="#334155" stroke="#64748b" strokeWidth="1.5" />

                {/* Left Arm Dimension = H (Fixed) */}
                <line x1={leftHookX} y1="265" x2="300" y2="265" stroke="#f43f5e" strokeWidth="1.5" strokeDasharray="3,3" />
                <text x="210" y="260" fill="#f43f5e" fontSize="9.5" fontWeight="bold" textAnchor="middle">Left Arm H = 2b (Fixed)</text>

                {/* Left Hook & Weight */}
                <line x1={leftHookX} y1="282" x2={leftHookX} y2="300" stroke="#67e8f9" strokeWidth="2" />
                {leverHighlight === 'total_equilibrium' ? (
                  <g transform={`translate(${leftHookX - 50}, 300)`}>
                    <rect x="0" y="0" width="100" height="48" rx="6" fill="rgba(6,182,212,0.85)" stroke="#67e8f9" strokeWidth="1.5" />
                    <text x="50" y="16" fill="#fff" fontSize="9.5" fontWeight="bold" textAnchor="middle">All Parabola Slices</text>
                    <text x="50" y="31" fill="#cffafe" fontSize="11" fontWeight="extrabold" textAnchor="middle">Area(Parabola)</text>
                    <text x="50" y="43" fill="#fde047" fontSize="8.5" textAnchor="middle">Torque = Area(P) · H</text>
                  </g>
                ) : (
                  <g transform={`translate(${leftHookX - 45}, 300)`}>
                    <rect x="0" y="0" width="90" height="48" rx="6" fill="rgba(6,182,212,0.85)" stroke="#67e8f9" strokeWidth="1.5" />
                    <text x="45" y="15" fill="#fff" fontSize="9" fontWeight="bold" textAnchor="middle">Parabola Slice</text>
                    <text x="45" y="30" fill="#cffafe" fontSize="11.5" fontWeight="extrabold" textAnchor="middle">w(x) = {sliceParaH.toFixed(0)}</text>
                    <text x="45" y="43" fill="#fde047" fontSize="8" textAnchor="middle">Torque = w · H</text>
                  </g>
                )}

                {/* Right Arm: Centroid OR Slice Weight */}
                {(leverHighlight === 'triangle_centroid' || leverHighlight === 'total_equilibrium') ? (
                  <g>
                    {/* Dimension from fulcrum to centroid at 1/3 H */}
                    <line x1="300" y1="265" x2={centroidX} y2="265" stroke="#c084fc" strokeWidth="1.5" strokeDasharray="3,3" />
                    <text x={300 + (leverH_px / 6)} y="260" fill="#c084fc" fontSize="9.5" fontWeight="bold" textAnchor="middle">Arm = ⅓ H</text>
                    <line x1={centroidX} y1="282" x2={centroidX} y2="300" stroke="#c084fc" strokeWidth="2" />
                    <g transform={`translate(${centroidX - 48}, 300)`}>
                      <rect x="0" y="0" width="96" height="48" rx="6" fill="rgba(168,85,247,0.85)" stroke="#e9d5ff" strokeWidth="1.5" />
                      <text x="48" y="15" fill="#fff" fontSize="9" fontWeight="bold" textAnchor="middle">Triangle Centroid G</text>
                      <text x="48" y="30" fill="#f5d0fe" fontSize="11" fontWeight="extrabold" textAnchor="middle">Weight = 4bh (4T)</text>
                      <text x="48" y="43" fill="#fde047" fontSize="8" textAnchor="middle">Torque = (4bh) · ⅓ H</text>
                    </g>
                  </g>
                ) : (
                  <g>
                    {/* Dimension from fulcrum to slice at distance x */}
                    <line x1="300" y1="265" x2={rightSliceX} y2="265" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="3,3" />
                    <text x={300 + (1 - u) * (leverH_px / 2)} y="260" fill="#f59e0b" fontSize="9" fontWeight="bold" textAnchor="middle">
                      Arm x = {((1 - u) * 100).toFixed(0)}% H
                    </text>
                    <line x1={rightSliceX} y1="282" x2={rightSliceX} y2="300" stroke="#f59e0b" strokeWidth="2" />
                    <g transform={`translate(${rightSliceX - 45}, 300)`}>
                      <rect x="0" y="0" width="90" height="48" rx="6" fill="rgba(245,158,11,0.85)" stroke="#fde047" strokeWidth="1.5" />
                      <text x="45" y="15" fill="#fff" fontSize="9" fontWeight="bold" textAnchor="middle">Triangle Slice</text>
                      <text x="45" y="30" fill="#fef08a" fontSize="11.5" fontWeight="extrabold" textAnchor="middle">L(x) = {sliceTriH.toFixed(0)}</text>
                      <text x="45" y="43" fill="#cffafe" fontSize="8" textAnchor="middle">Torque = L · x</text>
                    </g>
                  </g>
                )}

                {/* Equilibrium indicator badge on the far right */}
                <g transform="translate(425, 238)">
                  <rect x="0" y="0" width="150" height="40" rx="6" fill="rgba(15,23,42,0.92)" stroke="#10b981" strokeWidth="1.5" />
                  <text x="75" y="16" fill="#34d399" fontSize="10" fontWeight="bold" textAnchor="middle">⚖️ Lever in Equilibrium</text>
                  <text x="75" y="31" fill="#e2e8f0" fontSize="8.5" textAnchor="middle">Left Torque === Right Torque</text>
                </g>
              </g>

              {/* ── BOTTOM SECTION: INTERACTIVE STAGE BUTTONS & EQUATION BAR (y: 366 to 452) ── */}
              {/* Row of 4 Stage Pills */}
              <g transform="translate(25, 368)">
                {[
                  { id: 'tangent_triangle', label: '1. Tangent △ (4bh)' },
                  { id: 'slice_balance', label: '2. Slice Law (w·H=L·x)' },
                  { id: 'triangle_centroid', label: '3. Centroid at ⅓ H' },
                  { id: 'total_equilibrium', label: '4. Grand Balance (⁴⁄₃ T)' },
                ].map((item, idx) => {
                  const isActive = leverHighlight === item.id || (!leverHighlight && item.id === 'total_equilibrium');
                  return (
                    <g
                      key={item.id}
                      transform={`translate(${idx * 140}, 0)`}
                      className="cursor-pointer"
                      onClick={() => setLeverActiveHighlight(leverActiveHighlight === item.id ? null : item.id)}
                      onMouseEnter={() => setLeverHoverHighlight(item.id)}
                      onMouseLeave={() => setLeverHoverHighlight(null)}
                    >
                      <rect
                        x="0" y="0" width="130" height="26" rx="5"
                        fill={isActive ? 'rgba(6,182,212,0.35)' : 'rgba(30,41,59,0.8)'}
                        stroke={isActive ? '#38bdf8' : '#475569'}
                        strokeWidth={isActive ? 1.8 : 1}
                      />
                      <text
                        x="65" y="17"
                        fill={isActive ? '#fff' : '#94a3b8'}
                        fontSize="9.5"
                        fontWeight={isActive ? 'bold' : 'normal'}
                        textAnchor="middle"
                      >
                        {item.label}
                      </text>
                    </g>
                  );
                })}
              </g>

              {/* Dynamic Bottom Explanation / Scrubber Box */}
              <g transform="translate(25, 400)">
                <rect x="0" y="0" width="550" height="52" rx="7" fill="rgba(15,23,42,0.95)" stroke="#334155" strokeWidth="1.5" />

                {leverHighlight === 'slice_balance' ? (
                  <>
                    {/* Interactive Scrubber Controls */}
                    <g className="cursor-pointer" onClick={() => setLeverSliceU(Math.max(0.18, u - 0.12))}>
                      <rect x="15" y="10" width="115" height="32" rx="5" fill="#1e293b" stroke="#06b6d4" strokeWidth="1.2" />
                      <text x="72" y="30" fill="#38bdf8" fontSize="10.5" fontWeight="bold" textAnchor="middle">◀ Move Slice Left</text>
                    </g>
                    <g transform="translate(140, 10)">
                      <text x="135" y="16" fill="#fde047" fontSize="10" fontWeight="bold" textAnchor="middle">
                        Slice at x = {((1 - u) * 100).toFixed(0)}% of Lever Arm H | Ratio L/w = {(sliceTriH / sliceParaH).toFixed(2)} = H/x
                      </text>
                      <text x="135" y="30" fill="#34d399" fontSize="10.5" fontWeight="extrabold" textAnchor="middle">
                        Left Torque ({sliceParaH.toFixed(0)}·H) === Right Torque ({sliceTriH.toFixed(0)}·{((1 - u) * 100).toFixed(0)}%H) ⚖️
                      </text>
                    </g>
                    <g className="cursor-pointer" onClick={() => setLeverSliceU(Math.min(0.82, u + 0.12))}>
                      <rect x="420" y="10" width="115" height="32" rx="5" fill="#1e293b" stroke="#06b6d4" strokeWidth="1.2" />
                      <text x="477" y="30" fill="#38bdf8" fontSize="10.5" fontWeight="bold" textAnchor="middle">Move Slice Right ▶</text>
                    </g>
                  </>
                ) : leverHighlight === 'tangent_triangle' ? (
                  <>
                    <text x="275" y="20" fill="#f59e0b" fontSize="11" fontWeight="bold" textAnchor="middle">
                      Tangent at C bisects extended diameter (EB = BD = h ⟹ ED = 2h). Midline makes FA = 4h.
                    </text>
                    <text x="275" y="38" fill="#cbd5e1" fontSize="10.5" textAnchor="middle">
                      Circumscribed △AFC has Base 2b and Height 4h: <tspan fill="#fde047" fontWeight="bold">Area = ½ · (2b) · (4h) = 4bh = 4T</tspan>!
                    </text>
                  </>
                ) : leverHighlight === 'triangle_centroid' ? (
                  <>
                    <text x="275" y="20" fill="#c084fc" fontSize="11" fontWeight="bold" textAnchor="middle">
                      Archimedes' Centroid Law: Any triangle balances at ⅓ of its height from the base!
                    </text>
                    <text x="275" y="38" fill="#e2e8f0" fontSize="10.5" textAnchor="middle">
                      The entire triangle's area 4bh acts at single point G at distance <tspan fill="#d8b4fe" fontWeight="bold">⅓ H</tspan>. Calculus is avoided!
                    </text>
                  </>
                ) : (
                  <>
                    <text x="275" y="20" fill="#22d3ee" fontSize="11" fontWeight="bold" textAnchor="middle">
                      Mechanical Law of the Lever: Area(Parabola) · H = Area(△AFC) · (⅓ H) = (4bh) · (⅓ H)
                    </text>
                    <text x="275" y="38" fill="#34d399" fontSize="12" fontWeight="extrabold" textAnchor="middle">
                      ⟹ Area(Parabola) = ⁴⁄₃ bh = ⁴⁄₃ Inscribed Triangle T! (Q.E.D. — c. 250 BC)
                    </text>
                  </>
                )}
              </g>
            </g>
          );
        })()}

        {/* ── STEP 2: Method 2 — Geometric Quadrature Layer 1: Why 2nd Term is 1/4 T ── */}
        {step === 2 && (
          <g>
            <rect x="25" y="8" width="550" height="28" rx="6" fill="rgba(16,185,129,0.18)" stroke={OB.green} strokeWidth="1.5" />
            <text x="300" y="27" fill={OB.green} fontSize="13" fontWeight="bold" textAnchor="middle">
              Step 3 — Method 2: Quadrature Layer 1 (Why 2nd Term is ¼ T — Props. 18–21)
            </text>

            {/* Parabola curve */}
            <path
              d={proofParabolaPath}
              fill="rgba(6,182,212,0.06)"
              stroke={OB.cyan}
              strokeWidth={proofHighlight ? 2 : 2.5}
              opacity={proofHighlight === 'sagitta' ? 0.7 : 1}
            />

            {/* Main Inscribed Triangle AEF (Dashed reference) */}
            <polygon
              points="200,95 85,320 315,320"
              fill="rgba(30,58,138,0.18)"
              stroke="#3b82f6"
              strokeWidth="1.5"
              strokeDasharray="4,4"
              opacity={proofHighlight && proofHighlight !== 'topvsside' ? 0.5 : 1}
            />
            <text x="250" y="314" fill="#60a5fa" fontSize="9.5" fontWeight="bold">Main △AEF (Area T)</text>

            {/* Horizontal Base line of AEF */}
            <line x1="85" y1="320" x2="315" y2="320" stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="3,3" />

            {/* Top Triangle ABC */}
            <polygon
              points="200,95 142.5,151.25 257.5,151.25"
              fill={proofHighlight === 'topvsside' ? 'rgba(245,158,11,0.45)' : 'rgba(245,158,11,0.18)'}
              stroke={proofHighlight === 'topvsside' ? '#fbbf24' : '#f59e0b'}
              strokeWidth={proofHighlight === 'topvsside' ? 2.5 : 1.5}
              strokeDasharray={proofHighlight === 'topvsside' ? 'none' : '3,2'}
            />
            <text
              x="200" y="126"
              fill="#fde047"
              fontSize={proofHighlight === 'topvsside' ? '11' : '10'}
              fontWeight="bold"
              textAnchor="middle"
            >
              Top △ABC = ⅛ T
            </text>

            {/* Horizontal Chord BC */}
            <line
              x1="142.5" y1="151.25" x2="257.5" y2="151.25"
              stroke="#f59e0b"
              strokeWidth={proofHighlight === 'topvsside' ? 2.5 : 2}
              strokeDasharray={proofHighlight === 'topvsside' ? 'none' : '4,2'}
            />
            <text x="200" y="142" fill="#fde047" fontSize="8" fontWeight="bold" textAnchor="middle">
              Base BC = b (½ Base of AEF)
            </text>

            {/* Vertical height drop for △ABC */}
            <line x1="200" y1="95" x2="200" y2="151.25" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="2,2" />
            <text x="206" y="110" fill="#fde047" fontSize="8" fontStyle="italic">H = ¼ h</text>

            {/* GREEN TRIANGLE ABE: SUB-TRIANGLES & ALTITUDES */}
            {/* Upper sub-triangle △ABM1 */}
            <polygon
              points="200,95 142.5,151.25 142.5,207.5"
              fill={proofHighlight === 'subtriangles' ? 'rgba(6,182,212,0.7)' : proofHighlight === 'topvsside' || proofHighlight === 'totalgreen' ? 'rgba(6,182,212,0.55)' : 'rgba(6,182,212,0.45)'}
              stroke={proofHighlight === 'subtriangles' ? '#38bdf8' : '#06b6d4'}
              strokeWidth={proofHighlight === 'subtriangles' ? 3 : 2}
            />
            <text x="168" y="160" fill="#67e8f9" fontSize={proofHighlight === 'subtriangles' ? '10' : '9'} fontWeight="bold">
              △ABM₁ = ⅟₁₆ T
            </text>

            {/* Lower sub-triangle △EBM1 */}
            <polygon
              points="85,320 142.5,151.25 142.5,207.5"
              fill={proofHighlight === 'subtriangles' ? 'rgba(16,185,129,0.7)' : proofHighlight === 'topvsside' || proofHighlight === 'totalgreen' ? 'rgba(16,185,129,0.55)' : 'rgba(16,185,129,0.45)'}
              stroke={proofHighlight === 'subtriangles' ? '#34d399' : '#10b981'}
              strokeWidth={proofHighlight === 'subtriangles' ? 3 : 2}
            />
            <text x="122" y="240" fill="#6ee7b7" fontSize={proofHighlight === 'subtriangles' ? '10' : '9'} fontWeight="bold">
              △EBM₁ = ⅟₁₆ T
            </text>

            {/* Chord AE */}
            <line
              x1="200" y1="95" x2="85" y2="320"
              stroke={proofHighlight === 'sagitta' ? '#f8fafc' : '#cbd5e1'}
              strokeWidth={proofHighlight === 'sagitta' ? 2.5 : 1.5}
              strokeDasharray={proofHighlight === 'sagitta' ? 'none' : '4,3'}
            />

            {/* Vertical line through x = 142.5 (extended guide) */}
            <line
              x1="142.5" y1="95" x2="142.5" y2="320"
              stroke={proofHighlight === 'span' ? '#38bdf8' : '#475569'}
              strokeWidth={proofHighlight === 'span' ? 1.5 : 1}
              strokeDasharray="2,2"
              opacity={proofHighlight === 'span' ? 0.9 : 0.6}
            />

            {/* Alt 1: Horizontal drop from A(200,95) to x = 142.5 */}
            <line
              x1="200" y1="95" x2="142.5" y2="95"
              stroke="#06b6d4"
              strokeWidth={proofHighlight === 'span' ? 3 : 2}
              strokeDasharray={proofHighlight === 'span' ? 'none' : '3,2'}
            />
            <polyline
              points="150.5,95 150.5,103 142.5,103"
              fill="none"
              stroke="#06b6d4"
              strokeWidth={proofHighlight === 'span' ? 2 : 1.5}
            />
            <text
              x="171" y="88"
              fill={proofHighlight === 'span' ? '#38bdf8' : '#67e8f9'}
              fontSize={proofHighlight === 'span' ? '10' : '9'}
              fontWeight="bold"
              textAnchor="middle"
            >
              Alt₁ = ½ b
            </text>

            {/* Alt 2: Horizontal drop from E(85,320) to x = 142.5 */}
            <line
              x1="85" y1="320" x2="142.5" y2="320"
              stroke="#10b981"
              strokeWidth={proofHighlight === 'span' ? 3 : 2}
              strokeDasharray={proofHighlight === 'span' ? 'none' : '3,2'}
            />
            <polyline
              points="134.5,320 134.5,312 142.5,312"
              fill="none"
              stroke="#10b981"
              strokeWidth={proofHighlight === 'span' ? 2 : 1.5}
            />
            <text
              x="114" y="314"
              fill={proofHighlight === 'span' ? '#34d399' : '#6ee7b7'}
              fontSize={proofHighlight === 'span' ? '10' : '9'}
              fontWeight="bold"
              textAnchor="middle"
            >
              Alt₂ = ½ b
            </text>

            {/* Overall Horizontal Span Bracket */}
            <g opacity={proofHighlight === 'span' ? 1 : 0.8}>
              <line x1="85" y1="334" x2="200" y2="334" stroke="#38bdf8" strokeWidth={proofHighlight === 'span' ? 2.5 : 1.5} />
              <line x1="85" y1="330" x2="85" y2="338" stroke="#38bdf8" strokeWidth={proofHighlight === 'span' ? 2.5 : 1.5} />
              <line x1="200" y1="330" x2="200" y2="338" stroke="#38bdf8" strokeWidth={proofHighlight === 'span' ? 2.5 : 1.5} />
              <text
                x="142.5" y="347"
                fill={proofHighlight === 'span' ? '#38bdf8' : '#94a3b8'}
                fontSize={proofHighlight === 'span' ? '11' : '10'}
                fontWeight="bold"
                textAnchor="middle"
              >
                Total Span = Alt₁ + Alt₂ = b
              </text>
            </g>

            {/* Symmetrical Right Triangle △ACF */}
            <polygon
              points="200,95 257.5,151.25 315,320"
              fill={proofHighlight === 'totalgreen' ? 'rgba(16,185,129,0.55)' : 'rgba(16,185,129,0.22)'}
              stroke={proofHighlight === 'totalgreen' ? '#34d399' : '#10b981'}
              strokeWidth={proofHighlight === 'totalgreen' ? 2.5 : 1.5}
            />
            <text
              x="275" y="225"
              fill={proofHighlight === 'totalgreen' ? '#34d399' : '#6ee7b7'}
              fontSize={proofHighlight === 'totalgreen' ? '11' : '10'}
              fontWeight="bold"
            >
              △ACF = ⅛ T
            </text>

            {/* Points and Labels */}
            <circle cx="200" cy="95" r="4.5" fill="#38bdf8" stroke="#fff" strokeWidth="1.5" />
            <text x="200" y="85" fill="#38bdf8" fontSize="12" fontWeight="bold" textAnchor="middle">A(0,0)</text>

            <circle cx="85" cy="320" r="4.5" fill="#60a5fa" stroke="#fff" strokeWidth="1.5" />
            <text x="75" y="325" fill="#60a5fa" fontSize="12" fontWeight="bold" textAnchor="end">E(-b, h)</text>

            <circle cx="315" cy="320" r="4.5" fill="#60a5fa" stroke="#fff" strokeWidth="1.5" />
            <text x="325" y="325" fill="#60a5fa" fontSize="12" fontWeight="bold">F(+b, h)</text>

            {/* Midpoint M1 */}
            <circle cx="142.5" cy="207.5" r="4" fill="#f43f5e" stroke="#fff" strokeWidth="1" />
            <text x="148" y="210" fill="#f43f5e" fontSize="9" fontWeight="bold">M₁(-½b, ½h)</text>

            {/* Vertex B on parabola */}
            <circle cx="142.5" cy="151.25" r="4.5" fill="#34d399" stroke="#fff" strokeWidth="1.5" />
            <text x="134" y="152" fill="#34d399" fontSize="11" fontWeight="bold" textAnchor="end">B(-½b, ¼h)</text>

            {/* Vertex C on parabola */}
            <circle cx="257.5" cy="151.25" r="4.5" fill="#34d399" stroke="#fff" strokeWidth="1.5" />
            <text x="265" y="152" fill="#34d399" fontSize="11" fontWeight="bold">C(+½b, ¼h)</text>

            {/* Sagitta segment BM1 */}
            <line
              x1="142.5" y1="151.25" x2="142.5" y2="207.5"
              stroke="#f43f5e"
              strokeWidth={proofHighlight === 'sagitta' ? 4 : 2.5}
            />
            {/* Arrow on sagitta */}
            <polygon
              points="142.5,148 139,155 146,155"
              fill="#f43f5e"
            />
            <text
              x="136" y="185"
              fill={proofHighlight === 'sagitta' ? '#fb7185' : '#fca5a5'}
              fontSize={proofHighlight === 'sagitta' ? '11' : '10'}
              fontWeight="bold"
              textAnchor="end"
            >
              Sagitta BM₁ = ¼ h
            </text>

            {/* RIGHT PROOF BREAKDOWN CARD */}
            <g transform="translate(365, 42)">
              <rect x="0" y="0" width="220" height="326" rx="8" fill="rgba(15,23,42,0.96)" stroke="#334155" strokeWidth="1.5" />
              
              <text x="110" y="18" fill="#38bdf8" fontSize="11" fontWeight="bold" textAnchor="middle">
                Why Area(△ABE) = ⅛ T
              </text>
              <line x1="12" y1="24" x2="208" y2="24" stroke="#1e293b" strokeWidth="1" />

              {/* Interactive Item 1: Sagitta Height */}
              <g
                className="cursor-pointer"
                onClick={() => setActiveHighlight(activeHighlight === 'sagitta' ? null : 'sagitta')}
                onMouseEnter={() => setHoverHighlight('sagitta')}
                onMouseLeave={() => setHoverHighlight(null)}
              >
                <rect
                  x="8" y="28" width="204" height="46" rx="5"
                  fill={proofHighlight === 'sagitta' ? 'rgba(244,63,94,0.22)' : 'rgba(30,41,59,0.6)'}
                  stroke={proofHighlight === 'sagitta' ? '#f43f5e' : '#334155'}
                  strokeWidth="1"
                />
                <text x="14" y="42" fill="#fb7185" fontSize="9.5" fontWeight="bold">1. Sagitta Height (BM₁ = ¼ h):</text>
                <text x="14" y="55" fill="#cbd5e1" fontSize="8.5">• Chord AE midpoint: M₁(-½b, ½h)</text>
                <text x="14" y="67" fill="#cbd5e1" fontSize="8.5">• Parabola vertex: B(-½b, ¼h) ⟹ <tspan fill="#fb7185" fontWeight="bold">BM₁ = ¼h</tspan></text>
              </g>

              {/* Interactive Item 2: Horizontal Span */}
              <g
                className="cursor-pointer"
                onClick={() => setActiveHighlight(activeHighlight === 'span' ? null : 'span')}
                onMouseEnter={() => setHoverHighlight('span')}
                onMouseLeave={() => setHoverHighlight(null)}
              >
                <rect
                  x="8" y="78" width="204" height="46" rx="5"
                  fill={proofHighlight === 'span' ? 'rgba(6,182,212,0.22)' : 'rgba(30,41,59,0.6)'}
                  stroke={proofHighlight === 'span' ? '#06b6d4' : '#334155'}
                  strokeWidth="1"
                />
                <text x="14" y="92" fill="#38bdf8" fontSize="9.5" fontWeight="bold">2. Horizontal Span is b:</text>
                <text x="14" y="105" fill="#cbd5e1" fontSize="8.5">• Altitude from A(0,0): Alt₁ = ½ b</text>
                <text x="14" y="117" fill="#cbd5e1" fontSize="8.5">• Altitude from E(-b,h): Alt₂ = ½ b ⟹ <tspan fill="#38bdf8" fontWeight="bold">Span = b</tspan></text>
              </g>

              {/* Interactive Item 3: Exact Area Formula */}
              <g
                className="cursor-pointer"
                onClick={() => setActiveHighlight(activeHighlight === 'subtriangles' ? null : 'subtriangles')}
                onMouseEnter={() => setHoverHighlight('subtriangles')}
                onMouseLeave={() => setHoverHighlight(null)}
              >
                <rect
                  x="8" y="128" width="204" height="54" rx="5"
                  fill={proofHighlight === 'subtriangles' ? 'rgba(16,185,129,0.22)' : 'rgba(30,41,59,0.6)'}
                  stroke={proofHighlight === 'subtriangles' ? '#10b981' : '#334155'}
                  strokeWidth="1"
                />
                <text x="14" y="142" fill="#34d399" fontSize="9.5" fontWeight="bold">3. Exact Area Formula for △ABE:</text>
                <text x="14" y="155" fill="#94a3b8" fontSize="8">Area = ½ · Base(BM₁) · (Alt₁ + Alt₂)</text>
                <text x="14" y="167" fill="#6ee7b7" fontSize="9" fontWeight="bold">     = ½ · (¼ h) · b = ⅛ bh = <tspan fill="#34d399">⅛ T</tspan></text>
                <text x="14" y="178" fill="#94a3b8" fontSize="7.5">Sum of 2 sub-△s: ⅟₁₆ T + ⅟₁₆ T = ⅛ T</text>
              </g>

              {/* Interactive Item 4: Top △ABC vs Side △ABE Duality */}
              <g
                className="cursor-pointer"
                onClick={() => setActiveHighlight(activeHighlight === 'topvsside' ? null : 'topvsside')}
                onMouseEnter={() => setHoverHighlight('topvsside')}
                onMouseLeave={() => setHoverHighlight(null)}
              >
                <rect
                  x="8" y="186" width="204" height="46" rx="5"
                  fill={proofHighlight === 'topvsside' ? 'rgba(245,158,11,0.22)' : 'rgba(30,41,59,0.6)'}
                  stroke={proofHighlight === 'topvsside' ? '#f59e0b' : '#334155'}
                  strokeWidth="1"
                />
                <text x="14" y="200" fill="#fde047" fontSize="9.5" fontWeight="bold">4. Top △ABC vs Side △ABE:</text>
                <text x="14" y="213" fill="#cbd5e1" fontSize="8.5">• Top △ABC: Base = b, H = ¼h ⟹ <tspan fill="#fde047" fontWeight="bold">⅛ T</tspan></text>
                <text x="14" y="225" fill="#cbd5e1" fontSize="8.5">• Side △ABE: Base = ¼h, Span = b ⟹ <tspan fill="#34d399" fontWeight="bold">⅛ T</tspan></text>
              </g>

              {/* Interactive Item 5: Layer 1 Total */}
              <g
                className="cursor-pointer"
                onClick={() => setActiveHighlight(activeHighlight === 'totalgreen' ? null : 'totalgreen')}
                onMouseEnter={() => setHoverHighlight('totalgreen')}
                onMouseLeave={() => setHoverHighlight(null)}
              >
                <rect
                  x="8" y="236" width="204" height="52" rx="5"
                  fill={proofHighlight === 'totalgreen' ? 'rgba(168,85,247,0.25)' : 'rgba(30,41,59,0.6)'}
                  stroke={proofHighlight === 'totalgreen' ? '#a855f7' : '#334155'}
                  strokeWidth="1"
                />
                <text x="14" y="250" fill="#c084fc" fontSize="9.5" fontWeight="bold">5. Stage 1 Green Total = ¼ T:</text>
                <text x="14" y="263" fill="#cbd5e1" fontSize="8.5">• Left △ABE = ⅛ T, Right △ACF = ⅛ T</text>
                <text x="14" y="275" fill="#e9d5ff" fontSize="9" fontWeight="bold">⟹ Layer 1 Total = ⅛ T + ⅛ T = <tspan fill="#34d399">¼ T</tspan>!</text>
              </g>

              <rect x="8" y="292" width="204" height="28" rx="4" fill="rgba(15,23,42,0.8)" stroke="#334155" />
              <text x="110" y="310" fill="#38bdf8" fontSize="8.5" fontWeight="bold" textAnchor="middle">
                Click any box to inspect &amp; highlight
              </text>
            </g>

            {/* Bottom explanation */}
            <rect x="25" y="378" width="550" height="74" rx="8" fill="rgba(15,23,42,0.95)" stroke="#334155" strokeWidth="1.5" />
            <text x="300" y="398" fill="#38bdf8" fontSize="11" fontWeight="bold" textAnchor="middle">
              1. Prop 19–21: Parabola equation y ∝ x² guarantees the sagitta at mid-chord is strictly ¼ of total height h.
            </text>
            <text x="300" y="418" fill="#fde047" fontSize="11" fontWeight="bold" textAnchor="middle">
              2. Slicing with horizontal altitudes: Area(△ABE) = ½ · (¼ h) · b = ⅛ bh = ⅛ T. Symmetrical △ACF also = ⅛ T.
            </text>
            <text x="300" y="438" fill={OB.green} fontSize="12.5" fontWeight="bold" textAnchor="middle">
              3. Layer 1 Combined Area = ⅛ T + ⅛ T = ¼ T! This establishes the common ratio ¼ of the series. (Q.E.D.)
            </text>
          </g>
        )}

        {/* ── STEP 3: Method 2 — Geometric Quadrature Layer 2 & Series: Why 3rd Term is 1/16 T ── */}
        {step === 3 && (
          <g>
            <rect x="25" y="8" width="550" height="28" rx="6" fill="rgba(234,179,8,0.18)" stroke={OB.gold} strokeWidth="1.5" />
            <text x="300" y="27" fill={OB.gold} fontSize="13" fontWeight="bold" textAnchor="middle">
              Step 4 — Quadrature Layer 2 &amp; Infinite Series (Why 3rd Term is ⅟₁₆ T)
            </text>

            {/* Parabola curve */}
            <path
              d={proofParabolaPath}
              fill={layer2Highlight === 'series_sum' ? 'rgba(234,179,8,0.22)' : 'rgba(6,182,212,0.06)'}
              stroke={OB.cyan}
              strokeWidth={2.5}
            />

            {/* Primary Inscribed Triangle AEF (Background reference) */}
            <polygon
              points="200,95 85,320 315,320"
              fill="rgba(30,58,138,0.14)"
              stroke="#3b82f6"
              strokeWidth="1.2"
              strokeDasharray="4,4"
              opacity={0.6}
            />
            <text x="200" y="280" fill="#60a5fa" fontSize="9.5" fontWeight="bold" textAnchor="middle" opacity="0.6">
              Primary △AEF (1st Term: Area T = bh)
            </text>

            {/* Base chord EF */}
            <line x1="85" y1="320" x2="315" y2="320" stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="3,3" />

            {/* Layer 1 Triangles: △ABE and △ACF (translucent green) */}
            <polygon
              points="200,95 142.5,151.25 85,320"
              fill="rgba(16,185,129,0.2)"
              stroke="#10b981"
              strokeWidth="1.2"
              strokeDasharray="3,2"
            />
            <polygon
              points="200,95 257.5,151.25 315,320"
              fill="rgba(16,185,129,0.2)"
              stroke="#10b981"
              strokeWidth="1.2"
              strokeDasharray="3,2"
            />
            <text x="110" y="200" fill="#6ee7b7" fontSize="8.5" fontWeight="bold">△ABE (⅛ T)</text>
            <text x="240" y="200" fill="#6ee7b7" fontSize="8.5" fontWeight="bold">△ACF (⅛ T)</text>

            {/* ── LAYER 2: FOUR NEW INSCRIBED TRIANGLES (AMBER / GOLD) ── */}
            {/* Triangle 1: on chord AB: A(200,95), D1(171.25, 109.06), B(142.5, 151.25) */}
            <polygon
              points="200,95 171.25,109.06 142.5,151.25"
              fill={layer2Highlight === 'single_area' ? 'rgba(234,179,8,0.85)' : layer2Highlight ? 'rgba(234,179,8,0.65)' : 'rgba(234,179,8,0.45)'}
              stroke={layer2Highlight === 'single_area' ? '#fff' : '#eab308'}
              strokeWidth={layer2Highlight === 'single_area' ? 2.5 : 1.5}
            />

            {/* Triangle 2: on chord BE: B(142.5, 151.25), D2(113.75, 221.56), E(85, 320) */}
            <polygon
              points="142.5,151.25 113.75,221.56 85,320"
              fill={layer2Highlight ? 'rgba(234,179,8,0.65)' : 'rgba(234,179,8,0.45)'}
              stroke="#eab308"
              strokeWidth="1.5"
            />

            {/* Triangle 3: on chord AC: A(200,95), D3(228.75, 109.06), C(257.5, 151.25) */}
            <polygon
              points="200,95 228.75,109.06 257.5,151.25"
              fill={layer2Highlight ? 'rgba(234,179,8,0.65)' : 'rgba(234,179,8,0.45)'}
              stroke="#eab308"
              strokeWidth="1.5"
            />

            {/* Triangle 4: on chord CF: C(257.5, 151.25), D4(286.25, 221.56), F(315, 320) */}
            <polygon
              points="257.5,151.25 286.25,221.56 315,320"
              fill={layer2Highlight ? 'rgba(234,179,8,0.65)' : 'rgba(234,179,8,0.45)'}
              stroke="#eab308"
              strokeWidth="1.5"
            />

            {/* Layer 2 Vertices D1, D2, D3, D4 */}
            <circle cx="171.25" cy="109.06" r="3.5" fill="#fde047" stroke="#fff" strokeWidth="1" />
            <circle cx="113.75" cy="221.56" r="3.5" fill="#fde047" stroke="#fff" strokeWidth="1" />
            <circle cx="228.75" cy="109.06" r="3.5" fill="#fde047" stroke="#fff" strokeWidth="1" />
            <circle cx="286.25" cy="221.56" r="3.5" fill="#fde047" stroke="#fff" strokeWidth="1" />

            <text x="180" y="103" fill="#fde047" fontSize="8" fontWeight="bold">D₁</text>
            <text x="105" y="217" fill="#fde047" fontSize="8" fontWeight="bold">D₂</text>
            <text x="236" y="103" fill="#fde047" fontSize="8" fontWeight="bold">D₃</text>
            <text x="294" y="217" fill="#fde047" fontSize="8" fontWeight="bold">D₄</text>

            {/* Chord AB midpoint & Sagitta on chord AB */}
            <circle cx="171.25" cy="123.13" r="2.5" fill="#f43f5e" />
            <line
              x1="171.25" y1="123.13" x2="171.25" y2="109.06"
              stroke="#f43f5e"
              strokeWidth={layer2Highlight === 'quartered_sagitta' ? 3.5 : 2}
            />
            {/* Arrow on sagitta */}
            <polygon points="171.25,107 169,112 173.5,112" fill="#f43f5e" />

            {/* Sagitta label for D1 */}
            <text
              x="167" y="118"
              fill={layer2Highlight === 'quartered_sagitta' ? '#f43f5e' : '#fca5a5'}
              fontSize={layer2Highlight === 'quartered_sagitta' ? '9.5' : '8'}
              fontWeight="bold"
              textAnchor="end"
            >
              Sagitta = ⅟₁₆ h
            </text>

            {/* Chord BE sagitta */}
            <circle cx="113.75" cy="235.63" r="2.5" fill="#f43f5e" />
            <line
              x1="113.75" y1="235.63" x2="113.75" y2="221.56"
              stroke="#f43f5e"
              strokeWidth={layer2Highlight === 'quartered_sagitta' ? 3.5 : 2}
            />
            <polygon points="113.75,219.5 111.5,224.5 116,224.5" fill="#f43f5e" />

            {/* Span bracket on chord AB */}
            <g opacity={layer2Highlight === 'halved_span' ? 1 : 0.7}>
              <line x1="142.5" y1="75" x2="200" y2="75" stroke="#38bdf8" strokeWidth={layer2Highlight === 'halved_span' ? 2.5 : 1.2} />
              <line x1="142.5" y1="72" x2="142.5" y2="78" stroke="#38bdf8" strokeWidth={layer2Highlight === 'halved_span' ? 2.5 : 1.2} />
              <line x1="200" y1="72" x2="200" y2="78" stroke="#38bdf8" strokeWidth={layer2Highlight === 'halved_span' ? 2.5 : 1.2} />
              <text
                x="171.25" y="70"
                fill={layer2Highlight === 'halved_span' ? '#38bdf8' : '#7dd3fc'}
                fontSize={layer2Highlight === 'halved_span' ? '9.5' : '8'}
                fontWeight="bold"
                textAnchor="middle"
              >
                Span = ½ b
              </text>
            </g>

            {/* Single triangle callout badge on D1 */}
            {layer2Highlight === 'single_area' && (
              <g transform="translate(100, 125)">
                <rect x="0" y="0" width="130" height="24" rx="4" fill="rgba(15,23,42,0.95)" stroke="#eab308" strokeWidth="1.5" />
                <text x="65" y="16" fill="#fde047" fontSize="9.5" fontWeight="bold" textAnchor="middle">
                  Area(△) = ⅟₆₄ T
                </text>
              </g>
            )}

            {/* 4 Triangles Total Callout */}
            {layer2Highlight === 'total_third_term' && (
              <g transform="translate(110, 240)">
                <rect x="0" y="0" width="180" height="26" rx="5" fill="rgba(234,179,8,0.25)" stroke="#eab308" strokeWidth="2" />
                <text x="90" y="17" fill="#fde047" fontSize="10.5" fontWeight="extrabold" textAnchor="middle">
                  4 × (⅟₆₄ T) = ⅟₁₆ T (3rd Term!)
                </text>
              </g>
            )}

            {/* Series Sum Callout */}
            {layer2Highlight === 'series_sum' && (
              <g transform="translate(95, 230)">
                <rect x="0" y="0" width="210" height="42" rx="6" fill="rgba(15,23,42,0.95)" stroke="#10b981" strokeWidth="2" />
                <text x="105" y="17" fill="#34d399" fontSize="10.5" fontWeight="extrabold" textAnchor="middle">
                  T · [ 1 + ¼ + ⅟₁₆ + ⅟₆₄ + … ]
                </text>
                <text x="105" y="34" fill="#a7f3d0" fontSize="11" fontWeight="bold" textAnchor="middle">
                  = ⁴⁄₃ T = ⁴⁄₃ bh (Q.E.D.)
                </text>
              </g>
            )}

            {/* Main vertices A, E, F, B, C */}
            <circle cx="200" cy="95" r="4" fill="#38bdf8" />
            <text x="200" y="87" fill="#38bdf8" fontSize="11" fontWeight="bold" textAnchor="middle">A</text>
            <circle cx="85" cy="320" r="4" fill="#60a5fa" />
            <text x="75" y="325" fill="#60a5fa" fontSize="11" fontWeight="bold" textAnchor="end">E</text>
            <circle cx="315" cy="320" r="4" fill="#60a5fa" />
            <text x="325" y="325" fill="#60a5fa" fontSize="11" fontWeight="bold">F</text>
            <circle cx="142.5" cy="151.25" r="3.5" fill="#34d399" />
            <text x="134" y="152" fill="#34d399" fontSize="9.5" fontWeight="bold" textAnchor="end">B</text>
            <circle cx="257.5" cy="151.25" r="3.5" fill="#34d399" />
            <text x="265" y="152" fill="#34d399" fontSize="9.5" fontWeight="bold">C</text>

            {/* RIGHT SIDE DETAILED EXPLANATION CARD */}
            <g transform="translate(365, 42)">
              <rect x="0" y="0" width="220" height="326" rx="8" fill="rgba(15,23,42,0.96)" stroke="#334155" strokeWidth="1.5" />
              
              <text x="110" y="18" fill="#fde047" fontSize="11" fontWeight="bold" textAnchor="middle">
                Why 3rd Term is ⅟₁₆ T
              </text>
              <line x1="12" y1="24" x2="208" y2="24" stroke="#1e293b" strokeWidth="1" />

              {/* Card 1: 4 New Inscribed Triangles */}
              <g
                className="cursor-pointer"
                onClick={() => setLayer2ActiveHighlight(layer2ActiveHighlight === 'four_triangles' ? null : 'four_triangles')}
                onMouseEnter={() => setLayer2HoverHighlight('four_triangles')}
                onMouseLeave={() => setLayer2HoverHighlight(null)}
              >
                <rect
                  x="8" y="28" width="204" height="42" rx="5"
                  fill={layer2Highlight === 'four_triangles' ? 'rgba(234,179,8,0.25)' : 'rgba(30,41,59,0.6)'}
                  stroke={layer2Highlight === 'four_triangles' ? '#eab308' : '#334155'}
                  strokeWidth="1"
                />
                <text x="14" y="42" fill="#fde047" fontSize="9.5" fontWeight="bold">1. 4 New Inscribed Triangles:</text>
                <text x="14" y="55" fill="#cbd5e1" fontSize="8.5">• Built on 4 chords: AB, BE, AC, CF</text>
                <text x="14" y="66" fill="#cbd5e1" fontSize="8.5">• 2 chords per side × 2 sides = <tspan fill="#fde047" fontWeight="bold">4 triangles</tspan></text>
              </g>

              {/* Card 2: Halved Span */}
              <g
                className="cursor-pointer"
                onClick={() => setLayer2ActiveHighlight(layer2ActiveHighlight === 'halved_span' ? null : 'halved_span')}
                onMouseEnter={() => setLayer2HoverHighlight('halved_span')}
                onMouseLeave={() => setLayer2HoverHighlight(null)}
              >
                <rect
                  x="8" y="74" width="204" height="46" rx="5"
                  fill={layer2Highlight === 'halved_span' ? 'rgba(6,182,212,0.22)' : 'rgba(30,41,59,0.6)'}
                  stroke={layer2Highlight === 'halved_span' ? '#06b6d4' : '#334155'}
                  strokeWidth="1"
                />
                <text x="14" y="88" fill="#38bdf8" fontSize="9.5" fontWeight="bold">2. Horizontal Span is Halved (½ b):</text>
                <text x="14" y="101" fill="#cbd5e1" fontSize="8.5">• Layer 1 covered span = b</text>
                <text x="14" y="113" fill="#cbd5e1" fontSize="8.5">• Layer 2 bisects chord: <tspan fill="#38bdf8" fontWeight="bold">Δx = ½ b</tspan></text>
              </g>

              {/* Card 3: Quartered Sagitta */}
              <g
                className="cursor-pointer"
                onClick={() => setLayer2ActiveHighlight(layer2ActiveHighlight === 'quartered_sagitta' ? null : 'quartered_sagitta')}
                onMouseEnter={() => setLayer2HoverHighlight('quartered_sagitta')}
                onMouseLeave={() => setLayer2HoverHighlight(null)}
              >
                <rect
                  x="8" y="124" width="204" height="52" rx="5"
                  fill={layer2Highlight === 'quartered_sagitta' ? 'rgba(244,63,94,0.22)' : 'rgba(30,41,59,0.6)'}
                  stroke={layer2Highlight === 'quartered_sagitta' ? '#f43f5e' : '#334155'}
                  strokeWidth="1"
                />
                <text x="14" y="138" fill="#fb7185" fontSize="9.5" fontWeight="bold">3. Sagitta is Quartered (⅟₁₆ h):</text>
                <text x="14" y="150" fill="#cbd5e1" fontSize="8.5">• Parabola property: deviation ∝ (Δx)²</text>
                <text x="14" y="162" fill="#cbd5e1" fontSize="8.5">• Since Δx is ½, sagitta scales by (½)² = ¼:</text>
                <text x="14" y="172" fill="#fb7185" fontSize="8.5" fontWeight="bold">  Sagitta = ¼ · (¼ h) = ⅟₁₆ h</text>
              </g>

              {/* Card 4: Single Triangle Area */}
              <g
                className="cursor-pointer"
                onClick={() => setLayer2ActiveHighlight(layer2ActiveHighlight === 'single_area' ? null : 'single_area')}
                onMouseEnter={() => setLayer2HoverHighlight('single_area')}
                onMouseLeave={() => setLayer2HoverHighlight(null)}
              >
                <rect
                  x="8" y="180" width="204" height="50" rx="5"
                  fill={layer2Highlight === 'single_area' ? 'rgba(234,179,8,0.25)' : 'rgba(30,41,59,0.6)'}
                  stroke={layer2Highlight === 'single_area' ? '#eab308' : '#334155'}
                  strokeWidth="1"
                />
                <text x="14" y="194" fill="#fde047" fontSize="9.5" fontWeight="bold">4. Area of Each Triangle = ⅟₆₄ T:</text>
                <text x="14" y="206" fill="#cbd5e1" fontSize="8.5">Area = ½ · Base(⅟₁₆ h) · Span(½ b)</text>
                <text x="14" y="218" fill="#fde047" fontSize="9" fontWeight="bold">     = ½ · ⅟₁₆ · ½ · bh = ⅟₆₄ bh = <tspan fill="#fff">⅟₆₄ T</tspan></text>
                <text x="14" y="227" fill="#94a3b8" fontSize="7.5">(Each is ⅛ of previous △ area: ⅛ · ⅛ T = ⅟₆₄ T)</text>
              </g>

              {/* Card 5: Total 3rd Term */}
              <g
                className="cursor-pointer"
                onClick={() => setLayer2ActiveHighlight(layer2ActiveHighlight === 'total_third_term' ? null : 'total_third_term')}
                onMouseEnter={() => setLayer2HoverHighlight('total_third_term')}
                onMouseLeave={() => setLayer2HoverHighlight(null)}
              >
                <rect
                  x="8" y="234" width="204" height="42" rx="5"
                  fill={layer2Highlight === 'total_third_term' ? 'rgba(16,185,129,0.25)' : 'rgba(30,41,59,0.6)'}
                  stroke={layer2Highlight === 'total_third_term' ? '#10b981' : '#334155'}
                  strokeWidth="1"
                />
                <text x="14" y="248" fill="#34d399" fontSize="9.5" fontWeight="bold">5. 4 Triangles Total = ⅟₁₆ T:</text>
                <text x="14" y="261" fill="#cbd5e1" fontSize="8.5">Layer 2 Total = 4 × (⅟₆₄ T) = <tspan fill="#34d399" fontWeight="bold">⅟₁₆ T</tspan>!</text>
                <text x="14" y="271" fill="#6ee7b7" fontSize="8">⟹ Exactly the 3rd term of the series!</text>
              </g>

              {/* Card 6: Infinite Series */}
              <g
                className="cursor-pointer"
                onClick={() => setLayer2ActiveHighlight(layer2ActiveHighlight === 'series_sum' ? null : 'series_sum')}
                onMouseEnter={() => setLayer2HoverHighlight('series_sum')}
                onMouseLeave={() => setLayer2HoverHighlight(null)}
              >
                <rect
                  x="8" y="280" width="204" height="40" rx="5"
                  fill={layer2Highlight === 'series_sum' ? 'rgba(168,85,247,0.25)' : 'rgba(30,41,59,0.6)'}
                  stroke={layer2Highlight === 'series_sum' ? '#a855f7' : '#334155'}
                  strokeWidth="1"
                />
                <text x="14" y="294" fill="#c084fc" fontSize="9.5" fontWeight="bold">6. Geometric Series Sum = ⁴⁄₃ T:</text>
                <text x="14" y="306" fill="#e9d5ff" fontSize="8.5">T · [ 1 + ¼ + ⅟₁₆ + ⅟₆₄ + … ] = <tspan fill="#34d399" fontWeight="bold">⁴⁄₃ T = ⁴⁄₃ bh</tspan></text>
                <text x="14" y="316" fill="#94a3b8" fontSize="7.5">Archimedes' exhaustion identity (Prop 23–24)</text>
              </g>
            </g>

            {/* Bottom explanation */}
            <rect x="25" y="378" width="550" height="74" rx="8" fill="rgba(15,23,42,0.95)" stroke="#334155" strokeWidth="1.5" />
            <text x="300" y="398" fill="#fde047" fontSize="11" fontWeight="bold" textAnchor="middle">
              1. Why 3rd Term is ⅟₁₆ T: Halving span (½ b) &amp; quartering sagitta (⅟₁₆ h) gives each △ = ⅟₆₄ T. 4 × ⅟₆₄ T = ⅟₁₆ T!
            </text>
            <text x="300" y="418" fill="#38bdf8" fontSize="11" fontWeight="bold" textAnchor="middle">
              2. Induction: Layer k has 2ᵏ triangles each of area T/8ᵏ  ⟹  Layer Total = 2ᵏ · (T/8ᵏ) = T/4ᵏ.
            </text>
            <text x="300" y="438" fill={OB.green} fontSize="12.5" fontWeight="bold" textAnchor="middle">
              3. Exhaustion Series: Area = T · [ 1 + ¼ + ⅟₁₆ + ⅟₆₄ + ... ] = ⁴⁄₃ T = ⁴⁄₃ bh! (Q.E.D. — No calculus)
            </text>
          </g>
        )}
      </svg>
    );
  }, [step, parabolaPath, proofParabolaPath, parabolaSliceT, proofHighlight, activeHighlight, hoverHighlight, layer2Highlight, layer2ActiveHighlight, layer2HoverHighlight, leverHighlight, leverActiveHighlight, leverHoverHighlight, leverSliceU]);

  /* ═══════════════════════ LEFT SIDEBAR ═══════════════════════ */
  const leftPanel = (
    <div className="flex flex-col gap-3 min-h-full pb-4">
      {/* Header card */}
      <div className="bg-slate-900/90 border border-cyan-500/40 rounded-2xl p-4 shadow-xl shrink-0">
        <div className="flex items-center justify-between text-xs font-mono text-cyan-400 uppercase tracking-wider mb-1">
          <span>
            {activeSubtask === 1
              ? 'TASK 1: ON THE SPHERE & CYLINDER'
              : activeSubtask === 2
              ? 'TASK 2: EQUILIBRIUM OF PLANES (TRIANGLE)'
              : 'TASK 3: AREA OF PARABOLA'}
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
              : 'Area of Parabola'}
          </span>
        </h2>
        <p className="text-xs text-slate-300 mt-1 leading-relaxed">
          {activeSubtask === 1
            ? 'Discover how Archimedes proved that a sphere\'s surface area is 4πR² — exactly 2/3 of its circumscribed cylinder.'
            : activeSubtask === 2
            ? 'Explore the Law of the Lever, median concurrence, and the exact geometric proofs of the 2:1 centroid ratio.'
            : 'Discover how Archimedes proved that the area of a parabolic segment is exactly 4/3 bh (4/3 of the inscribed triangle) using both his mechanical lever balance and geometric exhaustion series (T + 1/4 T + 1/16 T + ...).'}
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
              : 'The Method & Quadrature of the Parabola'} • Proof
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
        <div className="text-[11px] text-slate-300 leading-relaxed mb-2 max-h-[350px] overflow-y-auto pr-1 custom-scrollbar">
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
                  <strong className="text-cyan-300">Step 1 (The Parabolic Segment &amp; Primary Inscribed Triangle):</strong>
                  <p className="mt-1">In both <em>The Method</em> and <em>Quadrature of the Parabola</em>, Archimedes studies a parabolic segment with base <span className="font-mono text-amber-300">2b</span> and height <span className="font-mono text-cyan-300">h</span>. Inscribing the primary triangle <span className="font-mono text-blue-400 font-bold">△AEF</span> gives area <span className="font-mono text-cyan-300 font-bold">T = ½ · (2b) · h = bh</span>.</p>
                  <p className="mt-1 text-slate-400">Archimedes' goal: calculate the exact area of the remaining curved segment outside △AEF without modern calculus.</p>
                </div>
              )}
              {step === 1 && (
                <div className="space-y-1.5 text-[11px]">
                  <div className="font-bold text-cyan-400 flex items-center justify-between">
                    <span>Step 2 (Method 1: The Mechanical Lever Law):</span>
                    <span className="text-[9px] font-normal text-slate-400">Click cards to highlight</span>
                  </div>
                  <div className="space-y-1 text-slate-300 text-[10.5px]">
                    {/* Card 1: Tangent Triangle */}
                    <div
                      className={`p-1 rounded cursor-pointer transition ${leverActiveHighlight === 'tangent_triangle' ? 'bg-amber-950/80 border border-amber-500' : 'hover:bg-slate-800/60'}`}
                      onClick={() => setLeverActiveHighlight(leverActiveHighlight === 'tangent_triangle' ? null : 'tangent_triangle')}
                      onMouseEnter={() => setLeverHoverHighlight('tangent_triangle')}
                      onMouseLeave={() => setLeverHoverHighlight(null)}
                    >
                      <span className="text-amber-400 font-bold">1. Tangent Triangle (△AFC = 4bh = 4T):</span> Tangent at <span className="font-mono text-amber-300">C</span> meets extended diameter at <span className="font-mono text-cyan-300">E</span> where <span className="font-mono text-cyan-300">EB = BD = h ⟹ ED = 2h</span>. A vertical line through <span className="font-mono text-amber-300">A</span> meets the tangent at <span className="font-mono text-rose-300">F</span>. By midline similarity, <span className="font-mono text-rose-300 font-bold">FA = 2·ED = 4h</span>. Base <span className="font-mono text-amber-300">AC = 2b</span>, so:
                      <div className="bg-slate-950/80 p-1 rounded border border-slate-800 font-mono text-[10px] text-center my-0.5">
                        Area(△AFC) = ½ · Base(2b) · Height(4h) = <span className="text-amber-300 font-bold">4bh = 4T</span>
                      </div>
                      The circumscribed triangle is strictly 4 times the inscribed triangle!
                    </div>

                    {/* Card 2: Law of the Lever on Slices */}
                    <div
                      className={`p-1 rounded cursor-pointer transition ${leverActiveHighlight === 'slice_balance' ? 'bg-cyan-950/80 border border-cyan-500' : 'hover:bg-slate-800/60'}`}
                      onClick={() => setLeverActiveHighlight(leverActiveHighlight === 'slice_balance' ? null : 'slice_balance')}
                      onMouseEnter={() => setLeverHoverHighlight('slice_balance')}
                      onMouseLeave={() => setLeverHoverHighlight(null)}
                    >
                      <span className="text-cyan-300 font-bold">2. Law of the Lever on Slices (w · H = L · x):</span> Any vertical slice at distance <span className="font-mono text-amber-300">x</span> from fulcrum A cuts triangle slice <span className="font-mono text-amber-300">L(x)</span> and parabola slice <span className="font-mono text-cyan-300">w(x)</span>. The parabola geometry guarantees the exact proportion:
                      <div className="bg-slate-950/80 p-1 rounded border border-slate-800 font-mono text-[10px] text-center my-0.5">
                        <span className="text-amber-300">L(x)</span> / <span className="text-cyan-300">w(x)</span> = <span className="text-rose-300">H</span> / <span className="text-amber-300">x</span>  ⟹  <span className="text-cyan-300 font-bold">w(x) · H</span> = <span className="text-amber-300 font-bold">L(x) · x</span>
                      </div>
                      Hanging slice <span className="font-mono text-cyan-300">w(x)</span> on the left arm at distance <span className="font-mono text-rose-300">H</span> produces identical torque to triangle slice <span className="font-mono text-amber-300">L(x)</span> sitting in place at distance <span className="font-mono text-amber-300">x</span>!
                    </div>

                    {/* Card 3: Triangle Centroid Concentration */}
                    <div
                      className={`p-1 rounded cursor-pointer transition ${leverActiveHighlight === 'triangle_centroid' ? 'bg-purple-950/80 border border-purple-500' : 'hover:bg-slate-800/60'}`}
                      onClick={() => setLeverActiveHighlight(leverActiveHighlight === 'triangle_centroid' ? null : 'triangle_centroid')}
                      onMouseEnter={() => setLeverHoverHighlight('triangle_centroid')}
                      onMouseLeave={() => setLeverHoverHighlight(null)}
                    >
                      <span className="text-purple-400 font-bold">3. Centroid at ⅓ H (No Calculus Needed):</span> Why doesn't Archimedes need integral calculus? All triangle slices stay in place. Their total rotational moment equals the triangle's area concentrated at its center of gravity! In <em>Equilibrium of Planes</em>, Archimedes proved a triangle's centroid is at <span className="font-mono text-purple-300 font-bold">⅓ H</span> from the base.
                      <div className="bg-slate-950/80 p-1 rounded border border-slate-800 font-mono text-[10px] text-center my-0.5">
                        Total Right-Side Torque = <span className="text-amber-300 font-bold">Area(△AFC)</span> · <span className="text-purple-300 font-bold">⅓ H</span> = <span className="text-amber-300 font-bold">(4bh)</span> · <span className="text-purple-300 font-bold">⅓ H</span>
                      </div>
                    </div>

                    {/* Card 4: Total Grand Balance */}
                    <div
                      className={`p-1 rounded cursor-pointer transition ${leverActiveHighlight === 'total_equilibrium' ? 'bg-emerald-950/80 border border-emerald-500' : 'hover:bg-slate-800/60'}`}
                      onClick={() => setLeverActiveHighlight(leverActiveHighlight === 'total_equilibrium' ? null : 'total_equilibrium')}
                      onMouseEnter={() => setLeverHoverHighlight('total_equilibrium')}
                      onMouseLeave={() => setLeverHoverHighlight(null)}
                    >
                      <span className="text-emerald-300 font-bold">4. Grand Mechanical Balance (Area = ⁴⁄₃ T):</span> Because every parabola slice is suspended at the same left distance <span className="font-mono text-rose-300">H</span>, all slices sum directly to the whole Parabola Area:
                      <div className="bg-slate-950/80 p-1.5 rounded border border-slate-800 font-mono text-[10px] text-center my-0.5">
                        <span className="text-cyan-300 font-bold">Area(P) · H</span> = <span className="text-amber-300 font-bold">(4bh) · ⅓ H</span>  ⟹  <span className="text-emerald-400 font-extrabold text-[11px]">Area(P) = ⁴⁄₃ bh = ⁴⁄₃ T</span>!
                      </div>
                      The lever arm <span className="font-mono text-rose-300">H</span> cancels out completely. Archimedes had found the exact curved area mechanically!
                    </div>
                  </div>
                </div>
              )}
              {step === 2 && (
                <div className="space-y-1.5 text-[11px]">
                  <div className="font-bold text-emerald-400 flex items-center justify-between">
                    <span>Step 3 (Method 2: Layer 1 — Why 2nd Term is ¼ T):</span>
                    <span className="text-[9px] font-normal text-slate-400">Click items to highlight</span>
                  </div>
                  <div className="space-y-1 text-slate-300 text-[10.5px]">
                    <div
                      className={`p-1 rounded cursor-pointer transition ${activeHighlight === 'sagitta' ? 'bg-rose-950/80 border border-rose-500' : 'hover:bg-slate-800/60'}`}
                      onClick={() => setActiveHighlight(activeHighlight === 'sagitta' ? null : 'sagitta')}
                    >
                      <span className="text-rose-400 font-bold">1. Sagitta Height (BM₁ = ¼ h):</span> Midpoint of chord AE is <span className="font-mono text-rose-300">M₁(-½b, ½h)</span>. The vertical line through M₁ hits the parabola at vertex <span className="font-mono text-emerald-300">B(-½b, ¼h)</span>. Vertical distance <span className="font-mono text-rose-300 font-bold">BM₁ = ½h - ¼h = ¼ h</span> is the <span className="text-amber-300 font-semibold">Sagitta</span> (Latin for "arrow").
                    </div>
                    <div
                      className={`p-1 rounded cursor-pointer transition ${activeHighlight === 'span' ? 'bg-cyan-950/80 border border-cyan-500' : 'hover:bg-slate-800/60'}`}
                      onClick={() => setActiveHighlight(activeHighlight === 'span' ? null : 'span')}
                    >
                      <span className="text-cyan-300 font-bold">2. Horizontal Span is b:</span> Using vertical segment BM₁ as the base, the altitudes from A(0,0) and E(-b,h) are horizontal: <span className="font-mono text-cyan-200">Alt₁ = ½ b</span> and <span className="font-mono text-cyan-200">Alt₂ = ½ b</span>. Total horizontal span = <span className="font-mono text-cyan-300 font-bold">Alt₁ + Alt₂ = b</span>.
                    </div>
                    <div
                      className={`p-1 rounded cursor-pointer transition ${activeHighlight === 'subtriangles' ? 'bg-emerald-950/80 border border-emerald-500' : 'hover:bg-slate-800/60'}`}
                      onClick={() => setActiveHighlight(activeHighlight === 'subtriangles' ? null : 'subtriangles')}
                    >
                      <span className="text-emerald-300 font-bold">3. Exact Area Formula for △ABE:</span>
                      <div className="bg-slate-950/80 p-1.5 rounded border border-slate-800 font-mono text-[10px] text-center my-0.5">
                        Area(△ABE) = ½ · Base(BM₁) · Span = ½ · (¼ h) · b = <span className="text-emerald-300 font-bold">⅛ bh = ⅛ T</span>
                      </div>
                      Vertical line BM₁ splits △ABE into two sub-triangles: <span className="font-mono text-cyan-300">△ABM₁ (⅟₁₆ T)</span> + <span className="font-mono text-emerald-300">△EBM₁ (⅟₁₆ T)</span> = <span className="font-mono text-emerald-400 font-bold">⅛ T</span>!
                    </div>
                    <div
                      className={`p-1 rounded cursor-pointer transition ${activeHighlight === 'topvsside' ? 'bg-amber-950/80 border border-amber-500' : 'hover:bg-slate-800/60'}`}
                      onClick={() => setActiveHighlight(activeHighlight === 'topvsside' ? null : 'topvsside')}
                    >
                      <span className="text-amber-300 font-bold">4. Top △ABC vs Side △ABE:</span> Top △ABC has horizontal base BC = b and vertical height ¼ h ⟹ <span className="font-mono text-amber-300">⅛ T</span>. Side △ABE has vertical base ¼ h and horizontal span b ⟹ <span className="font-mono text-emerald-300">⅛ T</span>. Both have area ⅛ T (rotated 90°)!
                    </div>
                    <div
                      className={`p-1 rounded cursor-pointer transition ${activeHighlight === 'totalgreen' ? 'bg-purple-950/80 border border-purple-500' : 'hover:bg-slate-800/60'}`}
                      onClick={() => setActiveHighlight(activeHighlight === 'totalgreen' ? null : 'totalgreen')}
                    >
                      <span className="text-purple-300 font-bold">5. Stage 1 Green Total = ¼ T (2nd Term):</span> Symmetrical △ACF on right side also = ⅛ T. Green Total = <span className="font-mono text-white font-bold">⅛ T + ⅛ T = ¼ T</span>!
                    </div>
                  </div>
                </div>
              )}
              {step === 3 && (
                <div className="space-y-1.5 text-[11px]">
                  <div className="font-bold text-amber-400 flex items-center justify-between">
                    <span>Step 4 (Method 2: Layer 2 — Why 3rd Term is ⅟₁₆ T):</span>
                    <span className="text-[9px] font-normal text-slate-400">Click items to highlight</span>
                  </div>
                  <div className="space-y-1 text-slate-300 text-[10.5px]">
                    <div
                      className={`p-1 rounded cursor-pointer transition ${layer2ActiveHighlight === 'four_triangles' ? 'bg-amber-950/80 border border-amber-500' : 'hover:bg-slate-800/60'}`}
                      onClick={() => setLayer2ActiveHighlight(layer2ActiveHighlight === 'four_triangles' ? null : 'four_triangles')}
                    >
                      <span className="text-amber-300 font-bold">1. 4 New Inscribed Triangles:</span> On the 4 remaining chords (AB, BE, AC, CF), Archimedes constructs 4 new triangles with vertices on the parabola (D₁, D₂, D₃, D₄).
                    </div>
                    <div
                      className={`p-1 rounded cursor-pointer transition ${layer2ActiveHighlight === 'halved_span' ? 'bg-cyan-950/80 border border-cyan-500' : 'hover:bg-slate-800/60'}`}
                      onClick={() => setLayer2ActiveHighlight(layer2ActiveHighlight === 'halved_span' ? null : 'halved_span')}
                    >
                      <span className="text-cyan-300 font-bold">2. Span is Halved (Δx = ½ b):</span> Each chord now spans half the horizontal interval of Layer 1: <span className="font-mono text-cyan-200">Δx = ½ b</span>.
                    </div>
                    <div
                      className={`p-1 rounded cursor-pointer transition ${layer2ActiveHighlight === 'quartered_sagitta' ? 'bg-rose-950/80 border border-rose-500' : 'hover:bg-slate-800/60'}`}
                      onClick={() => setLayer2ActiveHighlight(layer2ActiveHighlight === 'quartered_sagitta' ? null : 'quartered_sagitta')}
                    >
                      <span className="text-rose-400 font-bold">3. Sagitta is Quartered (⅟₁₆ h):</span> Because the parabola curve satisfies <span className="font-mono text-rose-300">y ∝ x²</span>, halving the span quarters the sagitta: <span className="font-mono text-rose-300">(½)² = ¼</span>. Hence, <span className="font-mono text-rose-200 font-bold">Sagitta₂ = ¼ · (¼ h) = ⅟₁₆ h</span>!
                    </div>
                    <div
                      className={`p-1 rounded cursor-pointer transition ${layer2ActiveHighlight === 'single_area' ? 'bg-amber-950/80 border border-amber-500' : 'hover:bg-slate-800/60'}`}
                      onClick={() => setLayer2ActiveHighlight(layer2ActiveHighlight === 'single_area' ? null : 'single_area')}
                    >
                      <span className="text-amber-300 font-bold">4. Area of Each Triangle = ⅟₆₄ T:</span>
                      <div className="bg-slate-950/80 p-1 rounded border border-slate-800 font-mono text-[10px] text-center my-0.5">
                        Area = ½ · Base(⅟₁₆ h) · Span(½ b) = <span className="text-amber-300 font-bold">⅟₆₄ bh = ⅟₆₄ T</span>
                      </div>
                      Each triangle is ⅛ of the previous layer's triangle: <span className="font-mono text-slate-300">⅛ · (⅛ T) = ⅟₆₄ T</span>.
                    </div>
                    <div
                      className={`p-1 rounded cursor-pointer transition ${layer2ActiveHighlight === 'total_third_term' ? 'bg-emerald-950/80 border border-emerald-500' : 'hover:bg-slate-800/60'}`}
                      onClick={() => setLayer2ActiveHighlight(layer2ActiveHighlight === 'total_third_term' ? null : 'total_third_term')}
                    >
                      <span className="text-emerald-300 font-bold">5. 4 Triangles Total = ⅟₁₆ T (The 3rd Term!):</span>
                      <div className="bg-slate-950/80 p-1 rounded border border-slate-800 font-mono text-[10px] text-center my-0.5">
                        4 × (⅟₆₄ T) = <span className="text-emerald-400 font-extrabold">⅟₁₆ T</span>
                      </div>
                      This proves definitively why the 3rd term in the series is exactly <span className="font-mono text-emerald-300 font-bold">⅟₁₆ T</span>!
                    </div>
                    <div
                      className={`p-1 rounded cursor-pointer transition ${layer2ActiveHighlight === 'series_sum' ? 'bg-purple-950/80 border border-purple-500' : 'hover:bg-slate-800/60'}`}
                      onClick={() => setLayer2ActiveHighlight(layer2ActiveHighlight === 'series_sum' ? null : 'series_sum')}
                    >
                      <span className="text-purple-300 font-bold">6. Exhaustion Series Sum = ⁴⁄₃ T:</span> General layer k has <span className="font-mono text-purple-200">2ᵏ</span> triangles of area <span className="font-mono text-purple-200">T/8ᵏ</span>, summing to <span className="font-mono text-purple-200">T/4ᵏ</span>.
                      <div className="font-mono text-cyan-300 text-center text-[10.5px] font-bold mt-0.5">
                        T · [ 1 + ¼ + ⅟₁₆ + ⅟₆₄ + … ] = ⁴⁄₃ T = ⁴⁄₃ bh! (Q.E.D.)
                      </div>
                    </div>
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
