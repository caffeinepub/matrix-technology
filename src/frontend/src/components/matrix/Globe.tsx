import { OrbitControls, Stars } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useCallback, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import type { StartupNode } from "../../backend.d";

// ─── Utility ────────────────────────────────────────────────────────────────

const RADIUS = 2.5;

function latLngToVec3(lat: number, lng: number, r: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  const x = -(r * Math.sin(phi) * Math.cos(theta));
  const z = r * Math.sin(phi) * Math.sin(theta);
  const y = r * Math.cos(phi);
  return new THREE.Vector3(x, y, z);
}

const SECTOR_COLORS: Record<string, string> = {
  Fintech: "#00ff41",
  Edtech: "#00d4ff",
  Healthtech: "#ff6b35",
  Agritech: "#7fff00",
  SaaS: "#bf7fff",
  "AI/ML": "#00ffff",
  "E-commerce": "#ffd700",
  CleanTech: "#39ff14",
  Other: "#ff69b4",
};

function getSectorColor(sector: string): string {
  return SECTOR_COLORS[sector] ?? SECTOR_COLORS.Other;
}

function hexToThree(hex: string): THREE.Color {
  return new THREE.Color(hex);
}

// Distance between two 3D points (approximate km via angles)
function approxDistanceKm(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// ─── Connection Arc ──────────────────────────────────────────────────────────

interface ArcProps {
  from: THREE.Vector3;
  to: THREE.Vector3;
  color: string;
}

function ConnectionArc({ from, to, color }: ArcProps) {
  const points = useMemo(() => {
    const mid = from.clone().add(to).multiplyScalar(0.5);
    const dist = from.distanceTo(to);
    mid.normalize().multiplyScalar(RADIUS + dist * 0.4);
    const curve = new THREE.CatmullRomCurve3([from, mid, to]);
    return curve.getPoints(50);
  }, [from, to]);

  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry().setFromPoints(points);
    return g;
  }, [points]);

  const material = useMemo(
    () =>
      new THREE.LineBasicMaterial({
        color: new THREE.Color(color),
        transparent: true,
        opacity: 0.35,
        linewidth: 1,
      }),
    [color],
  );

  return <primitive object={new THREE.Line(geometry, material)} />;
}

// ─── Node Sphere ─────────────────────────────────────────────────────────────

interface NodeSphereProps {
  node: StartupNode;
  isSelected: boolean;
  onSelect: (node: StartupNode) => void;
}

function NodeSphere({ node, isSelected, onSelect }: NodeSphereProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const color = getSectorColor(node.sector);
  const position = useMemo(
    () => latLngToVec3(node.latitude, node.longitude, RADIUS),
    [node.latitude, node.longitude],
  );

  useFrame((_, delta) => {
    if (meshRef.current) {
      const scale = isSelected ? 1.8 : 1;
      meshRef.current.scale.lerp(
        new THREE.Vector3(scale, scale, scale),
        5 * delta,
      );
    }
  });

  const handleClick = useCallback(
    (e: { stopPropagation: () => void }) => {
      e.stopPropagation();
      onSelect(node);
    },
    [node, onSelect],
  );

  return (
    // biome-ignore lint/a11y/useKeyWithClickEvents: Three.js mesh, not HTML
    <mesh ref={meshRef} position={position} onClick={handleClick}>
      <sphereGeometry args={[0.05, 8, 8]} />
      <meshStandardMaterial
        color={hexToThree(color)}
        emissive={hexToThree(color)}
        emissiveIntensity={isSelected ? 2.5 : 1.5}
        roughness={0.1}
        metalness={0.3}
      />
    </mesh>
  );
}

// ─── Glow Ring ───────────────────────────────────────────────────────────────

function GlowRing({ node }: { node: StartupNode }) {
  const ringRef = useRef<THREE.Mesh>(null);
  const color = getSectorColor(node.sector);
  const position = useMemo(
    () => latLngToVec3(node.latitude, node.longitude, RADIUS + 0.01),
    [node.latitude, node.longitude],
  );

  // Orient ring to face outward from globe surface
  const quaternion = useMemo(() => {
    const normal = position.clone().normalize();
    const q = new THREE.Quaternion();
    q.setFromUnitVectors(new THREE.Vector3(0, 0, 1), normal);
    return q;
  }, [position]);

  useFrame((state) => {
    if (ringRef.current) {
      const t = state.clock.getElapsedTime();
      ringRef.current.scale.setScalar(1 + 0.3 * Math.sin(t * 2));
      (ringRef.current.material as THREE.MeshBasicMaterial).opacity =
        0.3 + 0.2 * Math.sin(t * 2);
    }
  });

  return (
    <mesh ref={ringRef} position={position} quaternion={quaternion}>
      <ringGeometry args={[0.06, 0.1, 16]} />
      <meshBasicMaterial
        color={hexToThree(color)}
        transparent
        opacity={0.4}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

// ─── Earth Globe ────────────────────────────────────────────────────────────

function EarthGlobe() {
  const globeRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (globeRef.current) {
      globeRef.current.rotation.y += delta * 0.05;
    }
  });

  return (
    <mesh ref={globeRef}>
      <sphereGeometry args={[RADIUS, 64, 64]} />
      <meshPhongMaterial
        color={new THREE.Color(0x0a1a0a)}
        emissive={new THREE.Color(0x001a00)}
        emissiveIntensity={0.3}
        shininess={25}
        specular={new THREE.Color(0x00ff41).multiplyScalar(0.1)}
      />
    </mesh>
  );
}

// ─── India Highlight ────────────────────────────────────────────────────────

function IndiaHighlight() {
  // Approximate bounding region for India: lat 8-37, lng 68-97
  const positions = useMemo(() => {
    const pts: number[] = [];
    for (let lat = 8; lat <= 37; lat += 2) {
      for (let lng = 68; lng <= 97; lng += 2) {
        const v = latLngToVec3(lat, lng, RADIUS + 0.005);
        pts.push(v.x, v.y, v.z);
      }
    }
    return new Float32Array(pts);
  }, []);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color={new THREE.Color(0x00ff80)}
        size={0.012}
        transparent
        opacity={0.45}
        sizeAttenuation
      />
    </points>
  );
}

// ─── Atmosphere ──────────────────────────────────────────────────────────────

function Atmosphere() {
  return (
    <mesh>
      <sphereGeometry args={[RADIUS * 1.03, 32, 32]} />
      <meshPhongMaterial
        color={new THREE.Color(0x00ff41)}
        transparent
        opacity={0.04}
        side={THREE.BackSide}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  );
}

// ─── Connections ─────────────────────────────────────────────────────────────

interface ConnectionsProps {
  nodes: StartupNode[];
}

function Connections({ nodes }: ConnectionsProps) {
  const arcs = useMemo(() => {
    const result: Array<{
      from: THREE.Vector3;
      to: THREE.Vector3;
      color: string;
      key: string;
    }> = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i];
        const b = nodes[j];
        const dist = approxDistanceKm(
          a.latitude,
          a.longitude,
          b.latitude,
          b.longitude,
        );
        if (dist < 1500) {
          result.push({
            from: latLngToVec3(a.latitude, a.longitude, RADIUS),
            to: latLngToVec3(b.latitude, b.longitude, RADIUS),
            color: getSectorColor(a.sector),
            key: `${a.id}-${b.id}`,
          });
        }
      }
    }
    return result.slice(0, 20); // limit for performance
  }, [nodes]);

  return (
    <>
      {arcs.map((arc) => (
        <ConnectionArc
          key={arc.key}
          from={arc.from}
          to={arc.to}
          color={arc.color}
        />
      ))}
    </>
  );
}

// ─── Scene ───────────────────────────────────────────────────────────────────

interface SceneProps {
  nodes: StartupNode[];
  selectedNode: StartupNode | null;
  onSelectNode: (node: StartupNode | null) => void;
}

function Scene({ nodes, selectedNode, onSelectNode }: SceneProps) {
  const { gl } = useThree();

  // Make sure canvas doesn't capture all pointer events
  gl.domElement.style.touchAction = "none";

  const handleBackgroundClick = useCallback(() => {
    onSelectNode(null);
  }, [onSelectNode]);

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.3} />
      <directionalLight
        position={[5, 3, 5]}
        intensity={0.8}
        color={new THREE.Color(0xffffff)}
      />
      <pointLight
        position={[-5, -3, -5]}
        intensity={0.3}
        color={new THREE.Color(0x00ff41)}
      />
      <pointLight
        position={[0, 5, 0]}
        intensity={0.2}
        color={new THREE.Color(0x00d4ff)}
      />

      {/* Background stars */}
      <Stars
        radius={50}
        depth={30}
        count={3000}
        factor={2}
        saturation={0.2}
        fade
        speed={0.5}
      />

      {/* Globe */}
      <EarthGlobe />
      <IndiaHighlight />
      <Atmosphere />

      {/* Node connections */}
      <Connections nodes={nodes} />

      {/* Startup nodes */}
      {nodes.map((node) => (
        <NodeSphere
          key={node.id}
          node={node}
          isSelected={selectedNode?.id === node.id}
          onSelect={onSelectNode}
        />
      ))}

      {/* Glow rings on selected */}
      {selectedNode && <GlowRing node={selectedNode} />}

      {/* Click to deselect */}
      {/* biome-ignore lint/a11y/useKeyWithClickEvents: Three.js mesh, not HTML */}
      <mesh onClick={handleBackgroundClick} visible={false}>
        <sphereGeometry args={[100, 4, 4]} />
        <meshBasicMaterial side={THREE.BackSide} />
      </mesh>

      {/* Controls */}
      <OrbitControls
        enablePan={false}
        minDistance={3.5}
        maxDistance={8}
        rotateSpeed={0.5}
        zoomSpeed={0.8}
        autoRotate
        autoRotateSpeed={0.3}
      />
    </>
  );
}

// ─── Public Globe Component ──────────────────────────────────────────────────

interface GlobeProps {
  nodes: StartupNode[];
  selectedNode: StartupNode | null;
  onSelectNode: (node: StartupNode | null) => void;
}

export function Globe({ nodes, selectedNode, onSelectNode }: GlobeProps) {
  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 45 }}
      gl={{
        antialias: true,
        alpha: false,
        powerPreference: "high-performance",
      }}
      style={{
        background: "oklch(0.05 0.012 145)",
        width: "100%",
        height: "100%",
      }}
      data-ocid="dashboard.globe.canvas_target"
    >
      <Scene
        nodes={nodes}
        selectedNode={selectedNode}
        onSelectNode={onSelectNode}
      />
    </Canvas>
  );
}

export { getSectorColor, SECTOR_COLORS };
