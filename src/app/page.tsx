"use client"

import { NextPage } from 'next';
import React, { useRef, useState } from 'react';
import { Mesh } from 'three';
import { Canvas, useThree } from '@react-three/fiber';
import Card from '@/component/card';
import { useARToolKit } from '@/hooks/useARToolKit';

const Home: NextPage = () => {
  //ここでisDraggingとpreviousMousePositionのstateを定義
  const [isDragging, setIsDragging] = useState(false);
  const previousMousePosition = useRef({ x: 0, y: 0 });
  const mouseDelta = useRef({ x: 0, y: 0 });

  //ARの設定
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { camera, scene } = useThree();
  const { arToolkitSource, arToolkitContext, arToolkitMarker } = useARToolKit({
    domElement: canvasRef.current!,
    camera,
    cameraParametersUrl: '/camera_para.dat',
    markerPatternUrl: '/hiro.patt',
    scene,
  });

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(true);
    previousMousePosition.current = { x: e.clientX, y: e.clientY };
  
  }
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    document.addEventListener('touchmove', (e) => e.preventDefault(), { passive: false });
    const { x, y } = previousMousePosition.current;
    const dx = e.clientX - x;
    const dy = e.clientY - y;
    previousMousePosition.current = { x: e.clientX, y: e.clientY };
    mouseDelta.current = { x: dx, y: dy };
  }

  const handlePointerUp = () => {
    setIsDragging(false);
  }

  // const dragAnimation = (mesh: Mesh) => {
  //   if(isDragging && mouseDelta.current.x !== 0 && mouseDelta.current.y !== 0){
  //     mesh.rotation.x += mouseDelta.current.y * 0.01;
  //     mesh.rotation.y += mouseDelta.current.x * 0.01;
  //     mouseDelta.current = { x: 0, y: 0 };
  //   }
  // }

  const rotateAnimation = (mesh: Mesh) => {
    mesh.rotation.y += 0.01;
  }

  return(
    <div 
      style={{ width: '100vw', height: '100vh' }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      <Canvas ref={canvasRef}>
          <color attach="background" args={['#ffffff']} />
          <ambientLight />
          {/* 縦と横に回転 */}
          <Card position={[0, 0, 3.5]} 
            scale={1}
            imageFront="/ray.jpeg"
            imageBack="/rio.jpeg"
            animate={
              (mesh) => {
                rotateAnimation(mesh);
              }
            }
          />
      </Canvas>
    </div>
  );
};

export default Home;
