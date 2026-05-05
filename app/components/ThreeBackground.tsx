"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial, Float } from "@react-three/drei";
import * as THREE from "three";

function StarField() {
  const ref = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const positions = new Float32Array(3000 * 3);
    for (let i = 0; i < 3000; i++) {
      const radius = 20 + Math.random() * 80;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);
    }
    return positions;
  }, []);

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.008;
    }
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#eaeaea"
        size={0.06}
        sizeAttenuation
        depthWrite={false}
        opacity={0.8}
      />
    </Points>
  );
}

function Nebula() {
  const ref = useRef<THREE.Group>(null);

  const cloudPositions = useMemo(() => {
    const positions = new Float32Array(500 * 3);
    for (let i = 0; i < 500; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 30;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = -20 - Math.random() * 40;
    }
    return positions;
  }, []);

  return (
    <group ref={ref}>
      <Points positions={cloudPositions} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#7c3aed"
          size={0.3}
          sizeAttenuation
          depthWrite={false}
          opacity={0.15}
          blending={THREE.AdditiveBlending}
        />
      </Points>
      <Points positions={cloudPositions} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#4c1d95"
          size={0.5}
          sizeAttenuation
          depthWrite={false}
          opacity={0.08}
          blending={THREE.AdditiveBlending}
        />
      </Points>
    </group>
  );
}

function FloatingBody({
  geometry,
  position,
  color,
  size = 1,
}: {
  geometry: THREE.BufferGeometry;
  position: [number, number, number];
  color: string;
  size?: number;
}) {
  return (
    <Float speed={0.5} rotationIntensity={0.3} floatIntensity={0.5}>
      <mesh
        position={position}
        rotation={[Math.random() * Math.PI, Math.random() * Math.PI, 0]}
        scale={size}
      >
        <primitive object={geometry} />
        <meshBasicMaterial color={color} wireframe transparent opacity={0.1} />
      </mesh>
    </Float>
  );
}

function FloatingObjects() {
  return (
    <group>
      <FloatingBody
        geometry={new THREE.IcosahedronGeometry(1, 0)}
        position={[-8, 4, -12]}
        color="#7c3aed"
      />
      <FloatingBody
        geometry={new THREE.OctahedronGeometry(0.8, 0)}
        position={[10, -3, -10]}
        color="#6d28d9"
      />
      <FloatingBody
        geometry={new THREE.TorusGeometry(0.8, 0.3, 8, 16)}
        position={[-6, -6, -15]}
        color="#5b21b6"
        size={1.2}
      />
      <FloatingBody
        geometry={new THREE.TetrahedronGeometry(0.9, 0)}
        position={[7, 6, -18]}
        color="#4c1d95"
      />
    </group>
  );
}

function Planet() {
  return (
    <Float speed={0.2} rotationIntensity={0.1} floatIntensity={0.2}>
      <group position={[12, -5, -25]}>
        <mesh>
          <sphereGeometry args={[2, 32, 32]} />
          <meshBasicMaterial
            color="#1a0a2e"
            transparent
            opacity={0.6}
          />
        </mesh>
        <mesh rotation={[0.2, 0, 0]}>
          <torusGeometry args={[3, 0.05, 8, 64]} />
          <meshBasicMaterial
            color="#7c3aed"
            transparent
            opacity={0.15}
          />
        </mesh>
      </group>
    </Float>
  );
}

export default function ThreeBackground() {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: -1,
        pointerEvents: "none",
        background: "radial-gradient(ellipse at bottom, #0f0a1e 0%, #0a0a0f 100%)",
      }}
    >
      <Canvas camera={{ position: [0, 0, 10], fov: 60 }}>
        <StarField />
        <Nebula />
        <FloatingObjects />
        <Planet />
      </Canvas>
    </div>
  );
}
