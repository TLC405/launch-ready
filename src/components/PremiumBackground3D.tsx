import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import * as THREE from 'three';

// Glowing Sun with pulsating effect
function Sun() {
  const sunRef = useRef<THREE.Group>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const corona1Ref = useRef<THREE.Mesh>(null);
  const corona2Ref = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    
    // Pulsating glow
    if (glowRef.current) {
      const scale = 1 + Math.sin(t * 0.5) * 0.05;
      glowRef.current.scale.setScalar(scale);
    }
    if (corona1Ref.current) {
      corona1Ref.current.scale.setScalar(1.2 + Math.sin(t * 0.3) * 0.08);
    }
    if (corona2Ref.current) {
      corona2Ref.current.scale.setScalar(1.4 + Math.sin(t * 0.4 + 1) * 0.1);
    }
  });

  return (
    <group ref={sunRef} position={[0, 0, -50]}>
      {/* Core sun */}
      <mesh>
        <sphereGeometry args={[8, 64, 64]} />
        <meshBasicMaterial color="#ff6b35" />
      </mesh>
      
      {/* Inner glow layer */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[8.5, 32, 32]} />
        <meshBasicMaterial 
          color="#ff2975" 
          transparent 
          opacity={0.6}
        />
      </mesh>
      
      {/* Corona layer 1 */}
      <mesh ref={corona1Ref}>
        <sphereGeometry args={[10, 32, 32]} />
        <meshBasicMaterial 
          color="#ff6b35" 
          transparent 
          opacity={0.3}
        />
      </mesh>
      
      {/* Corona layer 2 */}
      <mesh ref={corona2Ref}>
        <sphereGeometry args={[12, 32, 32]} />
        <meshBasicMaterial 
          color="#ff2975" 
          transparent 
          opacity={0.15}
        />
      </mesh>
      
      {/* Outer glow */}
      <mesh>
        <sphereGeometry args={[15, 32, 32]} />
        <meshBasicMaterial 
          color="#ff2975" 
          transparent 
          opacity={0.08}
        />
      </mesh>
      
      {/* Sun light */}
      <pointLight color="#ff6b35" intensity={2} distance={200} />
      <pointLight color="#ff2975" intensity={1} distance={150} />
    </group>
  );
}

// Animated perspective grid with wave displacement
function Grid() {
  const gridRef = useRef<THREE.Mesh>(null);
  
  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(200, 200, 100, 100);
    geo.rotateX(-Math.PI / 2);
    return geo;
    return geo;
  }, []);
  
  useFrame((state) => {
    if (!gridRef.current) return;
    
    const geo = gridRef.current.geometry;
    const positions = geo.attributes.position;
    const time = state.clock.elapsedTime;
    
    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i);
      const z = positions.getZ(i);
      
      // Wave displacement
      const wave = Math.sin(z * 0.05 + time * 0.5) * 0.5 + 
                   Math.sin(x * 0.03 + time * 0.3) * 0.3;
      positions.setY(i, wave);
    }
    
    positions.needsUpdate = true;
  });

  return (
    <mesh ref={gridRef} geometry={geometry} position={[0, -5, 0]}>
      <meshBasicMaterial 
        color="#00f0ff"
        wireframe
        transparent
        opacity={0.4}
      />
    </mesh>
  );
}

// Second grid layer for depth
function GridOverlay() {
  const gridRef = useRef<THREE.Mesh>(null);
  
  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(200, 200, 50, 50);
    geo.rotateX(-Math.PI / 2);
    return geo;
  }, []);
  
  useFrame((state) => {
    if (!gridRef.current) return;
    
    const geo = gridRef.current.geometry;
    const positions = geo.attributes.position;
    const time = state.clock.elapsedTime;
    
    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i);
      const z = positions.getZ(i);
      
      const wave = Math.sin(z * 0.04 + time * 0.4 + 1) * 0.4 + 
                   Math.sin(x * 0.025 + time * 0.25 + 2) * 0.25;
      positions.setY(i, wave - 0.1);
    }
    
    positions.needsUpdate = true;
  });

  return (
    <mesh ref={gridRef} geometry={geometry} position={[0, -5, -2]}>
      <meshBasicMaterial 
        color="#ff2975"
        wireframe
        transparent
        opacity={0.3}
      />
    </mesh>
  );
}

function PremiumBackground3D() {
  return (
    <Canvas
      style={{ 
        background: 'linear-gradient(to bottom, #0a0812, #000000)',
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
      }}
      camera={{ position: [0, 2, 0], fov: 45 }}
    >
      <ambientLight intensity={0.1} />
      <Sun />
      <Grid />
      <GridOverlay />
      <Stars 
        radius={100} 
        depth={50} 
        count={5000} 
        factor={4} 
        saturation={0} 
        fade 
      />
    </Canvas>
  );
}

export default PremiumBackground3D;
