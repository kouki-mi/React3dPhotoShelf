"use client"

import { NextPage } from 'next';
import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Mesh } from 'three';
import Card from '@/component/card';

type BoxProps = {
  position: [x: number, y: number, z: number];
};

const Box: React.FC<BoxProps> = (props) => {
  const mesh = useRef<Mesh>(null!);
  const [hovered, setHover] = useState(false);
  const [active, setActive] = useState(false);
  useFrame(() => (mesh.current.rotation.x += 0.01));

  return (
    <mesh
      {...props}
      ref={mesh}
      scale={active ? 1.5 : 1}
      onClick={() => setActive(!active)}
      onPointerOver={() => setHover(true)}
      onPointerOut={() => setHover(false)}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
    </mesh>
  );
};

const Home: NextPage = () => (

  <div style={{ width: '100vw', height: '100vh' }}>
    <Canvas>
      <color attach="background" args={['#ffffff']} />
      <ambientLight />
      {/* 縦と横に回転 */}
      <Card position={[0, 0, 3.5]} 
        scale={1} 
        imageFront="/ray.jpeg"
        imageBack="/rio.jpeg"
        animate={
          (mesh) => {
            mesh.rotation.y += 0.01;
          }
        }
      />
    </Canvas>
  </div>
);

export default Home;
