import { useEffect, useRef, useState } from "react";
// import { THREEx, ARjs } from "@ar-js-org/ar.js-threejs";
import { Camera, Scene} from "three";
import dynamic from "next/dynamic";

type TypeOfTHREEx = typeof import("@ar-js-org/ar.js-threejs").THREEx;

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
    // dynamicで読み込む
    const [THREEx, setTHREEx] = useState<TypeOfTHREEx | null>(null);

    const arToolkitSource = useRef<InstanceType<TypeOfTHREEx["ArToolkitSource"]>>();
    const arToolkitContext = useRef<InstanceType<TypeOfTHREEx["ArToolkitContext"]>>();
    const arToolkitMarker = useRef<InstanceType<TypeOfTHREEx["ArMarkerControls"]>>();
    
    useEffect(() => {
        import("@ar-js-org/ar.js-threejs").then(mod => setTHREEx(mod.THREEx));
        if (THREEx === null) {
            return;
        }
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

        arToolkitSource.current.init(
            () => {
                arToolkitSource.current!.domElement.addEventListener("canplay", () => {
                    initARContext();
                });
                if(arToolkitSource.current === undefined) {
                    return;
                }
                window.arToolkitSource = arToolkitSource.current;
                setTimeout(() => {
                onResize();
                }, 2000);
            },
            () => {}
        );
        

        const onResize = () => {
            if (arToolkitSource.current) {
                arToolkitSource.current.onResizeElement();
                arToolkitSource.current.copyElementSizeTo(domElement);
                if (arToolkitContext.current?.arController !== null) {
                    arToolkitSource.current.copyElementSizeTo(
                        window.arToolkitContext.arController.canvas
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
                  if(arToolkitContext.current === undefined) {
                      return;
                  }
                  window.arToolkitContext = arToolkitContext.current;
              });
      
              scene.visible = false;
              if(arToolkitMarker.current === undefined) {
                  return;
              }
              window.arMarkerControls = arToolkitMarker.current;
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
                if(arToolkitSource.current === undefined) {
                    return;
                }
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
    }, [camera, cameraParametersUrl, markerPatternUrl, scene, domElement, THREEx]);

    console.log("arToolkitSource: ", arToolkitSource);
    console.log("arToolkitContext: ", arToolkitContext);
    console.log("arToolkitMarker: ", arToolkitMarker);
    return {
        arToolkitSource,
        arToolkitContext,
        arToolkitMarker,
    }
}