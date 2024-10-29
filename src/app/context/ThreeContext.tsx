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
import {
  add3DObject,
  remove3DObject,
  initialize,
  dispose,
} from "@/threejs/main";
import { TickFunction } from "@/threejs/main.type";

type ThreeContextType = {
  ready: boolean;
  addObject: (object: THREE.Object3D, func?: TickFunction) => void;
  removeObject: (object: THREE.Object3D, func?: TickFunction) => void;
};
const ThreeContext = createContext<ThreeContextType>({
  ready: false,
  addObject: () => {},
  removeObject: () => {},
});

type Props = {
  children: ReactNode;
  rootId: string;
};
export default function ThreeContextProvider({ children, rootId }: Props) {
  const [ready, setReady] = useState<boolean>(false);

  const addObject = useCallback(
    (object: THREE.Object3D, func?: TickFunction) => {
      add3DObject(object, func);
    },
    []
  );

  const removeObject = useCallback(
    (object: THREE.Object3D, func?: TickFunction) => {
      remove3DObject(object, func);
    },
    []
  );

  useEffect(() => {
    initialize(rootId);
    setReady(true);

    return () => {
      dispose(rootId);
    };
  }, []);

  const value = useMemo(() => {
    return { ready, addObject, removeObject };
  }, [addObject, ready, removeObject]);

  return (
    <ThreeContext.Provider value={value}>{children}</ThreeContext.Provider>
  );
}

export const useThreeContext = () => useContext(ThreeContext);
