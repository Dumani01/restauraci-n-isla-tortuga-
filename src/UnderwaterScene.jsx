import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sparkles } from "@react-three/drei";
import * as THREE from "three";

function Fish({ position, scale = 1, color = "#76d8cd", speed = 1 }) {
  const group = useRef();
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * speed;
    if (!group.current) return;
    group.current.position.x = position[0] + Math.sin(t) * 1.8;
    group.current.position.y = position[1] + Math.sin(t * 1.4) * 0.18;
    group.current.rotation.z = Math.cos(t) * 0.08;
  });
  return (
    <group ref={group} position={position} scale={scale}>
      <mesh>
        <sphereGeometry args={[0.48, 16, 10]} />
        <meshStandardMaterial color={color} roughness={0.64} metalness={0.05} />
      </mesh>
      <mesh position={[-0.56, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <coneGeometry args={[0.36, 0.7, 3]} />
        <meshStandardMaterial color={color} roughness={0.72} />
      </mesh>
      <mesh position={[0.34, 0.13, 0.32]}>
        <sphereGeometry args={[0.035, 8, 8]} />
        <meshBasicMaterial color="#f7fff7" />
      </mesh>
    </group>
  );
}

function ReefSilhouette() {
  return (
    <group position={[0, -2.15, -1]}>
      <mesh scale={[7, 0.34, 1.3]}>
        <sphereGeometry args={[1, 24, 10]} />
        <meshStandardMaterial color="#123d48" roughness={1} />
      </mesh>
      {[-3.1, -2.1, 2.1, 3.2].map((x, index) => (
        <mesh
          key={x}
          position={[x, 0.35 + (index % 2) * 0.2, 0.1]}
          scale={[0.22, 1.5 + (index % 3) * 0.25, 0.22]}
        >
          <cylinderGeometry args={[0.12, 0.35, 2.4, 7]} />
          <meshStandardMaterial
            color={index % 2 ? "#1b5e62" : "#17514e"}
            roughness={0.94}
          />
        </mesh>
      ))}
    </group>
  );
}

function SceneContent({ depth }) {
  const particles = useMemo(
    () =>
      Array.from({ length: 90 }, () => [
        (Math.random() - 0.5) * 13,
        (Math.random() - 0.5) * 7,
        (Math.random() - 0.5) * 4,
      ]),
    [],
  );
  const cameraTarget = useRef();
  useFrame(({ camera, clock }) => {
    camera.position.y = THREE.MathUtils.lerp(
      camera.position.y,
      1.2 - depth * 1.7,
      0.035,
    );
    camera.position.z = THREE.MathUtils.lerp(
      camera.position.z,
      7 - depth * 1.2,
      0.035,
    );
    camera.lookAt(0, camera.position.y - 0.2, -1);
    if (cameraTarget.current)
      cameraTarget.current.rotation.z =
        Math.sin(clock.getElapsedTime() * 0.15) * 0.02;
  });
  return (
    <>
      <ambientLight intensity={0.6} color="#8fe3d1" />
      <directionalLight intensity={1.6} color="#a8f1df" position={[-3, 5, 4]} />
      <fog attach="fog" args={["#062c3b", 5, 13]} />
      <group ref={cameraTarget}>
        <Fish
          position={[-2.6, 0.4, -1]}
          scale={0.68}
          color="#8cdcd0"
          speed={0.45}
        />
        <Fish
          position={[2.6, -0.2, -1.8]}
          scale={0.48}
          color="#f1aa82"
          speed={0.68}
        />
        <Fish
          position={[1.3, 1.15, -2.2]}
          scale={0.34}
          color="#8fbdd3"
          speed={0.82}
        />
        <ReefSilhouette />
      </group>
      <Sparkles
        count={particles.length}
        scale={[12, 7, 5]}
        size={1.5}
        speed={0.16}
        opacity={0.36}
        color="#b2eee1"
      />
    </>
  );
}

export function UnderwaterScene({ depth = 0 }) {
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    try {
      const canvas = document.createElement("canvas");
      setEnabled(
        Boolean(
          canvas.getContext("webgl") || canvas.getContext("experimental-webgl"),
        ),
      );
    } catch {
      setEnabled(false);
    }
  }, []);
  if (!enabled) return null;
  return (
    <div className="vh-underwater-scene" aria-hidden="true">
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 1.2, 7], fov: 46 }}
        gl={{ alpha: true, antialias: true }}
      >
        <SceneContent depth={depth} />
      </Canvas>
    </div>
  );
}
