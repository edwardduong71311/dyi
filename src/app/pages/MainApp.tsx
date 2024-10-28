"use client";

import { useEffect, useState } from "react";
import * as THREE from "three";
import { useThreeContext } from "../context/ThreeContext";
import InfraMenu from "../components/menu/InfraMenu";

export default function MainApp() {
  const { ready, addObject, removeObject } = useThreeContext();

  const [grid] = useState<THREE.GridHelper>(
    new THREE.GridHelper(200, 200, 0xbdc3c7, 0xbdc3c7)
  );

  useEffect(() => {
    if (ready) {
      addObject(grid);
    }

    return () => {
      removeObject(grid);
    };
  }, [ready]);

  return (
    <div>
      <InfraMenu />
    </div>
  );
}
