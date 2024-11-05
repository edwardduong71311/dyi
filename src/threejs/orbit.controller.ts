import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

let controls: OrbitControls;
export const initOrbitController = (
  camera: THREE.PerspectiveCamera,
  renderer: THREE.WebGLRenderer
) => {
  controls = new OrbitControls(camera, renderer.domElement);
  controls.maxDistance = 50;
  controls.minDistance = 5;
  controls.maxPolarAngle = Math.PI / 2.2;
};

export const getOrbitController = () => controls;
