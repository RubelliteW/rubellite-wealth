import { useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const COUNT = 1200;

/** Gem silhouette: points distributed over an elongated octahedron shell. */
function buildCloud() {
  const positions = new Float32Array(COUNT * 3);
  const colors = new Float32Array(COUNT * 3);
  const seeds = new Float32Array(COUNT);
  const ruby = new THREE.Color('#C9184A');
  const glow = new THREE.Color('#FF4D7D');
  const champagne = new THREE.Color('#D6B98C');
  const tmp = new THREE.Color();

  for (let i = 0; i < COUNT; i++) {
    // random direction, then project onto an octahedron-ish shell (gem)
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    let x = Math.sin(phi) * Math.cos(theta);
    let y = Math.cos(phi);
    let z = Math.sin(phi) * Math.sin(theta);
    // octahedron normalization (L1 norm) with jitter for a "cloud of facets"
    const l1 = Math.abs(x) + Math.abs(y) + Math.abs(z);
    const r = 1 + (Math.random() - 0.5) * 0.22;
    x = (x / l1) * r * 1.15;
    y = (y / l1) * r * 1.5; // elongate vertically like a cut stone
    z = (z / l1) * r * 1.15;
    positions.set([x, y, z], i * 3);

    tmp.copy(Math.random() < 0.72 ? ruby : champagne).lerp(glow, Math.random() * 0.35);
    colors.set([tmp.r, tmp.g, tmp.b], i * 3);
    seeds[i] = Math.random() * Math.PI * 2;
  }
  return { positions, colors, seeds };
}

function ParticleGem() {
  const pointsRef = useRef<THREE.Points>(null);
  const groupRef = useRef<THREE.Group>(null);
  const { positions, colors, seeds } = useMemo(() => buildCloud(), []);
  const base = useMemo(() => positions.slice(), [positions]);
  const parallax = useRef({ x: 0, y: 0 });

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const points = pointsRef.current;
    const group = groupRef.current;
    if (!points || !group) return;

    // slow rotation
    group.rotation.y = t * 0.08;
    // mouse parallax: rotate the cloud ±8deg, eased
    const targetX = (state.pointer.y * Math.PI) / 22.5;
    const targetY = (state.pointer.x * Math.PI) / 22.5;
    parallax.current.x += (targetX - parallax.current.x) * 0.04;
    parallax.current.y += (targetY - parallax.current.y) * 0.04;
    group.rotation.x = parallax.current.x;
    group.rotation.z = parallax.current.y * 0.4;

    // per-particle drift ±10px-equivalent (0.05 world units) with sine noise
    const attr = points.geometry.attributes.position as THREE.BufferAttribute;
    const arr = attr.array as Float32Array;
    for (let i = 0; i < COUNT; i++) {
      const s = seeds[i];
      arr[i * 3] = base[i * 3] + Math.sin(t * 0.6 + s) * 0.05;
      arr[i * 3 + 1] = base[i * 3 + 1] + Math.cos(t * 0.5 + s * 1.7) * 0.05;
      arr[i * 3 + 2] = base[i * 3 + 2] + Math.sin(t * 0.4 + s * 2.3) * 0.05;
    }
    attr.needsUpdate = true;
  });

  return (
    <group ref={groupRef}>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.02}
          vertexColors
          transparent
          opacity={0.85}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          sizeAttenuation
        />
      </points>
    </group>
  );
}

function webglAvailable(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch {
    return false;
  }
}

/**
 * Home hero particle field: ~1,200 warm-ruby/champagne particles forming a
 * slowly rotating faceted-gem point cloud with mouse parallax.
 * Falls back to a static blurred gem-gradient blob (no WebGL / reduced motion).
 */
export default function GemParticleField({ className = '' }: { className?: string }) {
  const [enabled] = useState(
    () =>
      typeof window !== 'undefined' &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches &&
      webglAvailable()
  );

  if (!enabled) {
    return (
      <div
        aria-hidden
        className={`pointer-events-none ${className}`}
        style={{
          background:
            'radial-gradient(closest-side, rgba(255,77,125,0.55), rgba(201,24,74,0.35) 45%, transparent 75%)',
          filter: 'blur(80px)',
          opacity: 0.25,
        }}
      />
    );
  }

  return (
    <div aria-hidden className={`pointer-events-none ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 3.4], fov: 42 }}
        dpr={[1, 1.75]}
        gl={{ antialias: true, alpha: true, powerPreference: 'low-power' }}
        style={{ width: '100%', height: '100%' }}
      >
        <ParticleGem />
      </Canvas>
    </div>
  );
}
