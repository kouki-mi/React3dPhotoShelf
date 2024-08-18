"use client"
import { useEffect, useRef } from "react";
import { THREEx } from "@ar-js-org/ar.js-threejs";
import { Camera, Scene} from "three";

export interface ARToolKitInitOptions {
    domElement: HTMLCanvasElement;
    camera : Camera;
    cameraParametersUrl: string;
    markerPatternUrl: string;
    scene: Scene;
}

export const useARToolKit = ({
    domElement,
    camera,
    cameraParametersUrl,
    markerPatternUrl,
    scene
}: ARToolKitInitOptions) => {
    const arToolkitSource = useRef<InstanceType<typeof THREEx.ArToolkitSource>>();
    const arToolkitContext = useRef<InstanceType<typeof THREEx.ArToolkitContext>>();
    const arToolkitMarker = useRef<InstanceType<typeof THREEx.ArMarkerControls>>();

    useEffect(() => { 
        arToolkitSource.current = new THREEx.ArToolkitSource({
            sourceType: "webcam",
            sourceWidth: window.innerWidth > window.innerHeight ? 640 : 480,
            sourceHeight: window.innerWidth > window.innerHeight ? 480 : 640,
        });

        arToolkitContext.current = new THREEx.ArToolkitContext({
            cameraParametersUrl: cameraParametersUrl,
            detectionMode: "mono",
        });

        arToolkitMarker.current = new THREEx.ArMarkerControls(
            arToolkitContext.current,
            camera,
            {
                type: "pattern",
                patternUrl: markerPatternUrl,
                changeMatrixMode: "cameraTransformMatrix",
            }
        );
      
        const onResize = () => {
            if (arToolkitSource.current) {
                arToolkitSource.current.onResizeElement();
                arToolkitSource.current.copyElementSizeTo(domElement);
                if (arToolkitContext.current?.arController !== null) {
                    arToolkitSource.current.copyElementSizeTo(
                        arToolkitContext?.current?.arController.canvas
                    );
                }
            }
        };

        const initARContext = () => {
            if (arToolkitContext.current) {
              arToolkitContext.current.init(() => {
                camera.projectionMatrix.copy(
                  arToolkitContext.current!.getProjectionMatrix()
                );
      
                arToolkitContext.current!.arController.orientatio = getSourceOrientation();
                arToolkitContext.current!.arController.options.orientation =
                  getSourceOrientation();
              });
      
              scene.visible = false;
            }
        };
      
        const getSourceOrientation = (): string => {
        return arToolkitSource.current?.domElement.videoWidth >
            arToolkitSource.current?.domElement.videoHeight
            ? "landscape"
            : "portrait";
        };

        if (arToolkitSource && arToolkitSource.current) {
            arToolkitSource.current.init(
              () => {
                arToolkitSource.current!.domElement.addEventListener("canplay", () => {
                  initARContext();
                });
                if(arToolkitSource.current === undefined) return;
                window.arToolkitSource = arToolkitSource.current;
                setTimeout(() => {
                  onResize();
                }, 2000);
              },
              () => {}
            );
        }
      
        window.addEventListener("resize", onResize);
    
        return () => {
        window.removeEventListener("resize", onResize);
        };
    }, [camera, cameraParametersUrl, markerPatternUrl, scene, domElement]);

    return {
        arToolkitSource,
        arToolkitContext,
        arToolkitMarker
    }
}