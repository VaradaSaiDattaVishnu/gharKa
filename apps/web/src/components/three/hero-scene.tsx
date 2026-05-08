"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, Environment } from "@react-three/drei";
import * as THREE from "three";
import { FoodParticles } from "./food-particles";

function Thali() {
  const plateRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (plateRef.current) {
      plateRef.current.rotation.y = clock.getElapsedTime() * 0.15;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.3} floatIntensity={0.8}>
      <group ref={plateRef}>
        {/* Plate base */}
        <mesh position={[0, 0, 0]} castShadow>
          <cylinderGeometry args={[1.5, 1.4, 0.12, 64]} />
          <meshStandardMaterial
            color="#D4A574"
            metalness={0.3}
            roughness={0.6}
          />
        </mesh>
        {/* Plate rim */}
        <mesh position={[0, 0.06, 0]}>
          <torusGeometry args={[1.45, 0.06, 16, 64]} />
          <meshStandardMaterial
            color="#C49660"
            metalness={0.4}
            roughness={0.5}
          />
        </mesh>
        {/* Center bowl */}
        <mesh position={[0, 0.12, 0]} castShadow>
          <cylinderGeometry args={[0.4, 0.35, 0.2, 32]} />
          <meshStandardMaterial color="#E8913A" roughness={0.7} />
        </mesh>
        {/* Small bowls around */}
        {[0, 1.2, 2.4, 3.6, 4.8].map((angle, i) => (
          <mesh
            key={i}
            position={[
              Math.cos(angle) * 0.9,
              0.1,
              Math.sin(angle) * 0.9,
            ]}
            castShadow
          >
            <cylinderGeometry args={[0.22, 0.2, 0.14, 24]} />
            <meshStandardMaterial
              color={
                ["#2E7D52", "#D84315", "#E8913A", "#C47425", "#1B5E3A"][i]
              }
              roughness={0.8}
            />
          </mesh>
        ))}
      </group>
    </Float>
  );
}

function SteamWisps() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const time = clock.getElapsedTime();
    groupRef.current.children.forEach((child, i) => {
      const mesh = child as THREE.Mesh;
      const speed = 0.3 + i * 0.1;
      const yOffset = (time * speed) % 3;
      mesh.position.y = 0.5 + yOffset;
      mesh.position.x = Math.sin(time * 0.5 + i * 2) * 0.3;
      const mat = mesh.material as THREE.MeshStandardMaterial;
      mat.opacity = Math.max(0, 0.15 - yOffset * 0.05);
      const s = 0.1 + yOffset * 0.15;
      mesh.scale.set(s, s, s);
    });
  });

  return (
    <group ref={groupRef}>
      {[0, 1, 2, 3, 4].map((i) => (
        <mesh key={i} position={[0, 0.5, 0]}>
          <sphereGeometry args={[1, 8, 8]} />
          <meshStandardMaterial
            color="#ffffff"
            transparent
            opacity={0.15}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}

export function HeroScene() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[5, 5, 5]}
        intensity={1}
        color="#FFF3E0"
        castShadow
      />
      <pointLight position={[-3, 3, -2]} intensity={0.4} color="#E8913A" />
      <Environment preset="apartment" />
      <Thali />
      <SteamWisps />
      <FoodParticles count={20} />
    </>
  );
}
