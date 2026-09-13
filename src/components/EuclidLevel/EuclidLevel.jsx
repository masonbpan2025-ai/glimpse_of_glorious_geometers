import React, { useState, useEffect } from 'react';
import { useGameState } from '../../context/GameStateContext';
import { BookOpen, ChevronRight, ChevronLeft, RotateCcw, ArrowRight, Lightbulb, Info, Sliders } from 'lucide-react';
import LevelShell from '../LevelShell';

export default function EuclidLevel() {
  const { activeSubtask, completedSubtasks, completeSubtask } = useGameState();

  // Task 1 Illustration Tab state: 'definitions' | 'axioms' | 'postulates' | 'propositions'
  const [illustrationTab, setIllustrationTab] = useState('definitions');
  // Task 1 Active Common Notion (1..5)
  const [activeCN, setActiveCN] = useState(1);
  // Task 1 Geodesics Simulator Geometry Type: 'Flat' | 'Spherical' | 'Hyperbolic'
  const [geometryType, setGeometryType] = useState('Flat');
  // Task 1 Proposition 1 construction step (0..3)
  const [prop1Step, setProp1Step] = useState(0);

  // Task 2 Proof Explorer Category: 'congruence' | 'triangles' | 'parallel'
  const [task2ProofCategory, setTask2ProofCategory] = useState('congruence');
  // Selected Proposition inside Task 2: 'Prop4' | 'Prop8' | 'Prop26' | 'Prop5' | 'Prop32' | 'Prop29'
  const [selectedProp, setSelectedProp] = useState('Prop4');
  // Proof Step for active proposition
  const [proofStep, setProofStep] = useState(0);
  // Interactive Construction Challenge state for Task 2 (Proposition IX: Bisecting an Angle)
  const [constructionStep, setConstructionStep] = useState(0);

  // Task 3 (Book III: Circles and Angles) State
  const [task3Category, setTask3Category] = useState('chords'); // 'chords' | 'tangents' | 'angles' | 'power_of_point'
  const [task3SelectedProp, setTask3SelectedProp] = useState('Prop3'); // 'Prop3' | 'Prop14' | 'Prop11_12' | 'Prop16' | 'Prop20' | 'Prop21' | 'Prop22' | 'Prop31' | 'Prop32' | 'Prop35_36'
  const [task3ProofStep, setTask3ProofStep] = useState(0);
  const [task3CalcMode, setTask3CalcMode] = useState('chords'); // 'chords' | 'equal_chords' | 'touching_circles' | 'tangent_line' | 'central_angle' | 'same_arc' | 'cyclic_quad' | 'thales' | 'alternate_seg' | 'power_point'

  // Task 4 (Book II & IV: Geometric Algebra & Polygons) State
  const [task4SelectedProp, setTask4SelectedProp] = useState('Prop12'); // 'Prop12' | 'Prop13' | 'Prop11' | 'Prop4_10' | 'Prop4_11' | 'Prop4_12_14'
  const [task4ProofStep, setTask4ProofStep] = useState(0);
  const [task4CalcMode, setTask4CalcMode] = useState('obtuse'); // 'obtuse' | 'acute' | 'golden' | 'golden_triangle' | 'pentagon'
  const [sideA, setSideA] = useState(80); // Base side a (BC)
  const [sideB, setSideB] = useState(60); // Side b (AC)
  const [angleTheta, setAngleTheta] = useState(120); // Obtuse (120) or Acute (60)
  const [goldenLineLen, setGoldenLineLen] = useState(100); // Line segment length a for Golden Ratio
  const [goldenTriBase, setGoldenTriBase] = useState(60); // Golden triangle base length b
  const [pentagonRadius, setPentagonRadius] = useState(70); // Pentagon circumradius R
  const [pentagonRot, setPentagonRot] = useState(0); // Pentagon rotation angle (0..360)
  const [polygonSides, setPolygonSides] = useState(5); // Polygon sides n (3..12)
  const [artPatternsSubMode, setArtPatternsSubMode] = useState('grid'); // 'grid' | 'phyllotaxis' | 'spirals' | 'golden_spiral'
  const [phyllotaxisAngle, setPhyllotaxisAngle] = useState(137.5); // Golden Angle default 137.5°
  const [spiralDepth, setSpiralDepth] = useState(6); // 1..8
  const [spiralType, setSpiralType] = useState('rectangles'); // 'rectangles' | 'whirling_triangles'

  // Task 5 (Book V & VI: Proportions & Similarities) State
  const [task5Category, setTask5Category] = useState('areas_parallel'); // 'areas_parallel' | 'similarity' | 'means_scaling' | 'pythagoras_arcs'
  const [task5SelectedProp, setTask5SelectedProp] = useState('Prop6_1'); // 'Prop6_1' | 'Prop6_2' | 'Prop6_3' | 'Prop6_4' | 'Prop6_5_7' | 'Prop6_16_17' | 'Prop6_19_20' | 'Prop6_31' | 'Prop6_33'
  const [task5ProofStep, setTask5ProofStep] = useState(0);
  const [task5CalcMode, setTask5CalcMode] = useState('area_base'); // 'area_base' | 'thales' | 'angle_bisector' | 'aaa' | 'cross_mult' | 'duplicate_ratio' | 'gen_pythagoras' | 'arc_ratio'
  const [task5Base1] = useState(60);
  const [task5Base2] = useState(90);
  const [task5Height] = useState(50);
  const [task5ThalesCut] = useState(0.4);
  const [task5ScaleK] = useState(1.5);
  const [task5ShapeType] = useState('semicircle');
  const [task5ArcAngle1] = useState(45);
  const [task5ArcAngle2] = useState(90);

  // General Quiz State for Task 1, Task 2, Task 3, Task 4 & Task 5
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showHint, setShowHint] = useState(false);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState('');

  // Reset quiz & step state when switching active subtask
  useEffect(() => {
    setCurrentQIndex(0);
    setSelectedAnswers({});
    setShowHint(false);
    setQuizSubmitted(false);
    setFeedbackMsg('');
    setProofStep(0);
    setConstructionStep(0);
    setTask3ProofStep(0);
    setTask4ProofStep(0);
    setTask5ProofStep(0);
    setActiveCN(1);
    setGeometryType('Flat');
    setProp1Step(0);
    setIsSuccess(completedSubtasks.includes(`6-${activeSubtask}`));
  }, [activeSubtask, completedSubtasks]);

  useEffect(() => {
    if (window.MathJax && typeof window.MathJax.typesetPromise === 'function') {
      window.MathJax.typesetPromise();
    }
  }, [
    activeSubtask, illustrationTab, task2ProofCategory, selectedProp, proofStep,
    constructionStep, currentQIndex, activeCN, geometryType, prop1Step,
    task3Category, task3SelectedProp, task3ProofStep, task3CalcMode, task4SelectedProp, task4ProofStep, sideA, sideB, angleTheta, goldenLineLen,
    task5Category, task5SelectedProp, task5ProofStep, task5CalcMode, task5Base1, task5Base2, task5Height, task5ThalesCut, task5ScaleK, task5ShapeType, task5ArcAngle1, task5ArcAngle2
  ]);

  // Task 1 Questions
  const task1Questions = [
    {
      id: 1,
      concept: 'Role of Definitions',
      question: 'Why did Euclid begin Book I of the Elements with 23 Definitions before listing any Postulates or Propositions?',
      options: [
        'To establish a precise, unambiguous vocabulary so every geometric entity has a clear mathematical meaning.',
        'To prove that points and lines are physical objects made of atoms.',
        'Because Greek law mandated dictionary entries at the start of all texts.',
        'To calculate numerical distances without proofs.'
      ],
      correct: 0,
      explanation: 'Definitions name and clarify concepts (point, line, circle, etc.) before any assumptions or proofs are made.'
    },
    {
      id: 2,
      concept: 'Axiom vs. Postulate',
      question: 'What is the primary difference between a Common Notion (Axiom) and a Postulate in Euclid\'s Elements?',
      options: [
        'Common Notions are general logical truths applicable across all reasoning, while Postulates are basic spatial permissions specific to geometry.',
        'Postulates are algebraic formulas, whereas Common Notions are physical laws of nature.',
        'Common Notions require detailed geometric proofs, while Postulates are unverified guesses.',
        'There is no difference; Euclid used the two terms interchangeably for construction rules.'
      ],
      correct: 0,
      explanation: 'Axioms (Common Notions) like "things equal to the same thing are equal" apply universally to all mathematics. Postulates like "draw a straight line between any two points" are specific geometric permissions.'
    },
    {
      id: 3,
      concept: '5th Postulate Controversy',
      question: 'Why was the 5th (Parallel) Postulate controversial for over 2,000 years?',
      options: [
        'Because it was long and complex, leading mathematicians to believe it was a Theorem that should be proved from the first four Postulates.',
        'Because Euclid forgot to include it in the original Greek manuscript.',
        'Because it contradicted the definition of a right angle.',
        'Because compasses could not physically draw parallel lines.'
      ],
      correct: 0,
      explanation: 'For 2,000 years, mathematicians felt Postulate 5 sounded like a theorem and spent centuries trying in vain to prove it from Postulates 1–4.'
    },
    {
      id: 4,
      concept: 'Non-Euclidean Breakthrough',
      question: 'What historic discovery occurred when 19th-century mathematicians intentionally replaced or modified the 5th Postulate?',
      options: [
        'They discovered Non-Euclidean Geometries (Spherical and Hyperbolic geometry) where parallel lines behave differently and the math remains completely consistent.',
        'They proved that geometry is impossible on curved surfaces.',
        'They proved the 5th Postulate from Postulates 1–4.',
        'They showed that triangles cannot exist in 3D space.'
      ],
      correct: 0,
      explanation: 'By assuming 0 parallel lines (Spherical) or infinitely many parallel lines (Hyperbolic), Gauss, Bolyai, and Lobachevsky created consistent Non-Euclidean geometries!'
    },
    {
      id: 5,
      concept: 'Problem vs. Theorem',
      question: 'Proposition 1 constructs an equilateral triangle on a given line segment and ends with Q.E.F. What subtype of Proposition is this?',
      options: [
        'A Problem (a geometric construction task ending with Quod Erat Faciendum - "which was to be done").',
        'A Theorem (a deductive proof of a property ending with Quod Erat Demonstrandum).',
        'A Postulate (an unproven geometric starting rule).',
        'A Common Notion (a universal logical axiom).'
      ],
      correct: 0,
      explanation: 'Propositions have two subtypes: Problems (constructions ending in Q.E.F.) and Theorems (proofs ending in Q.E.D.). Proposition 1 is a Problem.'
    }
  ];

  // Task 2 Questions (Book I: plane geometry)
  const task2Questions = [
    {
      id: 1,
      concept: 'Proposition IV (SAS)',
      question: 'What does Proposition IV (Side-Angle-Side) prove about two triangles?',
      options: [
        'If two triangles have two sides and the included angle respectively equal, the triangles are equal in every respect (congruent).',
        'If two triangles have equal areas, their side lengths must be identical.',
        'All right triangles automatically have equal interior angles.',
        'If two sides are equal, the third side must be twice as long.'
      ],
      correct: 0,
      explanation: 'Proposition IV proves SAS Congruence by superposition: placing one triangle onto another shows all remaining sides and angles coincide.'
    },
    {
      id: 2,
      concept: 'Proposition V (Pons Asinorum)',
      question: 'Why is Proposition V (Isosceles Triangle Theorem) historically called the "Pons Asinorum" (Bridge of Asses)?',
      options: [
        'Because it was considered the first true test of a geometry student\'s logical rigor, and its proof figure resembled a wooden bridge.',
        'Because Greek farmers used it to build bridges for livestock.',
        'Because Euclid wrote the proof on a wooden donkey saddle.',
        'Because it proved that donkeys cannot walk in straight lines.'
      ],
      correct: 0,
      explanation: 'Proposition V proves base angles of an isosceles triangle are equal. Its diagram resembles a bridge structure and separated serious thinkers from beginners.'
    },
    {
      id: 3,
      concept: 'Proposition XXXII (Angle Sum)',
      question: 'According to Proposition XXXII, what is the sum of the three interior angles of ANY triangle in Euclidean space?',
      options: [
        'Exactly two right angles (180 degrees).',
        'Three right angles (270 degrees).',
        'It varies depending on whether the triangle is acute or obtuse.',
        'One right angle (90 degrees).'
      ],
      correct: 0,
      explanation: 'By drawing a line parallel to one side through a vertex, Euclid proves the interior angles sum to 2 right angles (180°).'
    }
  ];

  // Task 3 Questions (Book III: Circles & Angles)
  const task3Questions = [
    {
      id: 1,
      concept: 'Proposition III.3 (Perpendicular Bisector of Chords)',
      question: 'If a straight line drawn through the center of a circle bisects a chord that does not pass through the center, what angle does it form with the chord?',
      options: [
        '45 degrees (Acute angle)',
        '60 degrees',
        '90 degrees (Right angle)',
        '180 degrees (Straight angle)'
      ],
      correct: 2,
      explanation: 'Proposition III.3 proves that a line from the center bisecting a chord is perpendicular to it (90°), establishing the perpendicular bisector rule for chords.'
    },
    {
      id: 2,
      concept: 'Proposition III.20 (The Central Angle Theorem)',
      question: 'According to Proposition III.20, if an inscribed angle standing on arc AB measures 35°, what is the measure of the central angle standing on the same arc?',
      options: [
        '35°',
        '70° (Double the inscribed angle)',
        '105°',
        '140°'
      ],
      correct: 1,
      explanation: 'Proposition III.20 proves that the central angle standing on an arc is double the inscribed angle standing on the same arc (2 × 35° = 70°).'
    },
    {
      id: 3,
      concept: 'Proposition III.31 (Thales\'s Theorem)',
      question: 'By Thales\'s Theorem (Proposition III.31), what is always the measure of an angle inscribed in a semicircle whose legs meet the diameter endpoints?',
      options: [
        '45 degrees',
        '60 degrees',
        '90 degrees (Right angle)',
        '120 degrees'
      ],
      correct: 2,
      explanation: 'Proposition III.31 proves that any triangle inscribed in a semicircle with the diameter as one of its sides is always a right-angled triangle (90°).'
    },
    {
      id: 4,
      concept: 'Proposition III.22 (Cyclic Quadrilateral Theorem)',
      question: 'In any quadrilateral inscribed in a circle (cyclic quadrilateral), what is the sum of any pair of opposite angles (Proposition III.22)?',
      options: [
        '90 degrees',
        '180 degrees (Two right angles)',
        '270 degrees',
        '360 degrees'
      ],
      correct: 1,
      explanation: 'Proposition III.22 proves that opposite angles of any cyclic quadrilateral sum to 180° (two right angles).'
    },
    {
      id: 5,
      concept: 'Propositions III.35 & III.36 (Power of a Point)',
      question: 'Two chords AB and CD intersect at point P inside a circle. If PA = 4, PB = 6, and PC = 3, what is the length of segment PD (Prop. III.35)?',
      options: [
        '5',
        '8 (since PA · PB = PC · PD ⟹ 4 · 6 = 3 · 8 = 24)',
        '12',
        '18'
      ],
      correct: 1,
      explanation: 'Proposition III.35 proves that PA · PB = PC · PD. Here 4 × 6 = 24, so PD = 24 / 3 = 8.'
    }
  ];

  // Task 4 Questions (Book II & IV: Geometric Algebra & Polygons)
  const task4Questions = [
    {
      id: 1,
      concept: 'Proposition XII (Obtuse Triangle Law)',
      question: 'In an obtuse triangle with side c opposite obtuse angle C, how does Euclid\'s Proposition XII express c² in terms of sides a, b and projected segment d?',
      options: [
        'c² = a² + b² + 2ad (Sum of squares of containing sides plus twice the rectangle of side a and projection d).',
        'c² = a² + b² - 2ad (Sum of squares minus twice the rectangle).',
        'c² = a² + b² + ad.',
        'c² = a² - b².'
      ],
      correct: 0,
      explanation: 'Proposition XII extends the Pythagorean Theorem to obtuse triangles: c² = a² + b² + 2ad. This is the geometric precursor to the Law of Cosines c² = a² + b² - 2ab cos(θ) for obtuse angles.'
    },
    {
      id: 2,
      concept: 'Proposition XIII (Acute Triangle Law)',
      question: 'According to Proposition XIII, what is the geometric relationship for side c opposite an acute angle in any triangle?',
      options: [
        'c² = a² + b² - 2ad (Sum of squares of containing sides minus twice the rectangle of the base and projected segment).',
        'c² = a² + b² + 2ad.',
        'c² = a² + b² + d².',
        'c² = 2a² + 2b².'
      ],
      correct: 0,
      explanation: 'Proposition XIII proves c² = a² + b² - 2ad for acute angles, which corresponds directly to the Law of Cosines c² = a² + b² - 2ab cos(θ).'
    },
    {
      id: 3,
      concept: 'Proposition II.11 (Golden Ratio)',
      question: 'Proposition II.11 divides a line segment a into two parts such that a(a - x) = x². What famous mathematical ratio is defined by this construction?',
      options: [
        'The Golden Ratio (φ = (1 + √5)/2 ≈ 1.618033...).',
        'The Archimedean Constant (π ≈ 3.14159...).',
        'Euler\'s Number (e ≈ 2.71828...).',
        'The Square Root of 2 (√2 ≈ 1.4142...).'
      ],
      correct: 0,
      explanation: 'Dividing a line in extreme and mean ratio (a(a-x) = x²) yields a/x = x/(a-x) = φ ≈ 1.618, the classical geometric definition of the Golden Ratio!'
    },
    {
      id: 4,
      concept: 'Proposition IV.10 (The Golden Triangle)',
      question: 'Euclid\'s Proposition IV.10 constructs an isosceles triangle where each base angle is double the vertical angle. What are the three interior angles of this Golden Triangle?',
      options: [
        '72°, 72°, 36° (Base angles 72° are double the vertex angle 36°).',
        '60°, 60°, 60° (Equilateral triangle).',
        '45°, 45°, 90° (Right isosceles triangle).',
        '80°, 80°, 20°.'
      ],
      correct: 0,
      explanation: 'Proposition IV.10 constructs a 72°-72°-36° isosceles triangle using the Golden Ratio from Prop II.11. The side-to-base ratio of this triangle equals φ ≈ 1.618.'
    },
    {
      id: 5,
      concept: 'Proposition IV.11 (Inscribing Regular Pentagon)',
      question: 'How does Proposition IV.11 construct a regular pentagon (equilateral & equiangular) inside a given circle?',
      options: [
        'By inscribing a Golden Triangle (72°-72°-36° from Prop IV.10) and bisecting its base angles to locate the 5 vertices.',
        'By repeatedly constructing equilateral triangles around the center.',
        'By drawing perpendicular diameters and bisecting them.',
        'By trial and error with a protractor.'
      ],
      correct: 0,
      explanation: 'Proposition IV.11 uses the Golden Triangle (Prop IV.10) to divide the circle into 5 equal arcs, producing the 5 equal sides (108° interior angles) of the regular pentagon.'
    },
    {
      id: 6,
      concept: 'Proposition I.32 Cor. (Polygon Angle Sum)',
      question: 'What is the total sum of the interior angles of a convex polygon with n sides, and why?',
      options: [
        '(n - 2) × 180° (drawing diagonals from one vertex divides the n-gon into n - 2 triangles, each having 180°).',
        'n × 180° (because there are n sides).',
        '(n + 2) × 180°.',
        '360° for all polygons regardless of n.'
      ],
      correct: 0,
      explanation: 'Drawing non-intersecting diagonals from one vertex divides an n-sided polygon into (n - 2) triangles. Since each triangle has 180° (Prop. I.32), the total interior angle sum is (n - 2) × 180°.'
    }
  ];

  // Task 5 Questions (Book V & VI: Proportions & Similarities)
  const task5Questions = [
    {
      id: 1,
      concept: 'Proposition VI.1 (Areas and Proportions)',
      question: 'According to Proposition VI.1, if two triangles have the same altitude (height), what is the relationship between their areas and their base lengths?',
      options: [
        'Their areas are in the exact same ratio as their base lengths (Area 1 / Area 2 = Base 1 / Base 2).',
        'Their areas are in the square ratio of their base lengths.',
        'Their areas are always equal regardless of base lengths.',
        'Their areas are in the inverse ratio of their base lengths.'
      ],
      correct: 0,
      explanation: 'Proposition VI.1 proves that triangles and parallelograms under the same height are to one another as their bases (area ratio = base ratio).'
    },
    {
      id: 2,
      concept: 'Proposition VI.2 (Thales\'s Proportionality Theorem)',
      question: 'In △ABC, line DE is drawn parallel to base BC, intersecting side AB at D and side AC at E. If AD = 4 cm, DB = 6 cm, and AE = 6 cm, what is EC (Prop. VI.2)?',
      options: [
        '4 cm',
        '9 cm (since AD/DB = AE/EC ⟹ 4/6 = 6/EC ⟹ EC = 36/4 = 9)',
        '12 cm',
        '15 cm'
      ],
      correct: 1,
      explanation: 'Proposition VI.2 proves that a line parallel to one side cuts the remaining sides proportionally: AD/DB = AE/EC ⟹ 4/6 = 6/EC ⟹ EC = 9 cm.'
    },
    {
      id: 3,
      concept: 'Proposition VI.3 (The Angle Bisector Theorem)',
      question: 'In △ABC, line segment AD bisects angle ∠BAC and meets base BC at D. If side AB = 10 and side AC = 15, in what ratio does D divide base BC?',
      options: [
        '2 : 3 (since BD / DC = AB / AC = 10 / 15 = 2 / 3)',
        '1 : 1 (bisects the base into equal halves)',
        '1 : 2',
        '3 : 4'
      ],
      correct: 0,
      explanation: 'Proposition VI.3 proves that the angle bisector divides the opposite base into segments proportional to the remaining sides: BD / DC = AB / AC = 10 / 15 = 2 / 3.'
    },
    {
      id: 4,
      concept: 'Propositions VI.19 & XX (Duplicate Area Ratio)',
      question: 'If triangle △DEF is similar to △ABC and its corresponding side lengths are 3 times larger (scale factor k = 3), how many times larger is the area of △DEF compared to △ABC?',
      options: [
        '3 times larger',
        '6 times larger',
        '9 times larger (in the duplicate ratio k² = 3² = 9)',
        '27 times larger'
      ],
      correct: 2,
      explanation: 'Propositions VI.19 & XX prove that similar triangles and polygons are in the duplicate ratio (square ratio) of their corresponding sides: Area ratio = k² = 3² = 9.'
    },
    {
      id: 5,
      concept: 'Proposition VI.31 (Generalized Pythagorean Theorem)',
      question: 'Euclid\'s Proposition VI.31 generalizes the Pythagorean Theorem (c² = a² + b²). What condition must shapes drawn on the 3 sides of a right triangle satisfy for Area(Hypotenuse) = Area(Leg 1) + Area(Leg 2)?',
      options: [
        'They must be similar and similarly described geometric figures (e.g. all 3 are semicircles, regular pentagons, etc.).',
        'They must all be squares (only squares work).',
        'They must all be circles with radius equal to the hypotenuse.',
        'They must have equal perimeters.'
      ],
      correct: 0,
      explanation: 'Proposition VI.31 proves that for ANY similar and similarly described geometric figures (semicircles, pentagons, triangles, etc.) built on the sides of a right-angled triangle, Area(Figure c) = Area(Figure a) + Area(Figure b).'
    }
  ];

  const currentQuestions = activeSubtask === 1 ? task1Questions : activeSubtask === 2 ? task2Questions : activeSubtask === 3 ? task3Questions : activeSubtask === 4 ? task4Questions : task5Questions;
  const currentQ = currentQuestions[currentQIndex] || currentQuestions[0];

  const handleSelectOption = (optionIndex) => {
    setSelectedAnswers({ ...selectedAnswers, [currentQIndex]: optionIndex });
    setFeedbackMsg('');
  };

  const handleNextQuestion = () => {
    if (selectedAnswers[currentQIndex] === undefined) {
      setFeedbackMsg('Please select an answer to proceed.');
      return;
    }
    if (currentQIndex < currentQuestions.length - 1) {
      setCurrentQIndex(currentQIndex + 1);
      setShowHint(false);
      setFeedbackMsg('');
    } else {
      let correctCount = 0;
      currentQuestions.forEach((q, idx) => {
        if (selectedAnswers[idx] === q.correct) correctCount++;
      });

      if (correctCount === currentQuestions.length) {
        setIsSuccess(true);
        setQuizSubmitted(true);
        completeSubtask(6, activeSubtask);
        setFeedbackMsg(`Task ${activeSubtask} Completed! Excellent mastery of Euclid's Elements!`);
      } else {
        setFeedbackMsg(`You scored ${correctCount}/${currentQuestions.length}. Review the explanations and try again!`);
      }
    }
  };

  const handleResetQuiz = () => {
    setSelectedAnswers({});
    setCurrentQIndex(0);
    setQuizSubmitted(false);
    setShowHint(false);
    setFeedbackMsg('');
  };

  // Props data map for Task 2 (Book I)
  const task2PropsMap = {
    Prop4: {
      title: 'Proposition IV (SAS)',
      text: 'If two triangles have two sides and the included angle respectively equal, then the triangles are equal in every respect.',
      category: 'congruence',
      steps: [
        'Given △ABC and △DEF where side AB = DE, side AC = DF (Def. 2: Line), and included angle ∠A = ∠D (Def. 8: Rectilinear Angle).',
        'Superimpose △ABC onto △DEF (Common Notion 4: Superposition) so point A coincides with point D (Postulate 1: Straight Line).',
        'Since AB = DE and ∠A = ∠D, ray AC falls along ray DF. Since AC = DF, point C coincides with point F (Common Notion 4).',
        'Base BC coincides with base EF (Postulate 1: Line Segment). Thus △ABC ≅ △DEF in every respect (Q.E.D.).'
      ]
    },
    Prop8: {
      title: 'Proposition VIII (SSS)',
      text: 'If two triangles have all three sides respectively equal, then their corresponding angles are equal, and the triangles are completely congruent.',
      category: 'congruence',
      steps: [
        'Given △ABC and △DEF with AB = DE, AC = DF, and BC = EF (Def. 20: Trilateral Figures).',
        'Superimpose base BC onto base EF (Common Notion 4). Point B coincides with E, and point C coincides with F.',
        'If vertex A did not coincide with vertex D, there would exist two different triangular constructions on the same base with equal sides.',
        'This contradicts Proposition VII (Unique Triangular Construction). Therefore, vertex A coincides with D, and ∠A = ∠D (Q.E.D.).'
      ]
    },
    Prop26: {
      title: 'Proposition XXVI (ASA / AAS)',
      text: 'If two triangles have two angles and one side respectively equal, the triangles are equal in every respect.',
      category: 'congruence',
      steps: [
        'Given △ABC and △DEF with ∠B = ∠E, ∠C = ∠F, and included side BC = EF (Def. 8 & Def. 2).',
        'Suppose AB > DE. Cut off BG = DE on side AB (Proposition III & Postulate 1) and draw segment GC.',
        'Then △GBC ≅ △DEF by SAS (Proposition IV), so ∠GCB = ∠DFE = ∠ACB.',
        'This implies the part angle ∠GCB equals the whole angle ∠ACB, which contradicts Common Notion 5 (The whole is greater than the part). Thus AB = DE (Q.E.D.).'
      ]
    },
    Prop5: {
      title: 'Proposition V (Pons Asinorum)',
      text: 'In any isosceles triangle, the angles at the base are equal to one another.',
      category: 'triangles',
      steps: [
        'Given isosceles △ABC with leg AB = AC (Def. 20: Isosceles Triangle).',
        'Produce AB to D and AC to E (Postulate 2: Extension Postulate).',
        'Take point F on BD and cut off AG = AF on CE (Proposition III). Connect FC and GB (Postulate 1).',
        'By SAS (Proposition IV), △AFC ≅ △AGB. Then subtract equal angles (Common Notion 3) to prove base angles ∠ABC = ∠ACB (Q.E.D.).'
      ]
    },
    Prop32: {
      title: 'Proposition XXXII (Angle Sum 180°)',
      text: 'In any triangle, the sum of the three interior angles is equal to two right angles (180°).',
      category: 'triangles',
      steps: [
        'Given △ABC with interior angles ∠A, ∠B, ∠C (Def. 8: Rectilinear Angle & Def. 20).',
        'Produce side BC to point D (Postulate 2: Extension Postulate), forming exterior angle ∠ACD.',
        'Draw straight line CE parallel to side AB (Proposition XXXI). By Proposition XXIX, alternate interior angles ∠BAC = ∠ACE, and corresponding angles ∠ABC = ∠ECD.',
        'Summing these gives exterior angle ∠ACD = ∠A + ∠B. Adding interior angle ∠ACB gives ∠A + ∠B + ∠C = two right angles (180°) (Common Notion 2 & Postulate 4) (Q.E.D.).'
      ]
    },
    Prop29: {
      title: 'Proposition XXIX (Parallel Lines & Transversal)',
      text: 'A straight line falling on parallel straight lines makes alternate interior angles equal to one another.',
      category: 'parallel',
      steps: [
        'Given parallel lines AB ∥ CD intersected by transversal EF at points G and H (Def. 23: Parallel Lines & Postulate 1).',
        'Suppose alternate interior angles ∠AGH and ∠GHD are unequal (Common Notion 2 & Def. 10: Right Angle).',
        'Then interior angles on the same side ∠BGH + ∠GHD < 180°. By Postulate 5 (The Parallel Postulate), lines AB and CD must meet on that side.',
        'This contradicts the hypothesis that AB and CD are parallel (Def. 23). Thus alternate angles ∠AGH = ∠GHD (Q.E.D.).'
      ]
    }
  };

  // Props data map for Task 3 (Book III: Circles and Angles)
  const task3PropsMap = {
    Prop3: {
      title: 'Proposition III.3 • Perpendicular Bisector of Chords',
      text: 'If a straight line drawn through the center of a circle bisects a chord that does not pass through the center, it is perpendicular to it; conversely, if it is perpendicular to it, it bisects it.',
      category: 'chords',
      formula: 'Line through Center O bisects Chord AB  ⟺  Line ⊥ Chord AB  (AM = MB & OM ⊥ AB)',
      steps: [
        'Given circle with center O and chord AB not passing through O. Let line OM join center O to midpoint M of chord AB.',
        'Draw radii OA and OB from center O to endpoints A and B (Postulate 1). OA = OB because all radii of a circle are equal (Definition 15).',
        'In triangles △OAM and △OBM: OA = OB, AM = MB (given midpoint), and OM is common. Therefore △OAM ≅ △OBM by SSS (Proposition I.8).',
        'Since corresponding angles are equal, ∠OMA = ∠OMB. Lines meeting at equal adjacent angles are right angles (Definition 10). Thus OM ⊥ AB. Conversely, if OM ⊥ AB, △OAM ≅ △OBM by RHS ⟹ AM = MB (Q.E.D.).'
      ]
    },
    Prop14: {
      title: 'Proposition III.14 • Equal Chords & Distance from Center',
      text: 'Equal chords in a circle are equally distant from the center; and conversely, straight lines equally distant from the center are equal.',
      category: 'chords',
      formula: 'Chord AB = Chord CD  ⟺  Distance OM = Distance ON  (OM ⊥ AB, ON ⊥ CD)',
      steps: [
        'Given circle with center O and chords AB and CD. Draw perpendiculars OM ⊥ AB and ON ⊥ CD from center O.',
        'By Proposition III.3, OM bisects AB (AM = AB/2) and ON bisects CD (CN = CD/2). Join radii OA and OC (OA = OC = R).',
        'By Pythagorean Theorem (Proposition I.47): OA² = OM² + AM² and OC² = ON² + CN².',
        'Since OA² = OC², OM² + (AB/2)² = ON² + (CD/2)². Therefore, AB = CD ⟺ OM = ON. Equal chords are equidistant from the center (Q.E.D.).'
      ]
    },
    Prop11_12: {
      title: 'Propositions III.11 & 12 • Line of Centers for Touching Circles',
      text: 'If two circles touch one another (internally or externally), the straight line joining their centers must pass through the point of contact.',
      category: 'tangents',
      formula: 'Point of Tangency P lies on line O₁O₂  (d = R₁ + R₂ for external, d = |R₁ - R₂| for internal)',
      steps: [
        'Given two circles with centers O₁ and O₂ touching at point P (internally in Prop. III.11 or externally in Prop. III.12).',
        'Suppose the straight line joining centers O₁ and O₂ did not pass through P. Draw lines O₁P and O₂P forming triangle △O₁PO₂.',
        'In △O₁PO₂, by Proposition I.20, the sum of two sides O₁P + O₂P must exceed the third side O₁O₂.',
        'However, for touching circles, O₁O₂ = O₁P + O₂P (external) or O₁P - O₂P (internal), creating a contradiction. Thus line O₁O₂ MUST pass through point of contact P (Q.E.D.).'
      ]
    },
    Prop16: {
      title: 'Proposition III.16 • Tangent Line Perpendicularity',
      text: 'The straight line drawn at right angles to the diameter of a circle from its extremity touches the circle, and no other straight line can pass between the tangent and the circumference.',
      category: 'tangents',
      formula: 'Tangent Line T ⊥ Radius OP at Point P  (Shortest distance from center O to line T is OP = R)',
      steps: [
        'Given circle with center O, diameter AB, radius OP, and straight line T drawn at right angles to AB at point P.',
        'Select any other point Q on line T. Join OQ forming right-angled triangle △OPQ with right angle at P.',
        'Since ∠OPQ = 90°, hypotenuse OQ > leg OP = R (Proposition I.19: greater angle opposite greater side).',
        'Therefore, point Q lies entirely outside the circle. Line T meets the circle at ONLY point P, making it a tangent line ⊥ radius OP (Q.E.D.).'
      ]
    },
    Prop20: {
      title: 'Proposition III.20 • The Central Angle Theorem',
      text: 'The angle at the center of a circle is double the angle at the circumference standing on the same arc.',
      category: 'angles',
      formula: 'Central Angle ∠AOB = 2 × Inscribed Angle ∠ACB  (standing on same arc AB)',
      steps: [
        'Given circle with center O, central angle ∠AOB and inscribed angle ∠ACB standing on same arc AB. Draw diameter COE through center O.',
        'In △AOC, OA = OC (radii), so △AOC is isosceles ⟹ ∠OAC = ∠OCA (Proposition I.5). Exterior angle ∠AOE = ∠OAC + ∠OCA = 2∠OCA (Proposition I.32).',
        'Similarly in △BOC, OB = OC (radii) ⟹ exterior angle ∠BOE = 2∠OCB.',
        'Summing both exterior angles: ∠AOB = ∠AOE + ∠BOE = 2(∠OCA + ∠OCB) = 2∠ACB. Central angle is double inscribed angle (Q.E.D.).'
      ]
    },
    Prop21: {
      title: 'Proposition III.21 • Inscribed Angles on Same Arc',
      text: 'Angles in the same segment of a circle are equal to one another.',
      category: 'angles',
      formula: 'Inscribed Angle ∠ACB = Inscribed Angle ∠ADB  (standing on same arc AB)',
      steps: [
        'Given circle with center O and two inscribed angles ∠ACB and ∠ADB standing on the same arc AB.',
        'Draw central angle ∠AOB joining center O to arc endpoints A and B.',
        'By Proposition III.20, central angle ∠AOB is double inscribed angle ∠ACB (∠AOB = 2∠ACB).',
        'By Proposition III.20 again, central angle ∠AOB is double inscribed angle ∠ADB (∠AOB = 2∠ADB). Thus 2∠ACB = 2∠ADB ⟹ ∠ACB = ∠ADB (Q.E.D.).'
      ]
    },
    Prop22: {
      title: 'Proposition III.22 • Cyclic Quadrilateral Theorem',
      text: 'The opposite angles of any quadrilateral inscribed in a circle (cyclic quadrilateral) together equal two right angles (180 degrees).',
      category: 'angles',
      formula: 'Opposite Angles ∠A + ∠C = 180°  &  ∠B + ∠D = 180°  (inscribed quadrilateral ABCD)',
      steps: [
        'Given quadrilateral ABCD inscribed in a circle (cyclic quadrilateral). Draw diagonals AC and BD.',
        'By Proposition III.21, angles in same segment are equal: ∠CAB = ∠CDB (standing on arc BC) and ∠ACB = ∠ADB (standing on arc AB).',
        'In triangle △ABC, sum of interior angles ∠ABC + ∠CAB + ∠ACB = 180° (Proposition I.32: 2 right angles).',
        'Substituting equal angles: ∠ABC + (∠CDB + ∠ADB) = ∠ABC + ∠ADC = 180°. Opposite angles of a cyclic quadrilateral sum to 180° (Q.E.D.).'
      ]
    },
    Prop31: {
      title: 'Proposition III.31 • Thales\'s Theorem (Angle in Semicircle)',
      text: 'The angle in a semicircle is a right angle (90 degrees). Any triangle inscribed in a semicircle with the diameter as one side is a right-angled triangle.',
      category: 'angles',
      formula: 'Inscribed Angle in Semicircle ∠ACB = 90°  (where AB is Diameter)',
      steps: [
        'Given circle with center O, diameter AB, and any point C on the semicircle. Join AC, BC, and radius OC.',
        'In △AOC, OA = OC (radii) ⟹ ∠OAC = ∠OCA (Prop. I.5). In △BOC, OB = OC (radii) ⟹ ∠OBC = ∠OCB.',
        'Sum of angles in △ABC: ∠ABC + ∠BAC + ∠ACB = 180° (Prop. I.32). Substitute: ∠OBC + ∠OAC + (∠OCA + ∠OCB) = 2(∠OCA + ∠OCB) = 2∠ACB = 180°.',
        'Dividing by 2 yields ∠ACB = 90° (Right Angle). The angle in a semicircle is always a right angle (Q.E.D.).'
      ]
    },
    Prop32: {
      title: 'Proposition III.32 • Alternate Segment Theorem',
      text: 'If a straight line touches a circle, and from the point of contact a chord is drawn, the angles which this chord makes with the tangent are equal to the angles in the alternate segments of the circle.',
      category: 'power_of_point',
      formula: 'Angle between Tangent & Chord = Inscribed Angle in Alternate Segment',
      steps: [
        'Given tangent line EF touching circle at B, chord AB drawn from point of contact B, and point C in alternate segment.',
        'Draw diameter BD ⊥ EF at B (Prop. III.16) and join AD. By Thales\'s Theorem (Prop. III.31), ∠DAB = 90°.',
        'In △ABD, ∠ABD + ∠ADB = 90°. Since tangent EF ⊥ diameter BD, ∠ABF + ∠ABD = 90° ⟹ ∠ABF = ∠ADB.',
        'By Proposition III.21, inscribed angles on same arc AB are equal: ∠ADB = ∠ACB. Therefore ∠ABF = ∠ACB (Q.E.D.).'
      ]
    },
    Prop35_36: {
      title: 'Propositions III.35 & 36 • Intersecting Chords & Power of a Point',
      text: 'If two chords (or secants) intersect inside (or outside) a circle, the product of the segments of one chord equals the product of the segments of the other.',
      category: 'power_of_point',
      formula: 'PA · PB = PC · PD = PT²  (Power of Point P with respect to Circle)',
      steps: [
        'Prop. III.35 (Given & Construction): Chords AB and CD intersect at off-center point P inside circle O (center O ≠ P). Join AC and BD forming △PAC and △PDB.',
        'Prop. III.35 (Internal Chords Proof): In △PAC & △PDB, inscribed ∠PAC = ∠PDB (Prop. III.21) and vertical ∠APC = ∠BPD ⟹ △PAC ~ △PDB ⟹ PA · PB = PC · PD (Inside Circle Q.E.D.).',
        'Prop. III.36 (External Point P Given): Point P lies OUTSIDE circle O. Draw secants PAB, PCD and tangent PT touching circle O at point T. Join AC and BD.',
        'Prop. III.36 (External Proof & Power of Point): In △PAC & △PDB, shared ∠P & inscribed ∠PAC = ∠PDB ⟹ △PAC ~ △PDB ⟹ PA · PB = PC · PD = PT² = |d² - R²| (Power of Point P) (Q.E.D.).'
      ]
    }
  };

  // Props data map for Task 4 (Book II & IV: Geometric Algebra & Polygons)
  const task4PropsMap = {
    Prop12: {
      title: 'Proposition XII • Obtuse Triangle Law',
      text: 'In an obtuse-angled triangle, the square of the side subtending the obtuse angle is greater than the sum of the squares of the sides containing the obtuse angle by twice the rectangle contained by one of those sides and the projection of the other onto it.',
      category: 'law_of_cosines',
      formula: 'c² = a² + b² + 2ad  (where d = b · cos(180° - θ))',
      steps: [
        'Given obtuse triangle △ABC with obtuse angle ∠ACB > 90° (Def. 10: Right Angle).',
        'Produce side BC to D (Postulate 2: Extension) and draw perpendicular altitude AD ⊥ BD from A to BC produced (Proposition I.12). Let CD = d be the projection of AC onto BC.',
        'Since line BD is cut at C, by Proposition II.4: Sq(BD) = Sq(BC) + Sq(CD) + 2 Rect(BC, CD). Add Sq(AD) to both sides (Common Notion 2: Addition of Equals).',
        'By Pythagorean Theorem (Proposition I.47), Sq(BD) + Sq(AD) = Sq(AB) = c², and Sq(CD) + Sq(AD) = Sq(AC) = b². Substituting gives Sq(AB) = Sq(BC) + Sq(AC) + 2 Rect(BC, CD), i.e., c² = a² + b² + 2ad (Q.E.D.).'
      ]
    },
    Prop13: {
      title: 'Proposition XIII • Acute Triangle Law',
      text: 'In any triangle, the square of the side opposite an acute angle is less than the sum of the squares of the sides containing that angle by twice the rectangle contained by one of them and the projected segment of the other.',
      category: 'law_of_cosines',
      formula: 'c² = a² + b² - 2ad  (where d = b · cos(θ))',
      steps: [
        'Given triangle △ABC with acute angle ∠ACB < 90° (Def. 10: Right Angle).',
        'Draw perpendicular altitude AD ⊥ BC from vertex A to base BC (Proposition I.12). Let CD = d be the projected segment.',
        'Since base BC is cut at D, by Proposition II.7: Sq(BC) + Sq(CD) = 2 Rect(BC, CD) + Sq(BD). Add Sq(AD) to both sides (Common Notion 2).',
        'Substitute Prop I.47 (Pythagorean Theorem): Sq(CD) + Sq(AD) = Sq(AC) = b², and Sq(BD) + Sq(AD) = Sq(AB) = c². Subtracting 2 Rect(BC, CD) (CN 3) yields c² = a² + b² - 2ad (Q.E.D.).'
      ]
    },
    Prop11: {
      title: 'Proposition II.11 • Golden Ratio (Extreme & Mean Ratio)',
      text: 'To cut a given straight line so that the rectangle contained by the whole and one of the segments is equal to the square on the remaining segment.',
      category: 'golden_polygons',
      formula: 'a(a - x) = x²  ⟹  x = ½(√5 - 1)a ≈ 0.618034 a  (Golden Ratio φ ≈ 1.618)',
      steps: [
        'Given straight line segment AB of length a (Def. 2: Straight Line).',
        'Construct square ABCD on AB (Proposition I.46). Bisect AB at E (Proposition I.10) so AE = EB = a/2, and join EC (Postulate 1).',
        'Produce EA to F such that EF = EC (Proposition I.3). Cut AB at H where AH = AF = x. Construct square AFGH on AH (Prop. I.46). By Prop. II.6 & I.47: Rect(FB, FA) + Sq(EA) = Sq(EC) = Sq(EA) + Sq(BC).',
        'Subtract Sq(EA) (CN 3): Rect(FB, FA) = Sq(AB) = a². Since Rect(FB, FA) = Sq(AF) + Rect(AB, AH) = x² + a·x, equating x² + a·x = a² yields x² = a² - a·x = a(a-x). Thus Square AFGH (x²) = Rectangle HBCK (a(a-x)) (Q.E.F.).'
      ]
    },
    Prop4_10: {
      title: 'Proposition IV.10 • The Golden Triangle (72°-72°-36°)',
      text: 'To construct an isosceles triangle in which each of the angles at the base is double the remaining one.',
      category: 'golden_polygons',
      formula: 'Base Angles = 72°, Vertex Angle = 36°  (Side / Base = φ ≈ 1.618)',
      steps: [
        'Given straight line AB. Cut AB at C in extreme and mean ratio by Proposition II.11 (AB · BC = AC²).',
        'With center A and radius AB, describe circle BDE (Postulate 3). Fit straight line BD = AC into circle BDE (Proposition IV.1).',
        'Join AD and CD (Postulate 1). Since AB·BC = BD², BD is tangent to circle ACD (Prop. III.37), making ∠BDC = ∠BAD (Prop. III.32). Exterior ∠BCD = ∠BAD + ∠CDA = ∠ADB = ∠ABD. Thus △BCD & △ACD are isosceles (Prop. I.6), making base angle ∠ABD = ∠ADB = 2∠BAD = 72° (since 5∠BAD = 180° by Prop. I.32).',
        'Therefore, each base angle of △ABD is double the vertical angle (72° = 2 × 36°). This Golden Triangle is the key for regular pentagons (Q.E.F.).'
      ]
    },
    Prop4_11: {
      title: 'Proposition IV.11 • Inscribing a Regular Pentagon',
      text: 'To inscribe an equilateral and equiangular (regular) pentagon in a given circle.',
      category: 'golden_polygons',
      formula: 'Regular Pentagon (5 equal sides s = 2R sin 36°, internal angle 108°)',
      steps: [
        'Given circle CIRC. Construct Golden Triangle △FGH with angles 72°-72°-36° (Proposition IV.10).',
        'Inscribe triangle △ACD equiangular to △FGH in circle CIRC (Proposition IV.2), so ∠ACD = ∠ADC = 72° and ∠CAD = 36°.',
        'Bisect angles ∠ACD and ∠ADC by straight lines CE and DB (Proposition I.9), cutting the circle at B and E.',
        'Join AB, BC, CD, DE, EA (Postulate 1). Segments AB, BC, CD, DE, EA subtend equal arcs. Pentagon ABCDE is equilateral and equiangular (Q.E.F.).'
      ]
    },
    Prop4_12_14: {
      title: 'Propositions IV.12-14 • Circumscribed Pentagon & Circles',
      text: 'How to circumscribe a regular pentagon about a circle, and how to inscribe & circumscribe circles in & about a regular pentagon.',
      category: 'golden_polygons',
      formula: 'Tangents (Prop IV.12), Incircle r = R·cos(36°) (Prop IV.13), Circumcircle R (Prop IV.14)',
      steps: [
        'Given inscribed regular pentagon ABCDE. Draw tangents to the circle at vertices A, B, C, D, E (Proposition III.17).',
        'The 5 tangent line intersections form outer pentagon PQRST circumscribed about the circle (Proposition IV.12).',
        'Bisect two internal angles of pentagon ABCDE (Prop. I.9). The intersection of angle bisectors locates the common center O.',
        'Perpendiculars from O to the sides give the inscribed circle (Prop. IV.13), while OA = OB = OC = OD = OE gives the circumscribed circle (Prop. IV.14) (Q.E.F.).'
      ]
    },
    PropPolygonAngleSum: {
      title: 'Proposition I.32 Cor. • Polygon Angle Sum Theorem',
      text: 'The sum of all the interior angles of any convex polygon with n sides is equal to (n - 2) × 180° (or 2n - 4 right angles).',
      category: 'polygon_angles',
      formula: 'Sum = (n - 2) × 180°  |  Each Angle of Regular n-gon = (n - 2) × 180° / n',
      steps: [
        'Given a convex polygon with n sides (n ≥ 3) and vertices V₁, V₂, ..., Vₙ.',
        'Draw (n - 3) non-intersecting diagonals from a single vertex (e.g. V₁) to all non-adjacent vertices (Postulate 1).',
        'These diagonals divide the n-sided polygon into exactly (n - 2) non-overlapping triangles.',
        'By Proposition I.32, each triangle has interior angle sum = 180°. Therefore, Total Interior Angle Sum = (n - 2) × 180°. For a regular n-gon, each angle = (n - 2) × 180° / n (Q.E.D.).'
      ]
    },
    PropArtPatterns: {
      title: 'Golden Ratio in Art & Patterns (Wikipedia φ)',
      text: 'How Euclid\'s Extreme and Mean Ratio (φ ≈ 1.618) connects geometry to Renaissance composition (da Vinci, Dalí) and biological growth patterns (Phyllotaxis, Fibonacci spirals).',
      category: 'golden_polygons',
      formula: 'Golden Angle θg = 360° × (1 - 1/φ) ≈ 137.5°  |  Golden Rectangle Aspect Ratio = 1.618 : 1',
      steps: [
        'Golden Rectangle in Art (da Vinci & Dalí): A rectangle with aspect ratio φ = 1.618:1 can be cut into a square and a smaller, self-similar Golden Rectangle. Artists use Golden Cut focal lines (0.618 / 0.382) for harmonious composition (e.g., Pacioli & da Vinci\'s "De divina proportione", 1509; Salvador Dalí\'s "The Sacrament of the Last Supper", 1955).',
        'Phyllotaxis & Plant Growth (Botanical Patterns): Leaves, sunflower seeds, and pinecone scales grow according to the Golden Angle θg = 360° × (1 - 1/φ) ≈ 137.50776°. Because φ is irrational, seeds at 137.5° intervals never align in spokes, creating optimal dense packing without wasted space.',
        'Fibonacci Spirals & Penrose 5-Fold Symmetry: Quarter-circle arcs inside logarithmic Golden Rectangles create natural spirals seen in shells and hurricanes. Consecutive Fibonacci ratios (Fn+1 / Fn ➔ φ) generate 5-fold regular pentagon diagonals (d/s = φ) and non-periodic Penrose tilings.',
        'The Golden Spiral (r = φ^(2θ/π)): A logarithmic spiral whose radius increases by a factor of φ for each 90° (π/2) quarter-turn (polar equation r = φ^(2θ/π)). Can be formed by nested Golden Rectangles or Whirling Golden Triangles (72°-72°-36°).'
      ]
    }
  };

  // Props data map for Task 5 (Book V & VI: Proportions & Similarities)
  const task5PropsMap = {
    Prop6_1: {
      title: 'Proposition VI.1 • Areas & Proportions of Triangles',
      text: 'Triangles and parallelograms which are under the same height are to one another as their bases.',
      category: 'areas_parallel',
      formula: 'Area(△1) / Area(△2) = Base(b1) / Base(b2)  (same altitude h)',
      steps: [
        'Given triangles △ABC and △ACD sharing vertex A and lying between parallel lines (same altitude h).',
        'Produce base BC to E, F... of length BC, and base CD to G, H... of length CD (Postulate 2: Extension).',
        'Triangles on equal bases under same height have equal areas (Prop. I.38). Thus any multiple of base BC creates the exact same multiple of area △ABC.',
        'By Definition V.5 (Equi-multiple Ratios), Area(△ABC) : Area(△ACD) = Base(BC) : Base(CD) (Q.E.D.).'
      ]
    },
    Prop6_2: {
      title: 'Proposition VI.2 • Thales\'s Proportionality Theorem',
      text: 'If a straight line is drawn parallel to one of the sides of a triangle, it cuts the sides of the triangle proportionally; conversely, if the sides are cut proportionally, the line is parallel to the remaining side.',
      category: 'areas_parallel',
      formula: 'Line DE ∥ BC  ⟺  AD / DB = AE / EC',
      steps: [
        'Given △ABC and line DE parallel to base BC, cutting AB at D and AC at E (Def. 23: Parallel Lines).',
        'Join BE and CD (Postulate 1). Triangles △BDE and △CDE stand on same base DE and between parallels DE ∥ BC, so Area(△BDE) = Area(△CDE) (Prop. I.37).',
        'Comparing to △ADE: by Prop. VI.1, Area(△ADE) / Area(△BDE) = AD / DB, and Area(△ADE) / Area(△CDE) = AE / EC.',
        'Since Area(△BDE) = Area(△CDE), the ratio AD / DB = AE / EC. Conversely, equal ratios force DE ∥ BC (Q.E.D.).'
      ]
    },
    Prop6_3: {
      title: 'Proposition VI.3 • The Angle Bisector Theorem',
      text: 'If an angle of a triangle is bisected, the line bisecting the angle cuts the base into segments which have the same ratio as the remaining sides of the triangle.',
      category: 'similarity',
      formula: 'Angle Bisector AD  ⟺  BD / DC = AB / AC',
      steps: [
        'Given △ABC with angle ∠BAC bisected by line AD meeting base BC at D.',
        'Draw CE parallel to AD meeting BA produced at E (Prop. I.31 & Postulate 2).',
        'Since AD ∥ CE, alternate angles ∠BAD = ∠AEC and corresponding angles ∠DAC = ∠ACE (Prop. I.29). Since ∠BAD = ∠DAC, ∠AEC = ∠ACE, so AE = AC (Prop. I.6).',
        'By Thales\'s Theorem (Prop. VI.2) on △BCE with AD ∥ CE: BD / DC = BA / AE. Substituting AE = AC yields BD / DC = AB / AC (Q.E.D.).'
      ]
    },
    Prop6_4: {
      title: 'Proposition VI.4 • AAA Similarity Theorem',
      text: 'In equiangular triangles the sides about the equal angles are proportional, and the sides corresponding to the equal angles subtend the equal angles.',
      category: 'similarity',
      formula: '∠A=∠D, ∠B=∠E, ∠C=∠F  ⟹  AB / DE = BC / EF = AC / DF',
      steps: [
        'Given equiangular triangles △ABC and △DEF where ∠A = ∠D, ∠B = ∠E, and ∠C = ∠F.',
        'Place △ABC so base BC and EF lie on one line. Extend AB and FE until they intersect at point G (Postulate 1 & 2).',
        'Since ∠B = ∠E, line BG ∥ DF, and since ∠C = ∠F, line CG ∥ DE. Figure BGDF is a parallelogram.',
        'By Thales\'s Theorem (Prop. VI.2), AB / DE = BC / EF = AC / DF. Equiangular triangles have proportional sides (Q.E.D.).'
      ]
    },
    Prop6_5_7: {
      title: 'Propositions VI.5-7 • SSS & SAS Similarity Criteria',
      text: 'If two triangles have their sides proportional (SSS), or two sides proportional and included angle equal (SAS), the triangles are equiangular and similar.',
      category: 'similarity',
      formula: 'Prop VI.5 (SSS): a/a\'=b/b\'=c/c\'  |  Prop VI.6 (SAS): a/a\'=b/b\' & ∠C=∠C\'  ⟹  △ABC ~ △DEF',
      steps: [
        'Prop. VI.5 (SSS Similarity): Given △ABC and △DEF with sides proportional: AB/DE = BC/EF = AC/DF.',
        'On side EF, construct △GEF equiangular to △ABC (Prop. I.23). By Prop. VI.4, △GEF has sides proportional to △ABC.',
        'Since DE/EF = AB/BC = GE/EF, we get DE = GE, and similarly DF = GF. By SSS Congruence (Prop. I.8), △GEF ≅ △DEF.',
        'Thus △ABC is equiangular to △DEF, so proportional sides imply equal corresponding angles (Q.E.D.).'
      ]
    },
    Prop6_16_17: {
      title: 'Propositions VI.16 & 17 • Rectangles & Cross-Multiplication',
      text: 'If four straight lines are proportional (a:b = c:d), the rectangle contained by the extremes equals the rectangle contained by the means (a·d = b·c).',
      category: 'means_scaling',
      formula: 'a : b = c : d  ⟺  a · d = b · c  |  Mean Proportional: a : x = x : b  ⟺  x² = a · b',
      steps: [
        'Given four proportional line segments a : b = c : d.',
        'Construct rectangle Rect(a, d) with side lengths a and d, and rectangle Rect(b, c) with side lengths b and c.',
        'By Proposition VI.14 (Equal Parallelograms with Reciprocal Sides), parallelograms having equal angles and reciprocal sides are equal in area.',
        'Since a / b = c / d ⟹ a · d = b · c. As a special case (Prop. VI.17), if three lines are proportional (a : x = x : b), then x² = a · b (Q.E.D.).'
      ]
    },
    Prop6_19_20: {
      title: 'Propositions VI.19 & 20 • Duplicate Ratio (Scaling Areas)',
      text: 'Similar triangles and similar polygons are to one another in the duplicate ratio (square ratio) of their corresponding sides.',
      category: 'means_scaling',
      formula: 'Area(△ABC) / Area(△DEF) = (AB / DE)² = k²  (Area scales as square of side lengths)',
      steps: [
        'Given similar triangles △ABC and △DEF with ratio of corresponding sides AB : DE = k.',
        'Find a third proportional line segment BG such that AB : DE = DE : BG (Prop. VI.11).',
        'By construction and Prop. VI.1, Area(△ABC) : Area(△ABG) = BC : BG = (AB : DE)². Since △ABG is proven equal to △DEF, Area(△ABC) : Area(△DEF) = (AB : DE)².  ',
        'Prop. VI.20 extends this to any regular or irregular similar polygons by dividing them into similar triangles: Area ratio = k² (Q.E.D.).'
      ]
    },
    Prop6_31: {
      title: 'Proposition VI.31 • Generalized Pythagorean Theorem',
      text: 'In right-angled triangles, the figure on the side subtending the right angle is equal to the similar and similarly described figures on the sides containing the right angle.',
      category: 'pythagoras_arcs',
      formula: 'Figure(c) = Figure(a) + Figure(b)  (for any similar shapes: semicircles, pentagons, etc.)',
      steps: [
        'Given right triangle △ABC with right angle at C, legs a (BC), b (AC), and hypotenuse c (AB).',
        'Construct similar geometric figures F_a, F_b, F_c on sides a, b, c respectively.',
        'By Proposition VI.19/20, the areas of similar figures are proportional to the squares on their sides: Area(F_a)/Area(F_c) = a²/c² and Area(F_b)/Area(F_c) = b²/c².',
        'Summing gives [Area(F_a) + Area(F_b)] / Area(F_c) = (a² + b²) / c². By Book I Prop 47, a² + b² = c², so Area(F_c) = Area(F_a) + Area(F_b) (Q.E.D.).'
      ]
    },
    Prop6_33: {
      title: 'Proposition VI.33 • Angles and Arc Ratios',
      text: 'In equal circles, angles have the same ratio as the circumferences (arcs) on which they stand, whether they are at the centers or at the circumferences.',
      category: 'pythagoras_arcs',
      formula: 'Arc Ratio s1 / s2 = Central Angle Ratio θ1 / θ2 = Inscribed Angle Ratio ψ1 / ψ2',
      steps: [
        'Given equal circles (or the same circle) with central angles ∠AOB and ∠COD standing on arcs AB and CD.',
        'Mark off consecutive equal arcs from B (BE, EF...) and from D (DG, GH...). Connect radii to center O.',
        'By Prop. I.4 & Def. V.5, equal arcs subtend equal central angles. Any multiple of arc AB produces the same multiple of central angle ∠AOB.',
        'By Euclid\'s Definition V.5, Arc(AB) / Arc(CD) = Central Angle ∠AOB / ∠COD = Inscribed Angle ∠APB / ∠CQD (Q.E.D.).'
      ]
    }
  };

  const activePropObj = activeSubtask === 2 
    ? (task2PropsMap[selectedProp] || task2PropsMap['Prop4']) 
    : activeSubtask === 3 
    ? (task3PropsMap[task3SelectedProp] || task3PropsMap['Prop3']) 
    : activeSubtask === 4 
    ? (task4PropsMap[task4SelectedProp] || task4PropsMap['Prop12']) 
    : (task5PropsMap[task5SelectedProp] || task5PropsMap['Prop6_1']);

  // Render Right Side Illustration Canvas depending on subtask
  const renderIllustrationCanvas = () => {
    if (activeSubtask === 1) {
      // Subtask 1: Basics (Definitions, Axioms, Postulates, Propositions)
      return (
        <div className="w-full h-full flex flex-col p-6 overflow-y-auto bg-gradient-to-br from-slate-950 via-[#0b1021] to-[#07090e]">
          {/* Top Control Header with 4 Tabs */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-4 border-b border-indigo-900/40">
            <div>
              <span className="text-[10px] font-mono tracking-widest text-indigo-400 uppercase">
                EUCLID'S ELEMENTS • BOOK I
              </span>
              <h2 className="text-lg font-serif font-bold text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-indigo-400" />
                <span>Interactive Concept Explorer</span>
              </h2>
            </div>

            <div className="flex flex-wrap gap-1.5 bg-slate-900/80 p-1 rounded-xl border border-slate-800">
              {[
                { id: 'definitions', label: '1. Definitions' },
                { id: 'axioms', label: '2. Common Notions (Axiom)' },
                { id: 'postulates', label: '3. Postulates' },
                { id: 'propositions', label: '4. Propositions (Problems & Theorems)' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setIllustrationTab(tab.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                    illustrationTab === tab.id
                      ? 'bg-indigo-600 text-white shadow-[0_0_12px_rgba(99,102,241,0.4)]'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab 1: Definitions */}
          {illustrationTab === 'definitions' && (
            <div className="flex flex-col gap-5">
              <div className="bg-indigo-950/30 border border-indigo-500/20 rounded-xl p-4 text-xs text-indigo-200/90 leading-relaxed">
                <p className="font-semibold text-indigo-300 mb-1">What is a Definition (Ὅροι - Horoi)?</p>
                Euclid opens Book I with 23 precise definitions. A definition establishes the exact boundary and meaning of a mathematical term (e.g. what is a point, line, or circle) so there is zero ambiguity in subsequent proofs.
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-mono text-indigo-400">Def. 1</span>
                    <h4 className="font-serif font-bold text-white text-sm mt-1">Point (Σημεῖον)</h4>
                    <p className="text-xs text-slate-300 mt-1">"A point is that which has no part." (0D location)</p>
                  </div>
                  <div className="mt-4 h-24 bg-slate-950/80 rounded-lg flex items-center justify-center border border-slate-800">
                    <svg className="w-full h-full" viewBox="0 0 200 100">
                      <circle cx="100" cy="50" r="4" fill="#e76f51" />
                      <text x="110" y="54" fill="#e9c46a" fontSize="10" fontFamily="serif">Point A (0D)</text>
                    </svg>
                  </div>
                </div>

                <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-mono text-indigo-400">Def. 2 & 4</span>
                    <h4 className="font-serif font-bold text-white text-sm mt-1">Straight Line (Εὐθεῖα)</h4>
                    <p className="text-xs text-slate-300 mt-1">"A line is breadthless length lying evenly with its points."</p>
                  </div>
                  <div className="mt-4 h-24 bg-slate-950/80 rounded-lg flex items-center justify-center border border-slate-800">
                    <svg className="w-full h-full" viewBox="0 0 200 100">
                      <line x1="30" y1="50" x2="170" y2="50" stroke="#3b82f6" strokeWidth="2" />
                      <circle cx="30" cy="50" r="3" fill="#e9c46a" />
                      <circle cx="170" cy="50" r="3" fill="#e9c46a" />
                    </svg>
                  </div>
                </div>

                <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-mono text-indigo-400">Def. 10</span>
                    <h4 className="font-serif font-bold text-white text-sm mt-1">Right Angle (Ὀρθή)</h4>
                    <p className="text-xs text-slate-300 mt-1">When adjacent angles formed by standing lines are equal (90°).</p>
                  </div>
                  <div className="mt-4 h-24 bg-slate-950/80 rounded-lg flex items-center justify-center border border-slate-800">
                    <svg className="w-full h-full" viewBox="0 0 200 100">
                      <line x1="20" y1="75" x2="180" y2="75" stroke="#64748b" strokeWidth="2" />
                      <line x1="100" y1="75" x2="100" y2="20" stroke="#10b981" strokeWidth="2" />
                      <path d="M 100 63 L 112 63 L 112 75" fill="none" stroke="#e9c46a" strokeWidth="1.5" />
                    </svg>
                  </div>
                </div>

                <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-mono text-indigo-400">Def. 15</span>
                    <h4 className="font-serif font-bold text-white text-sm mt-1">Circle (Κύκλος)</h4>
                    <p className="text-xs text-slate-300 mt-1">Plane figure contained by one line equidistant from center.</p>
                  </div>
                  <div className="mt-4 h-24 bg-slate-950/80 rounded-lg flex items-center justify-center border border-slate-800">
                    <svg className="w-full h-full" viewBox="0 0 200 100">
                      <circle cx="100" cy="50" r="35" fill="none" stroke="#a855f7" strokeWidth="2" />
                      <circle cx="100" cy="50" r="3" fill="#e9c46a" />
                    </svg>
                  </div>
                </div>

                <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex flex-col justify-between md:col-span-2">
                  <div>
                    <span className="text-xs font-mono text-indigo-400">Def. 20</span>
                    <h4 className="font-serif font-bold text-white text-sm mt-1">Equilateral Triangle (Ἰσόπλευρον)</h4>
                    <p className="text-xs text-slate-300 mt-1">A trilateral figure having three equal sides.</p>
                  </div>
                  <div className="mt-4 h-24 bg-slate-950/80 rounded-lg flex items-center justify-center border border-slate-800">
                    <svg className="w-full h-full" viewBox="0 0 300 100">
                      <polygon points="150,20 110,80 190,80" fill="rgba(99, 102, 241, 0.15)" stroke="#6366f1" strokeWidth="2" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Common Notions (Axiom) */}
          {illustrationTab === 'axioms' && (
            <div className="flex flex-col gap-5">
              <div className="bg-indigo-950/30 border border-indigo-500/20 rounded-xl p-4 text-xs text-indigo-200/90 leading-relaxed">
                <p className="font-semibold text-indigo-300 mb-1">What is a Common Notion / Axiom (Ἔννοιαι - Ennoiai)?</p>
                Common Notions are self-evident logical truths applicable across all mathematical disciplines (geometry, arithmetic, logic). They govern fundamental quantitative relationships.
              </div>

              <div className="flex flex-wrap gap-2 mb-2">
                {[
                  { id: 1, name: 'CN 1: Transitivity', text: 'Things which are equal to the same thing are also equal to one another.' },
                  { id: 2, name: 'CN 2: Addition of Equals', text: 'If equals be added to equals, the wholes are equal.' },
                  { id: 3, name: 'CN 3: Subtraction of Equals', text: 'If equals be subtracted from equals, the remainders are equal.' },
                  { id: 4, name: 'CN 4: Superposition', text: 'Things which coincide with one another are equal to one another.' },
                  { id: 5, name: 'CN 5: Whole vs. Part', text: 'The whole is greater than the part.' }
                ].map((cn) => (
                  <button
                    key={cn.id}
                    onClick={() => setActiveCN(cn.id)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                      activeCN === cn.id
                        ? 'bg-amber-500 text-slate-950 shadow-[0_0_12px_rgba(245,158,11,0.4)]'
                        : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
                    }`}
                  >
                    {cn.name}
                  </button>
                ))}
              </div>

              <div className="bg-slate-900/80 border border-amber-500/30 rounded-2xl p-5">
                <h3 className="text-base font-serif font-bold text-white mb-1">
                  Common Notion {activeCN}
                </h3>
                <p className="text-xs text-amber-200 italic mb-4">
                  {[
                    'Things which are equal to the same thing are also equal to one another.',
                    'If equals be added to equals, the wholes are equal.',
                    'If equals be subtracted from equals, the remainders are equal.',
                    'Things which coincide with one another are equal to one another.',
                    'The whole is greater than the part.'
                  ][activeCN - 1]}
                </p>

                <div className="h-40 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-center p-4">
                  <svg className="w-full h-full" viewBox="0 0 300 120">
                    <line x1="150" y1="30" x2="150" y2="100" stroke="#64748b" strokeWidth="4" />
                    <polygon points="130,100 170,100 150,90" fill="#64748b" />
                    <line x1="50" y1="40" x2="250" y2="40" stroke="#e9c46a" strokeWidth="3" />
                    <circle cx="150" cy="40" r="5" fill="#e76f51" />
                    <line x1="50" y1="40" x2="50" y2="70" stroke="#94a3b8" strokeWidth="1.5" />
                    <path d="M 25 70 Q 50 85 75 70" fill="none" stroke="#e9c46a" strokeWidth="2" />
                    <rect x="35" y="52" width="30" height="18" rx="3" fill="#3b82f6" opacity="0.8" />
                    <text x="45" y="65" fill="#ffffff" fontSize="10" fontWeight="bold">Side A</text>

                    <line x1="250" y1="40" x2="250" y2="70" stroke="#94a3b8" strokeWidth="1.5" />
                    <path d="M 225 70 Q 250 85 275 70" fill="none" stroke="#e9c46a" strokeWidth="2" />
                    <rect x="235" y="52" width="30" height="18" rx="3" fill="#3b82f6" opacity="0.8" />
                    <text x="245" y="65" fill="#ffffff" fontSize="10" fontWeight="bold">Side B</text>

                    <text x="120" y="20" fill="#10b981" fontSize="11" fontWeight="bold">Equilibrium (Equal Magnitudes)</text>
                  </svg>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Postulates (with Controversy & Geodesics Simulator) */}
          {illustrationTab === 'postulates' && (
            <div className="flex flex-col gap-6">
              <div className="space-y-3">
                <h3 className="text-xs font-mono font-bold text-indigo-300 uppercase tracking-widest">
                  The 5 Euclidean Postulates
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {/* Postulate 1 */}
                  <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3.5 flex flex-col justify-between">
                    <div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-indigo-950 text-indigo-300 border border-indigo-800">
                        1. The Line Postulate
                      </span>
                      <p className="text-xs font-serif italic text-amber-200 mt-1 shadow-sm">"A straight line may be drawn from any one point to any other point."</p>
                      <p className="text-[11px] text-slate-400 mt-1">(You can connect any two points with a straight line.)</p>
                    </div>
                    <div className="mt-3 h-24 bg-slate-950/80 rounded-lg flex items-center justify-center border border-slate-800">
                      <svg className="w-full h-full" viewBox="0 0 200 80">
                        <circle cx="40" cy="40" r="4" fill="#e76f51" />
                        <text x="35" y="58" fill="#e76f51" fontSize="9" fontWeight="bold">Point A</text>
                        <circle cx="160" cy="40" r="4" fill="#10b981" />
                        <text x="155" y="58" fill="#10b981" fontSize="9" fontWeight="bold">Point B</text>
                        <line x1="40" y1="40" x2="160" y2="40" stroke="#e9c46a" strokeWidth="2" strokeDasharray="3,3" className="animate-pulse" />
                      </svg>
                    </div>
                  </div>

                  {/* Postulate 2 */}
                  <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3.5 flex flex-col justify-between">
                    <div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-indigo-950 text-indigo-300 border border-indigo-800">
                        2. The Extension Postulate
                      </span>
                      <p className="text-xs font-serif italic text-amber-200 mt-1 shadow-sm">"A finite straight line may be produced to any length in a straight line."</p>
                      <p className="text-[11px] text-slate-400 mt-1">(You can extend a straight line segment infinitely in either direction.)</p>
                    </div>
                    <div className="mt-3 h-24 bg-slate-950/80 rounded-lg flex items-center justify-center border border-slate-800">
                      <svg className="w-full h-full" viewBox="0 0 200 80">
                        <line x1="50" y1="40" x2="150" y2="40" stroke="#3b82f6" strokeWidth="2.5" />
                        <line x1="15" y1="40" x2="50" y2="40" stroke="#60a5fa" strokeWidth="1.5" strokeDasharray="3,3" />
                        <line x1="150" y1="40" x2="185" y2="40" stroke="#60a5fa" strokeWidth="1.5" strokeDasharray="3,3" />
                        <circle cx="50" cy="40" r="3.5" fill="#e9c46a" />
                        <circle cx="150" cy="40" r="3.5" fill="#e9c46a" />
                        <text x="85" y="32" fill="#cbd5e1" fontSize="9">Segment</text>
                      </svg>
                    </div>
                  </div>

                  {/* Postulate 3 */}
                  <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3.5 flex flex-col justify-between">
                    <div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-indigo-950 text-indigo-300 border border-indigo-800">
                        3. The Circle Postulate
                      </span>
                      <p className="text-xs font-serif italic text-amber-200 mt-1 shadow-sm">"A circle may be described with any centre at any distance from that centre."</p>
                      <p className="text-[11px] text-slate-400 mt-1">(If you have a point and a distance, you can draw a circle with that point as the center and the distance as the radius.)</p>
                    </div>
                    <div className="mt-3 h-24 bg-slate-950/80 rounded-lg flex items-center justify-center border border-slate-800">
                      <svg className="w-full h-full" viewBox="0 0 200 80">
                        <circle cx="100" cy="40" r="30" fill="none" stroke="#a855f7" strokeWidth="2" />
                        <circle cx="100" cy="40" r="3.5" fill="#e9c46a" />
                        <line x1="100" y1="40" x2="130" y2="40" stroke="#e9c46a" strokeWidth="1.5" strokeDasharray="2,2" />
                        <text x="92" y="32" fill="#e9c46a" fontSize="8">Center</text>
                        <text x="108" y="52" fill="#a855f7" fontSize="8">Radius r</text>
                      </svg>
                    </div>
                  </div>

                  {/* Postulate 4 */}
                  <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3.5 flex flex-col justify-between">
                    <div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-indigo-950 text-indigo-300 border border-indigo-800">
                        4. The Right Angle Postulate
                      </span>
                      <p className="text-xs font-serif italic text-amber-200 mt-1 shadow-sm">"All right angles are equal to one another."</p>
                      <p className="text-[11px] text-slate-400 mt-1">(A right angle is exactly the same no matter where it is, how it is rotated, or how long the lines forming it are.)</p>
                    </div>
                    <div className="mt-3 h-24 bg-slate-950/80 rounded-lg flex items-center justify-center border border-slate-800">
                      <svg className="w-full h-full" viewBox="0 0 200 80">
                        <line x1="20" y1="60" x2="90" y2="60" stroke="#64748b" strokeWidth="1.5" />
                        <line x1="55" y1="60" x2="55" y2="15" stroke="#10b981" strokeWidth="1.5" />
                        <path d="M 55 50 L 65 50 L 65 60" fill="none" stroke="#e9c46a" strokeWidth="1.5" />
                        <g transform="translate(100, 10) rotate(25)">
                          <line x1="0" y1="40" x2="60" y2="40" stroke="#64748b" strokeWidth="1.5" />
                          <line x1="30" y1="40" x2="30" y2="0" stroke="#10b981" strokeWidth="1.5" />
                          <path d="M 30 30 L 40 30 L 40 40" fill="none" stroke="#e9c46a" strokeWidth="1.5" />
                        </g>
                        <text x="45" y="73" fill="#10b981" fontSize="8" fontWeight="bold">90° = 90°</text>
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Postulate 5 */}
                <div className="bg-slate-900/80 border border-rose-500/30 rounded-xl p-4">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-950 text-rose-300 border border-rose-800">
                    5. The Parallel Postulate
                  </span>
                  <p className="text-xs font-serif italic text-rose-200 leading-relaxed mt-1.5">
                    "If a straight line falling on two straight lines makes the interior angles on the same side less than two right angles, the two straight lines, if produced indefinitely, meet on that side on which are the angles less than the two right angles."
                  </p>
                  <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                    (If a line crosses two other lines, and the inner angles on one side add up to less than 180 degrees, those two lines will eventually cross each other on that side if you draw them long enough.)
                  </p>
                  <div className="mt-3 h-24 bg-slate-950/80 rounded-lg flex items-center justify-center border border-slate-800">
                    <svg className="w-full h-full" viewBox="0 0 300 80">
                      <line x1="30" y1="30" x2="250" y2="15" stroke="#f43f5e" strokeWidth="2" />
                      <line x1="30" y1="75" x2="250" y2="55" stroke="#f43f5e" strokeWidth="2" />
                      <line x1="70" y1="10" x2="70" y2="85" stroke="#e9c46a" strokeWidth="2" />
                      <path d="M 70 28 A 15 15 0 0 0 85 36" fill="none" stroke="#f43f5e" strokeWidth="1.5" />
                      <path d="M 70 71 A 15 15 0 0 1 85 66" fill="none" stroke="#f43f5e" strokeWidth="1.5" />
                      <text x="95" y="48" fill="#f43f5e" fontSize="9" fontWeight="bold">&alpha; + &beta; &lt; 180° (Lines intersect on right →)</text>
                    </svg>
                  </div>
                </div>
              </div>

              {/* Controversy Text */}
              <div className="bg-slate-900/90 border border-amber-500/30 rounded-2xl p-5 space-y-3">
                <div className="flex items-center gap-2 text-amber-400">
                  <Info className="w-4 h-4" />
                  <h3 className="font-serif font-bold text-sm text-white">Subjectivity & The 2,000-Year Controversy of the 5th Postulate</h3>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Whether a starting rule is categorized as an unprovable postulate can be subjective. For over 2,000 years, mathematicians felt that the 5th Postulate didn't belong in the "unprovable assumptions" category because it looked and sounded like a theorem.
                </p>
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-2 leading-relaxed">
                  <p className="font-semibold text-amber-300">Why was it controversial?</p>
                  <p>
                    Mathematicians believed that if they just tried hard enough, they could prove the 5th Postulate using only the first four. From ancient Greeks to medieval Islamic scholars to Renaissance Europeans, brilliant minds spent their entire careers trying to prove it—and all of them failed.
                  </p>
                  <p className="font-semibold text-indigo-300 pt-1">The Breakthrough: Non-Euclidean Geometry</p>
                  <p>
                    In the 1800s, mathematicians like Carl Friedrich Gauss, János Bolyai, and Nikolai Lobachevsky tried a different approach: What if we just break the 5th Postulate on purpose? They assumed that through a single point, you could draw multiple parallel lines, or zero parallel lines.
                  </p>
                  <p>
                    They expected the mathematics to break down into logical contradictions. Instead, a shocking thing happened: the math worked perfectly. They had accidentally discovered <strong>Non-Euclidean Geometries</strong>.
                  </p>
                </div>
              </div>

              {/* Interactive Visual Simulator */}
              <div className="bg-white rounded-2xl p-6 text-slate-900 shadow-2xl flex flex-col items-center select-none">
                <h2 className="text-2xl font-sans font-normal text-slate-900 self-start mb-4">
                  Geodesics & Parallel Postulate
                </h2>

                <div className="w-full h-64 flex items-center justify-center relative my-2">
                  {geometryType === 'Spherical' ? (
                    <svg className="w-56 h-56 filter drop-shadow-md" viewBox="0 0 200 200">
                      <defs>
                        <radialGradient id="sphereGrad" cx="35%" cy="35%" r="65%">
                          <stop offset="0%" stopColor="#ffffff" />
                          <stop offset="70%" stopColor="#e2e8f0" />
                          <stop offset="100%" stopColor="#cbd5e1" />
                        </radialGradient>
                      </defs>
                      <circle cx="100" cy="100" r="80" fill="url(#sphereGrad)" stroke="#94a3b8" strokeWidth="1" />
                      <ellipse cx="100" cy="100" rx="80" ry="22" fill="none" stroke="#2563eb" strokeWidth="2" />
                      <path d="M 100 20 Q 140 100 100 180" fill="none" stroke="#16a34a" strokeWidth="2" strokeDasharray="4,3" />
                      <path d="M 100 20 Q 165 100 100 180" fill="none" stroke="#16a34a" strokeWidth="2" strokeDasharray="4,3" />
                      <path d="M 100 20 Q 60 100 100 180" fill="none" stroke="#16a34a" strokeWidth="1.5" strokeDasharray="4,3" opacity="0.6" />
                      <circle cx="100" cy="20" r="2.5" fill="#16a34a" />
                      <circle cx="100" cy="180" r="2.5" fill="#16a34a" />
                      <circle cx="120" cy="65" r="5" fill="#dc2626" />
                    </svg>
                  ) : geometryType === 'Flat' ? (
                    <svg className="w-56 h-56 border border-slate-200 rounded-2xl bg-slate-50" viewBox="0 0 200 200">
                      <line x1="0" y1="100" x2="200" y2="100" stroke="#cbd5e1" strokeWidth="1" />
                      <line x1="10" y1="130" x2="190" y2="130" stroke="#2563eb" strokeWidth="2.5" />
                      <line x1="10" y1="70" x2="190" y2="70" stroke="#16a34a" strokeWidth="2.5" strokeDasharray="5,4" />
                      <circle cx="100" cy="70" r="5" fill="#dc2626" />
                    </svg>
                  ) : (
                    <svg className="w-56 h-56" viewBox="0 0 200 200">
                      <circle cx="100" cy="100" r="85" fill="#f8fafc" stroke="#2563eb" strokeWidth="3" />
                      <path d="M 25 60 Q 100 110 175 60" fill="none" stroke="#16a34a" strokeWidth="2" strokeDasharray="4,3" />
                      <path d="M 20 100 Q 100 130 180 100" fill="none" stroke="#16a34a" strokeWidth="2" strokeDasharray="4,3" />
                      <path d="M 30 140 Q 100 150 170 140" fill="none" stroke="#16a34a" strokeWidth="2" strokeDasharray="4,3" />
                      <circle cx="100" cy="115" r="5" fill="#dc2626" />
                    </svg>
                  )}
                </div>

                <div className="flex items-center justify-center gap-12 my-4 text-center">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                      GEOMETRY
                    </span>
                    <span className="text-base font-bold text-slate-900">
                      {geometryType}
                    </span>
                  </div>

                  <div className="h-8 w-[1px] bg-slate-300" />

                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                      PARALLEL LINES
                    </span>
                    <span className="text-base font-bold text-slate-900">
                      {geometryType === 'Spherical'
                        ? '0 (None)'
                        : geometryType === 'Flat'
                        ? '1 (Exactly One)'
                        : 'Infinitely Many'}
                    </span>
                  </div>
                </div>

                <div className="w-full max-w-sm flex items-center justify-between gap-4 mt-2">
                  <label htmlFor="geo-select" className="text-sm font-medium text-slate-700">
                    Geometry Type
                  </label>

                  <div className="relative flex-1">
                    <select
                      id="geo-select"
                      value={geometryType}
                      onChange={(e) => setGeometryType(e.target.value)}
                      className="w-full appearance-none bg-slate-50 hover:bg-slate-100 border border-slate-400 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 transition cursor-pointer pr-10"
                    >
                      <option value="Flat">Flat</option>
                      <option value="Spherical">Spherical</option>
                      <option value="Hyperbolic">Hyperbolic</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-700">
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                        <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 4: Propositions (Problems & Theorems) */}
          {illustrationTab === 'propositions' && (
            <div className="flex flex-col gap-6">
              <div className="bg-indigo-950/30 border border-indigo-500/20 rounded-xl p-4 text-xs text-indigo-200/90 leading-relaxed">
                <p className="font-semibold text-indigo-300 mb-1">What is a Proposition (Προτάσεις - Protaseis)?</p>
                A Proposition is a derived mathematical statement proved deductively step-by-step using only Definitions, Postulates, Common Notions, and previously proven Propositions.
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Problem */}
                <div className="bg-slate-900/80 border border-amber-500/30 rounded-2xl p-5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="px-2.5 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold text-xs uppercase tracking-wider">
                        Subtype 1: Problem (Πρόβλημα)
                      </span>
                      <span className="font-serif font-extrabold text-amber-400 text-xs">Ending: Q.E.F.</span>
                    </div>
                    <h3 className="text-base font-serif font-bold text-white mb-2">Geometric Construction Task</h3>
                    <p className="text-xs text-slate-300 leading-relaxed mb-3">
                      A Problem requires you to <strong>construct</strong> a specific geometric figure using straightedge and compass.
                    </p>
                  </div>

                  <div className="mt-4 pt-4 border-t border-slate-800">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-serif font-bold text-indigo-300">Featured Example: Proposition 1</span>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => setProp1Step((prop1Step - 1 + 4) % 4)}
                          className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-[10px] transition cursor-pointer flex items-center gap-0.5 border border-slate-700"
                        >
                          <ChevronLeft className="w-3 h-3" />
                          <span>Prev</span>
                        </button>
                        <button
                          onClick={() => setProp1Step((prop1Step + 1) % 4)}
                          className="px-2.5 py-1 rounded bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[10px] transition cursor-pointer flex items-center gap-1"
                        >
                          <span>Step {prop1Step + 1}/4: Advance</span>
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    <div className="h-44 bg-slate-950 rounded-xl border border-slate-800 relative overflow-hidden flex items-center justify-center">
                      <svg className="w-full h-full" viewBox="0 0 300 160">
                        <line x1="110" y1="100" x2="190" y2="100" stroke="#e9c46a" strokeWidth="3" />
                        <circle cx="110" cy="100" r="4" fill="#e76f51" />
                        <circle cx="190" cy="100" r="4" fill="#10b981" />
                        {prop1Step >= 1 && <circle cx="110" cy="100" r="80" fill="none" stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="3,3" />}
                        {prop1Step >= 2 && <circle cx="190" cy="100" r="80" fill="none" stroke="#a855f7" strokeWidth="1.5" strokeDasharray="3,3" />}
                        {prop1Step >= 3 && (
                          <>
                            <circle cx="150" cy="30.7" r="5" fill="#e9c46a" />
                            <line x1="110" y1="100" x2="150" y2="30.7" stroke="#6366f1" strokeWidth="2.5" />
                            <line x1="190" y1="100" x2="150" y2="30.7" stroke="#6366f1" strokeWidth="2.5" />
                            <polygon points="110,100 190,100 150,30.7" fill="rgba(99, 102, 241, 0.25)" />
                          </>
                        )}
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Theorem */}
                <div className="bg-slate-900/80 border border-emerald-500/30 rounded-2xl p-5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold text-xs uppercase tracking-wider">
                        Subtype 2: Theorem (Θεώρημα)
                      </span>
                      <span className="font-serif font-extrabold text-emerald-400 text-xs">Ending: Q.E.D.</span>
                    </div>
                    <h3 className="text-base font-serif font-bold text-white mb-2">Deductive Proof of Property</h3>
                    <p className="text-xs text-slate-300 leading-relaxed mb-3">
                      A Theorem states a mathematical relationship and provides a rigorous step-by-step logical proof.
                    </p>
                  </div>

                  <div className="mt-4 pt-4 border-t border-slate-800">
                    <span className="text-xs font-serif font-bold text-indigo-300 block mb-2">Featured Example: Proposition 4 (SAS)</span>
                    <div className="h-44 bg-slate-950 rounded-xl border border-slate-800 p-3 flex flex-col justify-between">
                      <p className="text-[11px] text-slate-300 italic">"If two triangles have two sides and the included angle equal, the remaining side & angles are equal."</p>
                      <div className="flex items-center justify-between text-[10px] font-mono text-emerald-400 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
                        <span>Proof Method: Superposition</span>
                        <span>Q.E.D.</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      );
    } else if (activeSubtask === 2) {
      // Subtask 2: Book I: plane geometry (Oliver Byrne-Styled Proof Explorer)
      return (
        <div className="w-full h-full flex flex-col p-6 overflow-y-auto bg-gradient-to-br from-slate-950 via-[#0b1021] to-[#07090e]">
          <div className="pb-3 mb-4 border-b border-indigo-900/40 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono tracking-widest text-indigo-400 uppercase">
                EUCLID'S ELEMENTS • BOOK I THEOREMS
              </span>
              <h2 className="text-lg font-serif font-bold text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-amber-400" />
                <span>Task 2: Oliver Byrne-Styled Theorem Proofs</span>
              </h2>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex gap-2 mb-4 bg-slate-900/80 p-1 rounded-xl border border-slate-800 self-start">
            {[
              { id: 'congruence', label: '1. Congruence Theorems' },
              { id: 'triangles', label: '2. Triangle Properties' },
              { id: 'parallel', label: '3. Parallel Lines' }
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setTask2ProofCategory(cat.id);
                  if (cat.id === 'congruence') setSelectedProp('Prop4');
                  if (cat.id === 'triangles') setSelectedProp('Prop5');
                  if (cat.id === 'parallel') setSelectedProp('Prop29');
                  setProofStep(0);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  task2ProofCategory === cat.id
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-[0_0_12px_rgba(245,158,11,0.4)]'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Proposition Pills inside Selected Category */}
          <div className="flex flex-wrap gap-2 mb-4 shrink-0">
            {Object.keys(task2PropsMap)
              .filter((key) => task2PropsMap[key].category === task2ProofCategory)
              .map((key) => (
                <button
                  key={key}
                  onClick={() => {
                    setSelectedProp(key);
                    setProofStep(0);
                  }}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer shrink-0 border ${
                    selectedProp === key
                      ? 'bg-indigo-600 border-indigo-400 text-white shadow-[0_0_12px_rgba(99,102,241,0.5)]'
                      : 'bg-slate-900 border-slate-750 text-slate-200 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  {task2PropsMap[key].title}
                </button>
              ))}
          </div>

          {/* Active Proposition Proof Card */}
          <div className="bg-slate-900/90 border border-indigo-500/30 rounded-2xl p-5 shadow-2xl flex flex-col justify-between flex-1">
            <div>
              <div className="flex items-center justify-between text-xs font-mono text-amber-400 uppercase tracking-wider mb-1">
                <span>{activePropObj.title.toUpperCase()}</span>
                <span className="text-xs font-mono text-emerald-400 font-bold">Q.E.D.</span>
              </div>
              <h3 className="text-base font-serif font-bold text-white mb-1">{activePropObj.title}</h3>
              <p className="text-[11px] text-amber-200 font-serif italic mb-2.5 leading-relaxed">"{activePropObj.text}"</p>

              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-mono text-indigo-300">Proof Step {proofStep + 1} of {activePropObj.steps.length}</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setProofStep((proofStep - 1 + activePropObj.steps.length) % activePropObj.steps.length)}
                    className="px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition cursor-pointer flex items-center gap-1 border border-slate-700"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    <span>Prev Step</span>
                  </button>
                  <button
                    onClick={() => setProofStep((proofStep + 1) % activePropObj.steps.length)}
                    className="px-3 py-1 rounded bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition cursor-pointer flex items-center gap-1"
                  >
                    <span>Advance Step</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-xs text-slate-200 leading-relaxed mb-2.5">
                {activePropObj.steps[proofStep]}
              </div>
            </div>

            {/* Oliver Byrne Color-Coded Geometric Proof SVG */}
            <div className="h-44 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-center p-2 relative overflow-hidden">
              {selectedProp === 'Prop4' && (
                <svg className="w-full h-full" viewBox="0 0 340 162">
                  {proofStep === 0 && (
                    <g>
                      <rect x="70" y="4" width="200" height="18" rx="4" fill="rgba(30, 41, 59, 0.9)" stroke="#475569" />
                      <text x="80" y="17" fill="#cbd5e1" fontSize="8.5" fontWeight="bold">Given: Def. 2 (Lines) & Def. 8 (Included Angle)</text>

                      <polygon points="40,140 120,140 70,50" fill="rgba(233, 196, 106, 0.2)" stroke="#e9c46a" strokeWidth="2.5" />
                      <line x1="40" y1="140" x2="120" y2="140" stroke="#f43f5e" strokeWidth="3.5" />
                      <line x1="40" y1="140" x2="70" y2="50" stroke="#3b82f6" strokeWidth="3.5" />
                      <path d="M 60 140 A 20 20 0 0 0 46.3 121" fill="none" stroke="#e9c46a" strokeWidth="3" />
                      <text x="28" y="152" fill="#e9c46a" fontSize="11" fontWeight="bold">A</text>
                      <text x="124" y="152" fill="#e9c46a" fontSize="11" fontWeight="bold">B</text>
                      <text x="66" y="42" fill="#e9c46a" fontSize="11" fontWeight="bold">C</text>
                      <text x="50" y="133" fill="#e9c46a" fontSize="9" fontWeight="bold">∠A</text>

                      <polygon points="200,140 280,140 230,50" fill="rgba(231, 111, 81, 0.2)" stroke="#e76f51" strokeWidth="2.5" />
                      <line x1="200" y1="140" x2="280" y2="140" stroke="#f43f5e" strokeWidth="3.5" />
                      <line x1="200" y1="140" x2="230" y2="50" stroke="#3b82f6" strokeWidth="3.5" />
                      <path d="M 220 140 A 20 20 0 0 0 206.3 121" fill="none" stroke="#e9c46a" strokeWidth="3" />
                      <text x="188" y="152" fill="#e76f51" fontSize="11" fontWeight="bold">D</text>
                      <text x="284" y="152" fill="#e76f51" fontSize="11" fontWeight="bold">E</text>
                      <text x="226" y="42" fill="#e76f51" fontSize="11" fontWeight="bold">F</text>
                      <text x="210" y="133" fill="#e9c46a" fontSize="9" fontWeight="bold">∠D</text>
                    </g>
                  )}

                  {proofStep === 1 && (
                    <g>
                      <rect x="45" y="4" width="250" height="18" rx="4" fill="rgba(16, 185, 129, 0.2)" stroke="#10b981" />
                      <text x="55" y="17" fill="#10b981" fontSize="8.5" fontWeight="bold">Justification: Common Notion 4 (Superposition) & Postulate 1</text>

                      <path d="M 90 95 Q 140 60 190 95" fill="none" stroke="#60a5fa" strokeWidth="2" strokeDasharray="4,3" />
                      <polygon points="190,95 182,90 183,99" fill="#60a5fa" />
                      <text x="120" y="68" fill="#60a5fa" fontSize="9" fontWeight="bold">Superimpose A → D</text>

                      <polygon points="120,140 200,140 150,50" fill="rgba(233, 196, 106, 0.3)" stroke="#e9c46a" strokeWidth="2" strokeDasharray="3,3" />
                      <text x="110" y="152" fill="#e9c46a" fontSize="10">A</text>
                      <text x="200" y="152" fill="#e9c46a" fontSize="10">B</text>
                      <text x="145" y="42" fill="#e9c46a" fontSize="10">C</text>

                      <polygon points="200,140 280,140 230,50" fill="rgba(231, 111, 81, 0.2)" stroke="#e76f51" strokeWidth="2.5" />
                      <circle cx="200" cy="140" r="5" fill="#10b981" />
                      <text x="188" y="154" fill="#10b981" fontSize="10" fontWeight="bold">A = D</text>
                      <text x="284" y="154" fill="#e76f51" fontSize="10" fontWeight="bold">E</text>
                      <text x="226" y="42" fill="#e76f51" fontSize="10" fontWeight="bold">F</text>
                    </g>
                  )}

                  {proofStep === 2 && (
                    <g>
                      <rect x="50" y="4" width="240" height="18" rx="4" fill="rgba(168, 85, 247, 0.2)" stroke="#a855f7" />
                      <text x="60" y="17" fill="#a855f7" fontSize="8.5" fontWeight="bold">Justification: Common Notion 4 (Coincidence of Points C & F)</text>

                      <polygon points="200,140 280,140 230,50" fill="rgba(233, 196, 106, 0.3)" stroke="#e9c46a" strokeWidth="2.5" />
                      <line x1="200" y1="140" x2="230" y2="50" stroke="#3b82f6" strokeWidth="4" />
                      <circle cx="200" cy="140" r="5" fill="#10b981" />
                      <circle cx="280" cy="140" r="5" fill="#10b981" />
                      <circle cx="230" cy="50" r="5" fill="#a855f7" />

                      <text x="185" y="154" fill="#10b981" fontSize="10" fontWeight="bold">A = D</text>
                      <text x="280" y="154" fill="#10b981" fontSize="10" fontWeight="bold">B = E</text>
                      <text x="222" y="40" fill="#a855f7" fontSize="10" fontWeight="bold">C = F</text>
                    </g>
                  )}

                  {proofStep === 3 && (
                    <g>
                      <rect x="40" y="4" width="260" height="22" rx="5" fill="rgba(16, 185, 129, 0.9)" />
                      <text x="50" y="19" fill="#ffffff" fontSize="8.5" fontWeight="bold">✓ Postulate 1 & CN 4: △ABC ≅ △DEF in every respect (Q.E.D.)</text>

                      <polygon points="200,140 280,140 230,50" fill="rgba(16, 185, 129, 0.35)" stroke="#10b981" strokeWidth="3" />
                      <line x1="280" y1="140" x2="230" y2="50" stroke="#e9c46a" strokeWidth="4" />
                      
                      <circle cx="200" cy="140" r="5" fill="#10b981" />
                      <circle cx="280" cy="140" r="5" fill="#10b981" />
                      <circle cx="230" cy="50" r="5" fill="#10b981" />

                      <text x="185" y="154" fill="#10b981" fontSize="10" fontWeight="bold">A = D</text>
                      <text x="280" y="154" fill="#10b981" fontSize="10" fontWeight="bold">B = E</text>
                      <text x="222" y="40" fill="#10b981" fontSize="10" fontWeight="bold">C = F</text>
                    </g>
                  )}
                </svg>
              )}

              {selectedProp === 'Prop8' && (
                <svg className="w-full h-full" viewBox="0 0 340 162">
                  {proofStep === 0 && (
                    <g>
                      <rect x="60" y="4" width="220" height="18" rx="4" fill="rgba(30, 41, 59, 0.9)" stroke="#475569" />
                      <text x="70" y="17" fill="#cbd5e1" fontSize="8.5" fontWeight="bold">Given: Def. 20 (Trilateral Figures with Equal Sides)</text>

                      <polygon points="40,140 120,140 70,50" fill="rgba(233, 196, 106, 0.2)" stroke="#e9c46a" strokeWidth="2" />
                      <line x1="40" y1="140" x2="120" y2="140" stroke="#e76f51" strokeWidth="3" />
                      <line x1="40" y1="140" x2="70" y2="50" stroke="#3b82f6" strokeWidth="3" />
                      <line x1="120" y1="140" x2="70" y2="50" stroke="#10b981" strokeWidth="3" />
                      <text x="28" y="152" fill="#e9c46a" fontSize="10" fontWeight="bold">A</text>
                      <text x="124" y="152" fill="#e9c46a" fontSize="10" fontWeight="bold">B</text>
                      <text x="66" y="42" fill="#e9c46a" fontSize="10" fontWeight="bold">C</text>

                      <polygon points="200,140 280,140 230,50" fill="rgba(231, 111, 81, 0.2)" stroke="#e76f51" strokeWidth="2" />
                      <line x1="200" y1="140" x2="280" y2="140" stroke="#e76f51" strokeWidth="3" />
                      <line x1="200" y1="140" x2="230" y2="50" stroke="#3b82f6" strokeWidth="3" />
                      <line x1="280" y1="140" x2="230" y2="50" stroke="#10b981" strokeWidth="3" />
                      <text x="188" y="152" fill="#e76f51" fontSize="10" fontWeight="bold">D</text>
                      <text x="284" y="152" fill="#e76f51" fontSize="10" fontWeight="bold">E</text>
                      <text x="226" y="42" fill="#e76f51" fontSize="10" fontWeight="bold">F</text>
                    </g>
                  )}

                  {proofStep === 1 && (
                    <g>
                      <rect x="60" y="4" width="220" height="18" rx="4" fill="rgba(16, 185, 129, 0.2)" stroke="#10b981" />
                      <text x="70" y="17" fill="#10b981" fontSize="8.5" fontWeight="bold">Justification: Common Notion 4 (Superposition of Base BC)</text>

                      <polygon points="200,140 280,140 230,50" fill="rgba(233, 196, 106, 0.3)" stroke="#e9c46a" strokeWidth="2.5" />
                      <line x1="200" y1="140" x2="280" y2="140" stroke="#10b981" strokeWidth="4" />
                      <circle cx="200" cy="140" r="5" fill="#10b981" />
                      <circle cx="280" cy="140" r="5" fill="#10b981" />
                      <text x="188" y="154" fill="#10b981" fontSize="10" fontWeight="bold">B = E</text>
                      <text x="280" y="154" fill="#10b981" fontSize="10" fontWeight="bold">C = F</text>
                      <text x="226" y="42" fill="#e76f51" fontSize="10" fontWeight="bold">D</text>
                      <text x="245" y="75" fill="#e9c46a" fontSize="10" fontWeight="bold">A</text>
                    </g>
                  )}

                  {proofStep === 2 && (
                    <g>
                      <rect x="40" y="4" width="260" height="22" rx="4" fill="rgba(244, 63, 94, 0.2)" stroke="#f43f5e" />
                      <text x="50" y="18" fill="#f43f5e" fontSize="8.5" fontWeight="bold">Contradiction: Proposition VII (Unique Triangular Construction)</text>

                      <polygon points="200,140 280,140 230,50" fill="rgba(231, 111, 81, 0.2)" stroke="#e76f51" strokeWidth="2" />
                      <line x1="200" y1="140" x2="260" y2="60" stroke="#f43f5e" strokeWidth="2.5" strokeDasharray="3,3" />
                      <line x1="280" y1="140" x2="260" y2="60" stroke="#f43f5e" strokeWidth="2.5" strokeDasharray="3,3" />
                      <circle cx="260" cy="60" r="5" fill="#f43f5e" />
                      <text x="188" y="154" fill="#10b981" fontSize="10" fontWeight="bold">B = E</text>
                      <text x="280" y="154" fill="#10b981" fontSize="10" fontWeight="bold">C = F</text>
                      <text x="225" y="42" fill="#cbd5e1" fontSize="10" fontWeight="bold">D</text>
                      <text x="268" y="62" fill="#f43f5e" fontSize="10" fontWeight="bold">A' (Offset)</text>
                    </g>
                  )}

                  {proofStep === 3 && (
                    <g>
                      <rect x="50" y="4" width="240" height="22" rx="5" fill="rgba(16, 185, 129, 0.9)" />
                      <text x="60" y="19" fill="#ffffff" fontSize="8.5" fontWeight="bold">✓ Prop VII & CN 4: SSS Proved: △ABC ≅ △DEF (Q.E.D.)</text>

                      <polygon points="200,140 280,140 230,50" fill="rgba(16, 185, 129, 0.35)" stroke="#10b981" strokeWidth="3" />
                      <circle cx="200" cy="140" r="5" fill="#10b981" />
                      <circle cx="280" cy="140" r="5" fill="#10b981" />
                      <circle cx="230" cy="50" r="5" fill="#10b981" />
                      <text x="188" y="154" fill="#10b981" fontSize="10" fontWeight="bold">B = E</text>
                      <text x="280" y="154" fill="#10b981" fontSize="10" fontWeight="bold">C = F</text>
                      <text x="222" y="40" fill="#10b981" fontSize="10" fontWeight="bold">A = D</text>
                    </g>
                  )}
                </svg>
              )}

              {selectedProp === 'Prop26' && (
                <svg className="w-full h-full" viewBox="0 0 340 162">
                  {proofStep === 0 && (
                    <g>
                      <rect x="65" y="4" width="210" height="18" rx="4" fill="rgba(30, 41, 59, 0.9)" stroke="#475569" />
                      <text x="75" y="17" fill="#cbd5e1" fontSize="8.5" fontWeight="bold">Given: Def. 8 (Angles) & Def. 2 (Included Side)</text>

                      <polygon points="40,140 120,140 70,50" fill="rgba(99, 102, 241, 0.2)" stroke="#6366f1" strokeWidth="2" />
                      <line x1="40" y1="140" x2="120" y2="140" stroke="#e9c46a" strokeWidth="3.5" />
                      <path d="M 58 140 A 18 18 0 0 0 45.7 122.9" fill="none" stroke="#3b82f6" strokeWidth="3" />
                      <path d="M 102 140 A 18 18 0 0 1 111.3 124.3" fill="none" stroke="#10b981" strokeWidth="3" />
                      <text x="28" y="152" fill="#cbd5e1" fontSize="10" fontWeight="bold">B</text>
                      <text x="124" y="152" fill="#cbd5e1" fontSize="10" fontWeight="bold">C</text>
                      <text x="66" y="42" fill="#cbd5e1" fontSize="10" fontWeight="bold">A</text>

                      <polygon points="200,140 280,140 230,50" fill="rgba(99, 102, 241, 0.2)" stroke="#6366f1" strokeWidth="2" />
                      <line x1="200" y1="140" x2="280" y2="140" stroke="#e9c46a" strokeWidth="3.5" />
                      <path d="M 218 140 A 18 18 0 0 0 205.7 122.9" fill="none" stroke="#3b82f6" strokeWidth="3" />
                      <path d="M 262 140 A 18 18 0 0 1 271.3 124.3" fill="none" stroke="#10b981" strokeWidth="3" />
                      <text x="188" y="152" fill="#cbd5e1" fontSize="10" fontWeight="bold">E</text>
                      <text x="284" y="152" fill="#cbd5e1" fontSize="10" fontWeight="bold">F</text>
                      <text x="226" y="42" fill="#cbd5e1" fontSize="10" fontWeight="bold">D</text>
                    </g>
                  )}

                  {proofStep === 1 && (
                    <g>
                      <rect x="40" y="4" width="260" height="18" rx="4" fill="rgba(244, 63, 94, 0.2)" stroke="#f43f5e" />
                      <text x="50" y="17" fill="#f43f5e" fontSize="8.5" fontWeight="bold">Justification: Proposition III (Cut Line) & Postulate 1</text>

                      <polygon points="40,140 120,140 70,50" fill="rgba(99, 102, 241, 0.15)" stroke="#6366f1" strokeWidth="2" />
                      <circle cx="55" cy="95" r="4.5" fill="#f43f5e" />
                      <line x1="55" y1="95" x2="120" y2="140" stroke="#e9c46a" strokeWidth="2" strokeDasharray="3,3" />
                      <text x="28" y="152" fill="#cbd5e1" fontSize="10" fontWeight="bold">B</text>
                      <text x="124" y="152" fill="#cbd5e1" fontSize="10" fontWeight="bold">C</text>
                      <text x="66" y="42" fill="#cbd5e1" fontSize="10" fontWeight="bold">A</text>
                      <text x="40" y="95" fill="#f43f5e" fontSize="10" fontWeight="bold">G</text>
                    </g>
                  )}

                  {proofStep === 2 && (
                    <g>
                      <rect x="40" y="4" width="260" height="22" rx="4" fill="rgba(244, 63, 94, 0.3)" stroke="#f43f5e" />
                      <text x="50" y="18" fill="#ffffff" fontSize="8.5" fontWeight="bold">Contradiction: Common Notion 5 (The whole is greater than the part)</text>

                      <polygon points="40,140 120,140 70,50" fill="rgba(99, 102, 241, 0.15)" stroke="#6366f1" strokeWidth="2" />
                      <polygon points="40,140 120,140 55,95" fill="rgba(244, 63, 94, 0.25)" stroke="#f43f5e" strokeWidth="2" />
                      <text x="28" y="152" fill="#cbd5e1" fontSize="10" fontWeight="bold">B</text>
                      <text x="124" y="152" fill="#cbd5e1" fontSize="10" fontWeight="bold">C</text>
                      <text x="66" y="42" fill="#cbd5e1" fontSize="10" fontWeight="bold">A</text>
                      <text x="40" y="95" fill="#f43f5e" fontSize="10" fontWeight="bold">G</text>
                    </g>
                  )}

                  {proofStep === 3 && (
                    <g>
                      <rect x="55" y="4" width="230" height="22" rx="5" fill="rgba(16, 185, 129, 0.9)" />
                      <text x="65" y="19" fill="#ffffff" fontSize="8.5" fontWeight="bold">✓ Prop IV & CN 5: ASA Proved: △ABC ≅ △DEF (Q.E.D.)</text>

                      <polygon points="40,140 120,140 70,50" fill="rgba(16, 185, 129, 0.35)" stroke="#10b981" strokeWidth="3" />
                      <polygon points="200,140 280,140 230,50" fill="rgba(16, 185, 129, 0.35)" stroke="#10b981" strokeWidth="3" />
                      <text x="28" y="152" fill="#10b981" fontSize="10" fontWeight="bold">B</text>
                      <text x="124" y="152" fill="#10b981" fontSize="10" fontWeight="bold">C</text>
                      <text x="66" y="42" fill="#10b981" fontSize="10" fontWeight="bold">A</text>
                      <text x="188" y="152" fill="#10b981" fontSize="10" fontWeight="bold">E</text>
                      <text x="284" y="152" fill="#10b981" fontSize="10" fontWeight="bold">F</text>
                      <text x="226" y="42" fill="#10b981" fontSize="10" fontWeight="bold">D</text>
                    </g>
                  )}
                </svg>
              )}

              {selectedProp === 'Prop5' && (
                <svg className="w-full h-full" viewBox="0 0 340 162">
                  {proofStep === 0 && (
                    <g>
                      <rect x="65" y="4" width="210" height="18" rx="4" fill="rgba(30, 41, 59, 0.9)" stroke="#475569" />
                      <text x="75" y="17" fill="#cbd5e1" fontSize="8.5" fontWeight="bold">Given: Def. 20 (Isosceles Triangle: AB = AC)</text>

                      <polygon points="170,45 110,125 230,125" fill="rgba(99, 102, 241, 0.2)" stroke="#6366f1" strokeWidth="2.5" />
                      <line x1="170" y1="45" x2="110" y2="125" stroke="#3b82f6" strokeWidth="3.5" />
                      <line x1="170" y1="45" x2="230" y2="125" stroke="#3b82f6" strokeWidth="3.5" />
                      <path d="M 130 125 A 20 20 0 0 0 122 109" fill="none" stroke="#e9c46a" strokeWidth="2.5" strokeDasharray="2,2" />
                      <path d="M 210 125 A 20 20 0 0 1 218 109" fill="none" stroke="#e9c46a" strokeWidth="2.5" strokeDasharray="2,2" />
                      <text x="165" y="38" fill="#e9c46a" fontSize="11" fontWeight="bold">A</text>
                      <text x="95" y="132" fill="#e9c46a" fontSize="11" fontWeight="bold">B</text>
                      <text x="235" y="132" fill="#e9c46a" fontSize="11" fontWeight="bold">C</text>
                    </g>
                  )}

                  {proofStep === 1 && (
                    <g>
                      <rect x="65" y="4" width="210" height="18" rx="4" fill="rgba(244, 63, 94, 0.2)" stroke="#f43f5e" />
                      <text x="75" y="17" fill="#f43f5e" fontSize="8.5" fontWeight="bold">Justification: Postulate 2 (Extension Postulate)</text>

                      <polygon points="170,45 110,125 230,125" fill="rgba(99, 102, 241, 0.2)" stroke="#6366f1" strokeWidth="2" />
                      <line x1="170" y1="45" x2="80" y2="155" stroke="#f43f5e" strokeWidth="2" strokeDasharray="4,3" />
                      <line x1="170" y1="45" x2="260" y2="155" stroke="#f43f5e" strokeWidth="2" strokeDasharray="4,3" />
                      <text x="165" y="38" fill="#e9c46a" fontSize="11" fontWeight="bold">A</text>
                      <text x="100" y="122" fill="#e9c46a" fontSize="11" fontWeight="bold">B</text>
                      <text x="230" y="122" fill="#e9c46a" fontSize="11" fontWeight="bold">C</text>
                      <text x="70" y="158" fill="#f43f5e" fontSize="10" fontWeight="bold">D</text>
                      <text x="265" y="158" fill="#f43f5e" fontSize="10" fontWeight="bold">E</text>
                    </g>
                  )}

                  {proofStep === 2 && (
                    <g>
                      <rect x="40" y="4" width="260" height="18" rx="4" fill="rgba(16, 185, 129, 0.2)" stroke="#10b981" />
                      <text x="50" y="17" fill="#10b981" fontSize="8.5" fontWeight="bold">Justification: Prop. III, Postulate 1 & Prop. IV (SAS)</text>

                      <polygon points="170,45 110,125 230,125" fill="rgba(99, 102, 241, 0.15)" stroke="#6366f1" strokeWidth="2" />
                      <line x1="170" y1="45" x2="80" y2="155" stroke="#f43f5e" strokeWidth="1.5" strokeDasharray="3,3" />
                      <line x1="170" y1="45" x2="260" y2="155" stroke="#f43f5e" strokeWidth="1.5" strokeDasharray="3,3" />
                      <circle cx="95" cy="140" r="4" fill="#10b981" />
                      <circle cx="245" cy="140" r="4" fill="#10b981" />
                      <line x1="95" y1="140" x2="230" y2="125" stroke="#10b981" strokeWidth="2" />
                      <line x1="245" y1="140" x2="110" y2="125" stroke="#10b981" strokeWidth="2" />
                      <text x="165" y="38" fill="#e9c46a" fontSize="11" fontWeight="bold">A</text>
                      <text x="100" y="122" fill="#e9c46a" fontSize="11" fontWeight="bold">B</text>
                      <text x="230" y="122" fill="#e9c46a" fontSize="11" fontWeight="bold">C</text>
                      <text x="70" y="158" fill="#f43f5e" fontSize="10" fontWeight="bold">D</text>
                      <text x="265" y="158" fill="#f43f5e" fontSize="10" fontWeight="bold">E</text>
                      <text x="82" y="142" fill="#10b981" fontSize="10" fontWeight="bold">F</text>
                      <text x="252" y="142" fill="#10b981" fontSize="10" fontWeight="bold">G</text>
                    </g>
                  )}

                  {proofStep === 3 && (
                    <g>
                      <rect x="40" y="4" width="260" height="22" rx="5" fill="rgba(16, 185, 129, 0.9)" />
                      <text x="50" y="19" fill="#ffffff" fontSize="8.5" fontWeight="bold">✓ Common Notion 3 (Subtraction): Base Angles Equal (Q.E.D.)</text>

                      <polygon points="170,45 110,125 230,125" fill="rgba(16, 185, 129, 0.3)" stroke="#10b981" strokeWidth="3" />
                      <path d="M 130 125 A 20 20 0 0 0 122 109" fill="none" stroke="#10b981" strokeWidth="3.5" />
                      <path d="M 210 125 A 20 20 0 0 1 218 109" fill="none" stroke="#10b981" strokeWidth="3.5" />
                      <text x="165" y="38" fill="#10b981" fontSize="11" fontWeight="bold">A</text>
                      <text x="95" y="132" fill="#10b981" fontSize="11" fontWeight="bold">B</text>
                      <text x="235" y="132" fill="#10b981" fontSize="11" fontWeight="bold">C</text>
                    </g>
                  )}
                </svg>
              )}

              {selectedProp === 'Prop32' && (
                <svg className="w-full h-full" viewBox="0 0 340 162">
                  {proofStep === 0 && (
                    <g>
                      <rect x="65" y="4" width="210" height="18" rx="4" fill="rgba(30, 41, 59, 0.9)" stroke="#475569" />
                      <text x="75" y="17" fill="#cbd5e1" fontSize="8.5" fontWeight="bold">Given: Def. 8 (Rectilinear Angles A, B, C)</text>

                      <polygon points="60,130 180,130 120,50" fill="rgba(16, 185, 129, 0.2)" stroke="#10b981" strokeWidth="2.5" />
                      <path d="M 80 130 A 20 20 0 0 0 72 114" fill="none" stroke="#3b82f6" strokeWidth="3" />
                      <path d="M 108 66 A 20 20 0 0 1 132 66" fill="none" stroke="#f43f5e" strokeWidth="3" />
                      <path d="M 160 130 A 20 20 0 0 1 168 114" fill="none" stroke="#e9c46a" strokeWidth="3" />

                      <text x="46" y="142" fill="#3b82f6" fontSize="11" fontWeight="bold">A</text>
                      <text x="182" y="142" fill="#e9c46a" fontSize="11" fontWeight="bold">C</text>
                      <text x="116" y="42" fill="#f43f5e" fontSize="11" fontWeight="bold">B</text>
                    </g>
                  )}

                  {proofStep === 1 && (
                    <g>
                      <rect x="65" y="4" width="210" height="18" rx="4" fill="rgba(244, 63, 94, 0.2)" stroke="#f43f5e" />
                      <text x="75" y="17" fill="#f43f5e" fontSize="8.5" fontWeight="bold">Justification: Postulate 2 (Extension Postulate)</text>

                      <polygon points="60,130 180,130 120,50" fill="rgba(16, 185, 129, 0.2)" stroke="#10b981" strokeWidth="2" />
                      <line x1="180" y1="130" x2="280" y2="130" stroke="#f43f5e" strokeWidth="2.5" strokeDasharray="4,3" />
                      <path d="M 205 130 A 25 25 0 0 0 165 110" fill="none" stroke="#a855f7" strokeWidth="3" />
                      <text x="46" y="142" fill="#3b82f6" fontSize="11" fontWeight="bold">A</text>
                      <text x="175" y="142" fill="#e9c46a" fontSize="11" fontWeight="bold">C</text>
                      <text x="116" y="42" fill="#f43f5e" fontSize="11" fontWeight="bold">B</text>
                      <text x="285" y="135" fill="#f43f5e" fontSize="11" fontWeight="bold">D</text>
                    </g>
                  )}

                  {proofStep === 2 && (
                    <g>
                      <rect x="35" y="4" width="270" height="18" rx="4" fill="rgba(233, 196, 106, 0.2)" stroke="#e9c46a" />
                      <text x="45" y="17" fill="#e9c46a" fontSize="8.5" fontWeight="bold">Justification: Proposition XXXI (Parallel Line) & Proposition XXIX</text>

                      <polygon points="60,130 180,130 120,50" fill="rgba(16, 185, 129, 0.2)" stroke="#10b981" strokeWidth="2" />
                      <line x1="180" y1="130" x2="280" y2="130" stroke="#f43f5e" strokeWidth="2" />
                      <line x1="180" y1="130" x2="240" y2="50" stroke="#e9c46a" strokeWidth="3" />
                      <path d="M 205 130 A 25 25 0 0 0 195 110" fill="none" stroke="#3b82f6" strokeWidth="3" />
                      <path d="M 195 110 A 25 25 0 0 0 165 110" fill="none" stroke="#f43f5e" strokeWidth="3" />

                      <text x="46" y="142" fill="#3b82f6" fontSize="11" fontWeight="bold">A</text>
                      <text x="175" y="142" fill="#e9c46a" fontSize="11" fontWeight="bold">C</text>
                      <text x="116" y="42" fill="#f43f5e" fontSize="11" fontWeight="bold">B</text>
                      <text x="285" y="135" fill="#f43f5e" fontSize="11" fontWeight="bold">D</text>
                      <text x="245" y="45" fill="#e9c46a" fontSize="11" fontWeight="bold">E (CE ∥ AB)</text>
                    </g>
                  )}

                  {proofStep === 3 && (
                    <g>
                      <rect x="40" y="4" width="260" height="22" rx="5" fill="rgba(16, 185, 129, 0.9)" />
                      <text x="50" y="19" fill="#ffffff" fontSize="8.5" fontWeight="bold">✓ Common Notion 2 & Postulate 4: Angle Sum = 180° (Q.E.D.)</text>

                      <polygon points="60,130 180,130 120,50" fill="rgba(16, 185, 129, 0.35)" stroke="#10b981" strokeWidth="3" />
                      <line x1="180" y1="130" x2="280" y2="130" stroke="#10b981" strokeWidth="3" />
                      <path d="M 155 130 A 25 25 0 0 1 205 130" fill="none" stroke="#e9c46a" strokeWidth="4" />

                      <text x="46" y="142" fill="#10b981" fontSize="11" fontWeight="bold">A</text>
                      <text x="175" y="142" fill="#10b981" fontSize="11" fontWeight="bold">C</text>
                      <text x="116" y="42" fill="#10b981" fontSize="11" fontWeight="bold">B</text>
                      <text x="285" y="135" fill="#10b981" fontSize="11" fontWeight="bold">D</text>
                    </g>
                  )}
                </svg>
              )}

              {selectedProp === 'Prop29' && (
                <svg className="w-full h-full" viewBox="0 0 340 162">
                  {proofStep === 0 && (
                    <g>
                      <rect x="55" y="4" width="230" height="18" rx="4" fill="rgba(30, 41, 59, 0.9)" stroke="#475569" />
                      <text x="65" y="17" fill="#cbd5e1" fontSize="8.5" fontWeight="bold">Given: Def. 23 (Parallel Lines) & Postulate 1</text>

                      <line x1="40" y1="50" x2="300" y2="50" stroke="#3b82f6" strokeWidth="3" />
                      <line x1="40" y1="120" x2="300" y2="120" stroke="#3b82f6" strokeWidth="3" />
                      <line x1="90" y1="140" x2="250" y2="30" stroke="#f43f5e" strokeWidth="3" />
                      <circle cx="221" cy="50" r="4" fill="#e9c46a" />
                      <circle cx="119" cy="120" r="4" fill="#e9c46a" />

                      <text x="28" y="53" fill="#3b82f6" fontSize="11" fontWeight="bold">A</text>
                      <text x="305" y="53" fill="#3b82f6" fontSize="11" fontWeight="bold">B</text>
                      <text x="28" y="123" fill="#3b82f6" fontSize="11" fontWeight="bold">C</text>
                      <text x="305" y="123" fill="#3b82f6" fontSize="11" fontWeight="bold">D</text>
                      <text x="255" y="27" fill="#f43f5e" fontSize="11" fontWeight="bold">E</text>
                      <text x="78" y="148" fill="#f43f5e" fontSize="11" fontWeight="bold">F</text>
                      <text x="226" y="44" fill="#e9c46a" fontSize="10" fontWeight="bold">G</text>
                      <text x="105" y="134" fill="#e9c46a" fontSize="10" fontWeight="bold">H</text>
                    </g>
                  )}

                  {proofStep === 1 && (
                    <g>
                      <rect x="55" y="4" width="230" height="18" rx="4" fill="rgba(233, 196, 106, 0.2)" stroke="#e9c46a" />
                      <text x="65" y="17" fill="#e9c46a" fontSize="8.5" fontWeight="bold">Justification: Common Notion 2 & Def. 10 (Right Angles)</text>

                      <line x1="40" y1="50" x2="300" y2="50" stroke="#3b82f6" strokeWidth="2.5" />
                      <line x1="40" y1="120" x2="300" y2="120" stroke="#3b82f6" strokeWidth="2.5" />
                      <line x1="90" y1="140" x2="250" y2="30" stroke="#f43f5e" strokeWidth="3" />
                      <path d="M 196 50 A 25 25 0 0 0 200.4 64.1" fill="none" stroke="#e9c46a" strokeWidth="3.5" />
                      <path d="M 144 120 A 25 25 0 0 0 139.6 105.9" fill="none" stroke="#e9c46a" strokeWidth="3.5" />
                      <circle cx="221" cy="50" r="3.5" fill="#e9c46a" />
                      <circle cx="119" cy="120" r="3.5" fill="#e9c46a" />

                      <text x="28" y="53" fill="#3b82f6" fontSize="11" fontWeight="bold">A</text>
                      <text x="305" y="53" fill="#3b82f6" fontSize="11" fontWeight="bold">B</text>
                      <text x="28" y="123" fill="#3b82f6" fontSize="11" fontWeight="bold">C</text>
                      <text x="305" y="123" fill="#3b82f6" fontSize="11" fontWeight="bold">D</text>
                      <text x="226" y="44" fill="#e9c46a" fontSize="10" fontWeight="bold">G</text>
                      <text x="105" y="134" fill="#e9c46a" fontSize="10" fontWeight="bold">H</text>
                    </g>
                  )}

                  {proofStep === 2 && (
                    <g>
                      <rect x="40" y="4" width="260" height="22" rx="4" fill="rgba(244, 63, 94, 0.3)" stroke="#f43f5e" />
                      <text x="50" y="18" fill="#ffffff" fontSize="8.5" fontWeight="bold">Contradiction: Postulate 5 (The Parallel Postulate)</text>

                      <line x1="40" y1="50" x2="300" y2="50" stroke="#3b82f6" strokeWidth="2" />
                      <line x1="40" y1="120" x2="300" y2="140" stroke="#f43f5e" strokeWidth="2" strokeDasharray="4,3" />
                      <line x1="90" y1="140" x2="250" y2="30" stroke="#f43f5e" strokeWidth="2" />
                      <text x="28" y="53" fill="#3b82f6" fontSize="11" fontWeight="bold">A</text>
                      <text x="305" y="53" fill="#3b82f6" fontSize="11" fontWeight="bold">B</text>
                      <text x="28" y="123" fill="#3b82f6" fontSize="11" fontWeight="bold">C</text>
                      <text x="305" y="143" fill="#f43f5e" fontSize="11" fontWeight="bold">D'</text>
                    </g>
                  )}

                  {proofStep === 3 && (
                    <g>
                      <rect x="45" y="4" width="250" height="22" rx="5" fill="rgba(16, 185, 129, 0.9)" />
                      <text x="55" y="19" fill="#ffffff" fontSize="8.5" fontWeight="bold">✓ Common Notion 1 & Def. 10: Transversal Angles Proven (Q.E.D.)</text>

                      <line x1="40" y1="50" x2="300" y2="50" stroke="#10b981" strokeWidth="3.5" />
                      <line x1="40" y1="120" x2="300" y2="120" stroke="#10b981" strokeWidth="3.5" />
                      <line x1="90" y1="140" x2="250" y2="30" stroke="#10b981" strokeWidth="3.5" />
                      <path d="M 196 50 A 25 25 0 0 0 200.4 64.1" fill="none" stroke="#10b981" strokeWidth="3" />
                      <path d="M 144 120 A 25 25 0 0 0 139.6 105.9" fill="none" stroke="#10b981" strokeWidth="3" />
                      <circle cx="221" cy="50" r="3.5" fill="#10b981" />
                      <circle cx="119" cy="120" r="3.5" fill="#10b981" />
                      <text x="28" y="53" fill="#10b981" fontSize="11" fontWeight="bold">A</text>
                      <text x="305" y="53" fill="#10b981" fontSize="11" fontWeight="bold">B</text>
                      <text x="28" y="123" fill="#10b981" fontSize="11" fontWeight="bold">C</text>
                      <text x="305" y="123" fill="#10b981" fontSize="11" fontWeight="bold">D</text>
                      <text x="226" y="44" fill="#10b981" fontSize="10" fontWeight="bold">G</text>
                      <text x="105" y="134" fill="#10b981" fontSize="10" fontWeight="bold">H</text>
                    </g>
                  )}
                </svg>
              )}
            </div>
          </div>
        </div>
      );
    } else if (activeSubtask === 3) {
      // Subtask 3: Book III: Circles and Angles
      return (
        <div className="w-full h-full flex flex-col p-4 overflow-y-auto custom-scrollbar bg-gradient-to-br from-slate-950 via-[#0b1021] to-[#07090e]">
          <div className="pb-2 mb-3 border-b border-indigo-900/40 flex items-center justify-between shrink-0">
            <div>
              <span className="text-[10px] font-mono tracking-widest text-indigo-400 uppercase">
                EUCLID'S ELEMENTS • BOOK III CIRCLES & ANGLES
              </span>
              <h2 className="text-base font-serif font-bold text-white flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-amber-400" />
                <span>Task 3: Oliver Byrne Book III Proofs</span>
              </h2>
            </div>
          </div>

          {/* Category Tabs for Task 3 */}
          <div className="flex flex-wrap gap-1.5 mb-2.5 bg-slate-900/80 p-1 rounded-xl border border-slate-800 shrink-0">
            {[
              { id: 'chords', label: '1. Chords & Center (Prop III, XIV)' },
              { id: 'tangents', label: '2. Tangents & Contact (Prop XI, XII, XVI)' },
              { id: 'angles', label: '3. Angles in Circles (Prop XX, XXI, XXII, XXXI)' },
              { id: 'power_of_point', label: '4. Power of a Point (Prop XXXII, XXXV, XXXVI)' }
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setTask3Category(cat.id);
                  if (cat.id === 'chords') setTask3SelectedProp('Prop3');
                  if (cat.id === 'tangents') setTask3SelectedProp('Prop11_12');
                  if (cat.id === 'angles') setTask3SelectedProp('Prop20');
                  if (cat.id === 'power_of_point') setTask3SelectedProp('Prop32');
                  setTask3ProofStep(0);
                }}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition cursor-pointer ${
                  task3Category === cat.id
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-[0_0_12px_rgba(245,158,11,0.4)]'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Proposition Pills inside Task 3 Category */}
          <div className="flex flex-wrap gap-1.5 mb-3 shrink-0">
            {Object.keys(task3PropsMap)
              .filter((key) => task3PropsMap[key].category === task3Category)
              .map((key) => (
                <button
                  key={key}
                  onClick={() => {
                    setTask3SelectedProp(key);
                    if (key === 'Prop3') setTask3CalcMode('chords');
                    if (key === 'Prop14') setTask3CalcMode('equal_chords');
                    if (key === 'Prop11_12') setTask3CalcMode('touching_circles');
                    if (key === 'Prop16') setTask3CalcMode('tangent_line');
                    if (key === 'Prop20') setTask3CalcMode('central_angle');
                    if (key === 'Prop21') setTask3CalcMode('same_arc');
                    if (key === 'Prop22') setTask3CalcMode('cyclic_quad');
                    if (key === 'Prop31') setTask3CalcMode('thales');
                    if (key === 'Prop32') setTask3CalcMode('alternate_seg');
                    if (key === 'Prop35_36') setTask3CalcMode('power_point');
                    setTask3ProofStep(0);
                  }}
                  className={`px-3 py-1 rounded-xl text-[11px] font-bold transition cursor-pointer shrink-0 border ${
                    task3SelectedProp === key
                      ? 'bg-indigo-600 border-indigo-400 text-white shadow-[0_0_12px_rgba(99,102,241,0.5)]'
                      : 'bg-slate-900 border-slate-750 text-slate-200 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  {task3PropsMap[key].title}
                </button>
              ))}
          </div>

          {/* Active Proposition Card */}
          <div className="bg-slate-900/90 border border-indigo-500/30 rounded-2xl p-3 shadow-2xl flex flex-col justify-between flex-1 overflow-y-auto custom-scrollbar">
            <div>
              <div className="flex items-center justify-between text-[10.5px] font-mono text-amber-400 uppercase tracking-wider mb-0.5">
                <span>{activePropObj.title.toUpperCase()}</span>
                <span className="text-[10.5px] font-mono text-emerald-400 font-bold">Q.E.D.</span>
              </div>
              <h3 className="text-xs font-serif font-bold text-white mb-0.5">{activePropObj.title}</h3>
              <p className="text-[9.5px] text-amber-200 font-serif italic mb-1 leading-tight">"{activePropObj.text}"</p>
              
              <div className="bg-slate-950/80 px-2.5 py-0.5 rounded-lg border border-slate-800 text-[10px] font-mono text-indigo-300 font-semibold mb-1.5">
                {activePropObj.formula}
              </div>

              <div className="flex justify-between items-center mb-1">
                <span className="text-[10px] font-mono text-indigo-300">Proof Step {task3ProofStep + 1} of {activePropObj.steps.length}</span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      const nextStep = (task3ProofStep - 1 + activePropObj.steps.length) % activePropObj.steps.length;
                      setTask3ProofStep(nextStep);
                    }}
                    className="px-2.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] font-bold transition cursor-pointer flex items-center gap-0.5 border border-slate-700"
                  >
                    <ChevronLeft className="w-3 h-3" />
                    <span>Prev Step</span>
                  </button>
                  <button
                    onClick={() => {
                      const nextStep = (task3ProofStep + 1) % activePropObj.steps.length;
                      setTask3ProofStep(nextStep);
                    }}
                    className="px-2.5 py-0.5 rounded bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-bold transition cursor-pointer flex items-center gap-0.5"
                  >
                    <span>Advance Step</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>

              <div className="bg-slate-950 px-2.5 py-1 rounded-xl border border-slate-800 text-[10px] text-slate-200 leading-tight mb-1.5">
                {activePropObj.steps[task3ProofStep]}
              </div>
            </div>

            {/* Oliver Byrne Color-Coded Geometric Algebra SVG for Book III */}
            <div className="h-[155px] shrink-0 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-center p-1 relative overflow-hidden">
              {/* Proposition III.3 */}
              {task3SelectedProp === 'Prop3' && (
                <svg className="w-full h-full" viewBox="0 0 340 145">
                  {task3ProofStep === 0 && (
                    <g>
                      <rect x="55" y="4" width="230" height="18" rx="4" fill="rgba(30, 41, 59, 0.9)" stroke="#475569" />
                      <text x="65" y="17" fill="#cbd5e1" fontSize="8.5" fontWeight="bold">Given: Circle center O, chord AB, midpoint M</text>
                      
                      <circle cx="170" cy="75" r="55" fill="none" stroke="#3b82f6" strokeWidth="2" />
                      <circle cx="170" cy="75" r="3.5" fill="#e9c46a" />
                      <line x1="120" y1="105" x2="220" y2="105" stroke="#f43f5e" strokeWidth="2.5" />
                      <line x1="170" y1="75" x2="170" y2="105" stroke="#10b981" strokeWidth="2.5" />
                      <circle cx="170" cy="105" r="3.5" fill="#10b981" />

                      <text x="162" y="70" fill="#e9c46a" fontSize="10" fontWeight="bold">O</text>
                      <text x="110" y="110" fill="#f43f5e" fontSize="10" fontWeight="bold">A</text>
                      <text x="225" y="110" fill="#f43f5e" fontSize="10" fontWeight="bold">B</text>
                      <text x="165" y="118" fill="#10b981" fontSize="10" fontWeight="bold">M</text>
                    </g>
                  )}
                  {task3ProofStep === 1 && (
                    <g>
                      <rect x="40" y="4" width="260" height="18" rx="4" fill="rgba(168, 85, 247, 0.2)" stroke="#a855f7" />
                      <text x="50" y="17" fill="#a855f7" fontSize="8.5" fontWeight="bold">Construction: Draw Radii OA & OB (Postulate 1 & Def. 15: OA = OB = R)</text>

                      <circle cx="170" cy="75" r="55" fill="none" stroke="#3b82f6" strokeWidth="2" />
                      <circle cx="170" cy="75" r="3.5" fill="#e9c46a" />
                      <line x1="120" y1="105" x2="220" y2="105" stroke="#f43f5e" strokeWidth="2.5" />
                      <line x1="170" y1="75" x2="170" y2="105" stroke="#10b981" strokeWidth="2.5" />
                      <line x1="170" y1="75" x2="120" y2="105" stroke="#a855f7" strokeWidth="2" strokeDasharray="4,3" />
                      <line x1="170" y1="75" x2="220" y2="105" stroke="#a855f7" strokeWidth="2" strokeDasharray="4,3" />

                      <text x="162" y="70" fill="#e9c46a" fontSize="10" fontWeight="bold">O</text>
                      <text x="110" y="110" fill="#f43f5e" fontSize="10" fontWeight="bold">A</text>
                      <text x="225" y="110" fill="#f43f5e" fontSize="10" fontWeight="bold">B</text>
                      <text x="165" y="118" fill="#10b981" fontSize="10" fontWeight="bold">M</text>
                      <text x="135" y="85" fill="#a855f7" fontSize="9" fontWeight="bold">R</text>
                      <text x="200" y="85" fill="#a855f7" fontSize="9" fontWeight="bold">R</text>
                    </g>
                  )}
                  {task3ProofStep === 2 && (
                    <g>
                      <rect x="45" y="4" width="250" height="18" rx="4" fill="rgba(59, 130, 246, 0.2)" stroke="#3b82f6" />
                      <text x="55" y="17" fill="#3b82f6" fontSize="8.5" fontWeight="bold">Justification: SSS Congruence △OAM ≅ △OBM (Prop. I.8)</text>

                      <circle cx="170" cy="75" r="55" fill="none" stroke="#3b82f6" strokeWidth="2" />
                      <polygon points="170,75 120,105 170,105" fill="rgba(59, 130, 246, 0.25)" stroke="#3b82f6" strokeWidth="1.5" />
                      <polygon points="170,75 220,105 170,105" fill="rgba(16, 185, 129, 0.25)" stroke="#10b981" strokeWidth="1.5" />
                      <circle cx="170" cy="75" r="3.5" fill="#e9c46a" />

                      <text x="162" y="70" fill="#e9c46a" fontSize="10" fontWeight="bold">O</text>
                      <text x="110" y="110" fill="#f43f5e" fontSize="10" fontWeight="bold">A</text>
                      <text x="225" y="110" fill="#f43f5e" fontSize="10" fontWeight="bold">B</text>
                      <text x="165" y="118" fill="#10b981" fontSize="10" fontWeight="bold">M</text>
                      <text x="135" y="98" fill="#3b82f6" fontSize="8.5" fontWeight="bold">△OAM</text>
                      <text x="180" y="98" fill="#10b981" fontSize="8.5" fontWeight="bold">△OBM</text>
                    </g>
                  )}
                  {task3ProofStep === 3 && (
                    <g>
                      <rect x="35" y="4" width="270" height="22" rx="5" fill="rgba(16, 185, 129, 0.9)" />
                      <text x="45" y="19" fill="#ffffff" fontSize="8.5" fontWeight="bold">✓ ∠OMA = ∠OMB = 90° ⟹ OM ⊥ AB (Perpendicular Bisector) (Q.E.D.)</text>

                      <circle cx="170" cy="75" r="55" fill="none" stroke="#3b82f6" strokeWidth="2" />
                      <circle cx="170" cy="75" r="3.5" fill="#e9c46a" />
                      <line x1="120" y1="105" x2="220" y2="105" stroke="#f43f5e" strokeWidth="2.5" />
                      <line x1="170" y1="75" x2="170" y2="105" stroke="#10b981" strokeWidth="3" />
                      
                      <path d="M 170 97 L 177 97 L 177 105" fill="none" stroke="#e9c46a" strokeWidth="2" />

                      <text x="162" y="70" fill="#e9c46a" fontSize="10" fontWeight="bold">O</text>
                      <text x="110" y="110" fill="#f43f5e" fontSize="10" fontWeight="bold">A</text>
                      <text x="225" y="110" fill="#f43f5e" fontSize="10" fontWeight="bold">B</text>
                      <text x="165" y="118" fill="#10b981" fontSize="10" fontWeight="bold">M</text>
                      <text x="125" y="42" fill="#10b981" fontSize="9" fontWeight="bold">OM ⊥ AB & AM = MB</text>
                    </g>
                  )}
                </svg>
              )}

              {/* Proposition III.14 */}
              {task3SelectedProp === 'Prop14' && (
                <svg className="w-full h-full" viewBox="0 0 340 145">
                  {task3ProofStep === 0 && (
                    <g>
                      <rect x="40" y="4" width="260" height="18" rx="4" fill="rgba(30, 41, 59, 0.9)" stroke="#475569" />
                      <text x="50" y="17" fill="#cbd5e1" fontSize="8.5" fontWeight="bold">Given: Circle center O, chords AB & CD, perpendiculars OM ⊥ AB, ON ⊥ CD</text>

                      <circle cx="170" cy="75" r="55" fill="none" stroke="#3b82f6" strokeWidth="2" />
                      <circle cx="170" cy="75" r="3.5" fill="#e9c46a" />
                      <line x1="125" y1="105" x2="215" y2="105" stroke="#f43f5e" strokeWidth="2.5" />
                      <line x1="125" y1="45" x2="215" y2="45" stroke="#10b981" strokeWidth="2.5" />
                      <line x1="170" y1="75" x2="170" y2="105" stroke="#e9c46a" strokeWidth="2" />
                      <line x1="170" y1="75" x2="170" y2="45" stroke="#e9c46a" strokeWidth="2" />
                      <circle cx="170" cy="105" r="3" fill="#e9c46a" />
                      <circle cx="170" cy="45" r="3" fill="#e9c46a" />

                      <text x="115" y="110" fill="#f43f5e" fontSize="10" fontWeight="bold">A</text>
                      <text x="220" y="110" fill="#f43f5e" fontSize="10" fontWeight="bold">B</text>
                      <text x="115" y="48" fill="#10b981" fontSize="10" fontWeight="bold">C</text>
                      <text x="220" y="48" fill="#10b981" fontSize="10" fontWeight="bold">D</text>
                      <text x="174" y="78" fill="#e9c46a" fontSize="10" fontWeight="bold">O</text>
                      <text x="165" y="118" fill="#e9c46a" fontSize="10" fontWeight="bold">M</text>
                      <text x="165" y="40" fill="#e9c46a" fontSize="10" fontWeight="bold">N</text>
                    </g>
                  )}
                  {task3ProofStep === 1 && (
                    <g>
                      <rect x="35" y="4" width="270" height="18" rx="4" fill="rgba(99, 102, 241, 0.2)" stroke="#6366f1" />
                      <text x="45" y="17" fill="#6366f1" fontSize="8.5" fontWeight="bold">Prop. III.3: AM = AB/2 & CN = CD/2; Draw Radii OA = OC = R</text>

                      <circle cx="170" cy="75" r="55" fill="none" stroke="#3b82f6" strokeWidth="2" />
                      <circle cx="170" cy="75" r="3.5" fill="#e9c46a" />
                      <line x1="125" y1="105" x2="215" y2="105" stroke="#f43f5e" strokeWidth="2.5" />
                      <line x1="125" y1="45" x2="215" y2="45" stroke="#10b981" strokeWidth="2.5" />
                      <line x1="170" y1="75" x2="125" y2="105" stroke="#a855f7" strokeWidth="2" strokeDasharray="4,3" />
                      <line x1="170" y1="75" x2="125" y2="45" stroke="#a855f7" strokeWidth="2" strokeDasharray="4,3" />
                      <line x1="170" y1="75" x2="170" y2="105" stroke="#e9c46a" strokeWidth="2" />
                      <line x1="170" y1="75" x2="170" y2="45" stroke="#e9c46a" strokeWidth="2" />

                      <text x="115" y="110" fill="#f43f5e" fontSize="10" fontWeight="bold">A</text>
                      <text x="220" y="110" fill="#f43f5e" fontSize="10" fontWeight="bold">B</text>
                      <text x="115" y="48" fill="#10b981" fontSize="10" fontWeight="bold">C</text>
                      <text x="220" y="48" fill="#10b981" fontSize="10" fontWeight="bold">D</text>
                      <text x="174" y="78" fill="#e9c46a" fontSize="10" fontWeight="bold">O</text>
                      <text x="165" y="118" fill="#e9c46a" fontSize="10" fontWeight="bold">M</text>
                      <text x="165" y="40" fill="#e9c46a" fontSize="10" fontWeight="bold">N</text>
                      <text x="140" y="95" fill="#a855f7" fontSize="9">OA=R</text>
                      <text x="140" y="60" fill="#a855f7" fontSize="9">OC=R</text>
                    </g>
                  )}
                  {task3ProofStep === 2 && (
                    <g>
                      <rect x="40" y="4" width="260" height="18" rx="4" fill="rgba(233, 196, 106, 0.2)" stroke="#e9c46a" />
                      <text x="50" y="17" fill="#e9c46a" fontSize="8.5" fontWeight="bold">Prop. I.47 (Pythagoras): OM² + (AB/2)² = ON² + (CD/2)²</text>

                      <circle cx="170" cy="75" r="55" fill="none" stroke="#3b82f6" strokeWidth="2" />
                      <polygon points="170,75 125,105 170,105" fill="rgba(244, 63, 94, 0.2)" stroke="#f43f5e" strokeWidth="1.5" />
                      <polygon points="170,75 125,45 170,45" fill="rgba(16, 185, 129, 0.2)" stroke="#10b981" strokeWidth="1.5" />

                      <text x="115" y="110" fill="#f43f5e" fontSize="10" fontWeight="bold">A</text>
                      <text x="115" y="48" fill="#10b981" fontSize="10" fontWeight="bold">C</text>
                      <text x="174" y="78" fill="#e9c46a" fontSize="10" fontWeight="bold">O</text>
                      <text x="165" y="118" fill="#e9c46a" fontSize="10" fontWeight="bold">M</text>
                      <text x="165" y="40" fill="#e9c46a" fontSize="10" fontWeight="bold">N</text>
                    </g>
                  )}
                  {task3ProofStep === 3 && (
                    <g>
                      <rect x="35" y="4" width="270" height="22" rx="5" fill="rgba(16, 185, 129, 0.9)" />
                      <text x="45" y="19" fill="#ffffff" fontSize="8.5" fontWeight="bold">✓ Equal Chords AB = CD ⟺ Distance OM = ON (Q.E.D.)</text>

                      <circle cx="170" cy="75" r="55" fill="none" stroke="#3b82f6" strokeWidth="2" />
                      <circle cx="170" cy="75" r="3.5" fill="#e9c46a" />
                      <line x1="125" y1="105" x2="215" y2="105" stroke="#f43f5e" strokeWidth="3" />
                      <line x1="125" y1="45" x2="215" y2="45" stroke="#10b981" strokeWidth="3" />
                      <line x1="170" y1="75" x2="170" y2="105" stroke="#e9c46a" strokeWidth="3" />
                      <line x1="170" y1="75" x2="170" y2="45" stroke="#e9c46a" strokeWidth="3" />

                      <text x="115" y="110" fill="#f43f5e" fontSize="10" fontWeight="bold">A</text>
                      <text x="220" y="110" fill="#f43f5e" fontSize="10" fontWeight="bold">B</text>
                      <text x="115" y="48" fill="#10b981" fontSize="10" fontWeight="bold">C</text>
                      <text x="220" y="48" fill="#10b981" fontSize="10" fontWeight="bold">D</text>
                      <text x="174" y="78" fill="#e9c46a" fontSize="10" fontWeight="bold">O</text>
                      <text x="165" y="118" fill="#e9c46a" fontSize="10" fontWeight="bold">M</text>
                      <text x="165" y="40" fill="#e9c46a" fontSize="10" fontWeight="bold">N</text>
                      <text x="130" y="25" fill="#e9c46a" fontSize="9" fontWeight="bold">AB = CD ⟺ OM = ON</text>
                    </g>
                  )}
                </svg>
              )}

              {/* Propositions III.11 & 12 */}
              {task3SelectedProp === 'Prop11_12' && (
                <svg className="w-full h-full" viewBox="0 0 340 145">
                  {task3ProofStep === 0 && (
                    <g>
                      <rect x="50" y="4" width="240" height="18" rx="4" fill="rgba(30, 41, 59, 0.9)" stroke="#475569" />
                      <text x="60" y="17" fill="#cbd5e1" fontSize="8.5" fontWeight="bold">Given: Two circles with centers O₁ & O₂ touching at P</text>

                      <circle cx="120" cy="75" r="45" fill="none" stroke="#3b82f6" strokeWidth="2" />
                      <circle cx="205" cy="75" r="40" fill="none" stroke="#10b981" strokeWidth="2" />
                      <circle cx="120" cy="75" r="3.5" fill="#3b82f6" />
                      <circle cx="205" cy="75" r="3.5" fill="#10b981" />
                      <circle cx="165" cy="75" r="4.5" fill="#e9c46a" />

                      <text x="114" y="90" fill="#3b82f6" fontSize="10" fontWeight="bold">O₁</text>
                      <text x="199" y="90" fill="#10b981" fontSize="10" fontWeight="bold">O₂</text>
                      <text x="160" y="65" fill="#e9c46a" fontSize="11" fontWeight="bold">P</text>
                    </g>
                  )}
                  {task3ProofStep === 1 && (
                    <g>
                      <rect x="30" y="4" width="280" height="18" rx="4" fill="rgba(244, 63, 94, 0.2)" stroke="#f43f5e" />
                      <text x="40" y="17" fill="#f43f5e" fontSize="8.5" fontWeight="bold">Contradiction: Suppose line O₁O₂ misses P, forming △O₁PO₂</text>

                      <circle cx="120" cy="75" r="45" fill="none" stroke="#3b82f6" strokeWidth="2" />
                      <circle cx="205" cy="75" r="40" fill="none" stroke="#10b981" strokeWidth="2" />
                      <line x1="120" y1="75" x2="205" y2="75" stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="3,3" />
                      <line x1="120" y1="75" x2="165" y2="45" stroke="#f43f5e" strokeWidth="2" />
                      <line x1="205" y1="75" x2="165" y2="45" stroke="#f43f5e" strokeWidth="2" />
                      <circle cx="165" cy="45" r="4.5" fill="#e9c46a" />

                      <text x="114" y="90" fill="#3b82f6" fontSize="10" fontWeight="bold">O₁</text>
                      <text x="199" y="90" fill="#10b981" fontSize="10" fontWeight="bold">O₂</text>
                      <text x="160" y="38" fill="#e9c46a" fontSize="11" fontWeight="bold">P (Offset)</text>
                    </g>
                  )}
                  {task3ProofStep === 2 && (
                    <g>
                      <rect x="35" y="4" width="270" height="18" rx="4" fill="rgba(233, 196, 106, 0.2)" stroke="#e9c46a" />
                      <text x="45" y="17" fill="#e9c46a" fontSize="8.5" fontWeight="bold">Prop. I.20 (△ Inequality): O₁P + O₂P &gt; O₁O₂</text>

                      <circle cx="120" cy="75" r="45" fill="none" stroke="#3b82f6" strokeWidth="2" />
                      <circle cx="205" cy="75" r="40" fill="none" stroke="#10b981" strokeWidth="2" />
                      <polygon points="120,75 205,75 165,45" fill="rgba(233, 196, 106, 0.2)" stroke="#e9c46a" strokeWidth="2" />

                      <text x="135" y="55" fill="#3b82f6" fontSize="9">r₁</text>
                      <text x="185" y="55" fill="#10b981" fontSize="9">r₂</text>
                      <text x="155" y="90" fill="#e9c46a" fontSize="9.5" fontWeight="bold">r₁ + r₂ &gt; O₁O₂</text>
                    </g>
                  )}
                  {task3ProofStep === 3 && (
                    <g>
                      <rect x="25" y="4" width="290" height="22" rx="5" fill="rgba(16, 185, 129, 0.9)" />
                      <text x="35" y="19" fill="#ffffff" fontSize="8.5" fontWeight="bold">✓ Contradiction: O₁O₂ = r₁ + r₂ ⟹ Line O₁O₂ MUST pass through P (Q.E.D.)</text>

                      <circle cx="120" cy="75" r="45" fill="none" stroke="#3b82f6" strokeWidth="2" />
                      <circle cx="205" cy="75" r="40" fill="none" stroke="#10b981" strokeWidth="2" />
                      <line x1="120" y1="75" x2="205" y2="75" stroke="#f43f5e" strokeWidth="3" />
                      <circle cx="120" cy="75" r="4" fill="#3b82f6" />
                      <circle cx="205" cy="75" r="4" fill="#10b981" />
                      <circle cx="165" cy="75" r="5" fill="#e9c46a" />

                      <text x="114" y="92" fill="#3b82f6" fontSize="10" fontWeight="bold">O₁</text>
                      <text x="199" y="92" fill="#10b981" fontSize="10" fontWeight="bold">O₂</text>
                      <text x="160" y="65" fill="#e9c46a" fontSize="11" fontWeight="bold">P (Contact)</text>
                    </g>
                  )}
                </svg>
              )}

              {/* Proposition III.16 */}
              {task3SelectedProp === 'Prop16' && (
                <svg className="w-full h-full" viewBox="0 0 340 145">
                  {task3ProofStep === 0 && (
                    <g>
                      <rect x="50" y="4" width="240" height="18" rx="4" fill="rgba(30, 41, 59, 0.9)" stroke="#475569" />
                      <text x="60" y="17" fill="#cbd5e1" fontSize="8.5" fontWeight="bold">Given: Circle center O, radius OP, line T ⊥ OP at P</text>

                      <circle cx="170" cy="75" r="50" fill="none" stroke="#3b82f6" strokeWidth="2" />
                      <line x1="170" y1="75" x2="220" y2="75" stroke="#e9c46a" strokeWidth="2.5" />
                      <line x1="220" y1="20" x2="220" y2="130" stroke="#f43f5e" strokeWidth="2.5" />
                      <circle cx="170" cy="75" r="3.5" fill="#e9c46a" />
                      <circle cx="220" cy="75" r="4" fill="#f43f5e" />

                      <path d="M 220 67 L 212 67 L 212 75" fill="none" stroke="#e9c46a" strokeWidth="1.5" />

                      <text x="160" y="78" fill="#e9c46a" fontSize="10" fontWeight="bold">O</text>
                      <text x="225" y="78" fill="#f43f5e" fontSize="10" fontWeight="bold">P</text>
                      <text x="225" y="25" fill="#f43f5e" fontSize="10" fontWeight="bold">T</text>
                    </g>
                  )}
                  {task3ProofStep === 1 && (
                    <g>
                      <rect x="40" y="4" width="260" height="18" rx="4" fill="rgba(99, 102, 241, 0.2)" stroke="#6366f1" />
                      <text x="50" y="17" fill="#6366f1" fontSize="8.5" fontWeight="bold">Construction: Take point Q on T, join OQ forming right △OPQ</text>

                      <circle cx="170" cy="75" r="50" fill="none" stroke="#3b82f6" strokeWidth="2" />
                      <polygon points="170,75 220,75 220,30" fill="rgba(16, 185, 129, 0.2)" stroke="#10b981" strokeWidth="1.5" />
                      <line x1="170" y1="75" x2="220" y2="30" stroke="#10b981" strokeWidth="2.5" />
                      <circle cx="220" cy="30" r="4" fill="#10b981" />

                      <text x="160" y="78" fill="#e9c46a" fontSize="10" fontWeight="bold">O</text>
                      <text x="225" y="78" fill="#f43f5e" fontSize="10" fontWeight="bold">P</text>
                      <text x="225" y="32" fill="#10b981" fontSize="10" fontWeight="bold">Q</text>
                    </g>
                  )}
                  {task3ProofStep === 2 && (
                    <g>
                      <rect x="35" y="4" width="270" height="18" rx="4" fill="rgba(233, 196, 106, 0.2)" stroke="#e9c46a" />
                      <text x="45" y="17" fill="#e9c46a" fontSize="8.5" fontWeight="bold">Prop. I.19: Hypotenuse OQ &gt; Radius OP = R ⟹ Q is outside circle</text>

                      <circle cx="170" cy="75" r="50" fill="none" stroke="#3b82f6" strokeWidth="2" />
                      <line x1="170" y1="75" x2="220" y2="75" stroke="#e9c46a" strokeWidth="2" />
                      <line x1="170" y1="75" x2="220" y2="30" stroke="#10b981" strokeWidth="3" />
                      <circle cx="220" cy="30" r="4" fill="#10b981" />

                      <text x="180" y="45" fill="#10b981" fontSize="9.5" fontWeight="bold">OQ &gt; R</text>
                    </g>
                  )}
                  {task3ProofStep === 3 && (
                    <g>
                      <rect x="30" y="4" width="280" height="22" rx="5" fill="rgba(16, 185, 129, 0.9)" />
                      <text x="40" y="19" fill="#ffffff" fontSize="8.5" fontWeight="bold">✓ Line T meets circle at ONLY point P ⟹ Tangent T ⊥ Radius OP (Q.E.D.)</text>

                      <circle cx="170" cy="75" r="50" fill="none" stroke="#3b82f6" strokeWidth="2" />
                      <line x1="170" y1="75" x2="220" y2="75" stroke="#e9c46a" strokeWidth="3" />
                      <line x1="220" y1="15" x2="220" y2="135" stroke="#f43f5e" strokeWidth="3.5" />
                      <circle cx="220" cy="75" r="5" fill="#f43f5e" />

                      <text x="160" y="78" fill="#e9c46a" fontSize="10" fontWeight="bold">O</text>
                      <text x="228" y="78" fill="#f43f5e" fontSize="10" fontWeight="bold">P (Tangency)</text>
                    </g>
                  )}
                </svg>
              )}

              {/* Proposition III.20 */}
              {task3SelectedProp === 'Prop20' && (
                <svg className="w-full h-full" viewBox="0 0 340 145">
                  {task3ProofStep === 0 && (
                    <g>
                      <rect x="40" y="4" width="260" height="18" rx="4" fill="rgba(30, 41, 59, 0.9)" stroke="#475569" />
                      <text x="50" y="17" fill="#cbd5e1" fontSize="8.5" fontWeight="bold">Given: Central ∠AOB & Inscribed ∠ACB on Arc AB; Draw diameter COE</text>

                      <circle cx="170" cy="75" r="55" fill="none" stroke="#3b82f6" strokeWidth="2" />
                      <circle cx="170" cy="75" r="3.5" fill="#e9c46a" />
                      <line x1="170" y1="75" x2="120" y2="105" stroke="#f43f5e" strokeWidth="2" />
                      <line x1="170" y1="75" x2="220" y2="105" stroke="#f43f5e" strokeWidth="2" />
                      <line x1="170" y1="20" x2="120" y2="105" stroke="#10b981" strokeWidth="2" />
                      <line x1="170" y1="20" x2="220" y2="105" stroke="#10b981" strokeWidth="2" />
                      <line x1="170" y1="20" x2="170" y2="130" stroke="#a855f7" strokeWidth="1.5" strokeDasharray="3,3" />

                      <text x="166" y="15" fill="#10b981" fontSize="11" fontWeight="bold">C</text>
                      <text x="110" y="115" fill="#f43f5e" fontSize="11" fontWeight="bold">A</text>
                      <text x="225" y="115" fill="#f43f5e" fontSize="11" fontWeight="bold">B</text>
                      <text x="175" y="80" fill="#e9c46a" fontSize="11" fontWeight="bold">O</text>
                      <text x="165" y="140" fill="#a855f7" fontSize="10">E</text>
                    </g>
                  )}
                  {task3ProofStep === 1 && (
                    <g>
                      <rect x="35" y="4" width="270" height="18" rx="4" fill="rgba(99, 102, 241, 0.2)" stroke="#6366f1" />
                      <text x="45" y="17" fill="#6366f1" fontSize="8.5" fontWeight="bold">Isosceles △AOC (Prop. I.5): Exterior ∠AOE = 2 × ∠OCA (Prop. I.32)</text>

                      <circle cx="170" cy="75" r="55" fill="none" stroke="#3b82f6" strokeWidth="2" />
                      <line x1="170" y1="20" x2="170" y2="130" stroke="#a855f7" strokeWidth="1.5" strokeDasharray="3,3" />
                      <polygon points="170,75 170,20 120,105" fill="rgba(244, 63, 94, 0.25)" stroke="#f43f5e" strokeWidth="2" />
                      <circle cx="170" cy="75" r="3.5" fill="#e9c46a" />

                      <text x="125" y="55" fill="#f43f5e" fontSize="9.5" fontWeight="bold">Exterior ∠AOE = 2∠OCA</text>
                      <text x="166" y="15" fill="#10b981" fontSize="11" fontWeight="bold">C</text>
                      <text x="110" y="115" fill="#f43f5e" fontSize="11" fontWeight="bold">A</text>
                      <text x="225" y="115" fill="#f43f5e" fontSize="11" fontWeight="bold">B</text>
                      <text x="175" y="80" fill="#e9c46a" fontSize="11" fontWeight="bold">O</text>
                      <text x="165" y="140" fill="#a855f7" fontSize="10">E</text>
                    </g>
                  )}
                  {task3ProofStep === 2 && (
                    <g>
                      <rect x="35" y="4" width="270" height="18" rx="4" fill="rgba(16, 185, 129, 0.2)" stroke="#10b981" />
                      <text x="45" y="17" fill="#10b981" fontSize="8.5" fontWeight="bold">Isosceles △BOC (Prop. I.5): Exterior ∠BOE = 2 × ∠OCB (Prop. I.32)</text>

                      <circle cx="170" cy="75" r="55" fill="none" stroke="#3b82f6" strokeWidth="2" />
                      <line x1="170" y1="20" x2="170" y2="130" stroke="#a855f7" strokeWidth="1.5" strokeDasharray="3,3" />
                      <polygon points="170,75 170,20 220,105" fill="rgba(16, 185, 129, 0.25)" stroke="#10b981" strokeWidth="2" />
                      <circle cx="170" cy="75" r="3.5" fill="#e9c46a" />

                      <text x="180" y="55" fill="#10b981" fontSize="9.5" fontWeight="bold">Exterior ∠BOE = 2∠OCB</text>
                      <text x="166" y="15" fill="#10b981" fontSize="11" fontWeight="bold">C</text>
                      <text x="110" y="115" fill="#f43f5e" fontSize="11" fontWeight="bold">A</text>
                      <text x="225" y="115" fill="#f43f5e" fontSize="11" fontWeight="bold">B</text>
                      <text x="175" y="80" fill="#e9c46a" fontSize="11" fontWeight="bold">O</text>
                      <text x="165" y="140" fill="#a855f7" fontSize="10">E</text>
                    </g>
                  )}
                  {task3ProofStep === 3 && (
                    <g>
                      <rect x="25" y="4" width="290" height="22" rx="5" fill="rgba(16, 185, 129, 0.9)" />
                      <text x="35" y="19" fill="#ffffff" fontSize="8.5" fontWeight="bold">✓ Central Angle ∠AOB = 2 × Inscribed Angle ∠ACB (70° = 2 × 35°) (Q.E.D.)</text>

                      <circle cx="170" cy="75" r="55" fill="none" stroke="#3b82f6" strokeWidth="2" />
                      <circle cx="170" cy="75" r="4" fill="#e9c46a" />
                      <line x1="170" y1="75" x2="120" y2="105" stroke="#e9c46a" strokeWidth="3" />
                      <line x1="170" y1="75" x2="220" y2="105" stroke="#e9c46a" strokeWidth="3" />
                      <line x1="170" y1="20" x2="120" y2="105" stroke="#10b981" strokeWidth="2.5" />
                      <line x1="170" y1="20" x2="220" y2="105" stroke="#10b981" strokeWidth="2.5" />

                      <text x="166" y="15" fill="#10b981" fontSize="11" fontWeight="bold">C (35°)</text>
                      <text x="110" y="115" fill="#f43f5e" fontSize="11" fontWeight="bold">A</text>
                      <text x="225" y="115" fill="#f43f5e" fontSize="11" fontWeight="bold">B</text>
                      <text x="175" y="90" fill="#e9c46a" fontSize="11" fontWeight="bold">O (70°)</text>
                      <text x="165" y="140" fill="#a855f7" fontSize="10">E</text>
                    </g>
                  )}
                </svg>
              )}

              {/* Proposition III.21 */}
              {task3SelectedProp === 'Prop21' && (
                <svg className="w-full h-full" viewBox="0 0 340 145">
                  {task3ProofStep === 0 && (
                    <g>
                      <rect x="40" y="4" width="260" height="18" rx="4" fill="rgba(30, 41, 59, 0.9)" stroke="#475569" />
                      <text x="50" y="17" fill="#cbd5e1" fontSize="8.5" fontWeight="bold">Given: Inscribed angles ∠ACB and ∠ADB standing on same arc AB</text>

                      <circle cx="170" cy="75" r="55" fill="none" stroke="#3b82f6" strokeWidth="2" />
                      <line x1="135" y1="32" x2="120" y2="105" stroke="#f43f5e" strokeWidth="2" />
                      <line x1="135" y1="32" x2="220" y2="105" stroke="#f43f5e" strokeWidth="2" />
                      <line x1="205" y1="32" x2="120" y2="105" stroke="#10b981" strokeWidth="2" />
                      <line x1="205" y1="32" x2="220" y2="105" stroke="#10b981" strokeWidth="2" />

                      <text x="125" y="24" fill="#f43f5e" fontSize="11" fontWeight="bold">C</text>
                      <text x="210" y="24" fill="#10b981" fontSize="11" fontWeight="bold">D</text>
                      <text x="110" y="115" fill="#e9c46a" fontSize="11" fontWeight="bold">A</text>
                      <text x="225" y="115" fill="#e9c46a" fontSize="11" fontWeight="bold">B</text>
                    </g>
                  )}
                  {task3ProofStep === 1 && (
                    <g>
                      <rect x="40" y="4" width="260" height="18" rx="4" fill="rgba(168, 85, 247, 0.2)" stroke="#a855f7" />
                      <text x="50" y="17" fill="#a855f7" fontSize="8.5" fontWeight="bold">Construction: Draw Central Angle ∠AOB from center O</text>

                      <circle cx="170" cy="75" r="55" fill="none" stroke="#3b82f6" strokeWidth="2" />
                      <line x1="135" y1="32" x2="120" y2="105" stroke="#475569" strokeWidth="1.5" strokeDasharray="2,2" />
                      <line x1="135" y1="32" x2="220" y2="105" stroke="#475569" strokeWidth="1.5" strokeDasharray="2,2" />
                      <line x1="205" y1="32" x2="120" y2="105" stroke="#475569" strokeWidth="1.5" strokeDasharray="2,2" />
                      <line x1="205" y1="32" x2="220" y2="105" stroke="#475569" strokeWidth="1.5" strokeDasharray="2,2" />
                      
                      <circle cx="170" cy="75" r="3.5" fill="#e9c46a" />
                      <line x1="170" y1="75" x2="120" y2="105" stroke="#a855f7" strokeWidth="2.5" />
                      <line x1="170" y1="75" x2="220" y2="105" stroke="#a855f7" strokeWidth="2.5" />

                      <text x="125" y="24" fill="#cbd5e1" fontSize="11" fontWeight="bold">C</text>
                      <text x="210" y="24" fill="#cbd5e1" fontSize="11" fontWeight="bold">D</text>
                      <text x="110" y="115" fill="#e9c46a" fontSize="11" fontWeight="bold">A</text>
                      <text x="225" y="115" fill="#e9c46a" fontSize="11" fontWeight="bold">B</text>
                      <text x="175" y="78" fill="#e9c46a" fontSize="11" fontWeight="bold">O</text>
                    </g>
                  )}
                  {task3ProofStep === 2 && (
                    <g>
                      <rect x="45" y="4" width="250" height="18" rx="4" fill="rgba(244, 63, 94, 0.2)" stroke="#f43f5e" />
                      <text x="55" y="17" fill="#f43f5e" fontSize="8.5" fontWeight="bold">Prop. III.20: Central ∠AOB = 2 × Inscribed ∠ACB = 2 × ∠ADB</text>

                      <circle cx="170" cy="75" r="55" fill="none" stroke="#3b82f6" strokeWidth="2" />
                      <polygon points="170,75 135,32 120,105 220,105" fill="rgba(244, 63, 94, 0.25)" stroke="#f43f5e" strokeWidth="1.5" />
                      <line x1="205" y1="32" x2="120" y2="105" stroke="#10b981" strokeWidth="1.5" strokeDasharray="3,3" />
                      <line x1="205" y1="32" x2="220" y2="105" stroke="#10b981" strokeWidth="1.5" strokeDasharray="3,3" />
                      <circle cx="170" cy="75" r="3.5" fill="#e9c46a" />

                      <text x="125" y="24" fill="#f43f5e" fontSize="11" fontWeight="bold">C</text>
                      <text x="210" y="24" fill="#10b981" fontSize="11" fontWeight="bold">D</text>
                      <text x="110" y="115" fill="#e9c46a" fontSize="11" fontWeight="bold">A</text>
                      <text x="225" y="115" fill="#e9c46a" fontSize="11" fontWeight="bold">B</text>
                      <text x="175" y="78" fill="#e9c46a" fontSize="11" fontWeight="bold">O</text>
                    </g>
                  )}
                  {task3ProofStep === 3 && (
                    <g>
                      <rect x="25" y="4" width="290" height="22" rx="5" fill="rgba(16, 185, 129, 0.9)" />
                      <text x="35" y="19" fill="#ffffff" fontSize="8.5" fontWeight="bold">✓ 2∠ACB = 2∠ADB ⟹ Inscribed Angles ∠ACB = ∠ADB (Q.E.D.)</text>

                      <circle cx="170" cy="75" r="55" fill="none" stroke="#3b82f6" strokeWidth="2" />
                      <line x1="135" y1="32" x2="120" y2="105" stroke="#10b981" strokeWidth="2.5" />
                      <line x1="135" y1="32" x2="220" y2="105" stroke="#10b981" strokeWidth="2.5" />
                      <line x1="205" y1="32" x2="120" y2="105" stroke="#10b981" strokeWidth="2.5" />
                      <line x1="205" y1="32" x2="220" y2="105" stroke="#10b981" strokeWidth="2.5" />

                      <text x="125" y="24" fill="#10b981" fontSize="11" fontWeight="bold">C (35°)</text>
                      <text x="210" y="24" fill="#10b981" fontSize="11" fontWeight="bold">D (35°)</text>
                      <text x="110" y="115" fill="#e9c46a" fontSize="11" fontWeight="bold">A</text>
                      <text x="225" y="115" fill="#e9c46a" fontSize="11" fontWeight="bold">B</text>
                    </g>
                  )}
                </svg>
              )}

              {/* Proposition III.22 */}
              {task3SelectedProp === 'Prop22' && (
                <svg className="w-full h-full" viewBox="0 0 340 145">
                  {task3ProofStep === 0 && (
                    <g>
                      <rect x="40" y="4" width="260" height="18" rx="4" fill="rgba(30, 41, 59, 0.9)" stroke="#475569" />
                      <text x="50" y="17" fill="#cbd5e1" fontSize="8.5" fontWeight="bold">Given: Inscribed Quadrilateral ABCD; Draw diagonals AC and BD</text>

                      <circle cx="170" cy="75" r="55" fill="none" stroke="#3b82f6" strokeWidth="2" />
                      <polygon points="170,20 120,65 140,125 220,105" fill="rgba(99, 102, 241, 0.2)" stroke="#6366f1" strokeWidth="2.5" />
                      <line x1="170" y1="20" x2="140" y2="125" stroke="#a855f7" strokeWidth="1.5" strokeDasharray="3,3" />
                      <line x1="120" y1="65" x2="220" y2="105" stroke="#a855f7" strokeWidth="1.5" strokeDasharray="3,3" />

                      <text x="166" y="15" fill="#f43f5e" fontSize="11" fontWeight="bold">A</text>
                      <text x="105" y="65" fill="#10b981" fontSize="11" fontWeight="bold">B</text>
                      <text x="126" y="135" fill="#f43f5e" fontSize="11" fontWeight="bold">C</text>
                      <text x="225" y="110" fill="#10b981" fontSize="11" fontWeight="bold">D</text>
                    </g>
                  )}
                  {task3ProofStep === 1 && (
                    <g>
                      <rect x="35" y="4" width="270" height="18" rx="4" fill="rgba(99, 102, 241, 0.2)" stroke="#6366f1" />
                      <text x="45" y="17" fill="#6366f1" fontSize="8.5" fontWeight="bold">Prop. III.21: Inscribed angles ∠CAB = ∠CDB & ∠ACB = ∠ADB</text>

                      <circle cx="170" cy="75" r="55" fill="none" stroke="#3b82f6" strokeWidth="2" />
                      <polygon points="170,20 120,65 140,125 220,105" fill="none" stroke="#6366f1" strokeWidth="2" />
                      <line x1="170" y1="20" x2="140" y2="125" stroke="#a855f7" strokeWidth="1.5" strokeDasharray="3,3" />
                      <line x1="120" y1="65" x2="220" y2="105" stroke="#a855f7" strokeWidth="1.5" strokeDasharray="3,3" />
                      <path d="M 160 30 A 15 15 0 0 1 165 38" fill="none" stroke="#f43f5e" strokeWidth="2" />
                      <path d="M 210 98 A 15 15 0 0 1 215 105" fill="none" stroke="#f43f5e" strokeWidth="2" />

                      <text x="166" y="15" fill="#f43f5e" fontSize="11" fontWeight="bold">A</text>
                      <text x="105" y="65" fill="#10b981" fontSize="11" fontWeight="bold">B</text>
                      <text x="126" y="135" fill="#f43f5e" fontSize="11" fontWeight="bold">C</text>
                      <text x="225" y="110" fill="#10b981" fontSize="11" fontWeight="bold">D</text>
                    </g>
                  )}
                  {task3ProofStep === 2 && (
                    <g>
                      <rect x="35" y="4" width="270" height="18" rx="4" fill="rgba(233, 196, 106, 0.2)" stroke="#e9c46a" />
                      <text x="45" y="17" fill="#e9c46a" fontSize="8.5" fontWeight="bold">Prop. I.32 (△ABC): ∠ABC + ∠CAB + ∠ACB = 180°</text>

                      <circle cx="170" cy="75" r="55" fill="none" stroke="#3b82f6" strokeWidth="2" />
                      <polygon points="170,20 120,65 140,125" fill="rgba(233, 196, 106, 0.3)" stroke="#e9c46a" strokeWidth="2.5" />

                      <text x="166" y="15" fill="#f43f5e" fontSize="11" fontWeight="bold">A</text>
                      <text x="105" y="65" fill="#10b981" fontSize="11" fontWeight="bold">B</text>
                      <text x="126" y="135" fill="#f43f5e" fontSize="11" fontWeight="bold">C</text>
                      <text x="225" y="110" fill="#cbd5e1" fontSize="11" fontWeight="bold">D</text>
                    </g>
                  )}
                  {task3ProofStep === 3 && (
                    <g>
                      <rect x="25" y="4" width="290" height="22" rx="5" fill="rgba(16, 185, 129, 0.9)" />
                      <text x="35" y="19" fill="#ffffff" fontSize="8.5" fontWeight="bold">✓ Opposite Angles ∠ABC + ∠ADC = 180° & ∠DAB + ∠BCD = 180° (Q.E.D.)</text>

                      <circle cx="170" cy="75" r="55" fill="none" stroke="#3b82f6" strokeWidth="2" />
                      <polygon points="170,20 120,65 140,125 220,105" fill="rgba(16, 185, 129, 0.3)" stroke="#10b981" strokeWidth="3" />

                      <text x="166" y="15" fill="#10b981" fontSize="11" fontWeight="bold">A</text>
                      <text x="105" y="65" fill="#e9c46a" fontSize="11" fontWeight="bold">B (110°)</text>
                      <text x="126" y="135" fill="#10b981" fontSize="11" fontWeight="bold">C</text>
                      <text x="225" y="110" fill="#e9c46a" fontSize="11" fontWeight="bold">D (70°)</text>
                    </g>
                  )}
                </svg>
              )}

              {/* Proposition III.31 */}
              {task3SelectedProp === 'Prop31' && (
                <svg className="w-full h-full" viewBox="0 0 340 145">
                  {task3ProofStep === 0 && (
                    <g>
                      <rect x="40" y="4" width="260" height="18" rx="4" fill="rgba(30, 41, 59, 0.9)" stroke="#475569" />
                      <text x="50" y="17" fill="#cbd5e1" fontSize="8.5" fontWeight="bold">Given: Circle center O, diameter AB, inscribed △ABC</text>

                      <circle cx="170" cy="75" r="55" fill="none" stroke="#3b82f6" strokeWidth="2" />
                      <line x1="115" y1="75" x2="225" y2="75" stroke="#e9c46a" strokeWidth="3" />
                      <polygon points="115,75 225,75 160,22" fill="rgba(99, 102, 241, 0.2)" stroke="#6366f1" strokeWidth="2" />
                      <circle cx="170" cy="75" r="3.5" fill="#e9c46a" />

                      <text x="100" y="78" fill="#e9c46a" fontSize="11" fontWeight="bold">A</text>
                      <text x="230" y="78" fill="#e9c46a" fontSize="11" fontWeight="bold">B</text>
                      <text x="155" y="15" fill="#f43f5e" fontSize="11" fontWeight="bold">C</text>
                      <text x="166" y="90" fill="#e9c46a" fontSize="11" fontWeight="bold">O</text>
                    </g>
                  )}
                  {task3ProofStep === 1 && (
                    <g>
                      <rect x="40" y="4" width="260" height="18" rx="4" fill="rgba(168, 85, 247, 0.2)" stroke="#a855f7" />
                      <text x="50" y="17" fill="#a855f7" fontSize="8.5" fontWeight="bold">Construction: Draw radius OC from center O to vertex C</text>

                      <circle cx="170" cy="75" r="55" fill="none" stroke="#3b82f6" strokeWidth="2" />
                      <line x1="115" y1="75" x2="225" y2="75" stroke="#e9c46a" strokeWidth="3" />
                      <polygon points="115,75 225,75 160,22" fill="none" stroke="#6366f1" strokeWidth="2" />
                      <line x1="170" y1="75" x2="160" y2="22" stroke="#a855f7" strokeWidth="2.5" strokeDasharray="4,3" />
                      <circle cx="170" cy="75" r="3.5" fill="#e9c46a" />

                      <text x="100" y="78" fill="#e9c46a" fontSize="11" fontWeight="bold">A</text>
                      <text x="230" y="78" fill="#e9c46a" fontSize="11" fontWeight="bold">B</text>
                      <text x="155" y="15" fill="#f43f5e" fontSize="11" fontWeight="bold">C</text>
                      <text x="166" y="90" fill="#e9c46a" fontSize="11" fontWeight="bold">O</text>
                      <text x="172" y="52" fill="#a855f7" fontSize="9" fontWeight="bold">OC=R</text>
                    </g>
                  )}
                  {task3ProofStep === 2 && (
                    <g>
                      <rect x="35" y="4" width="270" height="18" rx="4" fill="rgba(233, 196, 106, 0.2)" stroke="#e9c46a" />
                      <text x="45" y="17" fill="#e9c46a" fontSize="8.5" fontWeight="bold">Isosceles △AOC & △BOC (Prop. I.5): ∠OAC = ∠OCA & ∠OBC = ∠OCB</text>

                      <circle cx="170" cy="75" r="55" fill="none" stroke="#3b82f6" strokeWidth="2" />
                      <polygon points="170,75 115,75 160,22" fill="rgba(244, 63, 94, 0.25)" stroke="#f43f5e" strokeWidth="1.5" />
                      <polygon points="170,75 225,75 160,22" fill="rgba(16, 185, 129, 0.25)" stroke="#10b981" strokeWidth="1.5" />
                      <circle cx="170" cy="75" r="3.5" fill="#e9c46a" />

                      <text x="100" y="78" fill="#e9c46a" fontSize="11" fontWeight="bold">A</text>
                      <text x="230" y="78" fill="#e9c46a" fontSize="11" fontWeight="bold">B</text>
                      <text x="155" y="15" fill="#f43f5e" fontSize="11" fontWeight="bold">C</text>
                      <text x="166" y="90" fill="#e9c46a" fontSize="11" fontWeight="bold">O</text>
                    </g>
                  )}
                  {task3ProofStep === 3 && (
                    <g>
                      <rect x="25" y="4" width="290" height="22" rx="5" fill="rgba(16, 185, 129, 0.9)" />
                      <text x="35" y="19" fill="#ffffff" fontSize="8.5" fontWeight="bold">✓ 2∠ACB = 180° ⟹ Inscribed Angle in Semicircle ∠ACB = 90° (Q.E.D.)</text>

                      <circle cx="170" cy="75" r="55" fill="none" stroke="#3b82f6" strokeWidth="2" />
                      <line x1="115" y1="75" x2="225" y2="75" stroke="#e9c46a" strokeWidth="3" />
                      <polygon points="115,75 225,75 160,22" fill="rgba(16, 185, 129, 0.35)" stroke="#10b981" strokeWidth="3" />
                      <path d="M 155 27 L 163 32 L 168 25" fill="none" stroke="#f43f5e" strokeWidth="2" />
                      <circle cx="170" cy="75" r="3.5" fill="#e9c46a" />

                      <text x="100" y="78" fill="#e9c46a" fontSize="11" fontWeight="bold">A</text>
                      <text x="230" y="78" fill="#e9c46a" fontSize="11" fontWeight="bold">B</text>
                      <text x="155" y="15" fill="#f43f5e" fontSize="11" fontWeight="bold">C (90° Right Angle)</text>
                      <text x="166" y="90" fill="#e9c46a" fontSize="11" fontWeight="bold">O</text>
                    </g>
                  )}
                </svg>
              )}

              {/* Proposition III.32 */}
              {task3SelectedProp === 'Prop32' && (
                <svg className="w-full h-full" viewBox="0 0 340 145">
                  {task3ProofStep === 0 && (
                    <g>
                      <rect x="40" y="4" width="260" height="18" rx="4" fill="rgba(30, 41, 59, 0.9)" stroke="#475569" />
                      <text x="50" y="17" fill="#cbd5e1" fontSize="8.5" fontWeight="bold">Given: Tangent EF at B, chord AB, point C in alternate segment</text>

                      <circle cx="170" cy="75" r="50" fill="none" stroke="#3b82f6" strokeWidth="2" />
                      {/* Tangent EF line from E(80, 125) to F(260, 125) */}
                      <line x1="80" y1="125" x2="260" y2="125" stroke="#f43f5e" strokeWidth="2.5" />
                      {/* Scalene Tilted Triangle ABC: A(217,58) on right, B(170,125) at bottom, C(135,40) on top-left */}
                      <polygon points="170,125 217,58 135,40" fill="rgba(233, 196, 106, 0.2)" stroke="#e9c46a" strokeWidth="2" />

                      <circle cx="170" cy="125" r="4" fill="#f43f5e" />

                      <text x="70" y="138" fill="#f43f5e" fontSize="11" fontWeight="bold">E</text>
                      <text x="165" y="138" fill="#f43f5e" fontSize="11" fontWeight="bold">B (Contact)</text>
                      <text x="265" y="138" fill="#f43f5e" fontSize="11" fontWeight="bold">F</text>
                      <text x="222" y="62" fill="#e9c46a" fontSize="11" fontWeight="bold">A</text>
                      <text x="120" y="36" fill="#10b981" fontSize="11" fontWeight="bold">C (Alternate Segment)</text>
                    </g>
                  )}
                  {task3ProofStep === 1 && (
                    <g>
                      <rect x="35" y="4" width="270" height="18" rx="4" fill="rgba(168, 85, 247, 0.2)" stroke="#a855f7" />
                      <text x="45" y="17" fill="#a855f7" fontSize="8.5" fontWeight="bold">Prop. III.16 & III.31: Draw Diameter BD ⊥ EF & ∠DAB = 90°</text>

                      <circle cx="170" cy="75" r="50" fill="none" stroke="#3b82f6" strokeWidth="2" />
                      <line x1="80" y1="125" x2="260" y2="125" stroke="#f43f5e" strokeWidth="2.5" />
                      {/* Vertical Diameter BD from B(170,125) to D(170,25) */}
                      <line x1="170" y1="125" x2="170" y2="25" stroke="#a855f7" strokeWidth="2.5" strokeDasharray="4,3" />
                      <line x1="217" y1="58" x2="170" y2="25" stroke="#a855f7" strokeWidth="2" />
                      <line x1="170" y1="125" x2="217" y2="58" stroke="#e9c46a" strokeWidth="2" />

                      {/* Right Angle at B */}
                      <path d="M 170 117 L 178 117 L 178 125" fill="none" stroke="#a855f7" strokeWidth="1.5" />

                      <circle cx="170" cy="25" r="4" fill="#a855f7" />
                      <circle cx="170" cy="125" r="4" fill="#f43f5e" />

                      <text x="70" y="138" fill="#f43f5e" fontSize="11" fontWeight="bold">E</text>
                      <text x="165" y="138" fill="#f43f5e" fontSize="11" fontWeight="bold">B</text>
                      <text x="265" y="138" fill="#f43f5e" fontSize="11" fontWeight="bold">F</text>
                      <text x="222" y="62" fill="#e9c46a" fontSize="11" fontWeight="bold">A</text>
                      <text x="166" y="20" fill="#a855f7" fontSize="11" fontWeight="bold">D</text>
                    </g>
                  )}
                  {task3ProofStep === 2 && (
                    <g>
                      <rect x="35" y="4" width="270" height="18" rx="4" fill="rgba(233, 196, 106, 0.2)" stroke="#e9c46a" />
                      <text x="45" y="17" fill="#e9c46a" fontSize="8.5" fontWeight="bold">Complementary Angles: ∠ABF + ∠ABD = 90° ⟹ ∠ABF = ∠ADB</text>

                      <circle cx="170" cy="75" r="50" fill="none" stroke="#3b82f6" strokeWidth="2" />
                      <line x1="80" y1="125" x2="260" y2="125" stroke="#f43f5e" strokeWidth="2.5" />
                      <line x1="170" y1="125" x2="170" y2="25" stroke="#a855f7" strokeWidth="1.5" strokeDasharray="3,3" />
                      <polygon points="170,125 217,58 170,25" fill="rgba(233, 196, 106, 0.25)" stroke="#e9c46a" strokeWidth="2" />
                      
                      {/* Arc for ∠ABF at B(170,125) */}
                      <path d="M 195 125 A 25 25 0 0 0 192 103" fill="none" stroke="#f43f5e" strokeWidth="2.5" />
                      {/* Arc for ∠ADB at D(170,25) */}
                      <path d="M 170 45 A 20 20 0 0 0 186 38" fill="none" stroke="#e9c46a" strokeWidth="2.5" />

                      <circle cx="170" cy="25" r="3.5" fill="#a855f7" />

                      <text x="70" y="138" fill="#f43f5e" fontSize="11" fontWeight="bold">E</text>
                      <text x="165" y="138" fill="#f43f5e" fontSize="11" fontWeight="bold">B</text>
                      <text x="265" y="138" fill="#f43f5e" fontSize="11" fontWeight="bold">F</text>
                      <text x="222" y="62" fill="#e9c46a" fontSize="11" fontWeight="bold">A</text>
                      <text x="166" y="20" fill="#a855f7" fontSize="11" fontWeight="bold">D</text>
                      <text x="198" y="115" fill="#f43f5e" fontSize="9" fontWeight="bold">∠ABF</text>
                      <text x="188" y="38" fill="#e9c46a" fontSize="9" fontWeight="bold">∠ADB</text>
                    </g>
                  )}
                  {task3ProofStep === 3 && (
                    <g>
                      <rect x="25" y="4" width="290" height="22" rx="5" fill="rgba(16, 185, 129, 0.9)" />
                      <text x="35" y="19" fill="#ffffff" fontSize="8.5" fontWeight="bold">✓ Prop. III.21: ∠ADB = ∠ACB ⟹ Tangent-Chord Angle ∠ABF = ∠ACB (Q.E.D.)</text>

                      <circle cx="170" cy="75" r="50" fill="none" stroke="#3b82f6" strokeWidth="2" />
                      {/* Tangent Line EF from E(80,125) to F(260,125) */}
                      <line x1="80" y1="125" x2="260" y2="125" stroke="#f43f5e" strokeWidth="3" />
                      <line x1="170" y1="125" x2="170" y2="25" stroke="#a855f7" strokeWidth="1.5" strokeDasharray="3,3" />
                      <line x1="217" y1="58" x2="170" y2="25" stroke="#a855f7" strokeWidth="1.5" strokeDasharray="3,3" />

                      {/* Tilted Scalene Inscribed Triangle ABC */}
                      <polygon points="170,125 217,58 135,40" fill="rgba(16, 185, 129, 0.3)" stroke="#10b981" strokeWidth="3" />

                      {/* Arc for ∠ABF at B */}
                      <path d="M 195 125 A 25 25 0 0 0 192 103" fill="none" stroke="#f43f5e" strokeWidth="2.5" />
                      {/* Arc for ∠ACB at C(135,40) */}
                      <path d="M 148 43 A 15 15 0 0 1 140 55" fill="none" stroke="#10b981" strokeWidth="2.5" />
                      {/* Arc for ∠ADB at D(170,25) */}
                      <path d="M 170 45 A 20 20 0 0 0 186 38" fill="none" stroke="#a855f7" strokeWidth="2" />

                      <circle cx="170" cy="25" r="3.5" fill="#a855f7" />
                      <circle cx="170" cy="125" r="4" fill="#f43f5e" />

                      <text x="70" y="138" fill="#f43f5e" fontSize="11" fontWeight="bold">E</text>
                      <text x="165" y="138" fill="#f43f5e" fontSize="11" fontWeight="bold">B</text>
                      <text x="265" y="138" fill="#f43f5e" fontSize="11" fontWeight="bold">F</text>
                      <text x="222" y="62" fill="#e9c46a" fontSize="11" fontWeight="bold">A</text>
                      <text x="120" y="36" fill="#10b981" fontSize="11" fontWeight="bold">C</text>
                      <text x="166" y="20" fill="#a855f7" fontSize="11" fontWeight="bold">D</text>
                      <text x="198" y="115" fill="#f43f5e" fontSize="9" fontWeight="bold">∠ABF</text>
                      <text x="145" y="62" fill="#10b981" fontSize="9" fontWeight="bold">∠ACB</text>
                    </g>
                  )}
                </svg>
              )}

              {/* Propositions III.35 & 36 */}
              {task3SelectedProp === 'Prop35_36' && (
                <svg className="w-full h-full" viewBox="0 0 340 145">
                  {task3ProofStep === 0 && (
                    <g>
                      <rect x="40" y="4" width="260" height="18" rx="4" fill="rgba(30, 41, 59, 0.9)" stroke="#475569" />
                      <text x="50" y="17" fill="#cbd5e1" fontSize="8.5" fontWeight="bold">Prop. III.35 (Given): Off-Center P Inside Circle & Chords AB, CD</text>

                      {/* Circle Center O(170, 75), R=50 */}
                      <circle cx="170" cy="75" r="50" fill="none" stroke="#3b82f6" strokeWidth="2" />
                      <circle cx="170" cy="75" r="3" fill="#cbd5e1" />
                      <text x="174" y="73" fill="#cbd5e1" fontSize="9" fontWeight="bold">O</text>

                      {/* Off-Center Intersection P(164, 90) */}
                      <line x1="120" y1="75" x2="210" y2="105" stroke="#f43f5e" strokeWidth="2.5" />
                      <line x1="140" y1="115" x2="200" y2="35" stroke="#10b981" strokeWidth="2.5" />
                      <line x1="120" y1="75" x2="140" y2="115" stroke="#a855f7" strokeWidth="1.5" strokeDasharray="3,3" />
                      <line x1="210" y1="105" x2="200" y2="35" stroke="#a855f7" strokeWidth="1.5" strokeDasharray="3,3" />

                      <circle cx="164" cy="90" r="4.5" fill="#a855f7" />

                      <text x="108" y="78" fill="#f43f5e" fontSize="10" fontWeight="bold">A</text>
                      <text x="215" y="110" fill="#f43f5e" fontSize="10" fontWeight="bold">B</text>
                      <text x="130" y="125" fill="#10b981" fontSize="10" fontWeight="bold">C</text>
                      <text x="202" y="30" fill="#10b981" fontSize="10" fontWeight="bold">D</text>
                      <text x="170" y="98" fill="#a855f7" fontSize="11" fontWeight="bold">P</text>
                    </g>
                  )}
                  {task3ProofStep === 1 && (
                    <g>
                      <rect x="25" y="4" width="290" height="22" rx="5" fill="rgba(16, 185, 129, 0.9)" />
                      <text x="35" y="19" fill="#ffffff" fontSize="8.5" fontWeight="bold">✓ Prop. III.35: △PAC ~ △PDB ⟹ PA · PB = PC · PD (Inside Circle Q.E.D.)</text>

                      <circle cx="170" cy="75" r="50" fill="none" stroke="#3b82f6" strokeWidth="2" />
                      <circle cx="170" cy="75" r="3" fill="#cbd5e1" />
                      <text x="174" y="73" fill="#cbd5e1" fontSize="9" fontWeight="bold">O</text>

                      <polygon points="164,90 120,75 140,115" fill="rgba(59, 130, 246, 0.25)" stroke="#3b82f6" strokeWidth="2" />
                      <polygon points="164,90 200,35 210,105" fill="rgba(16, 185, 129, 0.25)" stroke="#10b981" strokeWidth="2" />

                      <circle cx="164" cy="90" r="4.5" fill="#a855f7" />

                      <text x="108" y="78" fill="#f43f5e" fontSize="10" fontWeight="bold">A</text>
                      <text x="215" y="110" fill="#f43f5e" fontSize="10" fontWeight="bold">B</text>
                      <text x="130" y="125" fill="#10b981" fontSize="10" fontWeight="bold">C</text>
                      <text x="202" y="30" fill="#10b981" fontSize="10" fontWeight="bold">D</text>
                      <text x="170" y="98" fill="#a855f7" fontSize="11" fontWeight="bold">P</text>
                      <text x="135" y="90" fill="#3b82f6" fontSize="9" fontWeight="bold">△PAC</text>
                      <text x="188" y="75" fill="#10b981" fontSize="9" fontWeight="bold">△PDB</text>
                    </g>
                  )}
                  {task3ProofStep === 2 && (
                    <g>
                      <rect x="35" y="4" width="270" height="18" rx="4" fill="rgba(233, 196, 106, 0.2)" stroke="#e9c46a" />
                      <text x="45" y="17" fill="#e9c46a" fontSize="8.5" fontWeight="bold">Prop. III.36 (Given): External Point P, Secants PAB, PCD & Tangent PT</text>

                      {/* Circle Center O(140, 75), R=45 */}
                      <circle cx="140" cy="75" r="45" fill="none" stroke="#3b82f6" strokeWidth="2" />
                      <circle cx="140" cy="75" r="3" fill="#cbd5e1" />
                      <text x="144" y="86" fill="#cbd5e1" fontSize="9" fontWeight="bold">O</text>

                      {/* Secant PAB: P(260, 75) -> A(185, 75) -> B(95, 75) */}
                      <line x1="260" y1="75" x2="95" y2="75" stroke="#f43f5e" strokeWidth="2.5" />
                      {/* Secant PCD: P(260, 75) -> C(183, 62) -> D(104, 48) on circle */}
                      <line x1="260" y1="75" x2="104" y2="48" stroke="#10b981" strokeWidth="2.5" />
                      {/* Tangent PT: P(260, 75) -> T(156, 33) */}
                      <line x1="260" y1="75" x2="156" y2="33" stroke="#e9c46a" strokeWidth="2.5" />
                      <line x1="140" y1="75" x2="156" y2="33" stroke="#a855f7" strokeWidth="1.5" strokeDasharray="3,3" />

                      {/* Construction Dashed Chords AC and BD */}
                      <line x1="185" y1="75" x2="183" y2="62" stroke="#a855f7" strokeWidth="1.5" strokeDasharray="3,3" />
                      <line x1="95" y1="75" x2="104" y2="48" stroke="#a855f7" strokeWidth="1.5" strokeDasharray="3,3" />

                      {/* Vertices ON Circle */}
                      <circle cx="260" cy="75" r="4.5" fill="#a855f7" />
                      <circle cx="185" cy="75" r="3.5" fill="#f43f5e" />
                      <circle cx="95" cy="75" r="3.5" fill="#f43f5e" />
                      <circle cx="183" cy="62" r="3.5" fill="#10b981" />
                      <circle cx="104" cy="48" r="3.5" fill="#10b981" />
                      <circle cx="156" cy="33" r="4" fill="#e9c46a" />

                      <text x="265" y="78" fill="#a855f7" fontSize="11" fontWeight="bold">P</text>
                      <text x="190" y="87" fill="#f43f5e" fontSize="10" fontWeight="bold">A</text>
                      <text x="82" y="78" fill="#f43f5e" fontSize="10" fontWeight="bold">B</text>
                      <text x="188" y="58" fill="#10b981" fontSize="10" fontWeight="bold">C</text>
                      <text x="92" y="45" fill="#10b981" fontSize="10" fontWeight="bold">D</text>
                      <text x="154" y="24" fill="#e9c46a" fontSize="10" fontWeight="bold">T</text>
                    </g>
                  )}
                  {task3ProofStep === 3 && (
                    <g>
                      <rect x="15" y="4" width="310" height="22" rx="5" fill="rgba(16, 185, 129, 0.9)" />
                      <text x="25" y="19" fill="#ffffff" fontSize="8.5" fontWeight="bold">✓ Prop. III.36: △PAC ~ △PDB ⟹ PA · PB = PC · PD = PT² = d² - R² (Q.E.D.)</text>

                      {/* Circle Center O(140, 75), R=45 */}
                      <circle cx="140" cy="75" r="45" fill="none" stroke="#3b82f6" strokeWidth="2" />
                      <circle cx="140" cy="75" r="3" fill="#cbd5e1" />
                      <text x="144" y="86" fill="#cbd5e1" fontSize="9" fontWeight="bold">O</text>

                      {/* External Triangles △PAC & △PDB */}
                      <polygon points="260,75 185,75 183,62" fill="rgba(59, 130, 246, 0.3)" stroke="#3b82f6" strokeWidth="2" />
                      <polygon points="260,75 95,75 104,48" fill="rgba(16, 185, 129, 0.25)" stroke="#10b981" strokeWidth="2" />

                      {/* Tangent PT */}
                      <line x1="260" y1="75" x2="156" y2="33" stroke="#e9c46a" strokeWidth="3" />
                      <circle cx="156" cy="33" r="4" fill="#e9c46a" />
                      <circle cx="260" cy="75" r="4.5" fill="#a855f7" />

                      {/* Vertices ON Circle */}
                      <circle cx="185" cy="75" r="3.5" fill="#f43f5e" />
                      <circle cx="95" cy="75" r="3.5" fill="#f43f5e" />
                      <circle cx="183" cy="62" r="3.5" fill="#10b981" />
                      <circle cx="104" cy="48" r="3.5" fill="#10b981" />

                      <text x="265" y="78" fill="#a855f7" fontSize="11" fontWeight="bold">P</text>
                      <text x="190" y="87" fill="#f43f5e" fontSize="10" fontWeight="bold">A</text>
                      <text x="82" y="78" fill="#f43f5e" fontSize="10" fontWeight="bold">B</text>
                      <text x="188" y="58" fill="#10b981" fontSize="10" fontWeight="bold">C</text>
                      <text x="92" y="45" fill="#10b981" fontSize="10" fontWeight="bold">D</text>
                      <text x="154" y="24" fill="#e9c46a" fontSize="10" fontWeight="bold">T</text>
                      <text x="195" y="42" fill="#e9c46a" fontSize="9" fontWeight="bold">PT² = PA · PB</text>
                    </g>
                  )}
                </svg>
              )}
            </div>
          </div>
        </div>
      );
    } else if (activeSubtask === 4) {
      // Subtask 4: Book II & IV: Geometric Algebra & Regular Polygons
      return (
        <div className="w-full h-full flex flex-col p-4 overflow-y-auto custom-scrollbar bg-gradient-to-br from-slate-950 via-[#0b1021] to-[#07090e]">
          <div className="pb-2 mb-3 border-b border-indigo-900/40 flex items-center justify-between shrink-0">
            <div>
              <span className="text-[10px] font-mono tracking-widest text-indigo-400 uppercase">
                EUCLID'S ELEMENTS • BOOK II & IV GEOMETRIC ALGEBRA
              </span>
              <h2 className="text-base font-serif font-bold text-white flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-amber-400" />
                <span>Task 4: Oliver Byrne Geometric Algebra Proofs</span>
              </h2>
            </div>
          </div>

          {/* Category Tabs for Task 4 */}
          <div className="flex flex-wrap gap-1.5 mb-2.5 bg-slate-900/80 p-1 rounded-xl border border-slate-800 shrink-0">
            {[
              { id: 'law_of_cosines', label: '1. Law of Cosines (Prop XII & XIII)' },
              { id: 'polygon_angles', label: '2. Polygon Angle Sum ((n-2)×180°)' },
              { id: 'golden_polygons', label: '3. Golden Ratio & Polygons (Book II & IV)' }
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  if (cat.id === 'law_of_cosines') { setTask4SelectedProp('Prop12'); setTask4CalcMode('obtuse'); }
                  if (cat.id === 'polygon_angles') { setTask4SelectedProp('PropPolygonAngleSum'); setTask4CalcMode('polygon_sum'); }
                  if (cat.id === 'golden_polygons') { setTask4SelectedProp('Prop11'); setTask4CalcMode('golden'); }
                  setTask4ProofStep(0);
                }}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition cursor-pointer ${
                  task4PropsMap[task4SelectedProp]?.category === cat.id
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-[0_0_12px_rgba(245,158,11,0.4)]'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Proposition Pills inside Task 4 Category */}
          <div className="flex flex-wrap gap-1.5 mb-3 shrink-0">
            {Object.keys(task4PropsMap)
              .filter((key) => task4PropsMap[key].category === (task4PropsMap[task4SelectedProp]?.category || 'law_of_cosines'))
              .map((key) => (
                <button
                  key={key}
                  onClick={() => {
                    setTask4SelectedProp(key);
                    setTask4ProofStep(0);
                    if (key === 'Prop12') setTask4CalcMode('obtuse');
                    if (key === 'Prop13') setTask4CalcMode('acute');
                    if (key === 'Prop11') setTask4CalcMode('golden');
                    if (key === 'Prop4_10') setTask4CalcMode('golden_triangle');
                    if (key === 'Prop4_11' || key === 'Prop4_12_14') setTask4CalcMode('pentagon');
                    if (key === 'PropPolygonAngleSum') setTask4CalcMode('polygon_sum');
                    if (key === 'PropArtPatterns') setTask4CalcMode('art_patterns');
                  }}
                  className={`px-3 py-1 rounded-xl text-[11px] font-bold transition cursor-pointer shrink-0 border ${
                    task4SelectedProp === key
                      ? 'bg-indigo-600 border-indigo-400 text-white shadow-[0_0_12px_rgba(99,102,241,0.5)]'
                      : 'bg-slate-900 border-slate-750 text-slate-200 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  {task4PropsMap[key].title}
                </button>
              ))}
          </div>

          {/* Active Proposition Card */}
          <div className="bg-slate-900/90 border border-indigo-500/30 rounded-2xl p-3 shadow-2xl flex flex-col justify-between flex-1 overflow-y-auto custom-scrollbar">
            <div>
              <div className="flex items-center justify-between text-[10.5px] font-mono text-amber-400 uppercase tracking-wider mb-0.5">
                <span>{activePropObj.title.toUpperCase()}</span>
                <span className="text-[10.5px] font-mono text-emerald-400 font-bold">
                  {task4SelectedProp.startsWith('Prop4') || task4SelectedProp === 'Prop11' ? 'Q.E.F.' : 'Q.E.D.'}
                </span>
              </div>
              <h3 className="text-xs font-serif font-bold text-white mb-0.5">{activePropObj.title}</h3>
              <p className="text-[9.5px] text-amber-200 font-serif italic mb-1 leading-tight">"{activePropObj.text}"</p>
              
              <div className="bg-slate-950/80 px-2.5 py-0.5 rounded-lg border border-slate-800 text-[10px] font-mono text-indigo-300 font-semibold mb-1.5">
                {activePropObj.formula}
              </div>

              {task4SelectedProp === 'PropArtPatterns' ? (
                <div className="space-y-1.5 mb-1.5">
                  {/* Sub-Mode Interactive Tabs for Art & Patterns */}
                  <div className="flex gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
                    {[
                      { id: 'grid', step: 0, label: '1. Art Grid' },
                      { id: 'phyllotaxis', step: 1, label: '2. Phyllotaxis (137.5°)' },
                      { id: 'spirals', step: 2, label: '3. Spirals & 5-Fold' },
                      { id: 'golden_spiral', step: 3, label: '4. Golden Spiral (r=φ^2θ/π)' }
                    ].map((sub) => (
                      <button
                        key={sub.id}
                        onClick={() => {
                          setArtPatternsSubMode(sub.id);
                          setTask4ProofStep(sub.step);
                        }}
                        className={`px-2 py-1 rounded-lg text-[10px] font-bold cursor-pointer transition flex-1 border ${
                          artPatternsSubMode === sub.id
                            ? 'bg-amber-500 text-slate-950 border-amber-400 font-extrabold shadow-[0_0_10px_rgba(245,158,11,0.4)]'
                            : 'bg-slate-900/80 text-slate-300 border-slate-800 hover:bg-slate-800 hover:text-white'
                        }`}
                      >
                        {sub.label}
                      </button>
                    ))}
                  </div>

                  {/* Interactive Controls Bar for Specific Sub-Modes */}
                  {artPatternsSubMode === 'phyllotaxis' && (
                    <div className="flex items-center justify-between bg-slate-950/90 px-3 py-1 rounded-lg border border-slate-800 text-[10px]">
                      <span>Divergence Angle θ: <strong className="text-amber-400 font-mono text-[11px]">{phyllotaxisAngle}°</strong></span>
                      <input
                        type="range"
                        min="120"
                        max="150"
                        step="0.1"
                        value={phyllotaxisAngle}
                        onChange={(e) => setPhyllotaxisAngle(Number(e.target.value))}
                        className="w-32 accent-amber-500 cursor-pointer"
                      />
                    </div>
                  )}

                  {artPatternsSubMode === 'golden_spiral' && (
                    <div className="flex items-center justify-between bg-slate-950/90 px-3 py-1 rounded-lg border border-slate-800 text-[10px]">
                      <div className="flex items-center gap-2">
                        <span>Spiral Depth: <strong className="text-amber-400 font-mono">{spiralDepth}</strong></span>
                        <input
                          type="range"
                          min="1"
                          max="8"
                          value={spiralDepth}
                          onChange={(e) => setSpiralDepth(Number(e.target.value))}
                          className="w-20 accent-amber-500 cursor-pointer"
                        />
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-slate-400">Construction:</span>
                        <button
                          onClick={() => setSpiralType(spiralType === 'rectangles' ? 'whirling_triangles' : 'rectangles')}
                          className="px-2 py-0.5 rounded bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-[9.5px] font-bold cursor-pointer border border-indigo-400 transition"
                        >
                          {spiralType === 'rectangles' ? 'Golden Rectangles' : 'Whirling △ (72°-72°-36°)'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[10px] font-mono text-indigo-300">Proof Step {task4ProofStep + 1} of {activePropObj.steps.length}</span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => {
                        const nextStep = (task4ProofStep - 1 + activePropObj.steps.length) % activePropObj.steps.length;
                        setTask4ProofStep(nextStep);
                      }}
                      className="px-2.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] font-bold transition cursor-pointer flex items-center gap-0.5 border border-slate-700"
                    >
                      <ChevronLeft className="w-3 h-3" />
                      <span>Prev Step</span>
                    </button>
                    <button
                      onClick={() => {
                        const nextStep = (task4ProofStep + 1) % activePropObj.steps.length;
                        setTask4ProofStep(nextStep);
                      }}
                      className="px-2.5 py-0.5 rounded bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-bold transition cursor-pointer flex items-center gap-0.5"
                    >
                      <span>Advance Step</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              )}

              <div className="bg-slate-950 px-2.5 py-1 rounded-xl border border-slate-800 text-[10px] text-slate-200 leading-tight mb-1.5">
                {activePropObj.steps[task4ProofStep]}
              </div>
            </div>

            {/* Oliver Byrne Color-Coded Geometric Algebra SVG */}
            <div className="h-[155px] shrink-0 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-center p-1 relative overflow-hidden">
              {/* Proposition XII: Obtuse Triangle Law */}
              {task4SelectedProp === 'Prop12' && (
                <svg className="w-full h-full" viewBox="0 0 340 145">
                  {task4ProofStep === 0 && (
                    <g>
                      <rect x="65" y="4" width="210" height="18" rx="4" fill="rgba(30, 41, 59, 0.9)" stroke="#475569" />
                      <text x="75" y="17" fill="#cbd5e1" fontSize="8.5" fontWeight="bold">Given: Def. 10 (Obtuse Angle ∠ACB &gt; 90°)</text>

                      {/* Obtuse Triangle ABC */}
                      <polygon points="80,125 180,125 240,65" fill="rgba(233, 196, 106, 0.2)" stroke="#e9c46a" strokeWidth="2.5" />
                      <line x1="80" y1="125" x2="180" y2="125" stroke="#f43f5e" strokeWidth="3" />
                      <line x1="180" y1="125" x2="240" y2="65" stroke="#3b82f6" strokeWidth="3" />
                      <line x1="80" y1="125" x2="240" y2="65" stroke="#10b981" strokeWidth="3.5" />

                      <text x="70" y="135" fill="#10b981" fontSize="11" fontWeight="bold">B</text>
                      <text x="180" y="138" fill="#e9c46a" fontSize="11" fontWeight="bold">C</text>
                      <text x="245" y="60" fill="#3b82f6" fontSize="11" fontWeight="bold">A</text>
                      <text x="130" y="138" fill="#f43f5e" fontSize="10" fontWeight="bold">a (BC)</text>
                      <text x="218" y="100" fill="#3b82f6" fontSize="10" fontWeight="bold">b (AC)</text>
                      <text x="150" y="90" fill="#10b981" fontSize="10" fontWeight="bold">c (AB)</text>
                    </g>
                  )}

                  {task4ProofStep === 1 && (
                    <g>
                      <rect x="55" y="4" width="230" height="18" rx="4" fill="rgba(244, 63, 94, 0.2)" stroke="#f43f5e" />
                      <text x="65" y="17" fill="#f43f5e" fontSize="8.5" fontWeight="bold">Justification: Postulate 2 (Extension) & Prop. I.12</text>

                      {/* Obtuse Triangle ABC + Extension CD + Perpendicular AD */}
                      <polygon points="80,125 180,125 240,65" fill="rgba(233, 196, 106, 0.15)" stroke="#e9c46a" strokeWidth="2" />
                      <line x1="180" y1="125" x2="240" y2="125" stroke="#f43f5e" strokeWidth="2.5" strokeDasharray="4,3" />
                      <line x1="240" y1="65" x2="240" y2="125" stroke="#a855f7" strokeWidth="3" />
                      <path d="M 230 125 L 230 115 L 240 115" fill="none" stroke="#e9c46a" strokeWidth="1.5" />

                      <text x="70" y="135" fill="#10b981" fontSize="11" fontWeight="bold">B</text>
                      <text x="175" y="138" fill="#e9c46a" fontSize="11" fontWeight="bold">C</text>
                      <text x="245" y="60" fill="#3b82f6" fontSize="11" fontWeight="bold">A</text>
                      <text x="245" y="135" fill="#f43f5e" fontSize="11" fontWeight="bold">D</text>
                      <text x="205" y="138" fill="#f43f5e" fontSize="10" fontWeight="bold">d (CD)</text>
                      <text x="248" y="98" fill="#a855f7" fontSize="10" fontWeight="bold">h (AD)</text>
                    </g>
                  )}

                  {task4ProofStep === 2 && (
                    <g>
                      <rect x="40" y="4" width="260" height="18" rx="4" fill="rgba(233, 196, 106, 0.2)" stroke="#e9c46a" />
                      <text x="50" y="17" fill="#e9c46a" fontSize="8.5" fontWeight="bold">Justification: Prop. II.4 (Sq(a+d) = a² + d² + 2ad)</text>

                      {/* Geometric Algebra Squares/Rectangles Visualizer */}
                      <rect x="70" y="70" width="55" height="55" fill="rgba(244, 63, 94, 0.25)" stroke="#f43f5e" strokeWidth="2" />
                      <text x="88" y="102" fill="#f43f5e" fontSize="10" fontWeight="bold">a²</text>

                      <rect x="125" y="70" width="35" height="35" fill="rgba(168, 85, 247, 0.25)" stroke="#a855f7" strokeWidth="2" />
                      <text x="135" y="92" fill="#a855f7" fontSize="10" fontWeight="bold">d²</text>

                      <rect x="160" y="70" width="70" height="35" fill="rgba(233, 196, 106, 0.3)" stroke="#e9c46a" strokeWidth="2" />
                      <text x="178" y="92" fill="#e9c46a" fontSize="10" fontWeight="bold">2ad</text>
                    </g>
                  )}

                  {task4ProofStep === 3 && (
                    <g>
                      <rect x="35" y="4" width="270" height="22" rx="5" fill="rgba(16, 185, 129, 0.9)" />
                      <text x="45" y="19" fill="#ffffff" fontSize="8.5" fontWeight="bold">✓ Prop. I.47 (Pythagoras): c² = a² + b² + 2ad (Q.E.D.)</text>

                      {/* Final Law of Cosines Verification */}
                      <polygon points="60,125 180,125 250,55" fill="rgba(16, 185, 129, 0.35)" stroke="#10b981" strokeWidth="3" />
                      <circle cx="60" cy="125" r="4" fill="#10b981" />
                      <circle cx="180" cy="125" r="4" fill="#e9c46a" />
                      <circle cx="250" cy="55" r="4" fill="#3b82f6" />
                      <text x="50" y="135" fill="#10b981" fontSize="11" fontWeight="bold">B</text>
                      <text x="175" y="138" fill="#e9c46a" fontSize="11" fontWeight="bold">C</text>
                      <text x="255" y="52" fill="#3b82f6" fontSize="11" fontWeight="bold">A</text>
                      <text x="120" y="85" fill="#10b981" fontSize="11" fontWeight="bold">c² = a² + b² + 2ad</text>
                    </g>
                  )}
                </svg>
              )}

              {/* Proposition XIII: Acute Triangle Law */}
              {task4SelectedProp === 'Prop13' && (
                <svg className="w-full h-full" viewBox="0 0 340 145">
                  {task4ProofStep === 0 && (
                    <g>
                      <rect x="65" y="4" width="210" height="18" rx="4" fill="rgba(30, 41, 59, 0.9)" stroke="#475569" />
                      <text x="75" y="17" fill="#cbd5e1" fontSize="8.5" fontWeight="bold">Given: Def. 10 (Acute Triangle ∠ACB &lt; 90°)</text>

                      {/* Acute Triangle ABC */}
                      <polygon points="60,125 220,125 150,45" fill="rgba(99, 102, 241, 0.2)" stroke="#6366f1" strokeWidth="2.5" />
                      <line x1="60" y1="125" x2="220" y2="125" stroke="#f43f5e" strokeWidth="3" />
                      <line x1="220" y1="125" x2="150" y2="45" stroke="#3b82f6" strokeWidth="3" />
                      <line x1="60" y1="125" x2="150" y2="45" stroke="#10b981" strokeWidth="3.5" />

                      <text x="48" y="135" fill="#10b981" fontSize="11" fontWeight="bold">B</text>
                      <text x="225" y="135" fill="#e9c46a" fontSize="11" fontWeight="bold">C</text>
                      <text x="145" y="38" fill="#3b82f6" fontSize="11" fontWeight="bold">A</text>
                      <text x="135" y="138" fill="#f43f5e" fontSize="10" fontWeight="bold">a (BC)</text>
                      <text x="195" y="85" fill="#3b82f6" fontSize="10" fontWeight="bold">b (AC)</text>
                      <text x="95" y="85" fill="#10b981" fontSize="10" fontWeight="bold">c (AB)</text>
                    </g>
                  )}

                  {task4ProofStep === 1 && (
                    <g>
                      <rect x="65" y="4" width="210" height="18" rx="4" fill="rgba(244, 63, 94, 0.2)" stroke="#f43f5e" />
                      <text x="75" y="17" fill="#f43f5e" fontSize="8.5" fontWeight="bold">Justification: Prop. I.12 (Perpendicular Altitude AD ⊥ BC)</text>

                      <polygon points="60,125 220,125 150,45" fill="rgba(99, 102, 241, 0.15)" stroke="#6366f1" strokeWidth="2" />
                      <line x1="150" y1="45" x2="150" y2="125" stroke="#a855f7" strokeWidth="3" />
                      <path d="M 150 115 L 160 115 L 160 125" fill="none" stroke="#e9c46a" strokeWidth="1.5" />

                      <text x="48" y="135" fill="#10b981" fontSize="11" fontWeight="bold">B</text>
                      <text x="225" y="135" fill="#e9c46a" fontSize="11" fontWeight="bold">C</text>
                      <text x="145" y="38" fill="#3b82f6" fontSize="11" fontWeight="bold">A</text>
                      <text x="145" y="138" fill="#a855f7" fontSize="11" fontWeight="bold">D</text>
                      <text x="180" y="138" fill="#f43f5e" fontSize="10" fontWeight="bold">d (CD)</text>
                      <text x="155" y="85" fill="#a855f7" fontSize="10" fontWeight="bold">h (AD)</text>
                    </g>
                  )}

                  {task4ProofStep === 2 && (
                    <g>
                      <rect x="40" y="4" width="260" height="18" rx="4" fill="rgba(233, 196, 106, 0.2)" stroke="#e9c46a" />
                      <text x="50" y="17" fill="#e9c46a" fontSize="8.5" fontWeight="bold">Justification: Prop. II.7 (Sq(BC) + Sq(CD) = 2Rect(BC,CD) + Sq(BD))</text>

                      <rect x="60" y="65" width="55" height="55" fill="rgba(244, 63, 94, 0.25)" stroke="#f43f5e" strokeWidth="2" />
                      <text x="75" y="98" fill="#f43f5e" fontSize="10" fontWeight="bold">a² + d²</text>

                      <rect x="125" y="65" width="75" height="40" fill="rgba(233, 196, 106, 0.3)" stroke="#e9c46a" strokeWidth="2" />
                      <text x="142" y="88" fill="#e9c46a" fontSize="10" fontWeight="bold">2ad</text>
                    </g>
                  )}

                  {task4ProofStep === 3 && (
                    <g>
                      <rect x="35" y="4" width="270" height="22" rx="5" fill="rgba(16, 185, 129, 0.9)" />
                      <text x="45" y="19" fill="#ffffff" fontSize="8.5" fontWeight="bold">✓ Prop. I.47 & CN 3: c² = a² + b² - 2ad (Q.E.D.)</text>

                      <polygon points="60,125 220,125 150,45" fill="rgba(16, 185, 129, 0.35)" stroke="#10b981" strokeWidth="3" />
                      <circle cx="60" cy="125" r="4" fill="#10b981" />
                      <circle cx="220" cy="125" r="4" fill="#e9c46a" />
                      <circle cx="150" cy="45" r="4" fill="#3b82f6" />
                      <text x="48" y="135" fill="#10b981" fontSize="11" fontWeight="bold">B</text>
                      <text x="225" y="135" fill="#e9c46a" fontSize="11" fontWeight="bold">C</text>
                      <text x="145" y="38" fill="#3b82f6" fontSize="11" fontWeight="bold">A</text>
                      <text x="110" y="85" fill="#10b981" fontSize="11" fontWeight="bold">c² = a² + b² - 2ad</text>
                    </g>
                  )}
                </svg>
              )}

              {/* Proposition XI: Golden Ratio */}
              {task4SelectedProp === 'Prop11' && (
                <svg className="w-full h-full" viewBox="0 0 340 145">
                  {task4ProofStep === 0 && (
                    <g>
                      <rect x="65" y="4" width="210" height="18" rx="4" fill="rgba(30, 41, 59, 0.9)" stroke="#475569" />
                      <text x="75" y="17" fill="#cbd5e1" fontSize="8.5" fontWeight="bold">Given: Straight Line AB of length a (Def. 2)</text>

                      {/* Line AB and Faint Outline of Square ABCD */}
                      <rect x="90" y="35" width="120" height="80" fill="none" stroke="#475569" strokeWidth="1.5" strokeDasharray="3,3" />
                      <line x1="90" y1="115" x2="210" y2="115" stroke="#e9c46a" strokeWidth="4" />
                      <circle cx="90" cy="115" r="5" fill="#e76f51" />
                      <circle cx="210" cy="115" r="5" fill="#10b981" />
                      <text x="82" y="130" fill="#e76f51" fontSize="11" fontWeight="bold">A</text>
                      <text x="212" y="130" fill="#10b981" fontSize="11" fontWeight="bold">B</text>
                      <text x="212" y="32" fill="#64748b" fontSize="10">C</text>
                      <text x="82" y="32" fill="#64748b" fontSize="10">D</text>
                      <text x="140" y="107" fill="#e9c46a" fontSize="11" fontWeight="bold">Line a</text>
                    </g>
                  )}

                  {task4ProofStep === 1 && (
                    <g>
                      <rect x="35" y="4" width="270" height="18" rx="4" fill="rgba(99, 102, 241, 0.2)" stroke="#6366f1" />
                      <text x="45" y="17" fill="#6366f1" fontSize="8.5" fontWeight="bold">Justification: Prop. I.46 (Square ABCD), I.10 (Midpoint E), Postulate 1 (EC)</text>

                      {/* Square ABCD and Right Triangle EBC */}
                      <rect x="90" y="35" width="120" height="80" fill="rgba(99, 102, 241, 0.12)" stroke="#6366f1" strokeWidth="2" />
                      <polygon points="150,115 210,115 210,35" fill="rgba(168, 85, 247, 0.25)" stroke="#a855f7" strokeWidth="1.5" />
                      <line x1="90" y1="115" x2="210" y2="115" stroke="#e9c46a" strokeWidth="3" />
                      <circle cx="150" cy="115" r="4" fill="#a855f7" />
                      <line x1="150" y1="115" x2="210" y2="35" stroke="#a855f7" strokeWidth="2.5" />

                      <text x="82" y="130" fill="#cbd5e1" fontSize="10">A</text>
                      <text x="212" y="130" fill="#cbd5e1" fontSize="10">B</text>
                      <text x="146" y="130" fill="#a855f7" fontSize="10" fontWeight="bold">E</text>
                      <text x="214" y="32" fill="#cbd5e1" fontSize="10">C</text>
                      <text x="82" y="32" fill="#cbd5e1" fontSize="10">D</text>
                      <text x="165" y="70" fill="#a855f7" fontSize="10" fontWeight="bold">EC</text>
                    </g>
                  )}

                  {task4ProofStep === 2 && (
                    <g>
                      <rect x="25" y="4" width="290" height="18" rx="4" fill="rgba(233, 196, 106, 0.2)" stroke="#e9c46a" />
                      <text x="35" y="17" fill="#e9c46a" fontSize="8.5" fontWeight="bold">Justification: Prop. I.3 (EF = EC), Prop. II.6 & I.47 (Rect(FB, FA) + Sq(EA) = Sq(EC))</text>

                      {/* Square ABCD */}
                      <rect x="90" y="35" width="120" height="80" fill="none" stroke="#475569" strokeWidth="1.5" />
                      {/* Midpoint E & Line EC */}
                      <line x1="150" y1="115" x2="210" y2="35" stroke="#a855f7" strokeWidth="1.5" strokeDasharray="3,3" />

                      {/* Extension EA to F where EF = EC */}
                      <line x1="50" y1="115" x2="150" y2="115" stroke="#f43f5e" strokeWidth="2.5" />
                      <circle cx="50" cy="115" r="4" fill="#f43f5e" />
                      <path d="M 210 35 A 100 100 0 0 0 50 115" fill="none" stroke="#a855f7" strokeWidth="1.5" strokeDasharray="2,2" />

                      {/* Square AFGH on AF (AH = AF = x = 40px) */}
                      <rect x="90" y="75" width="40" height="40" fill="rgba(233, 196, 106, 0.35)" stroke="#e9c46a" strokeWidth="2" />
                      <circle cx="130" cy="115" r="4" fill="#e9c46a" />

                      <text x="42" y="130" fill="#f43f5e" fontSize="10" fontWeight="bold">F</text>
                      <text x="85" y="130" fill="#cbd5e1" fontSize="10">A</text>
                      <text x="127" y="130" fill="#e9c46a" fontSize="10" fontWeight="bold">H</text>
                      <text x="146" y="130" fill="#a855f7" fontSize="10">E</text>
                      <text x="212" y="130" fill="#cbd5e1" fontSize="10">B</text>
                      <text x="214" y="32" fill="#cbd5e1" fontSize="10">C</text>
                      <text x="82" y="32" fill="#cbd5e1" fontSize="10">D</text>
                      <text x="133" y="72" fill="#e9c46a" fontSize="10" fontWeight="bold">G</text>
                      <text x="100" y="98" fill="#e9c46a" fontSize="10" fontWeight="bold">x²</text>
                    </g>
                  )}

                  {task4ProofStep === 3 && (
                    <g>
                      <rect x="25" y="4" width="290" height="22" rx="5" fill="rgba(16, 185, 129, 0.9)" />
                      <text x="35" y="19" fill="#ffffff" fontSize="8.5" fontWeight="bold">✓ Prop. XI: Square AFGH (x²) = Rectangle HBCK (a(a-x)) (Q.E.F.)</text>

                      {/* Square ABCD */}
                      <rect x="90" y="35" width="120" height="80" fill="none" stroke="#475569" strokeWidth="1.5" />

                      {/* Square AFGH (x²) */}
                      <rect x="90" y="75" width="40" height="40" fill="rgba(233, 196, 106, 0.4)" stroke="#e9c46a" strokeWidth="2.5" />

                      {/* Rectangle HBDK (a(a-x)) */}
                      <rect x="130" y="35" width="80" height="80" fill="rgba(16, 185, 129, 0.35)" stroke="#10b981" strokeWidth="2.5" />

                      {/* Extension F and H */}
                      <line x1="50" y1="115" x2="90" y2="115" stroke="#f43f5e" strokeWidth="2" strokeDasharray="3,3" />
                      <circle cx="50" cy="115" r="3" fill="#f43f5e" />
                      <circle cx="130" cy="115" r="4" fill="#e9c46a" />

                      <text x="42" y="130" fill="#f43f5e" fontSize="9">F</text>
                      <text x="85" y="130" fill="#cbd5e1" fontSize="10">A</text>
                      <text x="126" y="130" fill="#e9c46a" fontSize="10" fontWeight="bold">H</text>
                      <text x="212" y="130" fill="#cbd5e1" fontSize="10">B</text>
                      <text x="214" y="32" fill="#cbd5e1" fontSize="10">C</text>
                      <text x="82" y="32" fill="#cbd5e1" fontSize="10">D</text>
                      <text x="125" y="32" fill="#10b981" fontSize="10" fontWeight="bold">K</text>
                      <text x="133" y="72" fill="#e9c46a" fontSize="10" fontWeight="bold">G</text>

                      <text x="102" y="98" fill="#e9c46a" fontSize="11" fontWeight="bold">x²</text>
                      <text x="155" y="78" fill="#10b981" fontSize="11" fontWeight="bold">a(a - x)</text>
                      <text x="140" y="130" fill="#10b981" fontSize="9" fontWeight="bold">H cuts AB in Golden Ratio</text>
                    </g>
                  )}
                </svg>
              )}

              {/* Proposition IV.10: The Golden Triangle */}
              {task4SelectedProp === 'Prop4_10' && (
                <svg className="w-full h-full" viewBox="0 0 340 145">
                  {task4ProofStep === 0 && (
                    <g>
                      <rect x="50" y="4" width="240" height="18" rx="4" fill="rgba(30, 41, 59, 0.9)" stroke="#475569" />
                      <text x="60" y="17" fill="#cbd5e1" fontSize="8.5" fontWeight="bold">Given: Segment AB cut at C in Golden Ratio (Prop. II.11)</text>

                      <line x1="80" y1="95" x2="260" y2="95" stroke="#e9c46a" strokeWidth="4" />
                      <circle cx="80" cy="95" r="5" fill="#e76f51" />
                      <circle cx="260" cy="95" r="5" fill="#10b981" />
                      <circle cx="191" cy="95" r="4" fill="#a855f7" />

                      <text x="72" y="113" fill="#e76f51" fontSize="11" fontWeight="bold">A</text>
                      <text x="262" y="113" fill="#10b981" fontSize="11" fontWeight="bold">B</text>
                      <text x="187" y="113" fill="#a855f7" fontSize="11" fontWeight="bold">C (Golden Cut)</text>
                      <text x="120" y="85" fill="#e9c46a" fontSize="10">AC² = AB · BC</text>
                    </g>
                  )}

                  {task4ProofStep === 1 && (
                    <g>
                      <rect x="35" y="4" width="270" height="18" rx="4" fill="rgba(99, 102, 241, 0.2)" stroke="#6366f1" />
                      <text x="45" y="17" fill="#6366f1" fontSize="8.5" fontWeight="bold">Justification: Postulate 3 (Circle BDE, Radius AB), Prop. IV.1 (Chord BD = AC)</text>

                      {/* Circle BDE with center A(130, 95), radius R=100 */}
                      <circle cx="130" cy="95" r="100" fill="rgba(99, 102, 241, 0.08)" stroke="#6366f1" strokeWidth="1.5" strokeDasharray="3,3" />
                      <line x1="130" y1="95" x2="230" y2="95" stroke="#e9c46a" strokeWidth="3" />
                      
                      {/* Point C (Golden Cut on AB), Point D at (211, 36), Point E at (30, 95) on circle BDE */}
                      <circle cx="192" cy="95" r="3.5" fill="#a855f7" />
                      <circle cx="211" cy="36" r="4" fill="#f43f5e" />
                      <circle cx="30" cy="95" r="4" fill="#06b6d4" />
                      
                      <line x1="130" y1="95" x2="211" y2="36" stroke="#3b82f6" strokeWidth="3" />
                      <line x1="230" y1="95" x2="211" y2="36" stroke="#f43f5e" strokeWidth="3" />

                      <text x="120" y="110" fill="#cbd5e1" fontSize="10">A</text>
                      <text x="234" y="108" fill="#cbd5e1" fontSize="10">B</text>
                      <text x="187" y="110" fill="#a855f7" fontSize="10" fontWeight="bold">C</text>
                      <text x="214" y="32" fill="#f43f5e" fontSize="11" fontWeight="bold">D</text>
                      <text x="16" y="98" fill="#06b6d4" fontSize="11" fontWeight="bold">E</text>
                      <text x="180" y="60" fill="#f43f5e" fontSize="9.5" fontWeight="bold">BD = AC</text>
                      <text x="40" y="85" fill="#6366f1" fontSize="9" fontWeight="bold">Circle BDE</text>
                    </g>
                  )}

                  {task4ProofStep === 2 && (
                    <g>
                      <rect x="20" y="4" width="300" height="18" rx="4" fill="rgba(168, 85, 247, 0.2)" stroke="#a855f7" />
                      <text x="30" y="17" fill="#a855f7" fontSize="8.5" fontWeight="bold">Prop. III.37 & III.32: BD is tangent to Circle ACD at D ⟹ ∠BDC = ∠BAD = 36°</text>

                      {/* Circle BDE arc */}
                      <circle cx="130" cy="95" r="100" fill="none" stroke="#475569" strokeWidth="1" strokeDasharray="2,2" />
                      <circle cx="30" cy="95" r="3.5" fill="#06b6d4" />
                      <text x="16" y="98" fill="#06b6d4" fontSize="10">E</text>

                      {/* Circle ACD passing through A(130, 95), C(192, 95), D(211, 36) */}
                      <circle cx="161" cy="52.5" r="52.6" fill="rgba(168, 85, 247, 0.15)" stroke="#a855f7" strokeWidth="2" strokeDasharray="4,3" />
                      <text x="110" y="28" fill="#a855f7" fontSize="9.5" fontWeight="bold">Circle ACD</text>

                      <polygon points="130,95 230,95 211,36" fill="rgba(233, 196, 106, 0.15)" stroke="#e9c46a" strokeWidth="2.5" />
                      <line x1="192" y1="95" x2="211" y2="36" stroke="#a855f7" strokeWidth="2" strokeDasharray="3,3" />

                      {/* Tangent line segment BD */}
                      <line x1="230" y1="95" x2="211" y2="36" stroke="#f43f5e" strokeWidth="3" />

                      <path d="M 150 95 A 20 20 0 0 0 144 83" fill="none" stroke="#e9c46a" strokeWidth="2" />
                      <path d="M 215 95 A 20 20 0 0 1 221 83" fill="none" stroke="#e9c46a" strokeWidth="2.5" />
                      <path d="M 198 46 A 20 20 0 0 0 205 56" fill="none" stroke="#e9c46a" strokeWidth="2.5" />

                      <text x="120" y="110" fill="#cbd5e1" fontSize="10">A</text>
                      <text x="234" y="108" fill="#cbd5e1" fontSize="10">B</text>
                      <text x="187" y="110" fill="#a855f7" fontSize="10" fontWeight="bold">C</text>
                      <text x="214" y="32" fill="#f43f5e" fontSize="11" fontWeight="bold">D</text>
                      <text x="150" y="88" fill="#e9c46a" fontSize="9">36°</text>
                      <text x="210" y="88" fill="#e9c46a" fontSize="9" fontWeight="bold">72°</text>
                      <text x="195" y="60" fill="#e9c46a" fontSize="9" fontWeight="bold">72°</text>
                    </g>
                  )}

                  {task4ProofStep === 3 && (
                    <g>
                      <rect x="15" y="4" width="310" height="22" rx="5" fill="rgba(16, 185, 129, 0.9)" />
                      <text x="25" y="19" fill="#ffffff" fontSize="8.5" fontWeight="bold">✓ Prop. IV.10: Golden Triangle △ABD with Circumcircle ACD & Tangent BD (Q.E.F.)</text>

                      {/* Circle BDE arc */}
                      <circle cx="130" cy="95" r="100" fill="none" stroke="#10b981" strokeWidth="1" strokeDasharray="2,2" />
                      <circle cx="30" cy="95" r="3.5" fill="#06b6d4" />
                      <text x="16" y="98" fill="#06b6d4" fontSize="10">E</text>

                      {/* Circle ACD */}
                      <circle cx="161" cy="52.5" r="52.6" fill="rgba(168, 85, 247, 0.18)" stroke="#a855f7" strokeWidth="2" />
                      <text x="110" y="28" fill="#a855f7" fontSize="9.5" fontWeight="bold">Circle ACD</text>

                      <polygon points="130,95 230,95 211,36" fill="rgba(16, 185, 129, 0.25)" stroke="#10b981" strokeWidth="3" />
                      <line x1="192" y1="95" x2="211" y2="36" stroke="#a855f7" strokeWidth="2" strokeDasharray="3,3" />

                      <circle cx="130" cy="95" r="4" fill="#e76f51" />
                      <circle cx="230" cy="95" r="4" fill="#10b981" />
                      <circle cx="211" cy="36" r="4" fill="#3b82f6" />
                      <circle cx="192" cy="95" r="3.5" fill="#a855f7" />

                      <text x="120" y="110" fill="#e76f51" fontSize="11" fontWeight="bold">A</text>
                      <text x="234" y="108" fill="#10b981" fontSize="11" fontWeight="bold">B</text>
                      <text x="187" y="110" fill="#a855f7" fontSize="11" fontWeight="bold">C</text>
                      <text x="214" y="32" fill="#3b82f6" fontSize="11" fontWeight="bold">D</text>

                      <text x="150" y="88" fill="#10b981" fontSize="9.5" fontWeight="bold">36°</text>
                      <text x="210" y="88" fill="#10b981" fontSize="9.5" fontWeight="bold">72°</text>
                      <text x="195" y="60" fill="#10b981" fontSize="9.5" fontWeight="bold">72°</text>
                      <text x="140" y="68" fill="#e9c46a" fontSize="10" fontWeight="bold">Golden △ (72°-72°-36°)</text>
                    </g>
                  )}
                </svg>
              )}

              {/* Proposition IV.11: Inscribing Regular Pentagon */}
              {task4SelectedProp === 'Prop4_11' && (
                <svg className="w-full h-full" viewBox="0 0 340 145">
                  {task4ProofStep === 0 && (
                    <g>
                      <rect x="50" y="4" width="240" height="18" rx="4" fill="rgba(30, 41, 59, 0.9)" stroke="#475569" />
                      <text x="60" y="17" fill="#cbd5e1" fontSize="8.5" fontWeight="bold">Given: Circle CIRC and Golden Triangle (Prop. IV.10)</text>

                      <circle cx="170" cy="75" r="55" fill="none" stroke="#3b82f6" strokeWidth="2" />
                      <polygon points="60,110 110,110 85,35" fill="rgba(233, 196, 106, 0.25)" stroke="#e9c46a" strokeWidth="2" />
                      <text x="68" y="80" fill="#e9c46a" fontSize="9.5" fontWeight="bold">△FGH (72°-72°-36°)</text>
                      <text x="150" y="80" fill="#3b82f6" fontSize="11" fontWeight="bold">Circle CIRC</text>
                    </g>
                  )}

                  {task4ProofStep === 1 && (
                    <g>
                      <rect x="35" y="4" width="270" height="18" rx="4" fill="rgba(99, 102, 241, 0.2)" stroke="#6366f1" />
                      <text x="45" y="17" fill="#6366f1" fontSize="8.5" fontWeight="bold">Justification: Prop. IV.2 (Inscribe △ACD Equiangular to △FGH)</text>

                      <circle cx="170" cy="75" r="55" fill="none" stroke="#3b82f6" strokeWidth="2" />
                      {/* Exact Inscribed Golden Triangle ACD: A = (170, 20), C = (138, 120), D = (202, 120) */}
                      <polygon points="170,20 138,120 202,120" fill="rgba(233, 196, 106, 0.25)" stroke="#e9c46a" strokeWidth="2.5" />

                      <path d="M 162 38 A 20 20 0 0 0 178 38" fill="none" stroke="#e9c46a" strokeWidth="2" />
                      <path d="M 148 112 A 15 15 0 0 1 154 120" fill="none" stroke="#e9c46a" strokeWidth="2" />
                      <path d="M 186 120 A 15 15 0 0 1 192 112" fill="none" stroke="#e9c46a" strokeWidth="2" />

                      <text x="166" y="15" fill="#e9c46a" fontSize="11" fontWeight="bold">A</text>
                      <text x="124" y="132" fill="#e9c46a" fontSize="11" fontWeight="bold">C</text>
                      <text x="206" y="132" fill="#e9c46a" fontSize="11" fontWeight="bold">D</text>
                      <text x="164" y="48" fill="#e9c46a" fontSize="9" fontWeight="bold">36°</text>
                      <text x="142" y="110" fill="#e9c46a" fontSize="9" fontWeight="bold">72°</text>
                      <text x="188" y="110" fill="#e9c46a" fontSize="9" fontWeight="bold">72°</text>
                      <text x="135" y="70" fill="#e9c46a" fontSize="10" fontWeight="bold">Golden △ACD (Side/Base = φ)</text>
                    </g>
                  )}

                  {task4ProofStep === 2 && (
                    <g>
                      <rect x="35" y="4" width="270" height="18" rx="4" fill="rgba(233, 196, 106, 0.2)" stroke="#e9c46a" />
                      <text x="45" y="17" fill="#e9c46a" fontSize="8.5" fontWeight="bold">Justification: Prop. I.9 (Bisect ∠ACD & ∠ADC by lines CE & DB)</text>

                      <circle cx="170" cy="75" r="55" fill="none" stroke="#3b82f6" strokeWidth="2" />
                      <polygon points="170,20 138,120 202,120" fill="none" stroke="#475569" strokeWidth="1.5" strokeDasharray="3,3" />

                      {/* Bisector CE: C(138, 120) to E(222, 58); Bisector DB: D(202, 120) to B(118, 58) */}
                      <line x1="138" y1="120" x2="222" y2="58" stroke="#a855f7" strokeWidth="2" />
                      <line x1="202" y1="120" x2="118" y2="58" stroke="#a855f7" strokeWidth="2" />

                      <circle cx="118" cy="58" r="4" fill="#a855f7" />
                      <circle cx="222" cy="58" r="4" fill="#a855f7" />

                      <text x="166" y="15" fill="#cbd5e1" fontSize="10">A</text>
                      <text x="105" y="60" fill="#a855f7" fontSize="11" fontWeight="bold">B</text>
                      <text x="124" y="132" fill="#cbd5e1" fontSize="10">C</text>
                      <text x="206" y="132" fill="#cbd5e1" fontSize="10">D</text>
                      <text x="226" y="60" fill="#a855f7" fontSize="11" fontWeight="bold">E</text>
                    </g>
                  )}

                  {task4ProofStep === 3 && (
                    <g>
                      <rect x="20" y="4" width="300" height="22" rx="5" fill="rgba(16, 185, 129, 0.9)" />
                      <text x="30" y="19" fill="#ffffff" fontSize="8.5" fontWeight="bold">✓ Prop. IV.11: Regular Pentagon ABCDE (5 Equal Sides & 108° Internal Angles) (Q.E.F.)</text>

                      <circle cx="170" cy="75" r="55" fill="none" stroke="#3b82f6" strokeWidth="2" strokeDasharray="2,2" />
                      {/* Pentagon vertices: (170, 20), (118, 58), (138, 120), (202, 120), (222, 58) */}
                      <polygon points="170,20 118,58 138,120 202,120 222,58" fill="rgba(16, 185, 129, 0.35)" stroke="#10b981" strokeWidth="3" />

                      <text x="166" y="15" fill="#10b981" fontSize="11" fontWeight="bold">A</text>
                      <text x="105" y="58" fill="#10b981" fontSize="11" fontWeight="bold">B</text>
                      <text x="124" y="133" fill="#10b981" fontSize="11" fontWeight="bold">C</text>
                      <text x="205" y="133" fill="#10b981" fontSize="11" fontWeight="bold">D</text>
                      <text x="226" y="58" fill="#10b981" fontSize="11" fontWeight="bold">E</text>
                      <text x="135" y="75" fill="#e9c46a" fontSize="11" fontWeight="bold">Inscribed Regular Pentagon</text>
                    </g>
                  )}
                </svg>
              )}

              {/* Propositions IV.12-14: Circumscribed Pentagon & Circles */}
              {task4SelectedProp === 'Prop4_12_14' && (
                <svg className="w-full h-full" viewBox="0 0 340 145">
                  {task4ProofStep === 0 && (
                    <g>
                      <rect x="50" y="4" width="240" height="18" rx="4" fill="rgba(30, 41, 59, 0.9)" stroke="#475569" />
                      <text x="60" y="17" fill="#cbd5e1" fontSize="8.5" fontWeight="bold">Given: Inscribed Regular Pentagon ABCDE in Circle</text>

                      <circle cx="170" cy="75" r="55" fill="none" stroke="#3b82f6" strokeWidth="2" />
                      <polygon points="170,20 118,58 138,120 202,120 222,58" fill="rgba(99, 102, 241, 0.2)" stroke="#6366f1" strokeWidth="2" />
                      <text x="145" y="75" fill="#cbd5e1" fontSize="10">Pentagon ABCDE</text>
                    </g>
                  )}

                  {task4ProofStep === 1 && (
                    <g>
                      <rect x="35" y="4" width="270" height="18" rx="4" fill="rgba(99, 102, 241, 0.2)" stroke="#6366f1" />
                      <text x="45" y="17" fill="#6366f1" fontSize="8.5" fontWeight="bold">Justification: Prop. III.17 (Draw Tangents) & Prop. IV.12 (Outer Pentagon PQRST)</text>

                      <circle cx="170" cy="75" r="55" fill="none" stroke="#3b82f6" strokeWidth="2" />
                      <polygon points="170,20 118,58 138,120 202,120 222,58" fill="none" stroke="#475569" strokeWidth="1.5" strokeDasharray="3,3" />

                      {/* Circumscribed Pentagon PQRST: R_out = 55 / cos(36 deg) = 55 / 0.809 = 68.0 */}
                      <polygon points="170,7 105,54 130,130 210,130 235,54" fill="rgba(233, 196, 106, 0.25)" stroke="#e9c46a" strokeWidth="2.5" />

                      <text x="166" y="10" fill="#e9c46a" fontSize="11" fontWeight="bold">P</text>
                      <text x="94" y="56" fill="#e9c46a" fontSize="11" fontWeight="bold">Q</text>
                      <text x="118" y="140" fill="#e9c46a" fontSize="11" fontWeight="bold">R</text>
                      <text x="212" y="140" fill="#e9c46a" fontSize="11" fontWeight="bold">S</text>
                      <text x="239" y="56" fill="#e9c46a" fontSize="11" fontWeight="bold">T</text>
                    </g>
                  )}

                  {task4ProofStep === 2 && (
                    <g>
                      <rect x="35" y="4" width="270" height="18" rx="4" fill="rgba(233, 196, 106, 0.2)" stroke="#e9c46a" />
                      <text x="45" y="17" fill="#e9c46a" fontSize="8.5" fontWeight="bold">Justification: Prop. I.9 (Angle Bisectors Meet at Center O)</text>

                      <polygon points="170,20 118,58 138,120 202,120 222,58" fill="rgba(99, 102, 241, 0.15)" stroke="#6366f1" strokeWidth="2" />
                      <circle cx="170" cy="75" r="4" fill="#a855f7" />

                      {/* Bisector rays from center O(170,75) to vertices */}
                      <line x1="170" y1="75" x2="170" y2="20" stroke="#a855f7" strokeWidth="1.5" strokeDasharray="3,3" />
                      <line x1="170" y1="75" x2="118" y2="58" stroke="#a855f7" strokeWidth="1.5" strokeDasharray="3,3" />
                      <line x1="170" y1="75" x2="138" y2="120" stroke="#a855f7" strokeWidth="1.5" strokeDasharray="3,3" />
                      <line x1="170" y1="75" x2="202" y2="120" stroke="#a855f7" strokeWidth="1.5" strokeDasharray="3,3" />
                      <line x1="170" y1="75" x2="222" y2="58" stroke="#a855f7" strokeWidth="1.5" strokeDasharray="3,3" />

                      <text x="175" y="78" fill="#a855f7" fontSize="11" fontWeight="bold">Center O</text>
                    </g>
                  )}

                  {task4ProofStep === 3 && (
                    <g>
                      <rect x="15" y="4" width="310" height="22" rx="5" fill="rgba(16, 185, 129, 0.9)" />
                      <text x="25" y="19" fill="#ffffff" fontSize="8.5" fontWeight="bold">✓ Prop. IV.13 & IV.14: Incircle r = R·cos 36° & Circumcircle R (Q.E.F.)</text>

                      {/* Incircle r = 44.5 */}
                      <circle cx="170" cy="75" r="44.5" fill="rgba(233, 196, 106, 0.2)" stroke="#e9c46a" strokeWidth="2" />
                      {/* Inscribed Pentagon */}
                      <polygon points="170,20 118,58 138,120 202,120 222,58" fill="none" stroke="#10b981" strokeWidth="2.5" />
                      {/* Circumcircle R = 55 */}
                      <circle cx="170" cy="75" r="55" fill="none" stroke="#3b82f6" strokeWidth="2" strokeDasharray="3,3" />

                      <line x1="170" y1="75" x2="170" y2="20" stroke="#3b82f6" strokeWidth="2" />
                      <line x1="170" y1="75" x2="170" y2="120" stroke="#e9c46a" strokeWidth="2" />

                      <text x="174" y="52" fill="#3b82f6" fontSize="9" fontWeight="bold">R (Circumradius)</text>
                      <text x="174" y="102" fill="#e9c46a" fontSize="9" fontWeight="bold">r (Inradius)</text>
                    </g>
                  )}
                </svg>
              )}

              {/* Proposition I.32 Cor.: Polygon Angle Sum Theorem (n-2)*180 */}
              {task4SelectedProp === 'PropPolygonAngleSum' && (
                <svg className="w-full h-full" viewBox="0 0 340 145">
                  {task4ProofStep === 0 && (
                    <g>
                      <rect x="30" y="2" width="280" height="15" rx="3" fill="rgba(30, 41, 59, 0.9)" stroke="#475569" />
                      <text x="40" y="13" fill="#cbd5e1" fontSize="8" fontWeight="bold">Given: Convex Polygon with n sides (e.g. Pentagon n = 5)</text>

                      {/* Pentagon V1(170,24), V2(115,55), V3(135,122), V4(205,122), V5(225,55) */}
                      <polygon points="170,24 115,55 135,122 205,122 225,55" fill="rgba(99, 102, 241, 0.2)" stroke="#6366f1" strokeWidth="2.5" />

                      <circle cx="170" cy="24" r="3.5" fill="#f43f5e" />
                      <circle cx="115" cy="55" r="3.5" fill="#6366f1" />
                      <circle cx="135" cy="122" r="3.5" fill="#6366f1" />
                      <circle cx="205" cy="122" r="3.5" fill="#6366f1" />
                      <circle cx="225" cy="55" r="3.5" fill="#6366f1" />

                      <text x="166" y="19" fill="#f43f5e" fontSize="10" fontWeight="bold">V₁</text>
                      <text x="100" y="55" fill="#cbd5e1" fontSize="10" fontWeight="bold">V₂</text>
                      <text x="122" y="133" fill="#cbd5e1" fontSize="10" fontWeight="bold">V₃</text>
                      <text x="210" y="133" fill="#cbd5e1" fontSize="10" fontWeight="bold">V₄</text>
                      <text x="230" y="55" fill="#cbd5e1" fontSize="10" fontWeight="bold">V₅</text>
                      <text x="130" y="80" fill="#e9c46a" fontSize="10" fontWeight="bold">Pentagon (n = 5)</text>
                    </g>
                  )}

                  {task4ProofStep === 1 && (
                    <g>
                      <rect x="25" y="2" width="290" height="15" rx="3" fill="rgba(99, 102, 241, 0.2)" stroke="#6366f1" />
                      <text x="35" y="13" fill="#6366f1" fontSize="8" fontWeight="bold">Justification: Postulate 1 (Draw n - 3 = 2 diagonals from vertex V₁)</text>

                      <polygon points="170,24 115,55 135,122 205,122 225,55" fill="none" stroke="#475569" strokeWidth="1.5" />

                      {/* Diagonals V1 -> V3 and V1 -> V4 */}
                      <line x1="170" y1="24" x2="135" y2="122" stroke="#a855f7" strokeWidth="2" strokeDasharray="3,3" />
                      <line x1="170" y1="24" x2="205" y2="122" stroke="#a855f7" strokeWidth="2" strokeDasharray="3,3" />

                      <circle cx="170" cy="24" r="3.5" fill="#f43f5e" />
                      <circle cx="115" cy="55" r="3.5" fill="#6366f1" />
                      <circle cx="135" cy="122" r="3.5" fill="#a855f7" />
                      <circle cx="205" cy="122" r="3.5" fill="#a855f7" />
                      <circle cx="225" cy="55" r="3.5" fill="#6366f1" />

                      <text x="166" y="19" fill="#f43f5e" fontSize="10" fontWeight="bold">V₁</text>
                      <text x="100" y="55" fill="#cbd5e1" fontSize="10">V₂</text>
                      <text x="122" y="133" fill="#a855f7" fontSize="10">V₃</text>
                      <text x="210" y="133" fill="#a855f7" fontSize="10">V₄</text>
                      <text x="230" y="55" fill="#cbd5e1" fontSize="10">V₅</text>

                      <text x="45" y="90" fill="#f43f5e" fontSize="9.5" fontWeight="bold">n - 3 = 2 Diagonals</text>
                      <text x="215" y="90" fill="#10b981" fontSize="9.5" fontWeight="bold">n - 2 = 3 Triangles</text>
                    </g>
                  )}

                  {task4ProofStep === 2 && (
                    <g>
                      <rect x="20" y="2" width="300" height="15" rx="3" fill="rgba(233, 196, 106, 0.2)" stroke="#e9c46a" />
                      <text x="28" y="13" fill="#e9c46a" fontSize="8" fontWeight="bold">Justification: Prop. I.32 (Each of the n-2 triangles has angle sum = 180°)</text>

                      {/* 3 Triangles shaded differently */}
                      <polygon points="170,24 115,55 135,122" fill="rgba(244, 63, 94, 0.3)" stroke="#f43f5e" strokeWidth="2" />
                      <polygon points="170,24 135,122 205,122" fill="rgba(233, 196, 106, 0.3)" stroke="#e9c46a" strokeWidth="2" />
                      <polygon points="170,24 205,122 225,55" fill="rgba(16, 185, 129, 0.3)" stroke="#10b981" strokeWidth="2" />

                      <circle cx="170" cy="24" r="3.5" fill="#f43f5e" />

                      <text x="132" y="62" fill="#ffffff" fontSize="9" fontWeight="bold">△₁ (180°)</text>
                      <text x="156" y="95" fill="#ffffff" fontSize="9" fontWeight="bold">△₂ (180°)</text>
                      <text x="185" y="62" fill="#ffffff" fontSize="9" fontWeight="bold">△₃ (180°)</text>

                      <text x="166" y="19" fill="#f43f5e" fontSize="10" fontWeight="bold">V₁</text>
                      <text x="100" y="55" fill="#cbd5e1" fontSize="10">V₂</text>
                      <text x="122" y="133" fill="#cbd5e1" fontSize="10">V₃</text>
                      <text x="210" y="133" fill="#cbd5e1" fontSize="10">V₄</text>
                      <text x="230" y="55" fill="#cbd5e1" fontSize="10">V₅</text>
                    </g>
                  )}

                  {task4ProofStep === 3 && (
                    <g>
                      <rect x="15" y="2" width="310" height="15" rx="3" fill="rgba(16, 185, 129, 0.9)" />
                      <text x="22" y="13" fill="#ffffff" fontSize="8" fontWeight="bold">✓ Polygon Angle Sum Theorem: Total Sum = (n - 2) × 180° (Q.E.D.)</text>

                      <polygon points="170,24 115,55 135,122 205,122 225,55" fill="rgba(16, 185, 129, 0.25)" stroke="#10b981" strokeWidth="3" />
                      <line x1="170" y1="24" x2="135" y2="122" stroke="#10b981" strokeWidth="1.5" strokeDasharray="2,2" />
                      <line x1="170" y1="24" x2="205" y2="122" stroke="#10b981" strokeWidth="1.5" strokeDasharray="2,2" />

                      <circle cx="170" cy="24" r="3.5" fill="#10b981" />
                      <circle cx="115" cy="55" r="3.5" fill="#10b981" />
                      <circle cx="135" cy="122" r="3.5" fill="#10b981" />
                      <circle cx="205" cy="122" r="3.5" fill="#10b981" />
                      <circle cx="225" cy="55" r="3.5" fill="#10b981" />

                      <text x="166" y="19" fill="#10b981" fontSize="10" fontWeight="bold">V₁</text>
                      <text x="100" y="55" fill="#10b981" fontSize="10" fontWeight="bold">V₂</text>
                      <text x="122" y="133" fill="#10b981" fontSize="10" fontWeight="bold">V₃</text>
                      <text x="210" y="133" fill="#10b981" fontSize="10" fontWeight="bold">V₄</text>
                      <text x="230" y="55" fill="#10b981" fontSize="10" fontWeight="bold">V₅</text>

                      <text x="45" y="70" fill="#e9c46a" fontSize="10.5" fontWeight="bold">Pentagon (n=5): (5 - 2) × 180° = 540°</text>
                      <text x="45" y="88" fill="#3b82f6" fontSize="9.5" fontWeight="bold">Each Angle = 540° / 5 = 108° (Regular Pentagon)</text>
                    </g>
                  )}
                </svg>
              )}

              {/* Golden Ratio in Art & Patterns (Wikipedia φ) */}
              {task4SelectedProp === 'PropArtPatterns' && (
                <svg className="w-full h-full" viewBox="0 0 340 145">
                  {/* Sub-mode 1 'grid': Golden Rectangle Composition in Art */}
                  {artPatternsSubMode === 'grid' && (
                    <g>
                      <rect x="25" y="4" width="290" height="18" rx="4" fill="rgba(99, 102, 241, 0.2)" stroke="#6366f1" />
                      <text x="35" y="17" fill="#6366f1" fontSize="8.5" fontWeight="bold">Art Composition: Golden Rectangle (1.618 : 1) & Golden Cut Focal Lines</text>

                      {/* Golden Canvas (210 x 110) */}
                      <rect x="65" y="25" width="210" height="110" fill="rgba(30, 41, 59, 0.6)" stroke="#e9c46a" strokeWidth="2" />

                      {/* Golden Cut Lines (0.618 x 210 = 130; 0.382 x 110 = 42) */}
                      <line x1="195" y1="25" x2="195" y2="135" stroke="#a855f7" strokeWidth="2" strokeDasharray="3,3" />
                      <line x1="65" y1="67" x2="275" y2="67" stroke="#f43f5e" strokeWidth="2" strokeDasharray="3,3" />

                      {/* Golden Spiral arc */}
                      <path d="M 65 135 A 110 110 0 0 1 175 25 A 68 68 0 0 1 275 93" fill="none" stroke="#06b6d4" strokeWidth="2.5" />

                      <circle cx="195" cy="67" r="5" fill="#f43f5e" />
                      <text x="202" y="65" fill="#f43f5e" fontSize="9" fontWeight="bold">Focal Point (0.618)</text>
                      <text x="72" y="40" fill="#e9c46a" fontSize="9" fontWeight="bold">Golden Canvas φ ≈ 1.618</text>
                      <text x="72" y="125" fill="#cbd5e1" fontSize="8.5">da Vinci (De Divina Proportione, 1509) • Dalí (Last Supper, 1955)</text>
                    </g>
                  )}

                  {/* Sub-mode 2 'phyllotaxis': Sunflower Seed Growth & Golden Angle */}
                  {artPatternsSubMode === 'phyllotaxis' && (
                    <g>
                      <rect x="20" y="4" width="300" height="18" rx="4" fill="rgba(16, 185, 129, 0.2)" stroke="#10b981" />
                      <text x="30" y="17" fill="#10b981" fontSize="8.5" fontWeight="bold">Phyllotaxis: Golden Angle θg = 360° × (1 - 1/φ) ≈ 137.5° (Wikipedia)</text>

                      {/* Seeds Generator */}
                      {Array.from({ length: 140 }).map((_, i) => {
                        const r = 4.2 * Math.sqrt(i + 1);
                        const th = (i + 1) * phyllotaxisAngle * (Math.PI / 180);
                        const cx = 170 + r * Math.cos(th);
                        const cy = 78 + r * Math.sin(th);
                        return <circle key={i} cx={cx} cy={cy} r={2.2} fill={i % 2 === 0 ? "#e9c46a" : "#10b981"} />;
                      })}

                      <text x="25" y="138" fill={Math.abs(phyllotaxisAngle - 137.5) < 0.2 ? "#10b981" : "#f59e0b"} fontSize="9.5" fontWeight="bold">
                        {Math.abs(phyllotaxisAngle - 137.5) < 0.2
                          ? "✓ θg = 137.5° (Golden Angle): Seeds pack densely without gaps or spokes!"
                          : `⚠ θ = ${phyllotaxisAngle}°: Radial spokes & empty gaps appear!`}
                      </text>
                    </g>
                  )}

                  {/* Sub-mode 3 'spirals': Fibonacci & 5-Fold Regular Pentagram */}
                  {artPatternsSubMode === 'spirals' && (
                    <g>
                      <rect x="25" y="4" width="290" height="18" rx="4" fill="rgba(233, 196, 106, 0.2)" stroke="#e9c46a" />
                      <text x="35" y="17" fill="#e9c46a" fontSize="8.5" fontWeight="bold">Fibonacci Ratios (Fn+1/Fn ➔ φ) & Penrose 5-Fold Pentagon Symmetry</text>

                      {/* Regular Pentagram */}
                      <circle cx="170" cy="75" r="50" fill="none" stroke="#475569" strokeWidth="1.5" strokeDasharray="2,2" />
                      <polygon points="170,25 122,60 141,115 199,115 218,60" fill="none" stroke="#10b981" strokeWidth="2" />
                      {/* Pentagram Diagonals */}
                      <polygon points="170,25 141,115 218,60 122,60 199,115" fill="rgba(233, 196, 106, 0.15)" stroke="#e9c46a" strokeWidth="2" />

                      <text x="166" y="20" fill="#10b981" fontSize="10" fontWeight="bold">A</text>
                      <text x="108" y="60" fill="#10b981" fontSize="10" fontWeight="bold">B</text>
                      <text x="128" y="127" fill="#10b981" fontSize="10" fontWeight="bold">C</text>
                      <text x="201" y="127" fill="#10b981" fontSize="10" fontWeight="bold">D</text>
                      <text x="222" y="60" fill="#10b981" fontSize="10" fontWeight="bold">E</text>

                      <text x="30" y="70" fill="#e9c46a" fontSize="9.5" fontWeight="bold">Diagonal / Side = φ = 1.618</text>
                      <text x="30" y="85" fill="#a855f7" fontSize="9">Penrose Quasicrystal Symmetry</text>
                      <text x="30" y="100" fill="#06b6d4" fontSize="9">lim (Fn+1 / Fn) = 1.618034</text>
                    </g>
                  )}

                  {/* Sub-mode 4 'golden_spiral': Golden Spiral (r = φ^(2θ/π)) */}
                  {artPatternsSubMode === 'golden_spiral' && (
                    <g>
                      <rect x="20" y="4" width="300" height="18" rx="4" fill="rgba(233, 196, 106, 0.25)" stroke="#e9c46a" />
                      <text x="30" y="17" fill="#e9c46a" fontSize="8.5" fontWeight="bold">The Golden Spiral: Logarithmic Equation r = φ^(2θ/π) (Wikipedia)</text>

                      {spiralType === 'rectangles' ? (
                        <g>
                          {/* Nested Golden Rectangles & Squares Shading */}
                          <rect x="60" y="25" width="220" height="110" fill="rgba(15, 23, 42, 0.7)" stroke="#e9c46a" strokeWidth="2" />
                          <rect x="60" y="25" width="110" height="110" fill="rgba(30, 41, 59, 0.5)" stroke="#475569" strokeWidth="1.5" />
                          <rect x="170" y="25" width="68" height="68" fill="rgba(51, 65, 85, 0.5)" stroke="#475569" strokeWidth="1.5" />
                          <rect x="196" y="93" width="42" height="42" fill="rgba(71, 85, 105, 0.5)" stroke="#475569" strokeWidth="1.5" />
                          <rect x="170" y="109" width="26" height="26" fill="rgba(100, 116, 139, 0.5)" stroke="#475569" strokeWidth="1.5" />
                          <rect x="170" y="93" width="16" height="16" fill="rgba(148, 163, 184, 0.5)" stroke="#475569" strokeWidth="1.5" />

                          {/* Yellow Fill Highlight for Mathematical Discrepancy Overlap */}
                          <path
                            d="M 60 135 A 110 110 0 0 1 170 25 A 68 68 0 0 1 238 93 A 42 42 0 0 1 196 135 A 26 26 0 0 1 170 109 L 170 109 A 26 26 0 0 0 196 135 A 42 42 0 0 0 238 93 A 68 68 0 0 0 170 25 A 110 110 0 0 0 60 135 Z"
                            fill="rgba(234, 179, 8, 0.25)"
                          />

                          {/* Green Line: Quarter Circle Arcs Approximation */}
                          <path
                            d="M 60 135 A 110 110 0 0 1 170 25 A 68 68 0 0 1 238 93 A 42 42 0 0 1 196 135 A 26 26 0 0 1 170 109 A 16 16 0 0 1 186 93"
                            fill="none"
                            stroke="#10b981"
                            strokeWidth="2.5"
                          />

                          {/* Red Line: True Logarithmic Golden Spiral r = φ^(2θ/π) */}
                          <path
                            d={Array.from({ length: 120 }).map((_, i) => {
                              const theta = (i / 119) * (spiralDepth * Math.PI / 2);
                              const r = 4.2 * Math.pow(1.6180339887, (2 * theta) / Math.PI);
                              const cx = 186 - r * Math.cos(theta);
                              const cy = 109 + r * Math.sin(theta);
                              return `${i === 0 ? 'M' : 'L'} ${cx.toFixed(1)} ${cy.toFixed(1)}`;
                            }).join(' ')}
                            fill="none"
                            stroke="#f43f5e"
                            strokeWidth="2.5"
                          />

                          {/* Labels for Square Side Ratios */}
                          <text x="65" y="40" fill="#e9c46a" fontSize="10" fontWeight="bold">1</text>
                          <text x="175" y="40" fill="#e9c46a" fontSize="9" fontWeight="bold">1/φ</text>
                          <text x="242" y="112" fill="#e9c46a" fontSize="8" fontWeight="bold">1/φ²</text>
                          <text x="172" y="125" fill="#e9c46a" fontSize="7.5" fontWeight="bold">1/φ³</text>
                          <text x="270" y="38" fill="#e9c46a" fontSize="8" fontWeight="bold">1/φ</text>
                          <text x="282" y="115" fill="#e9c46a" fontSize="8" fontWeight="bold">1/φ²</text>

                          {/* Wikipedia Legend */}
                          <g transform="translate(25, 60)">
                            <rect x="0" y="0" width="135" height="42" rx="4" fill="rgba(15, 23, 42, 0.85)" stroke="#475569" />
                            <circle cx="8" cy="10" r="3" fill="#10b981" />
                            <text x="16" y="13" fill="#10b981" fontSize="7.5" fontWeight="bold">Green: Quarter-Circle Arc</text>
                            <circle cx="8" cy="22" r="3" fill="#f43f5e" />
                            <text x="16" y="25" fill="#f43f5e" fontSize="7.5" fontWeight="bold">Red: True Log Spiral r=φ^(2θ/π)</text>
                            <circle cx="8" cy="34" r="3" fill="#eab308" />
                            <text x="16" y="37" fill="#eab308" fontSize="7.5" fontWeight="bold">Yellow: Discrepancy Area</text>
                          </g>
                        </g>
                      ) : (
                        <g>
                          {/* Whirling Golden Triangles (72°-72°-36°) */}
                          <polygon points="170,28 70,138 270,138" fill="rgba(99, 102, 241, 0.12)" stroke="#6366f1" strokeWidth="2" />
                          <line x1="70" y1="138" x2="231.8" y2="95.6" stroke="#a855f7" strokeWidth="1.8" />
                          <line x1="270" y1="138" x2="131.8" y2="111.6" stroke="#e9c46a" strokeWidth="1.8" />
                          <line x1="231.8" y1="95.6" x2="170" y2="104.5" stroke="#10b981" strokeWidth="1.8" />
                          <line x1="131.8" y1="111.6" x2="155" y2="111" stroke="#06b6d4" strokeWidth="1.5" />

                          {/* Red Dashed Bisector Lines Intersecting at Spiral Pole O */}
                          <line x1="170" y1="28" x2="170" y2="138" stroke="#f43f5e" strokeWidth="1.2" strokeDasharray="3,3" />
                          <line x1="70" y1="138" x2="250.9" y2="115.8" stroke="#f43f5e" strokeWidth="1.2" strokeDasharray="3,3" />
                          <line x1="270" y1="138" x2="150.9" y2="61.8" stroke="#f43f5e" strokeWidth="1.2" strokeDasharray="3,3" />

                          {/* Logarithmic Spiral joining Whirling Vertices */}
                          <path
                            d="M 170 28 Q 130 92 70 138 Q 180 160 270 138 Q 260 112 231.8 95.6 Q 180 97 131.8 111.6 Q 150 102 170 104.5"
                            fill="none"
                            stroke="#06b6d4"
                            strokeWidth="3"
                          />

                          {/* Spiral Pole O */}
                          <circle cx="170" cy="108.5" r="4" fill="#a855f7" />
                          <text x="175" y="111" fill="#a855f7" fontSize="8" fontWeight="bold">Pole O</text>

                          <text x="166" y="24" fill="#6366f1" fontSize="10" fontWeight="bold">A (36°)</text>
                          <text x="52" y="142" fill="#6366f1" fontSize="10" fontWeight="bold">B (72°)</text>
                          <text x="274" y="142" fill="#6366f1" fontSize="10" fontWeight="bold">C (72°)</text>
                          <text x="236" y="94" fill="#a855f7" fontSize="9" fontWeight="bold">D</text>
                          <text x="120" y="116" fill="#e9c46a" fontSize="9" fontWeight="bold">E</text>

                          <text x="25" y="42" fill="#06b6d4" fontSize="8.5" fontWeight="bold">Whirling Golden △s (Prop IV.10)</text>
                          <text x="25" y="54" fill="#f43f5e" fontSize="8">Red Rays Intersect at Pole O</text>
                          <text x="25" y="66" fill="#e9c46a" fontSize="8">Vertices lie on r = φ^(2θ/π)</text>
                        </g>
                      )}
                    </g>
                  )}
                </svg>
              )}
            </div>
          </div>
        </div>
      );
    } else if (activeSubtask === 5) {
      // Subtask 5: Book V & VI: Proportions & Similarities
      return (
        <div className="w-full h-full flex flex-col p-4 overflow-y-auto custom-scrollbar bg-gradient-to-br from-slate-950 via-[#0b1021] to-[#07090e]">
          <div className="pb-2 mb-3 border-b border-indigo-900/40 flex items-center justify-between shrink-0">
            <div>
              <span className="text-[10px] font-mono tracking-widest text-indigo-400 uppercase">
                EUCLID'S ELEMENTS • BOOK V & VI PROPORTIONS & SIMILARITIES
              </span>
              <h2 className="text-base font-serif font-bold text-white flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-amber-400" />
                <span>Task 5: Oliver Byrne Book V & VI Proofs</span>
              </h2>
            </div>
          </div>

          {/* Category Tabs for Task 5 */}
          <div className="flex flex-wrap gap-1.5 mb-2.5 bg-slate-900/80 p-1 rounded-xl border border-slate-800 shrink-0">
            {[
              { id: 'areas_parallel', label: '1. Areas & Parallel Cut (Prop I, II)' },
              { id: 'similarity', label: '2. Similarity & Bisector (Prop III, IV, V-VII)' },
              { id: 'means_scaling', label: '3. Cross-Mult & Duplicate Ratio (Prop XVI-XVII, XIX-XX)' },
              { id: 'pythagoras_arcs', label: '4. Generalized Pythagoras & Arcs (Prop XXXI, XXXIII)' }
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setTask5Category(cat.id);
                  if (cat.id === 'areas_parallel') setTask5SelectedProp('Prop6_1');
                  if (cat.id === 'similarity') setTask5SelectedProp('Prop6_3');
                  if (cat.id === 'means_scaling') setTask5SelectedProp('Prop6_16_17');
                  if (cat.id === 'pythagoras_arcs') setTask5SelectedProp('Prop6_31');
                  setTask5ProofStep(0);
                }}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition cursor-pointer ${
                  task5Category === cat.id
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-[0_0_12px_rgba(245,158,11,0.4)]'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Proposition Pills inside Task 5 Category */}
          <div className="flex flex-wrap gap-1.5 mb-3 shrink-0">
            {Object.keys(task5PropsMap)
              .filter((key) => task5PropsMap[key].category === task5Category)
              .map((key) => (
                <button
                  key={key}
                  onClick={() => {
                    setTask5SelectedProp(key);
                    if (key === 'Prop6_1') setTask5CalcMode('area_base');
                    if (key === 'Prop6_2') setTask5CalcMode('thales');
                    if (key === 'Prop6_3') setTask5CalcMode('angle_bisector');
                    if (key === 'Prop6_4') setTask5CalcMode('aaa');
                    if (key === 'Prop6_5_7') setTask5CalcMode('aaa');
                    if (key === 'Prop6_16_17') setTask5CalcMode('cross_mult');
                    if (key === 'Prop6_19_20') setTask5CalcMode('duplicate_ratio');
                    if (key === 'Prop6_31') setTask5CalcMode('gen_pythagoras');
                    if (key === 'Prop6_33') setTask5CalcMode('arc_ratio');
                    setTask5ProofStep(0);
                  }}
                  className={`px-3 py-1 rounded-xl text-[11px] font-bold transition cursor-pointer shrink-0 border ${
                    task5SelectedProp === key
                      ? 'bg-indigo-600 border-indigo-400 text-white shadow-[0_0_12px_rgba(99,102,241,0.5)]'
                      : 'bg-slate-900 border-slate-750 text-slate-200 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  {task5PropsMap[key].title}
                </button>
              ))}
          </div>

          {/* Active Proposition Card */}
          <div className="bg-slate-900/90 border border-indigo-500/30 rounded-2xl p-3 shadow-2xl flex flex-col justify-between flex-1 overflow-y-auto custom-scrollbar">
            <div>
              <div className="flex items-center justify-between text-[10.5px] font-mono text-amber-400 uppercase tracking-wider mb-0.5">
                <span>{activePropObj.title.toUpperCase()}</span>
                <span className="text-[10.5px] font-mono text-emerald-400 font-bold">Q.E.D.</span>
              </div>
              <h3 className="text-xs font-serif font-bold text-white mb-0.5">{activePropObj.title}</h3>
              <p className="text-[9.5px] text-amber-200 font-serif italic mb-1 leading-tight">"{activePropObj.text}"</p>
              
              <div className="bg-slate-950/80 px-2.5 py-0.5 rounded-lg border border-slate-800 text-[10px] font-mono text-indigo-300 font-semibold mb-1.5">
                {activePropObj.formula}
              </div>

              <div className="flex justify-between items-center mb-1">
                <span className="text-[10px] font-mono text-indigo-300">Proof Step {task5ProofStep + 1} of {activePropObj.steps.length}</span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      const nextStep = (task5ProofStep - 1 + activePropObj.steps.length) % activePropObj.steps.length;
                      setTask5ProofStep(nextStep);
                    }}
                    className="px-2.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] font-bold transition cursor-pointer flex items-center gap-0.5 border border-slate-700"
                  >
                    <ChevronLeft className="w-3 h-3" />
                    <span>Prev Step</span>
                  </button>
                  <button
                    onClick={() => {
                      const nextStep = (task5ProofStep + 1) % activePropObj.steps.length;
                      setTask5ProofStep(nextStep);
                    }}
                    className="px-2.5 py-0.5 rounded bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-bold transition cursor-pointer flex items-center gap-0.5"
                  >
                    <span>Advance Step</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>

              <div className="bg-slate-950 px-2.5 py-1 rounded-xl border border-slate-800 text-[10px] text-slate-200 leading-tight mb-1.5">
                {activePropObj.steps[task5ProofStep]}
              </div>
            </div>

            {/* Oliver Byrne Color-Coded Geometric SVG for Task 5 */}
            <div className="h-[155px] shrink-0 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-center p-1 relative overflow-hidden">
              {/* Proposition VI.1: Areas & Bases */}
              {task5SelectedProp === 'Prop6_1' && (
                <svg className="w-full h-full" viewBox="0 0 340 145">
                  {task5ProofStep === 0 && (
                    <g>
                      <rect x="40" y="2" width="260" height="15" rx="3" fill="rgba(30, 41, 59, 0.9)" stroke="#475569" />
                      <text x="50" y="13" fill="#cbd5e1" fontSize="8" fontWeight="bold">Given: △ABC & △ACD with Altitude h from Vertex A</text>

                      {/* Parallels & Altitude */}
                      <line x1="20" y1="32" x2="320" y2="32" stroke="#475569" strokeWidth="1" strokeDasharray="3,3" />
                      <line x1="20" y1="125" x2="320" y2="125" stroke="#475569" strokeWidth="1.5" />
                      <line x1="170" y1="32" x2="170" y2="125" stroke="#a855f7" strokeWidth="1.5" strokeDasharray="2,2" />

                      {/* Triangles △ABC (b1=60) & △ACD (b2=80) */}
                      <polygon points="170,32 70,125 130,125" fill="rgba(244, 63, 94, 0.25)" stroke="#f43f5e" strokeWidth="2" />
                      <polygon points="170,32 130,125 210,125" fill="rgba(16, 185, 129, 0.25)" stroke="#10b981" strokeWidth="2" />

                      <circle cx="170" cy="32" r="3.5" fill="#cbd5e1" />
                      <circle cx="70" cy="125" r="3.5" fill="#f43f5e" />
                      <circle cx="130" cy="125" r="3.5" fill="#cbd5e1" />
                      <circle cx="210" cy="125" r="3.5" fill="#10b981" />

                      <text x="166" y="27" fill="#cbd5e1" fontSize="10" fontWeight="bold">A</text>
                      <text x="56" y="136" fill="#f43f5e" fontSize="10" fontWeight="bold">B</text>
                      <text x="126" y="136" fill="#cbd5e1" fontSize="10" fontWeight="bold">C</text>
                      <text x="214" y="136" fill="#10b981" fontSize="10" fontWeight="bold">D</text>
                      <text x="92" y="118" fill="#f43f5e" fontSize="9.5" fontWeight="bold">Base b₁</text>
                      <text x="162" y="118" fill="#10b981" fontSize="9.5" fontWeight="bold">Base b₂</text>
                      <text x="174" y="75" fill="#a855f7" fontSize="8.5">Height h</text>
                    </g>
                  )}

                  {task5ProofStep === 1 && (
                    <g>
                      <rect x="30" y="2" width="280" height="15" rx="3" fill="rgba(99, 102, 241, 0.2)" stroke="#6366f1" />
                      <text x="40" y="13" fill="#6366f1" fontSize="8" fontWeight="bold">Justification: Postulate 2 (Extension of Bases to E, F, G, H) & Prop. I.38</text>

                      <line x1="10" y1="125" x2="330" y2="125" stroke="#475569" strokeWidth="1.5" />
                      <polygon points="170,32 70,125 130,125" fill="rgba(244, 63, 94, 0.2)" stroke="#f43f5e" strokeWidth="2" />
                      <polygon points="170,32 130,125 210,125" fill="rgba(16, 185, 129, 0.2)" stroke="#10b981" strokeWidth="2" />

                      {/* Extended bases */}
                      <line x1="10" y1="125" x2="70" y2="125" stroke="#f43f5e" strokeWidth="2" strokeDasharray="3,3" />
                      <line x1="210" y1="125" x2="310" y2="125" stroke="#10b981" strokeWidth="2" strokeDasharray="3,3" />

                      <circle cx="170" cy="32" r="3.5" fill="#cbd5e1" />
                      <circle cx="70" cy="125" r="3.5" fill="#f43f5e" />
                      <circle cx="130" cy="125" r="3.5" fill="#cbd5e1" />
                      <circle cx="210" cy="125" r="3.5" fill="#10b981" />
                      <circle cx="20" cy="125" r="3" fill="#f43f5e" />
                      <circle cx="270" cy="125" r="3" fill="#10b981" />

                      <text x="166" y="27" fill="#cbd5e1" fontSize="10">A</text>
                      <text x="68" y="136" fill="#f43f5e" fontSize="10">B</text>
                      <text x="126" y="136" fill="#cbd5e1" fontSize="10">C</text>
                      <text x="212" y="136" fill="#10b981" fontSize="10">D</text>
                      <text x="14" y="136" fill="#f43f5e" fontSize="10" fontWeight="bold">E</text>
                      <text x="272" y="136" fill="#10b981" fontSize="10" fontWeight="bold">F</text>
                      <text x="40" y="85" fill="#f43f5e" fontSize="8.5" fontWeight="bold">Multiples of b₁</text>
                      <text x="235" y="85" fill="#10b981" fontSize="8.5" fontWeight="bold">Multiples of b₂</text>
                    </g>
                  )}

                  {task5ProofStep === 2 && (
                    <g>
                      <rect x="20" y="2" width="300" height="15" rx="3" fill="rgba(233, 196, 106, 0.2)" stroke="#e9c46a" />
                      <text x="28" y="13" fill="#e9c46a" fontSize="8" fontWeight="bold">Justification: Prop. I.38 (Equal Bases Under Same Height Have Equal Areas)</text>

                      <polygon points="170,32 70,125 130,125" fill="rgba(244, 63, 94, 0.35)" stroke="#f43f5e" strokeWidth="2.5" />
                      <polygon points="170,32 130,125 210,125" fill="rgba(16, 185, 129, 0.35)" stroke="#10b981" strokeWidth="2.5" />

                      <circle cx="170" cy="32" r="3.5" fill="#cbd5e1" />
                      <circle cx="70" cy="125" r="3.5" fill="#f43f5e" />
                      <circle cx="130" cy="125" r="3.5" fill="#cbd5e1" />
                      <circle cx="210" cy="125" r="3.5" fill="#10b981" />

                      <text x="92" y="85" fill="#ffffff" fontSize="10.5" fontWeight="bold">Area 1</text>
                      <text x="156" y="85" fill="#ffffff" fontSize="10.5" fontWeight="bold">Area 2</text>
                      <text x="166" y="27" fill="#cbd5e1" fontSize="10">A</text>
                      <text x="68" y="136" fill="#f43f5e" fontSize="10">B</text>
                      <text x="126" y="136" fill="#cbd5e1" fontSize="10">C</text>
                      <text x="212" y="136" fill="#10b981" fontSize="10">D</text>
                    </g>
                  )}

                  {task5ProofStep === 3 && (
                    <g>
                      <rect x="20" y="2" width="300" height="15" rx="3" fill="rgba(16, 185, 129, 0.9)" />
                      <text x="28" y="13" fill="#ffffff" fontSize="8" fontWeight="bold">✓ Prop. VI.1: Area(△ABC) / Area(△ACD) = Base(BC) / Base(CD) (Q.E.D.)</text>

                      <polygon points="170,32 70,125 130,125" fill="rgba(244, 63, 94, 0.3)" stroke="#f43f5e" strokeWidth="3" />
                      <polygon points="170,32 130,125 210,125" fill="rgba(16, 185, 129, 0.3)" stroke="#10b981" strokeWidth="3" />

                      <circle cx="170" cy="32" r="3.5" fill="#cbd5e1" />
                      <circle cx="70" cy="125" r="3.5" fill="#f43f5e" />
                      <circle cx="130" cy="125" r="3.5" fill="#cbd5e1" />
                      <circle cx="210" cy="125" r="3.5" fill="#10b981" />

                      <text x="166" y="27" fill="#cbd5e1" fontSize="10">A</text>
                      <text x="68" y="136" fill="#f43f5e" fontSize="10">B</text>
                      <text x="126" y="136" fill="#cbd5e1" fontSize="10">C</text>
                      <text x="212" y="136" fill="#10b981" fontSize="10">D</text>
                      <text x="100" y="75" fill="#e9c46a" fontSize="11" fontWeight="bold">Area Ratio = Base Ratio</text>
                    </g>
                  )}
                </svg>
              )}

              {/* Proposition VI.2: Thales's Proportionality Theorem */}
              {task5SelectedProp === 'Prop6_2' && (
                <svg className="w-full h-full" viewBox="0 0 340 145">
                  {task5ProofStep === 0 && (
                    <g>
                      <rect x="40" y="2" width="260" height="15" rx="3" fill="rgba(30, 41, 59, 0.9)" stroke="#475569" />
                      <text x="50" y="13" fill="#cbd5e1" fontSize="8" fontWeight="bold">Given: △ABC and Parallel Line DE ∥ BC</text>

                      <polygon points="160,28 50,128 270,128" fill="rgba(99, 102, 241, 0.15)" stroke="#6366f1" strokeWidth="2" />
                      <line x1="105" y1="78" x2="215" y2="78" stroke="#e9c46a" strokeWidth="3" />

                      <circle cx="160" cy="28" r="3.5" fill="#cbd5e1" />
                      <circle cx="50" cy="128" r="3.5" fill="#cbd5e1" />
                      <circle cx="270" cy="128" r="3.5" fill="#cbd5e1" />
                      <circle cx="105" cy="78" r="3.5" fill="#e9c46a" />
                      <circle cx="215" cy="78" r="3.5" fill="#e9c46a" />

                      <text x="156" y="23" fill="#cbd5e1" fontSize="10" fontWeight="bold">A</text>
                      <text x="36" y="134" fill="#cbd5e1" fontSize="10" fontWeight="bold">B</text>
                      <text x="274" y="134" fill="#cbd5e1" fontSize="10" fontWeight="bold">C</text>
                      <text x="92" y="80" fill="#e9c46a" fontSize="10" fontWeight="bold">D</text>
                      <text x="220" y="80" fill="#e9c46a" fontSize="10" fontWeight="bold">E</text>
                      <text x="145" y="73" fill="#e9c46a" fontSize="8.5" fontWeight="bold">DE ∥ BC</text>
                    </g>
                  )}

                  {task5ProofStep === 1 && (
                    <g>
                      <rect x="30" y="2" width="280" height="15" rx="3" fill="rgba(99, 102, 241, 0.2)" stroke="#6366f1" />
                      <text x="40" y="13" fill="#6366f1" fontSize="8" fontWeight="bold">Justification: Join BE & CD (Postulate 1) & Prop. I.37</text>

                      <polygon points="160,28 50,128 270,128" fill="none" stroke="#475569" strokeWidth="1.5" />
                      <polygon points="105,78 215,78 50,128" fill="rgba(244, 63, 94, 0.2)" stroke="#f43f5e" strokeWidth="2" />
                      <polygon points="105,78 215,78 270,128" fill="rgba(16, 185, 129, 0.2)" stroke="#10b981" strokeWidth="2" />

                      <circle cx="160" cy="28" r="3.5" fill="#cbd5e1" />
                      <circle cx="50" cy="128" r="3.5" fill="#cbd5e1" />
                      <circle cx="270" cy="128" r="3.5" fill="#cbd5e1" />
                      <circle cx="105" cy="78" r="3.5" fill="#e9c46a" />
                      <circle cx="215" cy="78" r="3.5" fill="#e9c46a" />

                      <text x="156" y="23" fill="#cbd5e1" fontSize="10">A</text>
                      <text x="36" y="134" fill="#cbd5e1" fontSize="10">B</text>
                      <text x="274" y="134" fill="#cbd5e1" fontSize="10">C</text>
                      <text x="92" y="80" fill="#e9c46a" fontSize="10">D</text>
                      <text x="220" y="80" fill="#e9c46a" fontSize="10">E</text>
                      <text x="120" y="108" fill="#ffffff" fontSize="8.5" fontWeight="bold">Area(△BDE) = Area(△CDE)</text>
                    </g>
                  )}

                  {task5ProofStep === 2 && (
                    <g>
                      <rect x="20" y="2" width="300" height="15" rx="3" fill="rgba(233, 196, 106, 0.2)" stroke="#e9c46a" />
                      <text x="28" y="13" fill="#e9c46a" fontSize="8" fontWeight="bold">Justification: Prop. VI.1 (Area(△ADE)/Area(△BDE) = AD/DB & AE/EC)</text>

                      <polygon points="160,28 105,78 215,78" fill="rgba(233, 196, 106, 0.3)" stroke="#e9c46a" strokeWidth="2.5" />
                      <line x1="105" y1="78" x2="270" y2="128" stroke="#10b981" strokeWidth="2" strokeDasharray="3,3" />
                      <line x1="215" y1="78" x2="50" y2="128" stroke="#f43f5e" strokeWidth="2" strokeDasharray="3,3" />

                      <circle cx="160" cy="28" r="3.5" fill="#cbd5e1" />
                      <circle cx="50" cy="128" r="3.5" fill="#cbd5e1" />
                      <circle cx="270" cy="128" r="3.5" fill="#cbd5e1" />
                      <circle cx="105" cy="78" r="3.5" fill="#e9c46a" />
                      <circle cx="215" cy="78" r="3.5" fill="#e9c46a" />

                      <text x="156" y="23" fill="#cbd5e1" fontSize="10">A</text>
                      <text x="36" y="134" fill="#cbd5e1" fontSize="10">B</text>
                      <text x="274" y="134" fill="#cbd5e1" fontSize="10">C</text>
                      <text x="92" y="80" fill="#e9c46a" fontSize="10">D</text>
                      <text x="220" y="80" fill="#e9c46a" fontSize="10">E</text>
                      <text x="68" y="52" fill="#f43f5e" fontSize="9.5" fontWeight="bold">AD/DB</text>
                      <text x="222" y="52" fill="#10b981" fontSize="9.5" fontWeight="bold">AE/EC</text>
                    </g>
                  )}

                  {task5ProofStep === 3 && (
                    <g>
                      <rect x="20" y="2" width="300" height="15" rx="3" fill="rgba(16, 185, 129, 0.9)" />
                      <text x="28" y="13" fill="#ffffff" fontSize="8" fontWeight="bold">✓ Prop. VI.2: Thales\'s Theorem AD / DB = AE / EC ⟺ DE ∥ BC (Q.E.D.)</text>

                      <polygon points="160,28 50,128 270,128" fill="rgba(16, 185, 129, 0.2)" stroke="#10b981" strokeWidth="3" />
                      <line x1="105" y1="78" x2="215" y2="78" stroke="#e9c46a" strokeWidth="3.5" />

                      <circle cx="160" cy="28" r="3.5" fill="#10b981" />
                      <circle cx="50" cy="128" r="3.5" fill="#10b981" />
                      <circle cx="270" cy="128" r="3.5" fill="#10b981" />
                      <circle cx="105" cy="78" r="3.5" fill="#e9c46a" />
                      <circle cx="215" cy="78" r="3.5" fill="#e9c46a" />

                      <text x="156" y="23" fill="#10b981" fontSize="10" fontWeight="bold">A</text>
                      <text x="36" y="134" fill="#10b981" fontSize="10" fontWeight="bold">B</text>
                      <text x="274" y="134" fill="#10b981" fontSize="10" fontWeight="bold">C</text>
                      <text x="92" y="80" fill="#e9c46a" fontSize="10" fontWeight="bold">D</text>
                      <text x="220" y="80" fill="#e9c46a" fontSize="10" fontWeight="bold">E</text>
                      <text x="110" y="102" fill="#e9c46a" fontSize="11" fontWeight="bold">AD / DB = AE / EC</text>
                    </g>
                  )}
                </svg>
              )}

              {/* Proposition VI.3: Angle Bisector Theorem */}
              {task5SelectedProp === 'Prop6_3' && (
                <svg className="w-full h-full" viewBox="0 0 340 145">
                  {task5ProofStep === 0 && (
                    <g>
                      <rect x="30" y="2" width="280" height="15" rx="3" fill="rgba(30, 41, 59, 0.9)" stroke="#475569" />
                      <text x="40" y="13" fill="#cbd5e1" fontSize="8" fontWeight="bold">Given: △ABC with Angle Bisector AD (∠BAD = ∠DAC)</text>

                      {/* △ABC with A(160,80), B(40,130), C(270,130), D(159,130), E(268,30) */}
                      <polygon points="160,80 40,130 270,130" fill="rgba(99, 102, 241, 0.15)" stroke="#6366f1" strokeWidth="2" />
                      <line x1="160" y1="80" x2="159" y2="130" stroke="#a855f7" strokeWidth="2.5" />
                      {/* Straight line BE through A to E */}
                      <line x1="40" y1="130" x2="268" y2="30" stroke="#475569" strokeWidth="1" strokeDasharray="2,2" />
                      <line x1="270" y1="130" x2="268" y2="30" stroke="#a855f7" strokeWidth="1.5" strokeDasharray="3,3" />

                      <circle cx="160" cy="80" r="3.5" fill="#6366f1" />
                      <circle cx="40" cy="130" r="3.5" fill="#6366f1" />
                      <circle cx="270" cy="130" r="3.5" fill="#6366f1" />
                      <circle cx="159" cy="130" r="3.5" fill="#a855f7" />
                      <circle cx="268" cy="30" r="3.5" fill="#f43f5e" />

                      <text x="156" y="72" fill="#cbd5e1" fontSize="10" fontWeight="bold">A</text>
                      <text x="24" y="134" fill="#cbd5e1" fontSize="10" fontWeight="bold">B</text>
                      <text x="278" y="134" fill="#cbd5e1" fontSize="10" fontWeight="bold">C</text>
                      <text x="156" y="143" fill="#a855f7" fontSize="10" fontWeight="bold">D</text>
                      <text x="276" y="32" fill="#f43f5e" fontSize="10" fontWeight="bold">E</text>
                      <text x="148" y="102" fill="#a855f7" fontSize="8.5" fontWeight="bold">α = α</text>
                    </g>
                  )}

                  {task5ProofStep === 1 && (
                    <g>
                      <rect x="30" y="2" width="280" height="15" rx="3" fill="rgba(99, 102, 241, 0.2)" stroke="#6366f1" />
                      <text x="40" y="13" fill="#6366f1" fontSize="8" fontWeight="bold">Justification: Prop. I.31 (Draw CE ∥ AD meeting BA produced at E)</text>

                      <polygon points="160,80 40,130 270,130" fill="none" stroke="#475569" strokeWidth="1.5" />
                      <line x1="160" y1="80" x2="159" y2="130" stroke="#a855f7" strokeWidth="2.5" />
                      {/* Straight line BE produced */}
                      <line x1="40" y1="130" x2="268" y2="30" stroke="#f43f5e" strokeWidth="2" strokeDasharray="3,3" />
                      <line x1="270" y1="130" x2="268" y2="30" stroke="#a855f7" strokeWidth="2.5" />

                      <circle cx="160" cy="80" r="3.5" fill="#6366f1" />
                      <circle cx="40" cy="130" r="3.5" fill="#6366f1" />
                      <circle cx="270" cy="130" r="3.5" fill="#6366f1" />
                      <circle cx="159" cy="130" r="3.5" fill="#a855f7" />
                      <circle cx="268" cy="30" r="3.5" fill="#f43f5e" />

                      <text x="156" y="72" fill="#cbd5e1" fontSize="10" fontWeight="bold">A</text>
                      <text x="24" y="134" fill="#cbd5e1" fontSize="10" fontWeight="bold">B</text>
                      <text x="278" y="134" fill="#cbd5e1" fontSize="10" fontWeight="bold">C</text>
                      <text x="156" y="143" fill="#a855f7" fontSize="10" fontWeight="bold">D</text>
                      <text x="276" y="32" fill="#f43f5e" fontSize="10" fontWeight="bold">E</text>
                      <text x="220" y="75" fill="#a855f7" fontSize="9" fontWeight="bold">CE ∥ AD</text>
                    </g>
                  )}

                  {task5ProofStep === 2 && (
                    <g>
                      <rect x="20" y="2" width="300" height="15" rx="3" fill="rgba(233, 196, 106, 0.2)" stroke="#e9c46a" />
                      <text x="28" y="13" fill="#e9c46a" fontSize="8" fontWeight="bold">Justification: Prop. I.29 (∠BAD=∠AEC & ∠DAC=∠ACE) ⟹ AE = AC (Prop. I.6)</text>

                      {/* Full triangle ABC and extended E */}
                      <polygon points="160,80 40,130 270,130" fill="none" stroke="#475569" strokeWidth="1.5" />
                      <polygon points="160,80 270,130 268,30" fill="rgba(233, 196, 106, 0.3)" stroke="#e9c46a" strokeWidth="2.5" />
                      <line x1="160" y1="80" x2="159" y2="130" stroke="#a855f7" strokeWidth="2" strokeDasharray="3,3" />

                      <circle cx="160" cy="80" r="3.5" fill="#6366f1" />
                      <circle cx="40" cy="130" r="3.5" fill="#6366f1" />
                      <circle cx="270" cy="130" r="3.5" fill="#6366f1" />
                      <circle cx="159" cy="130" r="3.5" fill="#a855f7" />
                      <circle cx="268" cy="30" r="3.5" fill="#f43f5e" />

                      <text x="156" y="72" fill="#cbd5e1" fontSize="10" fontWeight="bold">A</text>
                      <text x="24" y="134" fill="#cbd5e1" fontSize="10" fontWeight="bold">B</text>
                      <text x="278" y="134" fill="#cbd5e1" fontSize="10" fontWeight="bold">C</text>
                      <text x="156" y="143" fill="#a855f7" fontSize="10" fontWeight="bold">D</text>
                      <text x="276" y="32" fill="#f43f5e" fontSize="10" fontWeight="bold">E</text>
                      <text x="180" y="55" fill="#e9c46a" fontSize="9.5" fontWeight="bold">AE = AC (Isosceles △ACE)</text>
                    </g>
                  )}

                  {task5ProofStep === 3 && (
                    <g>
                      <rect x="20" y="2" width="300" height="15" rx="3" fill="rgba(16, 185, 129, 0.9)" />
                      <text x="28" y="13" fill="#ffffff" fontSize="8" fontWeight="bold">✓ Prop. VI.3: BD / DC = BA / AE = AB / AC (Angle Bisector Theorem Q.E.D.)</text>

                      <polygon points="160,80 40,130 270,130" fill="rgba(16, 185, 129, 0.25)" stroke="#10b981" strokeWidth="2.5" />
                      <line x1="160" y1="80" x2="159" y2="130" stroke="#a855f7" strokeWidth="3" />
                      <line x1="40" y1="130" x2="268" y2="30" stroke="#10b981" strokeWidth="2" strokeDasharray="3,3" />
                      <line x1="270" y1="130" x2="268" y2="30" stroke="#a855f7" strokeWidth="2" strokeDasharray="3,3" />

                      <circle cx="160" cy="80" r="3.5" fill="#10b981" />
                      <circle cx="40" cy="130" r="3.5" fill="#10b981" />
                      <circle cx="270" cy="130" r="3.5" fill="#10b981" />
                      <circle cx="159" cy="130" r="3.5" fill="#a855f7" />
                      <circle cx="268" cy="30" r="3.5" fill="#f43f5e" />

                      <text x="156" y="72" fill="#10b981" fontSize="10" fontWeight="bold">A</text>
                      <text x="24" y="134" fill="#10b981" fontSize="10" fontWeight="bold">B</text>
                      <text x="278" y="134" fill="#10b981" fontSize="10" fontWeight="bold">C</text>
                      <text x="156" y="143" fill="#a855f7" fontSize="10" fontWeight="bold">D</text>
                      <text x="276" y="32" fill="#f43f5e" fontSize="10" fontWeight="bold">E</text>
                      <text x="110" y="105" fill="#e9c46a" fontSize="11" fontWeight="bold">BD / DC = AB / AC</text>
                    </g>
                  )}
                </svg>
              )}

              {/* Proposition VI.4 & VI.5-7: AAA & SSS/SAS Similarity */}
              {(task5SelectedProp === 'Prop6_4' || task5SelectedProp === 'Prop6_5_7') && (
                <svg className="w-full h-full" viewBox="0 0 340 145">
                  {task5ProofStep === 0 && (
                    <g>
                      <rect x="40" y="2" width="260" height="15" rx="3" fill="rgba(30, 41, 59, 0.9)" stroke="#475569" />
                      <text x="50" y="13" fill="#cbd5e1" fontSize="8" fontWeight="bold">Given: Equiangular / Proportional Triangles △ABC & △DEF</text>

                      {/* △ABC (small) & △DEF (large) */}
                      <polygon points="80,35 30,125 130,125" fill="rgba(99, 102, 241, 0.2)" stroke="#6366f1" strokeWidth="2.5" />
                      <polygon points="250,25 180,135 320,135" fill="rgba(233, 196, 106, 0.2)" stroke="#e9c46a" strokeWidth="2.5" />

                      <circle cx="80" cy="35" r="3.5" fill="#6366f1" />
                      <circle cx="30" cy="125" r="3.5" fill="#6366f1" />
                      <circle cx="130" cy="125" r="3.5" fill="#6366f1" />
                      <circle cx="250" cy="25" r="3.5" fill="#e9c46a" />
                      <circle cx="180" cy="135" r="3.5" fill="#e9c46a" />
                      <circle cx="320" cy="135" r="3.5" fill="#e9c46a" />

                      <text x="76" y="29" fill="#6366f1" fontSize="10" fontWeight="bold">A</text>
                      <text x="16" y="132" fill="#6366f1" fontSize="10" fontWeight="bold">B</text>
                      <text x="134" y="132" fill="#6366f1" fontSize="10" fontWeight="bold">C</text>
                      <text x="246" y="20" fill="#e9c46a" fontSize="10" fontWeight="bold">D</text>
                      <text x="168" y="142" fill="#e9c46a" fontSize="10" fontWeight="bold">E</text>
                      <text x="324" y="142" fill="#e9c46a" fontSize="10" fontWeight="bold">F</text>
                    </g>
                  )}

                  {task5ProofStep === 1 && (
                    <g>
                      <rect x="30" y="2" width="280" height="15" rx="3" fill="rgba(99, 102, 241, 0.2)" stroke="#6366f1" />
                      <text x="40" y="13" fill="#6366f1" fontSize="8" fontWeight="bold">Justification: Place bases on one line & extend AB & FE to intersect at G</text>

                      <polygon points="80,35 30,125 130,125" fill="rgba(99, 102, 241, 0.2)" stroke="#6366f1" strokeWidth="2" />
                      <polygon points="250,25 180,135 320,135" fill="rgba(233, 196, 106, 0.2)" stroke="#e9c46a" strokeWidth="2" />
                      <line x1="80" y1="35" x2="165" y2="12" stroke="#f43f5e" strokeWidth="1.5" strokeDasharray="3,3" />
                      <line x1="250" y1="25" x2="165" y2="12" stroke="#f43f5e" strokeWidth="1.5" strokeDasharray="3,3" />

                      <circle cx="80" cy="35" r="3.5" fill="#6366f1" />
                      <circle cx="250" cy="25" r="3.5" fill="#e9c46a" />
                      <circle cx="165" cy="12" r="3.5" fill="#f43f5e" />

                      <text x="76" y="29" fill="#6366f1" fontSize="10">A</text>
                      <text x="246" y="20" fill="#e9c46a" fontSize="10">D</text>
                      <text x="162" y="22" fill="#f43f5e" fontSize="10" fontWeight="bold">G</text>
                      <text x="140" y="45" fill="#f43f5e" fontSize="8.5" fontWeight="bold">Parallelogram AGDC</text>
                    </g>
                  )}

                  {task5ProofStep === 2 && (
                    <g>
                      <rect x="20" y="2" width="300" height="15" rx="3" fill="rgba(233, 196, 106, 0.2)" stroke="#e9c46a" />
                      <text x="28" y="13" fill="#e9c46a" fontSize="8" fontWeight="bold">Justification: Prop. VI.2 (Thales\'s Theorem on Parallels BG ∥ DF & CG ∥ DE)</text>

                      <polygon points="80,35 30,125 130,125" fill="rgba(99, 102, 241, 0.3)" stroke="#6366f1" strokeWidth="2.5" />
                      <polygon points="250,25 180,135 320,135" fill="rgba(233, 196, 106, 0.3)" stroke="#e9c46a" strokeWidth="2.5" />

                      <circle cx="80" cy="35" r="3.5" fill="#6366f1" />
                      <circle cx="250" cy="25" r="3.5" fill="#e9c46a" />

                      <text x="125" y="75" fill="#ffffff" fontSize="11" fontWeight="bold">AB / DE = BC / EF = AC / DF = k</text>
                    </g>
                  )}

                  {task5ProofStep === 3 && (
                    <g>
                      <rect x="20" y="2" width="300" height="15" rx="3" fill="rgba(16, 185, 129, 0.9)" />
                      <text x="28" y="13" fill="#ffffff" fontSize="8" fontWeight="bold">✓ Prop. VI.4 & VI.5-7: △ABC ~ △DEF (AAA, SSS & SAS Similarity Q.E.D.)</text>

                      <polygon points="80,35 30,125 130,125" fill="rgba(16, 185, 129, 0.35)" stroke="#10b981" strokeWidth="3" />
                      <polygon points="250,25 180,135 320,135" fill="rgba(16, 185, 129, 0.35)" stroke="#10b981" strokeWidth="3" />

                      <circle cx="80" cy="35" r="3.5" fill="#10b981" />
                      <circle cx="250" cy="25" r="3.5" fill="#10b981" />

                      <text x="65" y="85" fill="#10b981" fontSize="11.5" fontWeight="bold">△ABC</text>
                      <text x="235" y="90" fill="#10b981" fontSize="13.5" fontWeight="bold">△DEF</text>
                      <text x="145" y="108" fill="#e9c46a" fontSize="11" fontWeight="bold">Similar (△ABC ~ △DEF)</text>
                    </g>
                  )}
                </svg>
              )}

              {/* Proposition VI.16 & 17: Cross-Multiplication & Geometric Mean */}
              {task5SelectedProp === 'Prop6_16_17' && (
                <svg className="w-full h-full" viewBox="0 0 340 145">
                  {task5ProofStep === 0 && (
                    <g>
                      <rect x="40" y="2" width="260" height="15" rx="3" fill="rgba(30, 41, 59, 0.9)" stroke="#475569" />
                      <text x="50" y="13" fill="#cbd5e1" fontSize="8" fontWeight="bold">Given: Four Proportional Lines a : b = c : d</text>

                      {/* Segments a, b, c, d */}
                      <line x1="40" y1="45" x2="120" y2="45" stroke="#f43f5e" strokeWidth="4" />
                      <line x1="40" y1="65" x2="180" y2="65" stroke="#3b82f6" strokeWidth="4" />
                      <line x1="40" y1="85" x2="100" y2="85" stroke="#10b981" strokeWidth="4" />
                      <line x1="40" y1="105" x2="190" y2="105" stroke="#e9c46a" strokeWidth="4" />

                      <text x="130" y="49" fill="#f43f5e" fontSize="10.5" fontWeight="bold">a</text>
                      <text x="190" y="69" fill="#3b82f6" fontSize="10.5" fontWeight="bold">b</text>
                      <text x="110" y="89" fill="#10b981" fontSize="10.5" fontWeight="bold">c</text>
                      <text x="200" y="109" fill="#e9c46a" fontSize="10.5" fontWeight="bold">d</text>
                    </g>
                  )}

                  {task5ProofStep === 1 && (
                    <g>
                      <rect x="30" y="2" width="280" height="15" rx="3" fill="rgba(99, 102, 241, 0.2)" stroke="#6366f1" />
                      <text x="40" y="13" fill="#6366f1" fontSize="8" fontWeight="bold">Justification: Construct Rectangles Rect(a, d) & Rect(b, c)</text>

                      <rect x="50" y="35" width="90" height="80" fill="rgba(244, 63, 94, 0.25)" stroke="#f43f5e" strokeWidth="2.5" />
                      <rect x="180" y="35" width="120" height="60" fill="rgba(59, 130, 246, 0.25)" stroke="#3b82f6" strokeWidth="2.5" />

                      <text x="80" y="80" fill="#f43f5e" fontSize="10.5" fontWeight="bold">Rect(a, d)</text>
                      <text x="215" y="70" fill="#3b82f6" fontSize="10.5" fontWeight="bold">Rect(b, c)</text>
                    </g>
                  )}

                  {task5ProofStep === 2 && (
                    <g>
                      <rect x="20" y="2" width="300" height="15" rx="3" fill="rgba(233, 196, 106, 0.2)" stroke="#e9c46a" />
                      <text x="28" y="13" fill="#e9c46a" fontSize="8" fontWeight="bold">Justification: Prop. VI.14 (Parallelograms with Reciprocal Sides Have Equal Area)</text>

                      <rect x="50" y="35" width="90" height="80" fill="rgba(244, 63, 94, 0.35)" stroke="#f43f5e" strokeWidth="2.5" />
                      <rect x="180" y="35" width="120" height="60" fill="rgba(16, 185, 129, 0.35)" stroke="#10b981" strokeWidth="2.5" />

                      <text x="75" y="75" fill="#ffffff" fontSize="10" fontWeight="bold">Area = a · d</text>
                      <text x="205" y="68" fill="#ffffff" fontSize="10" fontWeight="bold">Area = b · c</text>
                    </g>
                  )}

                  {task5ProofStep === 3 && (
                    <g>
                      <rect x="15" y="2" width="310" height="15" rx="3" fill="rgba(16, 185, 129, 0.9)" />
                      <text x="22" y="13" fill="#ffffff" fontSize="8" fontWeight="bold">✓ Prop. VI.16 & 17: a · d = b · c  &  Geometric Mean x² = a · b (Q.E.D.)</text>

                      <rect x="50" y="35" width="90" height="80" fill="rgba(16, 185, 129, 0.3)" stroke="#10b981" strokeWidth="3" />
                      <rect x="180" y="35" width="120" height="60" fill="rgba(16, 185, 129, 0.3)" stroke="#10b981" strokeWidth="3" />

                      <text x="110" y="130" fill="#e9c46a" fontSize="11" fontWeight="bold">a · d = b · c  (Cross-Multiplication Rule)</text>
                    </g>
                  )}
                </svg>
              )}

              {/* Proposition VI.19 & 20: Duplicate Ratio (Scaling Areas) */}
              {task5SelectedProp === 'Prop6_19_20' && (
                <svg className="w-full h-full" viewBox="0 0 340 145">
                  {task5ProofStep === 0 && (
                    <g>
                      <rect x="40" y="2" width="260" height="15" rx="3" fill="rgba(30, 41, 59, 0.9)" stroke="#475569" />
                      <text x="50" y="13" fill="#cbd5e1" fontSize="8" fontWeight="bold">Given: Similar Triangles △ABC & △DEF (Scale k = 1.5)</text>

                      <polygon points="70,45 30,125 110,125" fill="rgba(99, 102, 241, 0.2)" stroke="#6366f1" strokeWidth="2" />
                      <polygon points="240,25 180,135 300,135" fill="rgba(233, 196, 106, 0.2)" stroke="#e9c46a" strokeWidth="2.5" />

                      <circle cx="70" cy="45" r="3.5" fill="#6366f1" />
                      <circle cx="30" cy="125" r="3.5" fill="#6366f1" />
                      <circle cx="110" cy="125" r="3.5" fill="#6366f1" />
                      <circle cx="240" cy="25" r="3.5" fill="#e9c46a" />
                      <circle cx="180" cy="135" r="3.5" fill="#e9c46a" />
                      <circle cx="300" cy="135" r="3.5" fill="#e9c46a" />

                      <text x="66" y="40" fill="#6366f1" fontSize="10">A</text>
                      <text x="18" y="130" fill="#6366f1" fontSize="10">B</text>
                      <text x="114" y="130" fill="#6366f1" fontSize="10">C</text>
                      <text x="236" y="20" fill="#e9c46a" fontSize="10">D</text>
                      <text x="168" y="142" fill="#e9c46a" fontSize="10">E</text>
                      <text x="304" y="142" fill="#e9c46a" fontSize="10">F</text>
                      <text x="50" y="90" fill="#6366f1" fontSize="10" fontWeight="bold">Area A</text>
                      <text x="220" y="95" fill="#e9c46a" fontSize="11" fontWeight="bold">Area k²A</text>
                    </g>
                  )}

                  {task5ProofStep === 1 && (
                    <g>
                      <rect x="30" y="2" width="280" height="15" rx="3" fill="rgba(99, 102, 241, 0.2)" stroke="#6366f1" />
                      <text x="40" y="13" fill="#6366f1" fontSize="8" fontWeight="bold">Justification: Prop. VI.11 (Find Third Proportional Segment BG)</text>

                      <polygon points="70,45 30,125 110,125" fill="rgba(99, 102, 241, 0.2)" stroke="#6366f1" strokeWidth="2" />
                      <line x1="110" y1="125" x2="150" y2="125" stroke="#f43f5e" strokeWidth="2" strokeDasharray="3,3" />
                      <polygon points="240,25 180,135 300,135" fill="rgba(233, 196, 106, 0.2)" stroke="#e9c46a" strokeWidth="2" />

                      <circle cx="70" cy="45" r="3.5" fill="#6366f1" />
                      <circle cx="30" cy="125" r="3.5" fill="#6366f1" />
                      <circle cx="110" cy="125" r="3.5" fill="#6366f1" />
                      <circle cx="150" cy="125" r="3.5" fill="#f43f5e" />

                      <text x="66" y="40" fill="#6366f1" fontSize="10">A</text>
                      <text x="18" y="130" fill="#6366f1" fontSize="10">B</text>
                      <text x="104" y="134" fill="#6366f1" fontSize="10">C</text>
                      <text x="152" y="134" fill="#f43f5e" fontSize="10" fontWeight="bold">G</text>
                      <text x="110" y="80" fill="#f43f5e" fontSize="9.5" fontWeight="bold">BC : BG = (AB : DE)²</text>
                    </g>
                  )}

                  {task5ProofStep === 2 && (
                    <g>
                      <rect x="20" y="2" width="300" height="15" rx="3" fill="rgba(233, 196, 106, 0.2)" stroke="#e9c46a" />
                      <text x="28" y="13" fill="#e9c46a" fontSize="8" fontWeight="bold">Justification: Prop. VI.1 (Area(△ABC)/Area(△DEF) = BC/BG = (AB/DE)²)</text>

                      <polygon points="70,45 30,125 110,125" fill="rgba(99, 102, 241, 0.35)" stroke="#6366f1" strokeWidth="2.5" />
                      <polygon points="240,25 180,135 300,135" fill="rgba(233, 196, 106, 0.35)" stroke="#e9c46a" strokeWidth="2.5" />

                      <text x="110" y="80" fill="#ffffff" fontSize="11" fontWeight="bold">Area Ratio = (Side Ratio)² = k²</text>
                    </g>
                  )}

                  {task5ProofStep === 3 && (
                    <g>
                      <rect x="15" y="2" width="310" height="15" rx="3" fill="rgba(16, 185, 129, 0.9)" />
                      <text x="22" y="13" fill="#ffffff" fontSize="8" fontWeight="bold">✓ Prop. VI.19 & 20: Area Ratio = k²  (Duplicate Ratio of Corresponding Sides Q.E.D.)</text>

                      <polygon points="70,45 30,125 110,125" fill="rgba(16, 185, 129, 0.35)" stroke="#10b981" strokeWidth="3" />
                      <polygon points="240,25 180,135 300,135" fill="rgba(16, 185, 129, 0.35)" stroke="#10b981" strokeWidth="3" />

                      <text x="100" y="85" fill="#e9c46a" fontSize="11" fontWeight="bold">Double Side (2x) ⟹ Quadruple Area (4x)!</text>
                    </g>
                  )}
                </svg>
              )}

              {/* Proposition VI.31: Generalized Pythagorean Theorem */}
              {task5SelectedProp === 'Prop6_31' && (
                <svg className="w-full h-full" viewBox="0 0 340 145">
                  {task5ProofStep === 0 && (
                    <g>
                      <rect x="40" y="2" width="260" height="15" rx="3" fill="rgba(30, 41, 59, 0.9)" stroke="#475569" />
                      <text x="50" y="13" fill="#cbd5e1" fontSize="8" fontWeight="bold">Given: Right-Angled Triangle △ABC (∠C = 90°)</text>

                      <polygon points="115,125 245,125 115,55" fill="rgba(99, 102, 241, 0.2)" stroke="#6366f1" strokeWidth="2.5" />
                      <path d="M 115 115 L 125 115 L 125 125" fill="none" stroke="#e9c46a" strokeWidth="1.5" />

                      <circle cx="115" cy="125" r="3.5" fill="#cbd5e1" />
                      <circle cx="245" cy="125" r="3.5" fill="#cbd5e1" />
                      <circle cx="115" cy="55" r="3.5" fill="#cbd5e1" />

                      <text x="104" y="136" fill="#cbd5e1" fontSize="10" fontWeight="bold">C (90°)</text>
                      <text x="250" y="132" fill="#cbd5e1" fontSize="10" fontWeight="bold">B</text>
                      <text x="111" y="48" fill="#cbd5e1" fontSize="10" fontWeight="bold">A</text>
                      <text x="175" y="138" fill="#f43f5e" fontSize="9.5" fontWeight="bold">Leg a</text>
                      <text x="94" y="90" fill="#3b82f6" fontSize="9.5" fontWeight="bold">Leg b</text>
                      <text x="185" y="85" fill="#10b981" fontSize="9.5" fontWeight="bold">Hypotenuse c</text>
                    </g>
                  )}

                  {task5ProofStep === 1 && (
                    <g>
                      <rect x="30" y="2" width="280" height="15" rx="3" fill="rgba(99, 102, 241, 0.2)" stroke="#6366f1" />
                      <text x="40" y="13" fill="#6366f1" fontSize="8" fontWeight="bold">Justification: Construct Similar Figures F_a, F_b, F_c on sides a, b, c</text>

                      <polygon points="115,125 245,125 115,55" fill="rgba(99, 102, 241, 0.15)" stroke="#6366f1" strokeWidth="2" />

                      {/* Semicircle figures on sides */}
                      <path d="M 115 125 A 65 65 0 0 0 245 125" fill="rgba(244, 63, 94, 0.25)" stroke="#f43f5e" strokeWidth="2" />
                      <path d="M 115 55 A 35 35 0 0 0 115 125" fill="rgba(59, 130, 246, 0.25)" stroke="#3b82f6" strokeWidth="2" />
                      <path d="M 245 125 A 74 74 0 0 0 115 55" fill="rgba(16, 185, 129, 0.25)" stroke="#10b981" strokeWidth="2" />

                      <circle cx="115" cy="125" r="3.5" fill="#cbd5e1" />
                      <circle cx="245" cy="125" r="3.5" fill="#cbd5e1" />
                      <circle cx="115" cy="55" r="3.5" fill="#cbd5e1" />

                      <text x="175" y="142" fill="#f43f5e" fontSize="9" fontWeight="bold">F_a</text>
                      <text x="84" y="90" fill="#3b82f6" fontSize="9" fontWeight="bold">F_b</text>
                      <text x="195" y="65" fill="#10b981" fontSize="9" fontWeight="bold">F_c</text>
                    </g>
                  )}

                  {task5ProofStep === 2 && (
                    <g>
                      <rect x="20" y="2" width="300" height="15" rx="3" fill="rgba(233, 196, 106, 0.2)" stroke="#e9c46a" />
                      <text x="28" y="13" fill="#e9c46a" fontSize="8" fontWeight="bold">Justification: Prop. VI.19 (Area(F_a)/Area(F_c) = a²/c²  &  Area(F_b)/Area(F_c) = b²/c²)</text>

                      <polygon points="115,125 245,125 115,55" fill="none" stroke="#475569" strokeWidth="1.5" />
                      <path d="M 115 125 A 65 65 0 0 0 245 125" fill="rgba(244, 63, 94, 0.3)" stroke="#f43f5e" strokeWidth="2" />
                      <path d="M 115 55 A 35 35 0 0 0 115 125" fill="rgba(59, 130, 246, 0.3)" stroke="#3b82f6" strokeWidth="2" />
                      <path d="M 245 125 A 74 74 0 0 0 115 55" fill="rgba(16, 185, 129, 0.3)" stroke="#10b981" strokeWidth="2" />

                      <text x="95" y="80" fill="#ffffff" fontSize="10" fontWeight="bold">[Area(F_a) + Area(F_b)] / Area(F_c) = (a² + b²) / c²</text>
                    </g>
                  )}

                  {task5ProofStep === 3 && (
                    <g>
                      <rect x="15" y="2" width="310" height="15" rx="3" fill="rgba(16, 185, 129, 0.9)" />
                      <text x="22" y="13" fill="#ffffff" fontSize="8" fontWeight="bold">✓ Prop. VI.31: Area(Figure c) = Area(Figure a) + Area(Figure b) (Q.E.D.)</text>

                      <path d="M 115 125 A 65 65 0 0 0 245 125" fill="rgba(244, 63, 94, 0.35)" stroke="#f43f5e" strokeWidth="2.5" />
                      <path d="M 115 55 A 35 35 0 0 0 115 125" fill="rgba(59, 130, 246, 0.35)" stroke="#3b82f6" strokeWidth="2.5" />
                      <path d="M 245 125 A 74 74 0 0 0 115 55" fill="rgba(16, 185, 129, 0.35)" stroke="#10b981" strokeWidth="3" />

                      <text x="110" y="70" fill="#e9c46a" fontSize="11" fontWeight="bold">Generalized Pythagorean Theorem!</text>
                    </g>
                  )}
                </svg>
              )}

              {/* Proposition VI.33: Angles & Arc Ratios */}
              {task5SelectedProp === 'Prop6_33' && (
                <svg className="w-full h-full" viewBox="0 0 340 145">
                  {task5ProofStep === 0 && (
                    <g>
                      <rect x="40" y="2" width="260" height="15" rx="3" fill="rgba(30, 41, 59, 0.9)" stroke="#475569" />
                      <text x="50" y="13" fill="#cbd5e1" fontSize="8" fontWeight="bold">Given: Circle with Central Angles ∠AOB & ∠COD</text>

                      <circle cx="170" cy="78" r="48" fill="none" stroke="#3b82f6" strokeWidth="2" />
                      <circle cx="170" cy="78" r="3.5" fill="#cbd5e1" />

                      {/* Radii OA, OB & Arc AB */}
                      <line x1="170" y1="78" x2="218" y2="78" stroke="#f43f5e" strokeWidth="2.5" />
                      <line x1="170" y1="78" x2="204" y2="44" stroke="#f43f5e" strokeWidth="2.5" />
                      <path d="M 218 78 A 48 48 0 0 0 204 44" fill="none" stroke="#e9c46a" strokeWidth="3" />

                      <text x="174" y="81" fill="#cbd5e1" fontSize="10">O</text>
                      <text x="222" y="81" fill="#f43f5e" fontSize="10" fontWeight="bold">B</text>
                      <text x="207" y="39" fill="#f43f5e" fontSize="10" fontWeight="bold">A</text>
                      <text x="180" y="68" fill="#e9c46a" fontSize="9" fontWeight="bold">θ₁</text>
                    </g>
                  )}

                  {task5ProofStep === 1 && (
                    <g>
                      <rect x="30" y="2" width="280" height="15" rx="3" fill="rgba(99, 102, 241, 0.2)" stroke="#6366f1" />
                      <text x="40" y="13" fill="#6366f1" fontSize="8" fontWeight="bold">Justification: Prop. I.4 & Def. V.5 (Equal Arcs Subtend Equal Central Angles)</text>

                      <circle cx="170" cy="78" r="48" fill="none" stroke="#3b82f6" strokeWidth="2" />
                      <circle cx="170" cy="78" r="3.5" fill="#cbd5e1" />

                      <path d="M 218 78 A 48 48 0 0 0 204 44" fill="none" stroke="#e9c46a" strokeWidth="3" />
                      <path d="M 170 30 A 48 48 0 0 0 122 78" fill="none" stroke="#10b981" strokeWidth="3" />

                      <circle cx="218" cy="78" r="3" fill="#f43f5e" />
                      <circle cx="204" cy="44" r="3" fill="#f43f5e" />
                      <circle cx="170" cy="30" r="3" fill="#10b981" />
                      <circle cx="122" cy="78" r="3" fill="#10b981" />

                      <text x="174" y="81" fill="#cbd5e1" fontSize="10">O</text>
                      <text x="222" y="81" fill="#f43f5e" fontSize="9.5" fontWeight="bold">B</text>
                      <text x="207" y="39" fill="#f43f5e" fontSize="9.5" fontWeight="bold">A</text>
                      <text x="166" y="25" fill="#10b981" fontSize="9.5" fontWeight="bold">C</text>
                      <text x="110" y="81" fill="#10b981" fontSize="9.5" fontWeight="bold">D</text>
                      <text x="198" y="68" fill="#e9c46a" fontSize="8.5">Arc AB</text>
                      <text x="135" y="52" fill="#10b981" fontSize="8.5">Arc CD</text>
                    </g>
                  )}

                  {task5ProofStep === 2 && (
                    <g>
                      <rect x="20" y="2" width="300" height="15" rx="3" fill="rgba(233, 196, 106, 0.2)" stroke="#e9c46a" />
                      <text x="28" y="13" fill="#e9c46a" fontSize="8" fontWeight="bold">Justification: Definition V.5 (Equi-multiple Arc & Angle Ratios)</text>

                      <circle cx="170" cy="78" r="48" fill="rgba(99, 102, 241, 0.15)" stroke="#3b82f6" strokeWidth="2.5" />
                      <circle cx="170" cy="78" r="3.5" fill="#cbd5e1" />

                      <text x="174" y="81" fill="#cbd5e1" fontSize="10">O</text>
                      <text x="90" y="83" fill="#ffffff" fontSize="11" fontWeight="bold">Arc 1 / Arc 2 = Angle 1 / Angle 2</text>
                    </g>
                  )}

                  {task5ProofStep === 3 && (
                    <g>
                      <rect x="15" y="2" width="310" height="15" rx="3" fill="rgba(16, 185, 129, 0.9)" />
                      <text x="22" y="13" fill="#ffffff" fontSize="8" fontWeight="bold">✓ Prop. VI.33: s1 / s2 = θ1 / θ2 = ψ1 / ψ2 (Angles & Arc Ratios Q.E.D.)</text>

                      <circle cx="170" cy="78" r="48" fill="rgba(16, 185, 129, 0.25)" stroke="#10b981" strokeWidth="3" />
                      <circle cx="170" cy="78" r="3.5" fill="#cbd5e1" />

                      <text x="174" y="81" fill="#cbd5e1" fontSize="10">O</text>
                      <text x="75" y="83" fill="#e9c46a" fontSize="10.5" fontWeight="bold">Arcs are Proportional to Central & Inscribed Angles!</text>
                    </g>
                  )}
                </svg>
              )}
            </div>
          </div>
        </div>
      );
    }
  };

  // Helper calculations for Task 4 Left Panel Calculator
  const rad = (angleTheta * Math.PI) / 180;
  let projD = 0;
  let computedC = 0;

  if (task4CalcMode === 'obtuse') {
    projD = Math.abs(sideB * Math.cos(Math.PI - rad));
    computedC = Math.sqrt(sideA * sideA + sideB * sideB + 2 * sideA * projD);
  } else if (task4CalcMode === 'acute') {
    projD = Math.abs(sideB * Math.cos(rad));
    computedC = Math.sqrt(Math.max(0, sideA * sideA + sideB * sideB - 2 * sideA * projD));
  }

  const goldenX = ((Math.sqrt(5) - 1) / 2) * goldenLineLen;
  const goldenSquareArea = goldenX * goldenX;
  const goldenRectArea = goldenLineLen * (goldenLineLen - goldenX);
  const goldenPhi = goldenLineLen / goldenX;

  return (
    <LevelShell
      title="Level 6: Euclid's Elements"
      activeSubtask={activeSubtask}
      completedSubtasks={completedSubtasks}
      leftPanelClass="w-full md:w-[440px] lg:w-[480px]"
      canvas={renderIllustrationCanvas()}
    >
      {/* Left Panel: User Task (Task 1, Task 2, Task 3 & Task 4) */}
      <div className="flex flex-col justify-between h-full select-none">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] font-bold uppercase tracking-wider">
              {activeSubtask === 1
                ? 'TASK 1: BASICS'
                : activeSubtask === 2
                ? 'TASK 2: PLANE GEOMETRY'
                : activeSubtask === 3
                ? 'TASK 3: CIRCLES & ANGLES'
                : activeSubtask === 4
                ? 'TASK 4: GEOMETRIC ALGEBRA & POLYGONS'
                : 'TASK 5: BOOK V & VI PROPORTIONS'}
            </span>
            <span className="text-xs text-slate-400">Euclidean Structure</span>
          </div>

          <h2 className="text-xl font-serif font-bold text-white mb-2">
            {activeSubtask === 1
              ? 'Foundations & Relationships'
              : activeSubtask === 2
              ? 'Book I Theorems & Construction Challenge'
              : activeSubtask === 3
              ? 'Book III: Circles, Angles & Power of a Point'
              : activeSubtask === 4
              ? 'Book II & IV: Geometric Algebra & Regular Polygons'
              : 'Book V & VI: Proportions & Similarities'}
          </h2>

          <p className="text-xs text-slate-300 leading-relaxed mb-3">
            {activeSubtask === 1
              ? 'Test your understanding of the relationships between Definitions, Common Notions (Axioms), Postulates, and Propositions.'
              : activeSubtask === 2
              ? 'Solve Book I construction problems and verify proofs for Congruence, Isosceles Triangles, and Parallel Lines.'
              : activeSubtask === 3
              ? 'Explore Chords & Center (Prop III, XIV), Tangents (Prop XI, XII, XVI), Central & Inscribed Angles (Prop XX, XXI, XXII, XXXI), and Power of a Point (Prop XXXII, XXXV, XXXVI).'
              : activeSubtask === 4
              ? 'Explore Law of Cosines, Golden Ratio (Prop II.11), Golden Triangle (Prop IV.10), and Regular Pentagon Constructions (Prop IV.11-14).'
              : 'Explore Areas & Proportions (Prop I), Thales\'s Theorem (Prop II), Angle Bisector (Prop III), AAA Similarity (Prop IV-VII), Cross-Multiplication (Prop XVI-XVII), Duplicate Ratio (Prop XIX-XX), Generalized Pythagoras (Prop XXXI), and Arc Ratios (Prop XXXIII).'}
          </p>

          <div className="mb-4 p-2.5 rounded-lg bg-indigo-950/40 border border-indigo-500/30 text-[11px] text-indigo-200 flex items-center justify-between">
            <span>
              {activeSubtask === 3 ? (
                <>Reference: <a href="https://www.c82.net/euclid/en/book3/" target="_blank" rel="noopener noreferrer" className="text-amber-400 hover:text-amber-300 underline font-semibold transition">Byrne's Book III (c82.net)</a></>
              ) : activeSubtask === 4 ? (
                <>Reference: <a href="https://www.c82.net/euclid/en/book2/" target="_blank" rel="noopener noreferrer" className="text-amber-400 hover:text-amber-300 underline font-semibold transition">Byrne's Book II</a> & <a href="https://www.c82.net/euclid/en/book4/" target="_blank" rel="noopener noreferrer" className="text-amber-400 hover:text-amber-300 underline font-semibold transition">Book IV (c82.net)</a></>
              ) : activeSubtask === 5 ? (
                <>Reference: <a href="https://www.c82.net/euclid/en/book6/" target="_blank" rel="noopener noreferrer" className="text-amber-400 hover:text-amber-300 underline font-semibold transition">Byrne's Book V & VI (c82.net)</a></>
              ) : (
                <>Reference: <a href="https://www.c82.net/euclid/en/book1/" target="_blank" rel="noopener noreferrer" className="text-amber-400 hover:text-amber-300 underline font-semibold transition">Byrne's Book I (c82.net)</a></>
              )}
            </span>
            <span className="text-[10px] text-slate-400 font-mono">{activeSubtask === 3 ? 'Book III' : activeSubtask === 4 ? 'Book II & IV' : activeSubtask === 5 ? 'Book V & VI' : 'Book I'}</span>
          </div>

          {/* Interactive Construction Challenge Box for Task 2 */}
          {activeSubtask === 2 && (
            <div className="bg-slate-900/90 border border-amber-500/30 rounded-xl p-3.5 mb-4">
              <div className="flex items-center justify-between text-[11px] font-mono text-amber-400 mb-1">
                <span>CONSTRUCTION CHALLENGE</span>
                <span>Prop. IX • Angle Bisector</span>
              </div>
              <p className="text-xs text-slate-200 font-semibold mb-2">
                Task: Construct the angle bisector of a given angle ∠BAC using compass & straightedge.
              </p>
              
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[10px] text-slate-400">Step {constructionStep + 1}/4</span>
                <button
                  onClick={() => setConstructionStep((constructionStep + 1) % 4)}
                  className="px-2.5 py-1 rounded bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-[10px] transition cursor-pointer"
                >
                  {constructionStep < 3 ? 'Perform Step' : 'Reset Construction'}
                </button>
              </div>

              <p className="text-[11px] text-amber-200 italic bg-slate-950 p-2 rounded border border-slate-800">
                {constructionStep === 0 && 'Step 1: Mark equal distance points D on AB & E on AC using Circle Postulate 3.'}
                {constructionStep === 1 && 'Step 2: Construct equilateral triangle △DEF on segment DE (Proposition 1).'}
                {constructionStep === 2 && 'Step 3: Connect ray AF with a straight line (Postulate 1).'}
                {constructionStep === 3 && 'Step 4: Prove △ADF ≅ △AEF by SAS (Prop 4). Line AF bisects ∠BAC (Q.E.F.)!'}
              </p>
            </div>
          )}

          {/* Interactive Geometric Algebra & Polygon Calculator Box for Task 4 */}
          {activeSubtask === 4 && task4SelectedProp !== 'PropArtPatterns' && (
            <div className="bg-slate-900/90 border border-indigo-500/40 rounded-xl p-3.5 mb-4">
              <div className="flex items-center justify-between text-[11px] font-mono text-indigo-300 mb-2.5">
                <span className="flex items-center gap-1 font-bold">
                  <Sliders className="w-3.5 h-3.5 text-amber-400" />
                  GEOMETRIC ALGEBRA & POLYGON SIMULATOR
                </span>
                <span className="text-amber-400 font-bold">Book II & IV</span>
              </div>

              {/* Tool Mode Tabs */}
              <div className="flex flex-wrap gap-1 mb-3 bg-slate-950 p-1 rounded-lg border border-slate-800">
                {[
                  { id: 'obtuse', label: 'Prop XII (Obtuse)' },
                  { id: 'acute', label: 'Prop XIII (Acute)' },
                  { id: 'polygon_sum', label: 'Prop I.32 (Polygon Angle Sum)' },
                  { id: 'golden', label: 'Prop II.11 (Golden Ratio)' },
                  { id: 'golden_triangle', label: 'Prop IV.10 (Golden △)' },
                  { id: 'pentagon', label: 'Prop IV.11-14 (Pentagon)' }
                ].map((m) => (
                  <button
                    key={m.id}
                    onClick={() => {
                      setTask4CalcMode(m.id);
                      if (m.id === 'obtuse') { setTask4SelectedProp('Prop12'); }
                      if (m.id === 'acute') { setTask4SelectedProp('Prop13'); }
                      if (m.id === 'polygon_sum') { setTask4SelectedProp('PropPolygonAngleSum'); }
                      if (m.id === 'golden') { setTask4SelectedProp('Prop11'); }
                      if (m.id === 'golden_triangle') { setTask4SelectedProp('Prop4_10'); }
                      if (m.id === 'pentagon') { setTask4SelectedProp('Prop4_11'); }
                      setTask4ProofStep(0);
                    }}
                    className={`px-2 py-1 rounded text-[9.5px] font-bold transition cursor-pointer shrink-0 ${
                      task4CalcMode === m.id
                        ? 'bg-indigo-600 text-white shadow'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>

              {/* Controls for Prop I.32 Cor.: Polygon Angle Sum */}
              {task4CalcMode === 'polygon_sum' && (
                <div className="space-y-2.5 text-xs text-slate-200">
                  <div className="flex items-center justify-between">
                    <span>Number of Sides (n): <strong className="text-amber-400 font-mono">{polygonSides} sides</strong></span>
                    <input
                      type="range"
                      min="3"
                      max="12"
                      value={polygonSides}
                      onChange={(e) => setPolygonSides(Number(e.target.value))}
                      className="w-28 accent-indigo-500 cursor-pointer"
                    />
                  </div>
                  <div className="bg-slate-950 p-2 rounded-lg border border-slate-800 text-[11px] font-mono space-y-1">
                    <div className="flex justify-between text-indigo-300">
                      <span>Diagonals from 1 vertex: {polygonSides - 3}</span>
                      <span>Triangles formed: {polygonSides - 2}</span>
                    </div>
                    <div className="text-emerald-400 font-bold text-center border-t border-slate-800 pt-1">
                      Angle Sum = ({polygonSides} - 2) × 180° = {(polygonSides - 2) * 180}° ✓
                    </div>
                    <div className="text-amber-400 text-center text-[10px]">
                      Each Regular Angle = {((polygonSides - 2) * 180 / polygonSides).toFixed(1)}°
                    </div>
                  </div>
                </div>
              )}

              {/* Sliders & Math Output for Obtuse / Acute Law of Cosines */}
              {(task4CalcMode === 'obtuse' || task4CalcMode === 'acute') && (
                <div className="space-y-2.5 text-xs text-slate-200">
                  <div className="flex items-center justify-between">
                    <span>Base Side a (BC): <strong className="text-amber-400 font-mono">{sideA} px</strong></span>
                    <input
                      type="range"
                      min="50"
                      max="120"
                      value={sideA}
                      onChange={(e) => setSideA(Number(e.target.value))}
                      className="w-28 accent-indigo-500 cursor-pointer"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <span>Side b (AC): <strong className="text-blue-400 font-mono">{sideB} px</strong></span>
                    <input
                      type="range"
                      min="40"
                      max="100"
                      value={sideB}
                      onChange={(e) => setSideB(Number(e.target.value))}
                      className="w-28 accent-indigo-500 cursor-pointer"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <span>Angle θ (∠ACB): <strong className="text-emerald-400 font-mono">{angleTheta}°</strong></span>
                    <input
                      type="range"
                      min={task4CalcMode === 'obtuse' ? 95 : 25}
                      max={task4CalcMode === 'obtuse' ? 155 : 80}
                      value={angleTheta}
                      onChange={(e) => setAngleTheta(Number(e.target.value))}
                      className="w-28 accent-indigo-500 cursor-pointer"
                    />
                  </div>

                  <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-[11px] font-mono space-y-1">
                    <div className="flex justify-between text-indigo-300">
                      <span>Projection d: {projD.toFixed(1)} px</span>
                      <span>Side c (AB): {computedC.toFixed(1)} px</span>
                    </div>
                    <div className="text-amber-300 font-bold">
                      {task4CalcMode === 'obtuse'
                        ? `c² = a² + b² + 2ad  (${Math.round(computedC**2)} = ${sideA**2} + ${sideB**2} + ${Math.round(2*sideA*projD)})`
                        : `c² = a² + b² - 2ad  (${Math.round(computedC**2)} = ${sideA**2} + ${sideB**2} - ${Math.round(2*sideA*projD)})`}
                    </div>
                  </div>
                </div>
              )}

              {/* Sliders & Math Output for Golden Ratio (Prop XI) */}
              {task4CalcMode === 'golden' && (
                <div className="space-y-2.5 text-xs text-slate-200">
                  <div className="flex items-center justify-between">
                    <span>Line Length a: <strong className="text-amber-400 font-mono">{goldenLineLen} px</strong></span>
                    <input
                      type="range"
                      min="60"
                      max="150"
                      value={goldenLineLen}
                      onChange={(e) => setGoldenLineLen(Number(e.target.value))}
                      className="w-28 accent-indigo-500 cursor-pointer"
                    />
                  </div>

                  <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-[11px] font-mono space-y-1">
                    <div className="flex justify-between text-indigo-300">
                      <span>Golden Segment x: {goldenX.toFixed(2)} px</span>
                      <span>Remaining (a-x): {(goldenLineLen - goldenX).toFixed(2)} px</span>
                    </div>
                    <div className="flex justify-between text-emerald-400 font-bold">
                      <span>Square x² = {Math.round(goldenSquareArea)}</span>
                      <span>Rect a(a-x) = {Math.round(goldenRectArea)}</span>
                    </div>
                    <div className="text-amber-400 font-extrabold text-center pt-0.5 border-t border-slate-800">
                      Ratio a / x = φ = {goldenPhi.toFixed(6)} ✓
                    </div>
                  </div>
                </div>
              )}

              {/* Sliders & Math Output for Golden Triangle (Prop IV.10) */}
              {task4CalcMode === 'golden_triangle' && (
                <div className="space-y-2.5 text-xs text-slate-200">
                  <div className="flex items-center justify-between">
                    <span>Base Length b: <strong className="text-amber-400 font-mono">{goldenTriBase} px</strong></span>
                    <input
                      type="range"
                      min="30"
                      max="100"
                      value={goldenTriBase}
                      onChange={(e) => setGoldenTriBase(Number(e.target.value))}
                      className="w-28 accent-indigo-500 cursor-pointer"
                    />
                  </div>

                  <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-[11px] font-mono space-y-1">
                    <div className="flex justify-between text-indigo-300">
                      <span>Base Angles: 72°, 72°</span>
                      <span>Vertex Angle: 36°</span>
                    </div>
                    <div className="flex justify-between text-emerald-400 font-bold">
                      <span>Base b = {goldenTriBase} px</span>
                      <span>Equal Legs s = {(goldenTriBase * 1.6180339887).toFixed(1)} px</span>
                    </div>
                    <div className="text-amber-400 font-extrabold text-center pt-0.5 border-t border-slate-800">
                      Ratio Side / Base = φ = {((goldenTriBase * 1.6180339887) / goldenTriBase).toFixed(6)} ✓
                    </div>
                  </div>
                </div>
              )}

              {/* Sliders & Math Output for Regular Pentagon (Prop IV.11-14) */}
              {task4CalcMode === 'pentagon' && (
                <div className="space-y-2.5 text-xs text-slate-200">
                  <div className="flex items-center justify-between">
                    <span>Circle Radius R: <strong className="text-blue-400 font-mono">{pentagonRadius} px</strong></span>
                    <input
                      type="range"
                      min="40"
                      max="100"
                      value={pentagonRadius}
                      onChange={(e) => setPentagonRadius(Number(e.target.value))}
                      className="w-28 accent-indigo-500 cursor-pointer"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <span>Rotation Angle: <strong className="text-amber-400 font-mono">{pentagonRot}°</strong></span>
                    <input
                      type="range"
                      min="0"
                      max="360"
                      value={pentagonRot}
                      onChange={(e) => setPentagonRot(Number(e.target.value))}
                      className="w-28 accent-indigo-500 cursor-pointer"
                    />
                  </div>

                  <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-[11px] font-mono space-y-1">
                    <div className="flex justify-between text-indigo-300">
                      <span>Side s = {(2 * pentagonRadius * Math.sin(Math.PI / 5)).toFixed(1)} px</span>
                      <span>Inradius r = {(pentagonRadius * Math.cos(Math.PI / 5)).toFixed(1)} px</span>
                    </div>
                    <div className="flex justify-between text-emerald-400 font-bold">
                      <span>Internal Angle: 108°</span>
                      <span>Central Angle: 72°</span>
                    </div>
                    <div className="text-amber-400 font-extrabold text-center pt-0.5 border-t border-slate-800">
                      Diagonal / Side = φ = {((2 * pentagonRadius * Math.sin((2 * Math.PI) / 5)) / (2 * pentagonRadius * Math.sin(Math.PI / 5))).toFixed(6)} ✓
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Interactive Proportions & Similarities Calculator Box for Task 5 */}
          {activeSubtask === 5 && (
            <div className="bg-slate-900/90 border border-amber-500/40 rounded-xl p-3.5 mb-4">
              <div className="flex items-center justify-between text-[11px] font-mono text-amber-300 mb-2.5">
                <span className="flex items-center gap-1 font-bold">
                  <Sliders className="w-3.5 h-3.5 text-amber-400" />
                  BOOK V & VI PROPORTIONS SIMULATOR
                </span>
                <span className="text-amber-400 font-bold">Book V & VI</span>
              </div>


            </div>
          )}

          {/* Stepper Progress Bar for Quiz */}
          <div className="flex items-center justify-between gap-1.5 mb-4 bg-slate-950/60 p-2 rounded-xl border border-slate-800">
            {currentQuestions.map((q, idx) => {
              const isCurrent = idx === currentQIndex;
              const isAnswered = selectedAnswers[idx] !== undefined;

              return (
                <button
                  key={q.id}
                  onClick={() => setCurrentQIndex(idx)}
                  className={`flex-1 py-1 rounded text-[10px] font-mono font-bold transition ${
                    isCurrent
                      ? 'bg-indigo-600 text-white shadow-[0_0_8px_rgba(99,102,241,0.5)]'
                      : isAnswered
                      ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/60'
                      : 'bg-slate-900 text-slate-500 hover:text-slate-300'
                  }`}
                >
                  Q{idx + 1}
                </button>
              );
            })}
          </div>

          {/* Question Card */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4 mb-4">
            <div className="flex items-center justify-between text-[11px] text-indigo-400 font-mono mb-1.5">
              <span>QUESTION {currentQIndex + 1} OF {currentQuestions.length}</span>
              <span className="text-slate-400">{currentQ.concept}</span>
            </div>

            <h3 className="text-sm font-semibold text-white leading-snug mb-3">
              {currentQ.question}
            </h3>

            {/* Options */}
            <div className="space-y-2">
              {currentQ.options.map((opt, optIdx) => {
                const isSelected = selectedAnswers[currentQIndex] === optIdx;

                return (
                  <button
                    key={optIdx}
                    onClick={() => handleSelectOption(optIdx)}
                    className={`w-full text-left p-3 rounded-xl text-xs transition flex items-start gap-2.5 cursor-pointer border ${
                      isSelected
                        ? 'bg-indigo-950/70 border-indigo-500 text-white shadow-[0_0_10px_rgba(99,102,241,0.2)]'
                        : 'bg-slate-950/50 border-slate-800 text-slate-300 hover:bg-slate-900 hover:border-slate-700'
                    }`}
                  >
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-[10px] font-bold ${
                      isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {String.fromCharCode(65 + optIdx)}
                    </span>
                    <span className="leading-relaxed mt-0.5">{opt}</span>
                  </button>
                );
              })}
            </div>

            {/* Hint */}
            {showHint && (
              <div className="mt-3 p-3 bg-amber-950/30 border border-amber-500/30 rounded-lg text-xs text-amber-200 flex items-start gap-2">
                <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>{currentQ.explanation}</span>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Actions */}
        <div>
          {feedbackMsg && (
            <div className={`p-3 rounded-xl text-xs font-semibold mb-3 ${
              isSuccess
                ? 'bg-emerald-950/80 border border-emerald-500/40 text-emerald-300'
                : 'bg-rose-950/80 border border-rose-500/40 text-rose-300'
            }`}>
              {feedbackMsg}
            </div>
          )}

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowHint(!showHint)}
              className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200 text-xs font-semibold transition cursor-pointer flex items-center gap-1.5"
            >
              <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
              <span>{showHint ? 'Hide Hint' : 'Hint'}</span>
            </button>

            {quizSubmitted ? (
              <button
                onClick={handleResetQuiz}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retry Task {activeSubtask}</span>
              </button>
            ) : (
              <button
                onClick={handleNextQuestion}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-extrabold text-xs transition cursor-pointer flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(99,102,241,0.3)]"
              >
                <span>{currentQIndex < currentQuestions.length - 1 ? 'Submit & Next Question' : `Complete Task ${activeSubtask}`}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </LevelShell>
  );
}
