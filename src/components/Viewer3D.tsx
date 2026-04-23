"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
} from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import type { ProjectRow } from "@/lib/supabase/types";
import GoVizMark from "./GoVizMark";

type Props = {
  project: ProjectRow | null;
  onClose: () => void;
};

type ButtonStyle = {
  background: string;
  border: string;
  color: string;
  padding: string;
  fontFamily: string;
  fontSize: number;
  fontWeight: number;
  letterSpacing: string;
  textTransform: "uppercase";
  cursor: string;
  transition: string;
};

function makeBtnStyle(active: boolean): ButtonStyle {
  return {
    background: active ? "var(--blue)" : "rgba(255,255,255,0.08)",
    border: `1px solid ${active ? "var(--blue)" : "rgba(255,255,255,0.15)"}`,
    color: "#fff",
    padding: "7px 14px",
    fontFamily: "var(--f)",
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    cursor: "pointer",
    transition: "all 0.2s",
  };
}

export default function Viewer3D({ project, onClose }: Props) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const animRef = useRef<number>(0);

  const [loading, setLoading] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [hint, setHint] = useState(true);
  const [vis, setVis] = useState(false);
  const [wireframe, setWireframe] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setVis(true), 10);
    return () => clearTimeout(t);
  }, []);

  const handleClose = () => {
    setVis(false);
    setTimeout(onClose, 500);
  };

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x060609);
    scene.fog = new THREE.FogExp2(0x060609, 0.018);
    sceneRef.current = scene;

    const W = container.clientWidth;
    const H = container.clientHeight;
    const camera = new THREE.PerspectiveCamera(42, W / H, 0.1, 300);
    camera.position.set(14, 9, 14);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.04;
    controls.minDistance = 2;
    controls.maxDistance = 60;
    controls.maxPolarAngle = Math.PI / 2 + 0.1;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.6;
    controlsRef.current = controls;

    const onInteract = () => setHint(false);
    controls.addEventListener("start", onInteract);

    const ambient = new THREE.AmbientLight(0x303050, 1.2);
    scene.add(ambient);

    const sun = new THREE.DirectionalLight(0xffffff, 2);
    sun.position.set(15, 25, 10);
    sun.castShadow = true;
    sun.shadow.mapSize.width = 2048;
    sun.shadow.mapSize.height = 2048;
    sun.shadow.camera.near = 0.5;
    sun.shadow.camera.far = 100;
    sun.shadow.camera.left = -20;
    sun.shadow.camera.right = 20;
    sun.shadow.camera.top = 20;
    sun.shadow.camera.bottom = -20;
    sun.shadow.bias = -0.001;
    scene.add(sun);

    const blueRim = new THREE.PointLight(0x032bff, 4, 40);
    blueRim.position.set(-12, 6, -12);
    scene.add(blueRim);

    const warmFill = new THREE.PointLight(0x6688ff, 2, 30);
    warmFill.position.set(10, 3, -8);
    scene.add(warmFill);

    const groundGeo = new THREE.PlaneGeometry(100, 100);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x050508,
      roughness: 0.95,
      metalness: 0,
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    const grid = new THREE.GridHelper(60, 60, 0x032bff, 0x0d0d18);
    grid.position.y = 0.02;
    scene.add(grid);

    const building = new THREE.Group();
    building.name = "default-building";

    const blueMat = new THREE.MeshStandardMaterial({
      color: 0x032bff,
      roughness: 0.18,
      metalness: 0.55,
    });
    const concreteMat = new THREE.MeshStandardMaterial({
      color: 0xd8d4cc,
      roughness: 0.85,
      metalness: 0.0,
    });
    const glassMat = new THREE.MeshStandardMaterial({
      color: 0x7090ff,
      roughness: 0.05,
      metalness: 0.9,
      opacity: 0.55,
      transparent: true,
    });
    const darkMat = new THREE.MeshStandardMaterial({
      color: 0x111120,
      roughness: 0.4,
      metalness: 0.6,
    });

    const podium = new THREE.Mesh(new THREE.BoxGeometry(8, 2, 8), concreteMat);
    podium.position.y = 1;
    podium.castShadow = true;
    podium.receiveShadow = true;
    building.add(podium);

    const core = new THREE.Mesh(new THREE.BoxGeometry(5, 9, 5), blueMat);
    core.position.y = 2 + 4.5;
    core.castShadow = true;
    building.add(core);

    const mid = new THREE.Mesh(new THREE.BoxGeometry(4, 6, 4), glassMat);
    mid.position.y = 2 + 9 + 3;
    mid.rotation.y = Math.PI / 10;
    mid.castShadow = true;
    building.add(mid);

    const crown = new THREE.Mesh(new THREE.BoxGeometry(2.5, 4, 2.5), darkMat);
    crown.position.y = 2 + 9 + 6 + 2;
    crown.rotation.y = Math.PI / 6;
    crown.castShadow = true;
    building.add(crown);

    for (let i = 0; i < 8; i++) {
      const fin = new THREE.Mesh(
        new THREE.BoxGeometry(0.12, 9, 0.6),
        darkMat,
      );
      const angle = (i / 8) * Math.PI * 2;
      fin.position.set(
        Math.cos(angle) * 2.7,
        2 + 4.5,
        Math.sin(angle) * 2.7,
      );
      fin.rotation.y = angle;
      fin.castShadow = true;
      building.add(fin);
    }

    const edgesGeo = new THREE.EdgesGeometry(core.geometry);
    const edgeLines = new THREE.LineSegments(
      edgesGeo,
      new THREE.LineBasicMaterial({
        color: 0x5577ff,
        opacity: 0.35,
        transparent: true,
      }),
    );
    edgeLines.position.copy(core.position);
    building.add(edgeLines);

    scene.add(building);
    setLoading(false);

    let frame = 0;
    const animate = () => {
      animRef.current = requestAnimationFrame(animate);
      frame++;
      controls.update();
      blueRim.intensity = 3.5 + Math.sin(frame * 0.012) * 0.8;
      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      const nW = container.clientWidth;
      const nH = container.clientHeight;
      camera.aspect = nW / nH;
      camera.updateProjectionMatrix();
      renderer.setSize(nW, nH);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", onResize);
      controls.removeEventListener("start", onInteract);
      controls.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  useEffect(() => {
    if (!sceneRef.current) return;
    sceneRef.current.traverse((obj) => {
      if (obj instanceof THREE.Mesh) {
        const mat = obj.material as THREE.Material & { wireframe?: boolean };
        if (mat && !mat.transparent && "wireframe" in mat) {
          mat.wireframe = wireframe;
        }
      }
    });
  }, [wireframe]);

  useEffect(() => {
    if (controlsRef.current) controlsRef.current.autoRotate = autoRotate;
  }, [autoRotate]);

  const loadUrl = useCallback(
    (url: string, revokeAfter = false, displayName?: string) => {
      const scene = sceneRef.current;
      if (!scene) return;

      setLoading(true);
      if (displayName) setFileName(displayName);

      const loader = new GLTFLoader();
      loader.load(
        url,
        (gltf) => {
          const def = scene.getObjectByName("default-building");
          if (def) scene.remove(def);
          const prev = scene.getObjectByName("uploaded-model");
          if (prev) scene.remove(prev);

          const model = gltf.scene;
          model.name = "uploaded-model";

          const box = new THREE.Box3().setFromObject(model);
          const size = box.getSize(new THREE.Vector3());
          const center = box.getCenter(new THREE.Vector3());
          const maxDim = Math.max(size.x, size.y, size.z);
          const scale = 12 / maxDim;
          model.scale.setScalar(scale);
          model.position.set(
            -center.x * scale,
            -box.min.y * scale,
            -center.z * scale,
          );

          model.traverse((obj) => {
            if (obj instanceof THREE.Mesh) {
              obj.castShadow = true;
              obj.receiveShadow = true;
            }
          });

          scene.add(model);
          setLoading(false);
          if (revokeAfter) URL.revokeObjectURL(url);
        },
        undefined,
        (err) => {
          console.error(err);
          setLoading(false);
          alert(
            "Error loading model. Please check the file is a valid .GLB or .GLTF.",
          );
        },
      );
    },
    [],
  );

  const loadFile = useCallback(
    (file: File) => {
      const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
      if (ext === "skp") {
        alert(
          "SketchUp (.skp) cannot be loaded directly in the browser.\nPlease export your model as .GLB or .GLTF from SketchUp first, then upload here.",
        );
        return;
      }
      if (!["glb", "gltf"].includes(ext)) {
        alert("Please upload a .GLB or .GLTF file.");
        return;
      }
      const url = URL.createObjectURL(file);
      loadUrl(url, true, file.name);
    },
    [loadUrl],
  );

  // Auto-load project model_url once the scene is ready
  const modelUrl = project?.model_url ?? null;
  useEffect(() => {
    if (!modelUrl) return;
    const name = modelUrl.split("/").pop() ?? "model.glb";
    // Wait until initial scene is mounted
    const check = () => {
      if (sceneRef.current) loadUrl(modelUrl, false, name);
      else setTimeout(check, 80);
    };
    check();
  }, [modelUrl, loadUrl]);

  const onDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer?.files[0];
      if (file) loadFile(file);
    },
    [loadFile],
  );

  const onFileInput = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) loadFile(file);
    },
    [loadFile],
  );

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        opacity: vis ? 1 : 0,
        transition: "opacity 0.5s ease",
      }}
    >
      <div
        ref={mountRef}
        style={{ position: "absolute", inset: 0 }}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
      />

      {isDragging && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(3,43,255,0.25)",
            border: "3px dashed rgba(3,43,255,0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 20,
            pointerEvents: "none",
          }}
        >
          <div
            style={{
              fontSize: 28,
              fontWeight: 700,
              color: "#fff",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            Drop .GLB / .GLTF to Load
          </div>
        </div>
      )}

      {loading && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "#060609",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 20,
            zIndex: 15,
          }}
        >
          <div
            style={{
              width: 52,
              height: 52,
              border: "2px solid rgba(3,43,255,0.25)",
              borderTopColor: "var(--blue)",
              borderRadius: "50%",
              animation: "goviz-viewer-spin 0.9s linear infinite",
            }}
          />
          <div
            style={{
              fontSize: 11,
              letterSpacing: "0.28em",
              color: "rgba(255,255,255,0.35)",
              textTransform: "uppercase",
            }}
          >
            Initialising Scene
          </div>
        </div>
      )}

      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 10,
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.75) 0%, transparent 100%)",
          padding: "24px 32px 60px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 4,
            }}
          >
            <GoVizMark size={22} color="#032bff" />
            <span
              style={{
                fontSize: 10,
                letterSpacing: "0.25em",
                color: "rgba(255,255,255,0.4)",
                textTransform: "uppercase",
              }}
            >
              3D Viewer
            </span>
          </div>
          <div
            style={{
              fontSize: 22,
              fontWeight: 700,
              color: "#fff",
              letterSpacing: "-0.01em",
            }}
          >
            {project?.title ?? "Model Viewer"}
          </div>
          {project && (
            <div
              style={{
                fontSize: 12,
                color: "rgba(255,255,255,0.4)",
                marginTop: 3,
              }}
            >
              {project.location} · {project.year}
            </div>
          )}
        </div>

        <div
          style={{
            display: "flex",
            gap: 8,
            alignItems: "center",
            flexWrap: "wrap",
            justifyContent: "flex-end",
          }}
        >
          <button
            style={makeBtnStyle(wireframe)}
            onClick={() => setWireframe((w) => !w)}
          >
            {wireframe ? "Solid" : "Wireframe"}
          </button>
          <button
            style={makeBtnStyle(autoRotate)}
            onClick={() => setAutoRotate((a) => !a)}
          >
            {autoRotate ? "Stop Rotate" : "Auto Rotate"}
          </button>

          <label
            style={{
              ...makeBtnStyle(false),
              display: "flex",
              alignItems: "center",
              gap: 6,
              cursor: "pointer",
              background: fileName
                ? "rgba(3,43,255,0.6)"
                : "rgba(255,255,255,0.08)",
              border: fileName
                ? "1px solid rgba(3,43,255,0.8)"
                : "1px solid rgba(255,255,255,0.15)",
            }}
          >
            <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
              <path
                d="M6 1v8M2 5l4-4 4 4M1 11h10"
                stroke="currentColor"
                strokeWidth="1.3"
                strokeLinecap="round"
              />
            </svg>
            {fileName
              ? fileName.length > 18
                ? fileName.slice(0, 18) + "…"
                : fileName
              : "Upload Model"}
            <input
              type="file"
              accept=".glb,.gltf,.skp"
              style={{ display: "none" }}
              onChange={onFileInput}
            />
          </label>

          <button
            onClick={handleClose}
            aria-label="Close viewer"
            style={{
              ...makeBtnStyle(false),
              padding: "0",
              width: 36,
              height: 36,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 16,
            }}
          >
            ✕
          </button>
        </div>
      </div>

      {hint && !loading && (
        <div
          style={{
            position: "absolute",
            bottom: 36,
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            gap: 32,
            zIndex: 10,
            animation: "goviz-hint-fade 1.5s ease 5s forwards",
          }}
        >
          {(
            [
              ["Drag", "Rotate"],
              ["Scroll", "Zoom"],
              ["Right Drag", "Pan"],
            ] as const
          ).map(([k, v]) => (
            <div key={k} style={{ textAlign: "center" }}>
              <div
                style={{
                  fontSize: 9,
                  color: "rgba(255,255,255,0.3)",
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  marginBottom: 3,
                }}
              >
                {k}
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: "rgba(255,255,255,0.65)",
                  fontWeight: 600,
                }}
              >
                {v}
              </div>
            </div>
          ))}
        </div>
      )}

      {!fileName && !loading && (
        <div
          style={{
            position: "absolute",
            bottom: 32,
            right: 32,
            zIndex: 10,
            border: "1px dashed rgba(3,43,255,0.4)",
            background: "rgba(3,43,255,0.08)",
            padding: "12px 18px",
            maxWidth: 220,
          }}
        >
          <div
            style={{
              fontSize: 11,
              color: "rgba(255,255,255,0.5)",
              lineHeight: 1.6,
              letterSpacing: "0.02em",
            }}
          >
            Drop a{" "}
            <strong style={{ color: "rgba(255,255,255,0.8)" }}>.GLB</strong>{" "}
            or{" "}
            <strong style={{ color: "rgba(255,255,255,0.8)" }}>.GLTF</strong>{" "}
            file here to load your own model
          </div>
          <div
            style={{
              fontSize: 10,
              color: "rgba(255,255,255,0.25)",
              marginTop: 6,
            }}
          >
            .SKP: export as .GLB from SketchUp first
          </div>
        </div>
      )}
    </div>
  );
}
