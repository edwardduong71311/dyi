"use client";

import * as THREE from "three";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import WebGL from "three/examples/jsm/capabilities/WebGL.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

type TickFunction = () => void;
type ThreeContextType = {
  ready: boolean;
  scene: THREE.Scene | null;
  camera: THREE.Camera | null;
  renderer: THREE.WebGLRenderer | null;
  addObject: (object: THREE.Object3D, func?: TickFunction) => void;
  removeObject: (object: THREE.Object3D, func?: TickFunction) => void;
};
const ThreeContext = createContext<ThreeContextType>({
  ready: false,
  scene: null,
  camera: null,
  renderer: null,
  addObject: () => {},
  removeObject: () => {},
});

const mouse = new THREE.Vector2();
const raycaster = new THREE.Raycaster();

type Props = {
  children: ReactNode;
  rootId: string;
};
export default function ThreeContextProvider({ children, rootId }: Props) {
  const [ready, setReady] = useState<boolean>(false);
  const [scene, setScene] = useState<THREE.Scene | null>(null);
  const [camera, setCamera] = useState<THREE.Camera | null>(null);
  const [renderer, setRenderer] = useState<THREE.WebGLRenderer | null>(null);
  const [control, setControl] = useState<OrbitControls | null>(null);
  const [subscribers, setSubscribers] = useState<TickFunction[]>([]);

  const tick = useCallback(() => {
    for (const func of subscribers) {
      func();
    }
  }, [subscribers]);

  const animate = useCallback(() => {
    if (renderer && scene && camera && control) {
      tick();
      control.update();

      // Update the raycaster with the camera and mouse position
      raycaster.setFromCamera(mouse, camera);
      // Check for intersections
      // const intersects = raycaster.intersectObject(cube);

      renderer.render(scene, camera);
    }
  }, [renderer, scene, camera, control, tick]);

  const addObject = useCallback(
    (objects: THREE.Object3D, func?: TickFunction) => {
      if (scene) {
        scene.add(objects);
        if (func) setSubscribers([...subscribers, func]);
      }
    },
    [scene, subscribers]
  );

  const removeObject = useCallback(
    (objects: THREE.Object3D, func?: TickFunction) => {
      if (scene) {
        scene.remove(objects);
        if (func)
          setSubscribers([...subscribers.filter((item) => item !== func)]);
      }
    },
    [scene, subscribers]
  );

  useEffect(() => {
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      40,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(5, 5, 0);

    setScene(scene);
    setCamera(camera);
    setRenderer(renderer);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableRotate = true;
    controls.enablePan = true;
    controls.maxDistance = 50;
    controls.minDistance = 5;
    controls.maxPolarAngle = Math.PI / 2.2;
    setControl(controls);

    const onMouseMove = (event: MouseEvent) => {
      event.preventDefault();
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };
    document.addEventListener("mousemove", onMouseMove);
    return () => {
      document.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  useEffect(() => {
    if (!WebGL.isWebGL2Available()) {
      alert("Your browser does not supper WebGL");
      return;
    }

    if (camera && renderer) {
      camera.position.z = 5;
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setAnimationLoop(animate);
      document.getElementById(rootId)?.appendChild(renderer.domElement);
      setReady(true);
    }

    return () => {
      if (renderer)
        document.getElementById(rootId)?.removeChild(renderer.domElement);
    };
  }, [rootId, animate, camera, renderer]);

  const value = useMemo(() => {
    return { ready, scene, camera, renderer, addObject, removeObject };
  }, [ready, scene, camera, renderer, addObject, removeObject]);

  return (
    <ThreeContext.Provider value={value}>{children}</ThreeContext.Provider>
  );
}

export const useThreeContext = () => useContext(ThreeContext);
