import React, { useRef } from 'react';
import {TextureLoader, Mesh } from 'three';
import { useFrame } from '@react-three/fiber';

type CardProps = {
    position: [x: number, y: number, z: number];
    scale: number;
    imagePath: string;
};

type Size = [
    width: number,
    height: number,
    depth: number,
];

export default function Card(props: CardProps){
    const mesh = useRef<Mesh>(null!);
    const { position, scale, imagePath } = props;
    const texture = new TextureLoader().load(imagePath);
    const size: Size = [scale * 1.5, scale * 2, 0.01];

    useFrame(() => (mesh.current.rotation.y += 0.015));
    return (
        <mesh
            position={position}
            scale={scale}
            ref={mesh}
        >
            <boxGeometry args={size} />
            <meshStandardMaterial map={texture} />
        </mesh>
    )
}