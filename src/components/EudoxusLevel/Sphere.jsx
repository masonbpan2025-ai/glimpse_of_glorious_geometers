import React, { useState, useEffect, useRef } from 'react';
import { useGameState } from '../../context/GameStateContext';
import { Compass, Star } from 'lucide-react';
import LevelShell from '../LevelShell';

export default function Sphere() {
  const { activeSubtask, completedSubtasks, completeSubtask } = useGameState();
  const [n, setN] = useState(6); // Default slightly higher for sphere to look nicer
  const [mode, setMode] = useState('inscribed'); // 'inscribed' or 'circumscribed'
  const [answer, setAnswer] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const iframeRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const R = 5;  // Base radius
  const H = 2 * R; // Total height of sphere
  const dh = H / n;

  // Calculate volume
  const trueVolume = (4 / 3) * Math.PI * Math.pow(R, 3);
  
  let approxVolume = 0;
  for (let k = 0; k < n; k++) {
    const yEdge1 = -R + k * dh;
    const yEdge2 = -R + (k + 1) * dh;
    let rSlice = 0;

    if (mode === 'inscribed') {
      // Inscribed: use the minimum radius on this slice interval
      const dist1 = Math.abs(yEdge1);
      const dist2 = Math.abs(yEdge2);
      const maxDist = Math.max(dist1, dist2);
      rSlice = Math.sqrt(Math.max(0, Math.pow(R, 2) - Math.pow(maxDist, 2)));
    } else {
      // Circumscribed: use the maximum radius on this slice interval
      let minDist = 0;
      if (yEdge1 < 0 && yEdge2 > 0) {
        minDist = 0; // Equator is inside slice
      } else {
        minDist = Math.min(Math.abs(yEdge1), Math.abs(yEdge2));
      }
      rSlice = Math.sqrt(Math.max(0, Math.pow(R, 2) - Math.pow(minDist, 2)));
    }

    approxVolume += Math.PI * Math.pow(rSlice, 2) * dh;
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

    // Question: Sphere with radius R=3. Volume = 4/3 * pi * 3^3 = 4/3 * pi * 27 = 36 * pi.
    // Coefficient is 36.
    if (val === 36) {
      setIsSuccess(true);
      setErrorMsg('');
      completeSubtask(4, 3);
    } else {
      setErrorMsg('Incorrect. Hint: Volume = 4/3 * pi * R³. Calculate 4/3 * pi * (3³) and enter the coefficient of pi (e.g. 36).');
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
        const state = { n: 6, mode: 'inscribed', R: 5 };
        
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
        controls.target.set(0, 0, 0); // Sphere centered at origin

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        scene.add(ambientLight);
        const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
        dirLight.position.set(10, 20, 15);
        scene.add(dirLight);

        const gridHelper = new THREE.GridHelper(20, 20, 0x334155, 0x1e293b);
        gridHelper.position.y = -state.R; // Place grid at sphere bottom
        scene.add(gridHelper);

        // Static translucent sphere
        const sphereGeo = new THREE.SphereGeometry(state.R, 32, 32);
        const sphereMat = new THREE.MeshStandardMaterial({
          color: 0x94a3b8,
          transparent: true,
          opacity: 0.15,
          wireframe: true
        });
        const staticSphere = new THREE.Mesh(sphereGeo, sphereMat);
        scene.add(staticSphere);

        const cylinderGroup = new THREE.Group();
        scene.add(cylinderGroup);

        const dimGroup = new THREE.Group();
        scene.add(dimGroup);

        const cylinderMat = new THREE.MeshStandardMaterial({
          color: 0xd946ef, // Magenta / Pink Fuchsia
          transparent: true,
          opacity: 0.7,
          roughness: 0.3,
          metalness: 0.1
        });
        const cylinderEdgeMat = new THREE.LineBasicMaterial({ color: 0xc026d3, transparent: true, opacity: 0.4 });
        const unitCylinderGeo = new THREE.CylinderGeometry(1, 1, 1, 32);
        const unitEdgesGeo = new THREE.EdgesGeometry(unitCylinderGeo);

        function updateVisualization() {
          while(cylinderGroup.children.length > 0) cylinderGroup.remove(cylinderGroup.children[0]);
          while(dimGroup.children.length > 0) dimGroup.remove(dimGroup.children[0]);

          const R = state.R;
          const N = state.n;
          const H = 2 * R;
          const dh = H / N;

          for (let k = 0; k < N; k++) {
            const yEdge1 = -R + k * dh;
            const yEdge2 = -R + (k + 1) * dh;
            let rSlice = 0;
            let yPos = -R + k * dh + (dh / 2);

            if (state.mode === 'inscribed') {
              const dist1 = Math.abs(yEdge1);
              const dist2 = Math.abs(yEdge2);
              const maxDist = Math.max(dist1, dist2);
              rSlice = Math.sqrt(Math.max(0, Math.pow(R, 2) - Math.pow(maxDist, 2)));
            } else {
              let minDist = 0;
              if (yEdge1 < 0 && yEdge2 > 0) {
                minDist = 0;
              } else {
                minDist = Math.min(Math.abs(yEdge1), Math.abs(yEdge2));
              }
              rSlice = Math.sqrt(Math.max(0, Math.pow(R, 2) - Math.pow(minDist, 2)));
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

          // Bracket at bottom slice
          const dimX = R + 1.5;
          const yBottom = -R;
          const lineMat = new THREE.LineBasicMaterial({ color: 0x475569 });
          const lineGeo = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(dimX, yBottom, 0), new THREE.Vector3(dimX, yBottom + dh, 0),
            new THREE.Vector3(dimX - 0.4, yBottom, 0), new THREE.Vector3(dimX + 0.4, yBottom, 0),
            new THREE.Vector3(dimX - 0.4, yBottom + dh, 0), new THREE.Vector3(dimX + 0.4, yBottom + dh, 0)
          ]);
          const bracket = new THREE.LineSegments(lineGeo, lineMat);
          dimGroup.add(bracket);

          const labelDiv = document.createElement('div');
          labelDiv.className = 'math-label';
          labelDiv.textContent = '2R/N';
          const labelObj = new THREE.CSS2DObject(labelDiv);
          labelObj.position.set(dimX + 0.8, yBottom + dh / 2, 0);
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
            title="Sphere Method of Exhaustion 3D"
          />

          {/* Floating Controls Card */}
          <div className="absolute top-4 left-4 bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-xl p-4 shadow-2xl z-20 w-[280px] md:w-[320px] pointer-events-auto space-y-4 select-none">
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Number of Layers (N = {n})</span>
              </div>
              <input
                type="range"
                min="2"
                max="50"
                step="2" // Steps of 2 keeps slices symmetrical
                value={n}
                onChange={(e) => setN(parseInt(e.target.value))}
                className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-fuchsia-500"
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
                <span className="text-sm font-bold text-fuchsia-400">{approxVolume.toFixed(2)}</span>
              </div>
              <div className="col-span-2 border-t border-slate-800/80 pt-2 flex justify-between px-2 text-[10px]">
                <span className="text-slate-500 font-bold uppercase tracking-wider">Error Gap:</span>
                <span className="font-mono text-slate-300">{errorPercent.toFixed(2)}%</span>
              </div>
            </div>

            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Current Summation</span>
              <div className="bg-slate-950/60 p-2.5 rounded border border-slate-850 text-center font-mono text-[10px] text-fuchsia-400">
                <span>V ≈ ∑<sub>i=1</sub><sup>N</sup> π · (R² - y<sub>i</sub>²) · (2R/N)</span>
              </div>
            </div>
          </div>
        </div>
      }
    >
      <div className="flex flex-col gap-4 text-slate-350 text-xs h-full justify-between">
        
        {/* Context panel */}
        <div className="space-y-4 overflow-y-auto pr-1">
          <h2 className="text-xl font-light tracking-tight text-white leading-tight">
            The <span className="font-bold text-fuchsia-400">Sphere Volume</span> Limit
          </h2>
          <p className="text-slate-400 leading-relaxed">
            Approximating a sphere's volume represents a grand triumph of the Method of Exhaustion.
          </p>
          
          <div className="bg-slate-900/60 border border-slate-800/40 rounded-xl p-3 flex flex-col gap-1.5">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Method of Exhaustion</h4>
            <p className="text-[11px] leading-relaxed text-slate-300">
              By dividing a sphere of radius $R$ into $N$ flat cylinder disks, each with height $2R/N$, the radius of each disk is bounded by the circular profile $r^2 = R^2 - y^2$. Stacking these disks "exhausts" the sphere's empty space, converging exactly to the limit:
            </p>
            <div className="bg-slate-950/60 p-2.5 rounded border border-slate-850 text-center text-xs font-mono text-fuchsia-400 my-1">
              V = ⁴/₃ · π · R³
            </div>
          </div>
        </div>

        {/* Verification Card */}
        <div className="bg-slate-950/40 border border-slate-800/80 p-4 rounded-xl flex flex-col gap-3">
          <h3 className="text-xs font-bold text-fuchsia-400 uppercase tracking-wider flex items-center gap-2">
            <Compass className="w-4 h-4" /> 4-3. Sphere Volume
          </h3>
          <p className="text-[11px] leading-relaxed text-slate-300">
            A sphere has a radius of <strong>R = 3</strong>. Calculate the exact volume of this sphere. Enter your answer as a multiple of <strong>π</strong> (e.g. if the volume is 36π, enter <strong>36</strong>).
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
                placeholder="e.g. 36"
                className="bg-slate-900 border border-slate-800 text-white text-xs px-3 py-2 rounded-lg outline-none focus:border-fuchsia-500 transition text-center font-mono"
              />
            </div>

            {errorMsg && (
              <div className="text-[11px] text-rose-400 font-bold bg-rose-955/20 border border-rose-900/50 p-2 rounded mt-1">
                {errorMsg}
              </div>
            )}

            {isSuccess ? (
              <div className="text-[11px] text-emerald-400 font-bold bg-emerald-950/20 border border-emerald-900/50 p-2.5 rounded flex items-center gap-1.5 mt-1">
                <Star className="w-4 h-4 text-fuchsia-400 fill-current" />
                <span>Superb! Volume verified (36π). You have completed Eudoxus's 3D volume calculations! Excellent work!</span>
              </div>
            ) : (
              <div className="flex justify-end mt-1">
                <button
                  onClick={handleVerify}
                  className="bg-fuchsia-600 hover:bg-fuchsia-500 text-white font-bold px-4 py-2 rounded-lg text-xs transition cursor-pointer"
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
