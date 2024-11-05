import * as THREE from "three";

let camera: THREE.PerspectiveCamera;

export const initCamera = () => {
  camera = new THREE.PerspectiveCamera(
    40,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(5, 5, 5);
};

export const getCamera = () => camera;
