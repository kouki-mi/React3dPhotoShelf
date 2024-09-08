import { useEffect} from 'react';
import { useARToolKit } from '@/hooks/useARToolKit';
import { useThree } from '@react-three/fiber';
import Card from '@/component/card';
import { Mesh } from 'three';

type ArSceneProps = {
    canvasRef: React.RefObject<HTMLCanvasElement>;
}

const rotateAnimation = (mesh: Mesh) => {
    mesh.rotation.y += 0.01;
}

export default function ArScene({ canvasRef }: ArSceneProps){
  const { camera, scene } = useThree();
  const { arToolkitSource, arToolkitContext } = useARToolKit({
    domElement: canvasRef.current!,
    camera,
    cameraParametersUrl: '/camera_para.dat',
    markerPatternUrl: '/marker.patt',
    scene,
  });

  useEffect(() => {
    const tick = () => {
      if(arToolkitSource.current?.ready && arToolkitContext.current?.update){
        arToolkitContext.current?.update(arToolkitSource.current.domElement);
        scene.visible = camera.visible;
      }
    }
    requestAnimationFrame(tick);
  }, [arToolkitSource.current?.ready]);

  return (
    <>
        <Card
        position={[0, 0, 3.5]}
        scale={1}
        imageFront="/ray.jpeg"
        imageBack="/rio.jpeg"
        animate={(mesh) => rotateAnimation(mesh)}
        />
    </>
  )
}
