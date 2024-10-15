"use client";

import { useEffect, useState } from "react";
import * as THREE from "three";
import { useThreeContext } from "../context/ThreeContext";

export default function MainApp() {
  const { addObject, removeObject } = useThreeContext();

  const [cube] = useState<THREE.Mesh>(
    new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshBasicMaterial({ color: 0x00ff00 })
    )
  );

  useEffect(() => {
    addObject(cube);

    setInterval(() => {
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;
    }, 20);

    return () => {
      removeObject(cube);
    };
  }, []);

  return <></>;
}
