import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

function Server(props: any) {
  const meshRef = useRef<THREE.Mesh>();
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01;
    }
  });

  return (
    <mesh {...props} ref={meshRef}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#4F46E5" />
    </mesh>
  );
}

function DataStream({ startPoint, endPoint }: { startPoint: THREE.Vector3; endPoint: THREE.Vector3 }) {
  const points = [startPoint, endPoint];
  const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);

  return (
    <line geometry={lineGeometry}>
      <lineBasicMaterial color="#06B6D4" linewidth={2} />
    </line>
  );
}

export function MonitoringScene() {
  return (
    <Canvas camera={{ position: [0, 0, 5] }}>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      
      <Server position={[0, 0, 0]} />
      
      <DataStream 
        startPoint={new THREE.Vector3(-2, 0, 0)} 
        endPoint={new THREE.Vector3(2, 0, 0)} 
      />
      
      <OrbitControls enableZoom={false} />
    </Canvas>
  );
}