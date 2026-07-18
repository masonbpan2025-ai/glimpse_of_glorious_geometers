import React, { useState, useEffect, useRef } from 'react';
import { useGameState } from '../../context/GameStateContext';
import { Compass, Star } from 'lucide-react';
import LevelShell from '../LevelShell';

export default function Sphere() {
  const { activeSubtask, completedSubtasks, completeSubtask } = useGameState();
  const [n, setN] = useState(6); // Default number of layers
  const [mode, setMode] = useState('inscribed'); // 'inscribed' or 'circumscribed'
  const [answer, setAnswer] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const iframeRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const R = 5;  // Base radius of hemisphere
  const dh = R / n;

  // Calculate volume of hemisphere: 2/3 * pi * R^3
  const trueVolume = (2 / 3) * Math.PI * Math.pow(R, 3);
  
  let approxVolume = 0;
  for (let i = 1; i <= n; i++) {
    let rSlice = 0;
    if (mode === 'inscribed') {
      rSlice = R * Math.sqrt(Math.max(0, 1 - Math.pow(i / n, 2)));
    } else {
      rSlice = R * Math.sqrt(Math.max(0, 1 - Math.pow((i - 1) / n, 2)));
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

  // Trigger MathJax typesetting on state changes
  useEffect(() => {
    if (window.MathJax && typeof window.MathJax.typesetPromise === 'function') {
      window.MathJax.typesetPromise();
    }
  });

  const handleVerify = (e) => {
    e.preventDefault();
    const cleaned = answer.replace(/\s+/g, '').replace('pi', '').replace('*', '').trim();
    const val = parseInt(cleaned, 10);
    
    if (isNaN(val)) {
      setErrorMsg('Please enter a valid integer.');
      return;
    }

    // Question: Hemisphere with radius R=3. Volume = 2/3 * pi * 3^3 = 2/3 * pi * 27 = 18 * pi.
    // Coefficient is 18.
    if (val === 18) {
      setIsSuccess(true);
      setErrorMsg('');
      completeSubtask(4, 3);
    } else {
      setErrorMsg('Incorrect. Hint: Volume = \\(\\frac{2}{3}\\pi R^3\\). Calculate \\(\\frac{2}{3} \\times (3^3)\\) and enter the result (e.g. 18).');
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
        camera.position.set(13, 10, 13);

        const controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.target.set(0, state.R / 2, 0); // Focus on center of hemisphere

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        scene.add(ambientLight);
        const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
        dirLight.position.set(10, 20, 15);
        scene.add(dirLight);

        const gridHelper = new THREE.GridHelper(20, 20, 0x334155, 0x1e293b);
        gridHelper.position.y = 0; // Ground grid at flat base
        scene.add(gridHelper);

        // Static translucent dome (hemisphere)
        const domeGeo = new THREE.SphereGeometry(state.R, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2);
        const domeMat = new THREE.MeshStandardMaterial({
          color: 0x94a3b8,
          transparent: true,
          opacity: 0.15,
          wireframe: true
        });
        const domeMesh = new THREE.Mesh(domeGeo, domeMat);
        scene.add(domeMesh);

        // Flat circular base for the hemisphere
        const baseGeo = new THREE.CircleGeometry(state.R, 32);
        const baseMat = new THREE.MeshStandardMaterial({
          color: 0x94a3b8,
          transparent: true,
          opacity: 0.1,
          side: THREE.DoubleSide
        });
        const baseMesh = new THREE.Mesh(baseGeo, baseMat);
        baseMesh.rotation.x = Math.PI / 2;
        scene.add(baseMesh);

        const cylinderGroup = new THREE.Group();
        scene.add(cylinderGroup);

        const dimGroup = new THREE.Group();
        scene.add(dimGroup);

        const cylinderMat = new THREE.MeshStandardMaterial({
          color: 0xd946ef, // Magenta
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
          const dh = R / N;

          for (let i = 1; i <= N; i++) {
            let rSlice = 0;
            let yPos = (i - 0.5) * dh;

            if (state.mode === 'inscribed') {
              rSlice = R * Math.sqrt(Math.max(0, 1 - Math.pow(i / N, 2)));
            } else {
              rSlice = R * Math.sqrt(Math.max(0, 1 - Math.pow((i - 1) / N, 2)));
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
          labelDiv.textContent = 'R/N';
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
            title="Hemisphere Method of Exhaustion 3D"
          />

          {/* Floating Controls Card */}
          <div className="absolute top-4 left-4 bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-xl p-4 shadow-2xl z-20 w-[280px] md:w-[320px] pointer-events-auto space-y-4 select-none tex2jax_process">
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Number of Layers (N = {n})</span>
              </div>
              <input
                type="range"
                min="2"
                max="50"
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
              <div className="bg-slate-950/60 p-2 text-center font-mono text-[10px] text-fuchsia-400">
                {mode === 'inscribed' ? (
                  <span>{"$$V_{in} = \\sum_{i=1}^{N} \\pi R^2 \\left(1 - \\left(\\frac{i}{N}\\right)^2\\right) \\frac{R}{N}$$"}</span>
                ) : (
                  <span>{"$$V_{out} = \\sum_{i=1}^{N} \\pi R^2 \\left(1 - \\left(\\frac{i-1}{N}\\right)^2\\right) \\frac{R}{N}$$"}</span>
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
            The <span className="font-bold text-fuchsia-400">Hemisphere Volume</span>
          </h2>
          <p className="text-slate-400 leading-relaxed">
            Approximating a sphere's volume represents a grand triumph of the Method of Exhaustion.
          </p>
          
          <div className="bg-slate-900/60 border border-slate-800/40 rounded-xl p-3 flex flex-col gap-1.5">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Method of Exhaustion</h4>
            <p className="text-[11px] leading-relaxed text-slate-300 text-justify">
              {"By dividing a hemisphere of radius $R$ into $N$ flat cylinder disks of height $R/N$, the radius of the $i$-th disk is given by $r_i = R\\sqrt{1 - (i/N)^2}$. Stacking these disks \"exhausts\" the hemisphere's volume."}
            </p>
            <p className="text-[11px] leading-relaxed text-slate-400 text-justify">
              Archimedes was the person who historically used the Method of Exhaustion to calculate the volume of a sphere, but it is presented here as it follows the same slicing principle as the pyramid and cone.
            </p>
            <div className="bg-slate-950/60 p-2.5 rounded border border-slate-850 text-center text-xs font-mono text-fuchsia-400 my-1">
              {"$$V = \\frac{2}{3} \\pi R^3$$"}
            </div>
          </div>
        </div>

        {/* Verification Card */}
        <div className="bg-slate-950/40 border border-slate-800/80 p-4 rounded-xl flex flex-col gap-3">
          <h3 className="text-xs font-bold text-fuchsia-400 uppercase tracking-wider flex items-center gap-2">
            <Compass className="w-4 h-4" /> 4-3. Hemisphere Volume
          </h3>
          <p className="text-[11px] leading-relaxed text-slate-300">
            A hemisphere has a radius of $R = 3$. Calculate the exact volume of this hemisphere. Enter your answer as a multiple of $\pi$ (e.g. if the volume is $18\pi$, enter <strong>18</strong>).
          </p>

          <div className="border-t border-slate-800/80 pt-3 flex flex-col gap-2.5">
            <div className="flex flex-col gap-1">
              <span className="text-[9px] uppercase font-bold tracking-wider text-slate-400">Exact Volume (multiple of \(\pi\))</span>
              <input
                type="text"
                value={answer}
                onChange={(e) => {
                  setAnswer(e.target.value);
                  setErrorMsg('');
                }}
                disabled={isSuccess}
                placeholder="e.g. 18"
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
                <span>Superb! Volume verified (18\(\pi\)). You have completed Eudoxus's 3D volume calculations! Excellent work!</span>
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
