import React, { useState, useEffect, useRef } from 'react';
import { useGameState } from '../../context/GameStateContext';
import { Compass, Star } from 'lucide-react';
import LevelShell from '../LevelShell';

export default function Cone() {
  const { activeSubtask, completedSubtasks, completeSubtask } = useGameState();
  const [n, setN] = useState(4);
  const [mode, setMode] = useState('inscribed'); // 'inscribed' or 'circumscribed'
  const [answer, setAnswer] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const iframeRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const R = 5;  // Base radius
  const H = 10; // Total height
  const dh = H / n;

  // Calculate volume
  const trueVolume = (1 / 3) * Math.PI * Math.pow(R, 2) * H;
  
  let approxVolume = 0;
  for (let k = 0; k < n; k++) {
    let rSlice = 0;
    if (mode === 'inscribed') {
      rSlice = R * (1 - ((k + 1) * dh) / H);
    } else {
      rSlice = R * (1 - (k * dh) / H);
    }
    if (rSlice > 0) {
      approxVolume += Math.PI * Math.pow(rSlice, 2) * dh;
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

  const handleVerify = (e) => {
    e.preventDefault();
    const cleaned = answer.replace(/\s+/g, '').replace('pi', '').replace('*', '').trim();
    const val = parseInt(cleaned, 10);
    
    if (isNaN(val)) {
      setErrorMsg('Please enter a valid integer.');
      return;
    }

    // Question: Cone with base radius R=3, height H=10. Volume = 1/3 * pi * 9 * 10 = 30 * pi.
    // Coefficient is 30.
    if (val === 30) {
      setIsSuccess(true);
      setErrorMsg('');
      completeSubtask(4, 2);
    } else {
      setErrorMsg('Incorrect. Hint: Volume = 1/3 * pi * R² * H. Calculate 1/3 * pi * (3²) * 10, then enter only the multiple coefficient of pi (e.g. 30).');
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
        const state = { n: 4, mode: 'inscribed', R: 5, H: 10 };
        
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

        // Static translucent cone
        const coneGeo = new THREE.ConeGeometry(state.R, state.H, 32);
        coneGeo.translate(0, state.H / 2, 0);
        const coneMat = new THREE.MeshStandardMaterial({
          color: 0x94a3b8,
          transparent: true,
          opacity: 0.15,
          wireframe: true
        });
        const staticCone = new THREE.Mesh(coneGeo, coneMat);
        scene.add(staticCone);

        const cylinderGroup = new THREE.Group();
        scene.add(cylinderGroup);

        const dimGroup = new THREE.Group();
        scene.add(dimGroup);

        const cylinderMat = new THREE.MeshStandardMaterial({
          color: 0x0ea5e9, // Sky Blue / Cyan color
          transparent: true,
          opacity: 0.7,
          roughness: 0.3,
          metalness: 0.1
        });
        const cylinderEdgeMat = new THREE.LineBasicMaterial({ color: 0x0284c7, transparent: true, opacity: 0.4 });
        const unitCylinderGeo = new THREE.CylinderGeometry(1, 1, 1, 32);
        const unitEdgesGeo = new THREE.EdgesGeometry(unitCylinderGeo);

        function updateVisualization() {
          while(cylinderGroup.children.length > 0) cylinderGroup.remove(cylinderGroup.children[0]);
          while(dimGroup.children.length > 0) dimGroup.remove(dimGroup.children[0]);

          const R = state.R;
          const H = state.H;
          const N = state.n;
          const dh = H / N;

          for (let k = 0; k < N; k++) {
            let rSlice = 0;
            let yPos = k * dh + (dh / 2);
            if (state.mode === 'inscribed') {
              rSlice = R * (1 - ((k + 1) * dh) / H);
            } else {
              rSlice = R * (1 - (k * dh) / H);
            }

            if (rSlice > 0) {
              const cyl = new THREE.Mesh(unitCylinderGeo, cylinderMat);
              cyl.scale.set(rSlice, dh, rSlice);
              cyl.position.set(0, yPos, 0);

              const edges = new THREE.LineSegments(unitEdgesGeo, cylinderEdgeMat);
              edges.scale.copy(cyl.scale);
              edges.position.copy(cyl.position);

              cylinderGroup.add(cyl);
              cylinderGroup.add(edges);
            }
          }

          // Bracket
          const dimX = R + 1.5;
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
        <div className="absolute inset-0 w-full h-full">
          <iframe
            ref={iframeRef}
            srcDoc={iframeSrcDoc}
            onLoad={() => setIsLoaded(true)}
            className="w-full h-full border-none"
            title="Cone Method of Exhaustion 3D"
          />
        </div>
      }
    >
      <div className="flex flex-col gap-4 text-slate-350 text-xs h-full justify-between">
        
        {/* Context panel */}
        <div className="space-y-4 overflow-y-auto pr-1">
          <h2 className="text-xl font-light tracking-tight text-white leading-tight">
            The <span className="font-bold text-sky-400">Cone Volume</span> Proof
          </h2>
          <p className="text-slate-400 leading-relaxed">
            By scaling cylinder slices inside a cone, Eudoxus proved that curved 3D solids follow the same "one-third" ratio as flat-faced pyramids.
          </p>
          
          <div className="bg-slate-900/60 border border-slate-800/40 rounded-xl p-3 flex flex-col gap-1.5">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Method of Exhaustion</h4>
            <p className="text-[11px] leading-relaxed text-slate-300">
              When we divide the cone height $H$ into $N$ layers, the height of each slice is $H/N$. Inscribing or circumscribing cylinder disks of height $H/N$ allows us to define upper and lower bounds for the total volume:
            </p>
            <div className="bg-slate-950/60 p-2.5 rounded border border-slate-850 text-center text-xs font-mono text-sky-400 my-1">
              V = ⅓ · π · R² · Height
            </div>
          </div>

          {/* Controls */}
          <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-4 space-y-4">
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
                className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-500"
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
                <span className="text-sm font-bold text-sky-400">{approxVolume.toFixed(2)}</span>
              </div>
              <div className="col-span-2 border-t border-slate-800/80 pt-2 flex justify-between px-2 text-[10px]">
                <span className="text-slate-500 font-bold uppercase tracking-wider">Error Gap:</span>
                <span className="font-mono text-slate-300">{errorPercent.toFixed(2)}%</span>
              </div>
            </div>

            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Current Summation</span>
              <div className="bg-slate-950/60 p-2.5 rounded border border-slate-850 text-center font-mono text-[10px] text-sky-400">
                {mode === 'inscribed' ? (
                  <span>V<sub>in</sub> = ∑<sub>i=1</sub><sup>N-1</sup> π · (R · i/N)² · (H/N)</span>
                ) : (
                  <span>V<sub>out</sub> = ∑<sub>i=1</sub><sup>N</sup> π · (R · i/N)² · (H/N)</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Verification Card */}
        <div className="bg-slate-950/40 border border-slate-800/80 p-4 rounded-xl flex flex-col gap-3">
          <h3 className="text-xs font-bold text-sky-400 uppercase tracking-wider flex items-center gap-2">
            <Compass className="w-4 h-4" /> 4-2. Cone Volume
          </h3>
          <p className="text-[11px] leading-relaxed text-slate-300">
            A cone has a base radius of <strong>R = 3</strong> and a height of <strong>H = 10</strong>. Calculate the exact volume of this cone. Enter your answer as a multiple of <strong>π</strong> (e.g. if the volume is 30π, enter <strong>30</strong>).
          </p>

          <div className="border-t border-slate-800/80 pt-3 flex flex-col gap-2.5">
            <div className="flex flex-col gap-1">
              <span className="text-[9px] uppercase font-bold tracking-wider text-slate-400">Exact Volume (multiple of π)</span>
              <input
                type="text"
                value={answer}
                onChange={(e) => {
                  setAnswer(e.target.value);
                  setErrorMsg('');
                }}
                disabled={isSuccess}
                placeholder="e.g. 30"
                className="bg-slate-900 border border-slate-800 text-white text-xs px-3 py-2 rounded-lg outline-none focus:border-sky-500 transition text-center font-mono"
              />
            </div>

            {errorMsg && (
              <div className="text-[11px] text-rose-400 font-bold bg-rose-955/20 border border-rose-900/50 p-2 rounded mt-1">
                {errorMsg}
              </div>
            )}

            {isSuccess ? (
              <div className="text-[11px] text-emerald-400 font-bold bg-emerald-950/20 border border-emerald-900/50 p-2.5 rounded flex items-center gap-1.5 mt-1">
                <Star className="w-4 h-4 text-sky-400 fill-current" />
                <span>Superb! Volume verified (30π). You have completed Eudoxus's 3D volume calculations! Excellent work!</span>
              </div>
            ) : (
              <div className="flex justify-end mt-1">
                <button
                  onClick={handleVerify}
                  className="bg-sky-600 hover:bg-sky-500 text-white font-bold px-4 py-2 rounded-lg text-xs transition cursor-pointer"
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
