"use client"

import { NextPage } from 'next';
import React, { useRef, useState } from 'react';
import { Canvas, useFrame, ThreeEvent, events, } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Mesh, Vector3} from 'three';
import Card from '@/component/card';

const Rig = ({ v = new Vector3() }) => {
  return useFrame((state) => {
    state.camera.position.lerp(v.set(state.mouse.x / 2, state.mouse.y / 2, 10), 0.05)
  })
};

const Home: NextPage = () => {
  const [active, setActive] = useState(false);
  //ここでisDraggingとpreviousMousePositionのstateを定義
  const [isDragging, setIsDragging] = useState(false);
  const previousMousePosition = useRef({ x: 0, y: 0 });
  const mouseDelta = useRef({ x: 0, y: 0 });

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(true);
    previousMousePosition.current = { x: e.clientX, y: e.clientY };
  
  }
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const { x, y } = previousMousePosition.current;
    const dx = e.clientX - x;
    const dy = e.clientY - y;
    previousMousePosition.current = { x: e.clientX, y: e.clientY };
    mouseDelta.current = { x: dx, y: dy };
    console.log(dx, dy);
  }

  const handlePointerUp = () => {
    setIsDragging(false);
  }

  return(
    <div 
      style={{ width: '100vw', height: '100vh' }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
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
              console.log(isDragging)
              if(isDragging && mouseDelta.current.x !== 0 && mouseDelta.current.y !== 0){
                console.log("dragging");
                mesh.rotation.x += mouseDelta.current.y * 0.01;
                mesh.rotation.y += mouseDelta.current.x * 0.01;
                mouseDelta.current = { x: 0, y: 0 };
              }
            }
          }
        />
      </Canvas>
    </div>
  );
};

export default Home;
