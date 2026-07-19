import React, { useState, useEffect } from 'react';
import { useGameState } from '../../context/GameStateContext';
import { Compass, Star, Play, Brain, Check, RefreshCw } from 'lucide-react';
import LevelShell from '../LevelShell';

export default function AristotleLevel() {
  const { activeSubtask, completedSubtasks, completeSubtask } = useGameState();
  const [selectedOption, setSelectedOption] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [syllogismStep, setSyllogismStep] = useState(0); // 0 = idle, 1 = major, 2 = minor, 3 = complete
  const [hoveredAngle, setHoveredAngle] = useState(null); // 'a', 'b', 'c', or null

  // Reset task status when changing subtasks
  useEffect(() => {
    setSelectedOption(null);
    setErrorMsg('');
    setIsSuccess(completedSubtasks.includes(`5-${activeSubtask}`));
    setSyllogismStep(0);
  }, [activeSubtask, completedSubtasks]);

  // Typeset math on load/render
  useEffect(() => {
    if (window.MathJax && typeof window.MathJax.typesetPromise === 'function') {
      window.MathJax.typesetPromise();
    }
  });

  const questions = {
    1: {
      title: '5-1. Formal Logic',
      desc: 'Verify your understanding of syllogistic logic: If "All squares are rectangles" and "ABCD is a square", what is the logically deduced conclusion?',
      options: [
        'Therefore, ABCD is a rectangle.',
        'Therefore, ABCD is a square.',
        'Therefore, ABCD has unequal side lengths.',
        'Therefore, all rectangles are squares.'
      ],
      correct: 0,
      hint: 'Deduction works by applying a universal rule (Major Premise) to a specific instance (Minor Premise).'
    },
    2: {
      title: '5-2. Axiomatic Science',
      desc: 'Why did Aristotle argue that every deductive science must begin with self-evident, unproved truths (axioms)?',
      options: [
        'To prevent an infinite regression of proofs where every statement requires another proof.',
        'Because axioms are historically discovered before any other math.',
        'To allow mathematicians to change starting rules dynamically during calculations.',
        'Because proofs are not considered scientifically rigorous.'
      ],
      correct: 0,
      hint: 'Without self-evident axioms, you would have to prove your starting principles, and then prove those proofs, infinitely.'
    },
    3: {
      title: '5-3. First Principles',
      desc: "Euclid's Common Notion 5 ('The whole is greater than the part') directly reflects which type of Aristotelian first principle?",
      options: [
        'A universal truth applicable to all scientific reasoning.',
        'A postulate specific only to geometric constructions.',
        'An empirical hypothesis that must be measured experimentally.',
        'A basic definition of a mathematical object.'
      ],
      correct: 0,
      hint: 'Common notions are self-evident axioms of reasoning, not specific geometric constructs like postulates.'
    },
    4: {
      title: '5-4. Demonstration',
      desc: "According to Aristotle's Posterior Analytics, what counts as genuine scientific knowledge?",
      options: [
        'A logical demonstration that explains the *cause* (why) of a fact, not just *that* it is true.',
        'A collection of measurements without deductive logical justifications.',
        'A description of a shape without linking it to starting axioms.',
        'Deducing theorems using non-logical methods.'
      ],
      correct: 0,
      hint: 'Real science doesn\'t just state a fact; it demonstrates the logical reason why it must be true.'
    },
    5: {
      title: '5-5. Science Classes',
      desc: "Under Aristotle's division of sciences, which category studies things that are 'abstracted from matter'?",
      options: [
        'Mathematics (Geometry & Arithmetic).',
        'Physics (Natural Science & Change).',
        'Biology (Living Systems).',
        'Ethics (Human Conduct).'
      ],
      correct: 0,
      hint: 'Mathematics studies pure quantity and form, abstracted from physical matter.'
    }
  };

  const currentQ = questions[activeSubtask] || questions[1];

  const handleVerify = (e) => {
    e.preventDefault();
    if (selectedOption === null) {
      setErrorMsg('Please select an option.');
      return;
    }

    if (selectedOption === currentQ.correct) {
      setIsSuccess(true);
      setErrorMsg('');
      completeSubtask(5, activeSubtask);
    } else {
      setErrorMsg(`Incorrect. Hint: ${currentQ.hint}`);
    }
  };

  const runSyllogism = () => {
    setSyllogismStep(1);
    setTimeout(() => setSyllogismStep(2), 800);
    setTimeout(() => setSyllogismStep(3), 1600);
  };

  // Render right panel based on active task
  const renderCanvas = () => {
    switch (activeSubtask) {
      case 1:
        return (
          <div className="absolute inset-0 bg-[#07090e] p-8 flex flex-col justify-center items-center select-none">
            <div className="max-w-md w-full bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-5">
              <div className="text-center border-b border-slate-800 pb-3">
                <Brain className="w-8 h-8 text-amber-500 mx-auto mb-2" />
                <h3 className="font-serif text-lg font-bold text-slate-200">Interactive Syllogism</h3>
                <p className="text-xs text-slate-500">Perform Aristotelian logical deduction</p>
              </div>

              <div className="space-y-4">
                <div className={`p-4 bg-slate-950 rounded-lg border-l-4 border-amber-500 transition-all duration-500 ${syllogismStep >= 1 ? 'opacity-100 translate-x-0' : 'opacity-30'}`}>
                  <span className="text-[9px] text-amber-500 font-bold uppercase tracking-wider block mb-1">Major Premise (Universal Rule)</span>
                  <span className="text-sm text-slate-350">"All triangles have interior angles summing to $180^\circ$."</span>
                </div>

                <div className={`p-4 bg-slate-950 rounded-lg border-l-4 border-yellow-500 transition-all duration-500 ${syllogismStep >= 2 ? 'opacity-100 translate-x-0' : 'opacity-30'}`}>
                  <span className="text-[9px] text-yellow-500 font-bold uppercase tracking-wider block mb-1">Minor Premise (Particular Fact)</span>
                  <span className="text-sm text-slate-350">"$\triangle ABC$ is a triangle."</span>
                </div>

                <div className={`p-4 bg-slate-950 rounded-lg border-l-4 border-emerald-500 transition-all duration-500 ${syllogismStep >= 3 ? 'opacity-100 scale-105' : 'opacity-30'}`}>
                  <span className="text-[9px] text-emerald-500 font-bold uppercase tracking-wider block mb-1">Conclusion (Deduced Truth)</span>
                  <span className="text-sm font-semibold text-slate-200">"Therefore, $\triangle ABC$ has interior angles summing to $180^\circ$."</span>
                </div>
              </div>

              <div className="flex justify-center pt-2">
                <button
                  onClick={runSyllogism}
                  disabled={syllogismStep > 0 && syllogismStep < 3}
                  className="bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-xs transition cursor-pointer flex items-center gap-1.5 active:scale-95"
                >
                  {syllogismStep === 3 ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5" /> Reset Logic
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-current" /> Perform Deduction
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="absolute inset-0 bg-[#07090e] p-8 flex flex-col justify-center items-center select-none">
            <div className="max-w-md w-full bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
              <h3 className="font-serif text-lg font-bold text-center text-slate-200 border-b border-slate-800 pb-3">
                Aristotelian Axiomatic Hierarchy
              </h3>
              <p className="text-xs text-slate-400 text-center leading-relaxed">
                Aristotle structured scientific deduction as a top-down logical flow starting from self-evident axioms.
              </p>

              <div className="space-y-3 pt-2">
                <div className="bg-slate-950 border border-slate-850 p-4 rounded-xl text-center shadow transform hover:scale-102 transition-transform cursor-default">
                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block mb-0.5">Step 1: Universal Rules</span>
                  <span className="text-sm font-bold text-slate-300 block mb-1">Definitions & Axioms</span>
                  <span className="text-[10px] text-amber-500/80 italic font-serif">Example: "The whole is greater than the part"</span>
                </div>
                <div className="text-center text-slate-650"><Compass className="w-4 h-4 mx-auto animate-bounce" /></div>
                <div className="bg-slate-950 border border-slate-850 p-4 rounded-xl text-center shadow w-11/12 mx-auto transform hover:scale-102 transition-transform cursor-default">
                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block mb-0.5">Step 2: Particular Assumptions</span>
                  <span className="text-sm font-bold text-slate-350 block mb-1">Postulates & Hypotheses</span>
                  <span className="text-[10px] text-yellow-500/80 italic font-serif">Example: "To draw a straight line from any point to any point"</span>
                </div>
                <div className="text-center text-slate-650"><Compass className="w-4 h-4 mx-auto animate-bounce" /></div>
                <div className="bg-amber-950/20 border border-amber-900/30 p-4 rounded-xl text-center shadow-lg w-5/6 mx-auto transform hover:scale-105 transition-transform cursor-default">
                  <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest block mb-1">Step 3: Deductive Target</span>
                  <span className="text-base font-bold text-amber-400 block mb-1">Propositions & Theorems</span>
                  <span className="text-[10px] text-emerald-400/90 italic font-serif">Example: "To construct an equilateral triangle on a line segment"</span>
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="absolute inset-0 bg-[#07090e] p-8 flex flex-col justify-center items-center select-none overflow-y-auto">
            <div className="max-w-2xl w-full bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
              <h3 className="font-serif text-lg font-bold text-center text-slate-200 border-b border-slate-800 pb-3">
                First Principles: Aristotle & Euclid
              </h3>

              <div className="grid md:grid-cols-2 gap-4 pt-2">
                <div className="bg-slate-950 border border-slate-850 p-4 rounded-xl space-y-3">
                  <span className="text-[9px] font-bold text-amber-500 uppercase tracking-wider block">Aristotelian Philosophy</span>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Aristotle argued that sciences begin with universal common principles that apply to all reasoning, such as:
                  </p>
                  <div className="bg-slate-900 p-2.5 rounded border border-slate-850 text-[11px] text-slate-300">
                    "If equals are subtracted from equals, the remainders are equal."
                  </div>
                </div>

                <div className="bg-slate-950 border border-slate-850 p-4 rounded-xl space-y-3">
                  <span className="text-[9px] font-bold text-yellow-500 uppercase tracking-wider block">Euclid's Elements</span>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Euclid structured these universal principles under the name <strong>Common Notions</strong> (CN) in Book I:
                  </p>
                  <div className="bg-slate-900 p-2.5 rounded border border-slate-850 text-[11px] text-slate-350">
                    <strong>CN 3:</strong> "If equals be subtracted from equals, the remainders are equal."
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="absolute inset-0 bg-[#07090e] p-6 flex flex-col justify-center items-center select-none overflow-y-auto">
            <div className="max-w-2xl w-full bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-4">
              <div className="text-center border-b border-slate-800 pb-2.5">
                <h3 className="font-serif text-lg font-bold text-slate-200">Geometric Demonstration Example</h3>
                <p className="text-xs text-slate-400">Sum of interior angles in a triangle is $180^\circ$</p>
              </div>

              <div className="grid md:grid-cols-2 gap-4 items-center">
                {/* Left Side: SVG Illustration (Triangle & Parallel Line) */}
                <div className="bg-slate-950/80 border border-slate-850 rounded-xl p-4 flex flex-col items-center justify-center relative">
                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest absolute top-3 left-3">Illustration</span>
                  
                  <svg width="260" height="200" viewBox="0 0 260 200" className="mt-4">
                    {/* Parallel Line at Vertex C */}
                    <line x1="20" y1="50" x2="240" y2="50" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="3 3" />
                    <text x="25" y="42" fill="#f59e0b" className="text-[10px] font-bold">Parallel Line</text>

                    {/* Base line AB */}
                    <line x1="60" y1="150" x2="200" y2="150" stroke="#475569" strokeWidth="1.5" />
                    
                    {/* Triangle Sides */}
                    <line x1="60" y1="150" x2="130" y2="50" stroke="#e2e8f0" strokeWidth="2" />
                    <line x1="200" y1="150" x2="130" y2="50" stroke="#e2e8f0" strokeWidth="2" />

                    {/* Angle sectors at vertices */}
                    {/* Angle a (bottom-left) */}
                    <path
                      d="M 60 150 L 80 150 A 20 20 0 0 0 74 130 Z"
                      fill="#f59e0b"
                      fillOpacity={hoveredAngle === 'a' ? 0.6 : 0.2}
                      stroke="#f59e0b"
                      strokeWidth={hoveredAngle === 'a' ? 2 : 1}
                      className="transition-all duration-300"
                    />
                    <text x="72" y="145" fill="#f59e0b" className="text-[9px] font-bold">a</text>

                    {/* Angle b (bottom-right) */}
                    <path
                      d="M 200 150 L 180 150 A 20 20 0 0 1 189 135 Z"
                      fill="#10b981"
                      fillOpacity={hoveredAngle === 'b' ? 0.6 : 0.2}
                      stroke="#10b981"
                      strokeWidth={hoveredAngle === 'b' ? 2 : 1}
                      className="transition-all duration-300"
                    />
                    <text x="182" y="145" fill="#10b981" className="text-[9px] font-bold">b</text>

                    {/* Vertex C labels */}
                    {/* Alternate angle a' (left) */}
                    <path
                      d="M 130 50 L 110 50 A 20 20 0 0 0 116 64 Z"
                      fill="#f59e0b"
                      fillOpacity={hoveredAngle === 'a' ? 0.6 : 0.2}
                      stroke="#f59e0b"
                      strokeWidth={hoveredAngle === 'a' ? 2 : 1}
                      className="transition-all duration-300"
                    />
                    <text x="112" y="45" fill="#f59e0b" className="text-[9px] font-bold">a'</text>

                    {/* Angle c (middle) */}
                    <path
                      d="M 130 50 L 116 64 A 20 20 0 0 0 144 64 Z"
                      fill="#6366f1"
                      fillOpacity={hoveredAngle === 'c' ? 0.6 : 0.2}
                      stroke="#6366f1"
                      strokeWidth={hoveredAngle === 'c' ? 2 : 1}
                      className="transition-all duration-300"
                    />
                    <text x="127" y="68" fill="#6366f1" className="text-[9px] font-bold">c</text>

                    {/* Alternate angle b' (right) */}
                    <path
                      d="M 130 50 L 144 64 A 20 20 0 0 0 150 50 Z"
                      fill="#10b981"
                      fillOpacity={hoveredAngle === 'b' ? 0.6 : 0.2}
                      stroke="#10b981"
                      strokeWidth={hoveredAngle === 'b' ? 2 : 1}
                      className="transition-all duration-300"
                    />
                    <text x="142" y="45" fill="#10b981" className="text-[9px] font-bold">b'</text>

                    {/* Vertex Labels */}
                    <text x="45" y="165" fill="#94a3b8" className="text-[10px] font-serif font-bold">A</text>
                    <text x="210" y="165" fill="#94a3b8" className="text-[10px] font-serif font-bold">B</text>
                    <text x="128" y="32" fill="#94a3b8" className="text-[10px] font-serif font-bold">C</text>
                  </svg>
                  
                  <div className="mt-2 text-center">
                    <p className="text-[10px] text-slate-400 leading-relaxed font-serif">
                      {"Alternate angles are equal: $a' = a$ and $b' = b$."}
                    </p>
                    <p className="text-[10px] font-semibold text-slate-350 font-serif">
                      {"Straight line: $a' + c + b' = 180^\\circ$"}
                    </p>
                  </div>
                </div>

                {/* Right Side: Demonstration Mapping to the 3 criteria */}
                <div className="space-y-3">
                  <div
                    className={`bg-slate-950 p-3 rounded-lg border transition-all duration-300 cursor-default ${
                      hoveredAngle === 'a'
                        ? 'border-amber-500 bg-amber-950/15 scale-102 shadow-[0_0_12px_rgba(245,158,11,0.15)]'
                        : 'border-slate-850'
                    }`}
                    onMouseEnter={() => setHoveredAngle('a')}
                    onMouseLeave={() => setHoveredAngle(null)}
                  >
                    <span className="text-[8px] font-bold text-amber-500 uppercase tracking-widest block mb-0.5">1. True Premises</span>
                    <p className="text-[10.5px] leading-relaxed text-slate-400">
                      {"We start from the self-evident axiom that parallel lines cut by a transversal form equal alternate interior angles ($a' = a$ and $b' = b$)."}
                    </p>
                  </div>

                  <div
                    className={`bg-slate-950 p-3 rounded-lg border transition-all duration-300 cursor-default ${
                      hoveredAngle === 'c'
                        ? 'border-indigo-500 bg-indigo-950/15 scale-102 shadow-[0_0_12px_rgba(99,102,241,0.15)]'
                        : 'border-slate-850'
                    }`}
                    onMouseEnter={() => setHoveredAngle('c')}
                    onMouseLeave={() => setHoveredAngle(null)}
                  >
                    <span className="text-[8px] font-bold text-yellow-500 uppercase tracking-widest block mb-0.5">2. Deductive Leap-Free</span>
                    <p className="text-[10.5px] leading-relaxed text-slate-400">
                      {"We draw a line parallel to base $AB$ through vertex $C$. The alternate angles line up with interior angles on a straight line at vertex $C$, meaning $a' + c + b' = 180^\\circ$, proving $a + c + b = 180^\\circ$ without assumptions."}
                    </p>
                  </div>

                  <div
                    className={`bg-slate-950 p-3 rounded-lg border transition-all duration-300 cursor-default ${
                      hoveredAngle === 'b'
                        ? 'border-emerald-500 bg-emerald-950/15 scale-102 shadow-[0_0_12px_rgba(16,185,129,0.15)]'
                        : 'border-slate-850'
                    }`}
                    onMouseEnter={() => setHoveredAngle('b')}
                    onMouseLeave={() => setHoveredAngle(null)}
                  >
                    <span className="text-[8px] font-bold text-emerald-500 uppercase tracking-widest block mb-0.5">3. Explanatory Power</span>
                    <p className="text-[10.5px] leading-relaxed text-slate-350">
                      {"Rather than just measuring to see *that* it is true, the parallel line structure demonstrates the logical cause (why) the sum is $180^\\circ$."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="absolute inset-0 bg-[#07090e] p-8 flex flex-col justify-center items-center select-none overflow-y-auto">
            <div className="max-w-md w-full bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
              <h3 className="font-serif text-lg font-bold text-center text-slate-200 border-b border-slate-800 pb-3">
                Aristotle's Classification of Sciences
              </h3>
              <p className="text-xs text-slate-400 text-center leading-relaxed">
                By organizing sciences into distinct classes, Aristotle defined mathematics as studies of quantities abstracted from matter.
              </p>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="bg-slate-950 p-3 rounded-lg border border-slate-850 text-center hover:bg-slate-900 transition-colors cursor-default">
                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">Physics</span>
                  <span className="text-[11px] text-slate-350">Matter & motion</span>
                </div>
                <div className="bg-amber-950/20 p-3 rounded-lg border border-amber-900/30 text-center shadow transform scale-105 cursor-default">
                  <span className="text-[9px] font-bold text-amber-500 uppercase tracking-wider block">Mathematics</span>
                  <span className="text-[11px] font-semibold text-amber-400">Abstracted Quantity</span>
                </div>
                <div className="bg-slate-950 p-3 rounded-lg border border-slate-850 text-center hover:bg-slate-900 transition-colors cursor-default">
                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">Biology</span>
                  <span className="text-[11px] text-slate-350">Living organisms</span>
                </div>
                <div className="bg-slate-950 p-3 rounded-lg border border-slate-850 text-center hover:bg-slate-900 transition-colors cursor-default">
                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">Ethics</span>
                  <span className="text-[11px] text-slate-350">Human action</span>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const renderLeftPanel = () => {
    if (activeSubtask === 4) {
      return (
        <div className="space-y-4 overflow-y-auto pr-1">
          <h2 className="text-xl font-light tracking-tight text-white leading-tight">
            Posterior Analytics: <span className="font-bold text-amber-500">Demonstration</span>
          </h2>
          <p className="text-slate-400 leading-relaxed text-justify">
            Aristotle defined three criteria that raise arguments to genuine scientific demonstrations:
          </p>

          <div className="space-y-3">
            <div className="flex gap-3 bg-slate-900/60 p-3 rounded-lg border border-slate-800/40 items-center">
              <div className="w-8 h-8 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold text-xs shrink-0">
                1
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-305 font-sans">True Premises</h4>
                <p className="text-[10px] text-slate-500">Must start from true and self-evident axioms.</p>
              </div>
            </div>

            <div className="flex gap-3 bg-slate-900/60 p-3 rounded-lg border border-slate-800/40 items-center">
              <div className="w-8 h-8 rounded-full bg-yellow-500/10 text-yellow-500 flex items-center justify-center font-bold text-xs shrink-0">
                2
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-305 font-sans">Deductive Leap-Free</h4>
                <p className="text-[10px] text-slate-500">Every step must follow logically with absolute rigor.</p>
              </div>
            </div>

            <div className="flex gap-3 bg-slate-900/60 p-3 rounded-lg border border-slate-800/40 items-center">
              <div className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold text-xs shrink-0 animate-pulse">
                3
              </div>
              <div>
                <h4 className="text-xs font-bold text-emerald-400 font-sans">Explanatory Power</h4>
                <p className="text-[10px] text-slate-500">Must prove *why* the fact holds true, not just *that* it does.</p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-4 overflow-y-auto pr-1">
        <h2 className="text-xl font-light tracking-tight text-white leading-tight">
          Aristotle's <span className="font-bold text-amber-500">Methodology</span>
        </h2>
        <p className="text-slate-400 leading-relaxed text-justify">
          Aristotle of Stagira (384–322 BC) formulated the principles of formal logic and scientific structure. Decades later, Euclid of Alexandria built his masterpiece, the <em>Elements</em>, using Aristotle's axiomatic blueprints.
        </p>

        <div className="bg-slate-900/60 border border-slate-800/40 rounded-xl p-3 flex flex-col gap-1">
          <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Philosophical Impact</h4>
          <p className="text-[11px] leading-relaxed text-slate-300 text-justify">
            Before geometry could be proved, the rules of proof had to be created. Aristotle developed syllogistic deduction, defined unproved starting axioms, and argued that mathematical objects exist as pure form abstracted from matter.
          </p>
        </div>
      </div>
    );
  };

  return (
    <LevelShell
      title="Level 5: Aristotle"
      activeSubtask={activeSubtask}
      completedSubtasks={completedSubtasks}
      canvas={renderCanvas()}
    >
      <div className="flex flex-col gap-4 text-slate-350 text-xs h-full justify-between tex2jax_process">
        
        {/* Context panel */}
        {renderLeftPanel()}

        {/* Verification Card */}
        <div className="bg-slate-950/40 border border-slate-800/80 p-4 rounded-xl flex flex-col gap-3">
          <h3 className="text-xs font-bold text-amber-500 uppercase tracking-wider flex items-center gap-2">
            <Compass className="w-4 h-4" /> {currentQ.title}
          </h3>
          <p className="text-[11px] leading-relaxed text-slate-300">
            {currentQ.desc}
          </p>

          <div className="border-t border-slate-800/80 pt-3 flex flex-col gap-2">
            <div className="flex flex-col gap-2">
              {currentQ.options.map((opt, idx) => (
                <label
                  key={idx}
                  className={`flex items-start gap-3 p-3 rounded-lg border text-[11px] cursor-pointer transition ${
                    selectedOption === idx
                      ? 'bg-amber-950/20 border-amber-500 text-amber-300'
                      : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="aristotle-option"
                    checked={selectedOption === idx}
                    onChange={() => {
                      if (!isSuccess) {
                        setSelectedOption(idx);
                        setErrorMsg('');
                      }
                    }}
                    disabled={isSuccess}
                    className="mt-0.5 accent-amber-500 cursor-pointer"
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>

            {errorMsg && (
              <div className="text-[11px] text-rose-400 font-bold bg-rose-955/20 border border-rose-900/50 p-2 rounded mt-1">
                {errorMsg}
              </div>
            )}

            {isSuccess ? (
              <div className="text-[11px] text-emerald-400 font-bold bg-emerald-950/20 border border-emerald-900/50 p-2.5 rounded flex items-center gap-1.5 mt-1">
                <Star className="w-4 h-4 text-amber-500 fill-current" />
                <span>Superb! Aristotelian methodology question verified. Excellent progress!</span>
              </div>
            ) : (
              <div className="flex justify-end mt-1">
                <button
                  onClick={handleVerify}
                  className="bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold px-4 py-2 rounded-lg text-xs transition cursor-pointer"
                >
                  Verify Answer
                </button>
              </div>
            )}
          </div>
        </div>

      </div>
    </LevelShell>
  );
}
