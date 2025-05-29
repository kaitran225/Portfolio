import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import styled from 'styled-components';
import * as THREE from 'three';

// A rotating cube component
const RotatingCube: React.FC = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.5;
      meshRef.current.rotation.y += delta * 0.2;
    }
  });
  
  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[1.5, 1.5, 1.5]} />
      <meshStandardMaterial color="#00a8ff" metalness={0.5} roughness={0.2} />
    </mesh>
  );
};

// Main Three.js component
const ThreeJSComponent: React.FC = () => {
  return (
    <ThreeJSWrapper>
      <Canvas>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <RotatingCube />
        <OrbitControls enableZoom={true} />
      </Canvas>
    </ThreeJSWrapper>
  );
};

const ThreeJSWrapper = styled.div`
  width: 100%;
  height: 100%;
  background-color: #111;
`;

export default ThreeJSComponent; 