import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sparkles } from '@react-three/drei';
import * as THREE from 'three';

function Fish({ position, scale = 1, color = '#76d8cd', speed = 1 }) {
  const group = useRef();
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * speed;
    if (!group.current) return;
    group.current.position.x = position[0] + Math.sin(t) * 1.8;
    group.current.position.y = position[1] + Math.sin(t * 1.4) * .18;
    group.current.rotation.z = Math.cos(t) * .08;
  });
  return <group ref={group} position={position} scale={scale}><mesh><sphereGeometry args={[.48, 16, 10]} /><meshStandardMaterial color={color} roughness={.64} metalness={.05} /></mesh><mesh position={[-.56, 0, 0]} rotation={[0, 0, Math.PI / 2]}><coneGeometry args={[.36, .7, 3]} /><meshStandardMaterial color={color} roughness={.72} /></mesh><mesh position={[.34, .13, .32]}><sphereGeometry args={[.035, 8, 8]} /><meshBasicMaterial color="#f7fff7" /></mesh></group>;
}

function ReefSilhouette() {
  return <group position={[0, -2.15, -1]}><mesh scale={[7, .34, 1.3]}><sphereGeometry args={[1, 24, 10]} /><meshStandardMaterial color="#123d48" roughness={1} /></mesh>{[-3.1, -2.1, 2.1, 3.2].map((x, index) => <mesh key={x} position={[x, .35 + (index % 2) * .2, .1]} scale={[.22, 1.5 + (index % 3) * .25, .22]}><cylinderGeometry args={[.12, .35, 2.4, 7]} /><meshStandardMaterial color={index % 2 ? '#1b5e62' : '#17514e'} roughness={.94} /></mesh>)}</group>;
}

function SceneContent({ depth }) {
  const particles = useMemo(() => Array.from({ length: 90 }, () => [(Math.random() - .5) * 13, (Math.random() - .5) * 7, (Math.random() - .5) * 4]), []);
  const cameraTarget = useRef();
  useFrame(({ camera, clock }) => {
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, 1.2 - depth * 1.7, .035);
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, 7 - depth * 1.2, .035);
    camera.lookAt(0, camera.position.y - .2, -1);
    if (cameraTarget.current) cameraTarget.current.rotation.z = Math.sin(clock.getElapsedTime() * .15) * .02;
  });
  return <><ambientLight intensity={.6} color="#8fe3d1" /><directionalLight intensity={1.6} color="#a8f1df" position={[-3, 5, 4]} /><fog attach="fog" args={['#062c3b', 5, 13]} /><group ref={cameraTarget}><Fish position={[-2.6, .4, -1]} scale={.68} color="#8cdcd0" speed={.45} /><Fish position={[2.6, -.2, -1.8]} scale={.48} color="#f1aa82" speed={.68} /><Fish position={[1.3, 1.15, -2.2]} scale={.34} color="#8fbdd3" speed={.82} /><ReefSilhouette /></group><Sparkles count={particles.length} scale={[12, 7, 5]} size={1.5} speed={.16} opacity={.36} color="#b2eee1" /></>;
}

export function UnderwaterScene({ depth = 0 }) {
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      setEnabled(Boolean(canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
    } catch {
      setEnabled(false);
    }
  }, []);
  if (!enabled) return null;
  return <div className="vh-underwater-scene" aria-hidden="true"><Canvas dpr={[1, 1.5]} camera={{ position: [0, 1.2, 7], fov: 46 }} gl={{ alpha: true, antialias: true }}><SceneContent depth={depth} /></Canvas></div>;
}
