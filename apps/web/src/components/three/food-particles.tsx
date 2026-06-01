// @ts-nocheck — React Three Fiber v8's intrinsic JSX elements (<mesh>, <instancedMesh>,
// geometries, materials, ...) are not recognized under @types/react@18.3's automatic JSX
// runtime (a known R3F v8 typing gap). They are valid at runtime via R3F's reconciler; we
// skip type-checking this decorative 3D-only file rather than disabling it app-wide.
"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export function FoodParticles({ count = 30 }: { count?: number }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);

  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      temp.push({
        position: [
          (Math.random() - 0.5) * 8,
          (Math.random() - 0.5) * 6,
          (Math.random() - 0.5) * 4,
        ] as [number, number, number],
        speed: 0.2 + Math.random() * 0.5,
        offset: Math.random() * Math.PI * 2,
        scale: 0.03 + Math.random() * 0.06,
      });
    }
    return temp;
  }, [count]);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const time = clock.getElapsedTime();

    particles.forEach((particle, i) => {
      const [x, y, z] = particle.position;
      dummy.position.set(
        x + Math.sin(time * particle.speed + particle.offset) * 0.5,
        y + Math.cos(time * particle.speed * 0.7 + particle.offset) * 0.3,
        z
      );
      dummy.rotation.set(
        time * particle.speed * 0.5,
        time * particle.speed * 0.3,
        0
      );
      dummy.scale.setScalar(particle.scale);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshStandardMaterial
        color="#E8913A"
        transparent
        opacity={0.3}
        roughness={0.8}
      />
    </instancedMesh>
  );
}
