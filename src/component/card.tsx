import React, { useRef } from 'react';
import {TextureLoader, Mesh } from 'three';
import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';

type CardProps = {
    position: [x: number, y: number, z: number];
    scale: number;
    imagePath: string;
    animate?: (mesh: Mesh) => void;
};

type Size = [
    width: number,
    height: number,
    depth: number,
];

export default function Card(props: CardProps){
    const mesh = useRef<Mesh>(null!);
    const { position, scale, imagePath } = props;
    const textureLoaderFront = new THREE.TextureLoader().load(imagePath)
    const textureLoaderBack = new THREE.TextureLoader().load('/rio.jpeg')
    const size: Size = [scale, scale, 0.01];
    useFrame(() => {
        if(props.animate){
            props.animate(mesh.current);
        }
    });
    return (
        <mesh
            position={position}
            scale={scale}
            ref={mesh}
        >
            <boxGeometry args={size} />
            <meshBasicMaterial attach={"material-0"} color="#6495F6" />
            <meshBasicMaterial attach={"material-1"} color="#FF4F61" />
            <meshBasicMaterial attach={"material-2"} color="black" />
            <meshBasicMaterial attach={"material-3"} color="black" />
            <meshBasicMaterial attach={"material-4"} map={textureLoaderFront} />
            <meshBasicMaterial attach={"material-5"} map={textureLoaderBack} />
            
        </mesh>
    )
}