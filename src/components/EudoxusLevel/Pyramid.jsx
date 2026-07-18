import React, { useState, useEffect, useRef } from 'react';
import { useGameState } from '../../context/GameStateContext';
import { Compass, Star, Play, RotateCcw } from 'lucide-react';
import LevelShell from '../LevelShell';

export default function Pyramid() {
  const { activeSubtask, completedSubtasks, completeSubtask } = useGameState();
  const [n, setN] = useState(4);
  const [mode, setMode] = useState('inscribed'); // 'inscribed' or 'circumscribed'
  const [answer, setAnswer] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const iframeRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const W = 6;  // Base side width
  const H = 10; // Total height
  const dh = H / n;

  // Calculate volume
  const trueVolume = (1 / 3) * Math.pow(W, 2) * H;
  
  let approxVolume = 0;
  for (let k = 0; k < n; k++) {
    let width = 0;
    if (mode === 'inscribed') {
      width = W * (1 - ((k + 1) * dh) / H);
    } else {
      width = W * (1 - (k * dh) / H);
    }
    if (width > 0) {
      approxVolume += Math.pow(width, 2) * dh;
    }
  }

  const errorPercent = (Math.abs(approxVolume - trueVolume) / trueVolume) * 100;

  // Send updates to the iframe
  useEffect(() => {
    if (iframeRef.current && iframeRef.current.contentWindow && isLoaded) {
      iframeRef.current.contentWindow.postMessage({
        type: 'UPDATE_PARAMS',
        n,
        mode
      }, '*');
    }
  }, [n, mode, isLoaded]);

  // Trigger MathJax typesetting on state changes
  useEffect(() => {
    if (window.MathJax && typeof window.MathJax.typesetPromise === 'function') {
      window.MathJax.typesetPromise();
    }
  });

  const handleVerify = (e) => {
    e.preventDefault();
    const val = parseInt(answer.trim(), 10);
    if (isNaN(val)) {
      setErrorMsg('Please enter a valid integer.');
      return;
    }

    // Question: Pyramid with base side W=5, height H=12. Volume = 1/3 * 25 * 12 = 100.
    if (val === 100) {
      setIsSuccess(true);
      setErrorMsg('');
      completeSubtask(4, 1);
    } else {
      setErrorMsg('Incorrect. Hint: Volume = \\(\\frac{1}{3} \\times W^2 \\times H\\). Calculate \\(\\frac{1}{3} \\times (5^2) \\times 12\\) and enter the result (e.g. 100).');
    }
  };

  const iframeSrcDoc = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { margin: 0; padding: 0; overflow: hidden; background: #07090e; }
        #canvas-container { width: 100vw; height: 100vh; }
        .math-label {
          color: #94a3b8;
          font-size: 11px;
          font-family: monospace;
          pointer-events: none;
          background: rgba(15, 23, 42, 0.85);
          padding: 2px 6px;
          border-radius: 4px;
          border: 1px solid #334155;
        }
      </style>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
      <script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.js"></script>
      <script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/renderers/CSS2DRenderer.js"></script>
    </head>
    <body>
      <div id="canvas-container"></div>
      <script>
        const state = { n: 4, mode: 'inscribed', W: 6, H: 10 };
        
        const container = document.getElementById('canvas-container');
        const scene = new THREE.Scene();
        scene.background = new THREE.Color('#07090e');

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        container.appendChild(renderer.domElement);

        const labelRenderer = new THREE.CSS2DRenderer();
        labelRenderer.setSize(window.innerWidth, window.innerHeight);
        labelRenderer.domElement.style.position = 'absolute';
        labelRenderer.domElement.style.top = '0px';
        labelRenderer.domElement.style.pointerEvents = 'none';
        container.appendChild(labelRenderer.domElement);

        const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.set(13, 11, 13);

        const controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.target.set(0, state.H / 2, 0);

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        scene.add(ambientLight);
        const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
        dirLight.position.set(10, 20, 15);
        scene.add(dirLight);

        const gridHelper = new THREE.GridHelper(20, 20, 0x334155, 0x1e293b);
        scene.add(gridHelper);

        // Static translucent pyramid
        const pyramidGeo = new THREE.CylinderGeometry(0, state.W / Math.sqrt(2), state.H, 4, 1);
        pyramidGeo.translate(0, state.H / 2, 0);
        const pyramidMat = new THREE.MeshStandardMaterial({
          color: 0x94a3b8,
          transparent: true,
          opacity: 0.15,
          wireframe: true
        });
        const staticPyramid = new THREE.Mesh(pyramidGeo, pyramidMat);
        staticPyramid.rotation.y = Math.PI / 4; // Align flat sides with grid
        scene.add(staticPyramid);

        const slabGroup = new THREE.Group();
        scene.add(slabGroup);

        const dimGroup = new THREE.Group();
        scene.add(dimGroup);

        const slabMat = new THREE.MeshStandardMaterial({
          color: 0xf59e0b, // Amber color for pyramid
          transparent: true,
          opacity: 0.7,
          roughness: 0.3,
          metalness: 0.1
        });
        const slabEdgeMat = new THREE.LineBasicMaterial({ color: 0xd97706, transparent: true, opacity: 0.4 });
        const unitSlabGeo = new THREE.BoxGeometry(1, 1, 1);
        const unitEdgesGeo = new THREE.EdgesGeometry(unitSlabGeo);

        function updateVisualization() {
          while(slabGroup.children.length > 0) slabGroup.remove(slabGroup.children[0]);
          while(dimGroup.children.length > 0) dimGroup.remove(dimGroup.children[0]);

          const W = state.W;
          const H = state.H;
          const N = state.n;
          const dh = H / N;

          for (let k = 0; k < N; k++) {
            let wSlice = 0;
            let yPos = k * dh + (dh / 2);
            if (state.mode === 'inscribed') {
              wSlice = W * (1 - ((k + 1) * dh) / H);
            } else {
              wSlice = W * (1 - (k * dh) / H);
            }

            if (wSlice > 0) {
              const slab = new THREE.Mesh(unitSlabGeo, slabMat);
              slab.scale.set(wSlice, dh, wSlice);
              slab.position.set(0, yPos, 0);

              const edges = new THREE.LineSegments(unitEdgesGeo, slabEdgeMat);
              edges.scale.copy(slab.scale);
              edges.position.copy(slab.position);

              slabGroup.add(slab);
              slabGroup.add(edges);
            }
          }

          // Bracket
          const dimX = (W / 2) + 1.5;
          const lineMat = new THREE.LineBasicMaterial({ color: 0x475569 });
          const lineGeo = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(dimX, 0, 0), new THREE.Vector3(dimX, dh, 0),
            new THREE.Vector3(dimX - 0.4, 0, 0), new THREE.Vector3(dimX + 0.4, 0, 0),
            new THREE.Vector3(dimX - 0.4, dh, 0), new THREE.Vector3(dimX + 0.4, dh, 0)
          ]);
          const bracket = new THREE.LineSegments(lineGeo, lineMat);
          dimGroup.add(bracket);

          const labelDiv = document.createElement('div');
          labelDiv.className = 'math-label';
          labelDiv.textContent = 'H/N';
          const labelObj = new THREE.CSS2DObject(labelDiv);
          labelObj.position.set(dimX + 0.8, dh / 2, 0);
          dimGroup.add(labelObj);
        }

        window.addEventListener('message', (e) => {
          if (e.data.type === 'UPDATE_PARAMS') {
            state.n = e.data.n;
            state.mode = e.data.mode;
            updateVisualization();
          }
        });

        window.addEventListener('resize', () => {
          renderer.setSize(window.innerWidth, window.innerHeight);
          labelRenderer.setSize(window.innerWidth, window.innerHeight);
          camera.aspect = window.innerWidth / window.innerHeight;
          camera.updateProjectionMatrix();
        });

        function animate() {
          requestAnimationFrame(animate);
          controls.update();
          renderer.render(scene, camera);
          labelRenderer.render(scene, camera);
        }

        updateVisualization();
        animate();
      </script>
    </body>
    </html>
  `;

  return (
    <LevelShell
      title="Level 4: Eudoxus"
      activeSubtask={activeSubtask}
      completedSubtasks={completedSubtasks}
      canvas={
        <div className="absolute inset-0 w-full h-full relative">
          <iframe
            ref={iframeRef}
            srcDoc={iframeSrcDoc}
            onLoad={() => setIsLoaded(true)}
            className="w-full h-full border-none"
            title="Pyramid Method of Exhaustion 3D"
          />

          {/* Floating Controls Card */}
          <div className="absolute top-4 left-4 bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-xl p-4 shadow-2xl z-20 w-[280px] md:w-[320px] pointer-events-auto space-y-4 select-none tex2jax_process">
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Number of Layers (N = {n})</span>
              </div>
              <input
                type="range"
                min="1"
                max="50"
                value={n}
                onChange={(e) => setN(parseInt(e.target.value))}
                className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
            </div>

            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Approximation Mode</span>
              <div className="flex bg-slate-950 rounded-lg p-1 border border-slate-800">
                <button
                  onClick={() => setMode('inscribed')}
                  className={`flex-1 py-1.5 text-[11px] font-semibold rounded transition cursor-pointer ${mode === 'inscribed' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
                >
                  Inscribed (Under)
                </button>
                <button
                  onClick={() => setMode('circumscribed')}
                  className={`flex-1 py-1.5 text-[11px] font-semibold rounded transition cursor-pointer ${mode === 'circumscribed' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
                >
                  Circumscribed (Over)
                </button>
              </div>
            </div>

            <div className="bg-slate-950/40 border border-slate-800 p-3 rounded-lg grid grid-cols-2 gap-3 text-center">
              <div>
                <span className="text-[8px] font-bold text-slate-500 uppercase tracking-wider block mb-0.5">True Volume</span>
                <span className="text-sm font-bold text-slate-300">{trueVolume.toFixed(2)}</span>
              </div>
              <div>
                <span className="text-[8px] font-bold text-slate-500 uppercase tracking-wider block mb-0.5">Approximation</span>
                <span className="text-sm font-bold text-amber-400">{approxVolume.toFixed(2)}</span>
              </div>
              <div className="col-span-2 border-t border-slate-800/80 pt-2 flex justify-between px-2 text-[10px]">
                <span className="text-slate-500 font-bold uppercase tracking-wider">Error Gap:</span>
                <span className="font-mono text-slate-300">{errorPercent.toFixed(2)}%</span>
              </div>
            </div>

            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Current Summation</span>
              <div className="bg-slate-950/60 p-2 text-center font-mono text-[10px] text-amber-500">
                {mode === 'inscribed' ? (
                  <span>{"$$V_{in} = \\sum_{i=1}^{N-1} \\left(W \\cdot \\frac{i}{N}\\right)^2 \\frac{H}{N}$$"}</span>
                ) : (
                  <span>{"$$V_{out} = \\sum_{i=1}^{N} \\left(W \\cdot \\frac{i}{N}\\right)^2 \\frac{H}{N}$$"}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      }
    >
      <div className="flex flex-col gap-4 text-slate-350 text-xs h-full justify-between tex2jax_process">
        
        {/* Context panel */}
        <div className="space-y-4 overflow-y-auto pr-1">
          <h2 className="text-xl font-light tracking-tight text-white leading-tight">
            Eudoxus of <span className="font-bold text-amber-500">Cnidus</span>
          </h2>
          <p className="text-slate-400 leading-relaxed">
            Eudoxus (c. 408–355 BC) solved a longstanding mathematical problem: finding the exact volume of three-dimensional curved and sloping shapes. 
          </p>
          
          <div className="bg-slate-900/60 border border-slate-800/40 rounded-xl p-3 flex flex-col gap-1.5">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Method of Exhaustion</h4>
            <p className="text-[11px] leading-relaxed text-slate-300">
              Before calculus, Eudoxus rigorously calculated volumes by sandwiching a target shape between simpler, known shapes. 
              By filling a pyramid with thinner and thinner rectangular prism slabs, the total volume of the slabs "exhausts" the remaining space, converging exactly to:
            </p>
            <div className="bg-slate-950/60 p-2.5 rounded border border-slate-850 text-center text-xs font-mono text-amber-400 my-1">
              {"$$V = \\frac{1}{3} \\cdot \\text{Base Area} \\cdot \\text{Height}$$"}
            </div>
          </div>
        </div>

        {/* Verification Card */}
        <div className="bg-slate-950/40 border border-slate-800/80 p-4 rounded-xl flex flex-col gap-3">
          <h3 className="text-xs font-bold text-amber-500 uppercase tracking-wider flex items-center gap-2">
            <Compass className="w-4 h-4" /> 4-1. Pyramid Volume
          </h3>
          <p className="text-[11px] leading-relaxed text-slate-300">
            A square pyramid has a base side length of $W = 5$ and a height of $H = 12$. Using the formula derived by Eudoxus, calculate the exact volume of this pyramid.
          </p>

          <div className="border-t border-slate-800/80 pt-3 flex flex-col gap-2.5">
            <div className="flex flex-col gap-1">
              <span className="text-[9px] uppercase font-bold tracking-wider text-slate-400">Exact Volume</span>
              <input
                type="text"
                value={answer}
                onChange={(e) => {
                  setAnswer(e.target.value);
                  setErrorMsg('');
                }}
                disabled={isSuccess}
                placeholder="e.g. 100"
                className="bg-slate-900 border border-slate-800 text-white text-xs px-3 py-2 rounded-lg outline-none focus:border-amber-500 transition text-center font-mono"
              />
            </div>

            {errorMsg && (
              <div className="text-[11px] text-rose-400 font-bold bg-rose-955/20 border border-rose-900/50 p-2 rounded mt-1">
                {errorMsg}
              </div>
            )}

            {isSuccess ? (
              <div className="text-[11px] text-emerald-400 font-bold bg-emerald-950/20 border border-emerald-900/50 p-2.5 rounded flex items-center gap-1.5 mt-1">
                <Star className="w-4 h-4 text-amber-500 fill-current" />
                <span>Superb! Volume verified (100). Task 1 complete! Select Task 2 to proceed to the Cone.</span>
              </div>
            ) : (
              <div className="flex justify-end mt-1">
                <button
                  onClick={handleVerify}
                  className="bg-amber-600 hover:bg-amber-500 text-white font-bold px-4 py-2 rounded-lg text-xs transition cursor-pointer"
                >
                  Verify Volume
                </button>
              </div>
            )}
          </div>
        </div>

      </div>
    </LevelShell>
  );
}
