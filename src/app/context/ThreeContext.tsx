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

type TickFunction = () => void;
type ThreeContextType = {
  scene: THREE.Scene | null;
  camera: THREE.Camera | null;
  renderer: THREE.WebGLRenderer | null;
  addObject: (object: THREE.Object3D, func?: TickFunction) => void;
  removeObject: (object: THREE.Object3D, func?: TickFunction) => void;
};
const ThreeContext = createContext<ThreeContextType>({
  scene: null,
  camera: null,
  renderer: null,
  addObject: () => {},
  removeObject: () => {},
});

type Props = {
  children: ReactNode;
  rootId: string;
};
export default function ThreeContextProvider({ children, rootId }: Props) {
  const [scene] = useState<THREE.Scene>(new THREE.Scene());
  const [camera] = useState<THREE.Camera>(
    new THREE.PerspectiveCamera(
      75,
      window?.innerWidth / window?.innerHeight,
      0.1,
      1000
    )
  );
  const [renderer] = useState<THREE.WebGLRenderer>(new THREE.WebGLRenderer());
  const [subscribers, setSubscribers] = useState<TickFunction[]>([]);

  const tick = useCallback(() => {
    for (const func of subscribers) {
      func();
    }
  }, [subscribers]);

  const animate = useCallback(() => {
    tick();
    renderer?.render(scene, camera);
  }, [camera, renderer, scene, tick]);

  const addObject = useCallback(
    (objects: THREE.Object3D, func?: TickFunction) => {
      scene.add(objects);
      if (func) setSubscribers([...subscribers, func]);
    },
    [scene, subscribers]
  );

  const removeObject = useCallback(
    (objects: THREE.Object3D, func?: TickFunction) => {
      scene.remove(objects);
      if (func)
        setSubscribers([...subscribers.filter((item) => item !== func)]);
    },
    [scene, subscribers]
  );

  useEffect(() => {
    if (WebGL.isWebGL2Available()) {
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setAnimationLoop(animate);
      document.getElementById(rootId)?.appendChild(renderer.domElement);

      camera.position.z = 5;
    } else {
      alert("Your browser does not supper WebGL");
    }

    return () => {
      document.getElementById(rootId)?.removeChild(renderer.domElement);
    };
  }, [rootId, animate, camera, renderer]);

  const value = useMemo(() => {
    return { scene, camera, renderer, addObject, removeObject };
  }, [camera, scene, renderer, addObject, removeObject]);

  return (
    <ThreeContext.Provider value={value}>{children}</ThreeContext.Provider>
  );
}

export const useThreeContext = () => useContext(ThreeContext);
