
import React, { useRef, useState, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Box, Sphere, Environment } from '@react-three/drei';
import * as THREE from 'three';

interface VRSceneProps {
  userCount: number;
  onInteraction: () => void;
}

const FloatingCube = ({ position }: { position: [number, number, number] }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.5;
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.3;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.getElapsedTime() * 2) * 0.2;
    }
  });

  return (
    <Box
      ref={meshRef}
      position={position}
      args={[1, 1, 1]}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onClick={() => {
        console.log('Cube clicked!');
      }}
    >
      <meshStandardMaterial 
        color={hovered ? '#00ffff' : '#8b5cf6'} 
        emissive={hovered ? '#00ffff' : '#000000'}
        emissiveIntensity={hovered ? 0.2 : 0}
      />
    </Box>
  );
};

const VREnvironment = ({ userCount, onInteraction }: VRSceneProps) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.002;
    }
  });

  return (
    <>
      <Environment preset="night" />
      
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#00ffff" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#8b5cf6" />
      
      <group ref={groupRef}>
        <FloatingCube position={[2, 1, 0]} />
        <FloatingCube position={[-2, 1, 0]} />
        <FloatingCube position={[0, 1, 2]} />
        <FloatingCube position={[0, 1, -2]} />
      </group>
      
      <Sphere position={[0, 0, 0]} args={[0.5]} onClick={onInteraction}>
        <meshStandardMaterial 
          color="#00ffff" 
          emissive="#00ffff" 
          emissiveIntensity={0.3}
          transparent
          opacity={0.7}
        />
      </Sphere>
      
      <Text
        position={[0, 3, 0]}
        fontSize={0.5}
        color="#00ffff"
        anchorX="center"
        anchorY="middle"
      >
        ICP VR Genesis Realm
      </Text>
      
      <Text
        position={[0, 2.3, 0]}
        fontSize={0.2}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        {userCount} users online
      </Text>
      
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial 
          color="#1a1a2e" 
          transparent 
          opacity={0.8}
          roughness={0.8}
        />
      </mesh>
      
      <OrbitControls
        enablePan={false}
        enableZoom={true}
        enableRotate={true}
        minDistance={3}
        maxDistance={15}
        maxPolarAngle={Math.PI / 2}
      />
    </>
  );
};

const VRScene: React.FC<VRSceneProps> = ({ userCount, onInteraction }) => {
  return (
    <div className="w-full h-full bg-gradient-to-br from-slate-900 to-slate-800">
      <Suspense fallback={
        <div className="flex items-center justify-center h-full">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground">Loading VR Scene...</p>
          </div>
        </div>
      }>
        <Canvas
          camera={{ position: [0, 5, 8], fov: 60 }}
          gl={{ 
            antialias: true, 
            alpha: true,
            powerPreference: "high-performance"
          }}
        >
          <VREnvironment userCount={userCount} onInteraction={onInteraction} />
        </Canvas>
      </Suspense>
    </div>
  );
};

export default VRScene;
