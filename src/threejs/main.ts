import * as THREE from "three";

import WebGL from "three/addons/capabilities/WebGL.js";
import { getScene, getMoveableObjects, notifySubscribers } from "./scene";
import { initDragControl } from "./drag.controller";
import { getOrbitController, initOrbitController } from "./orbit.controller";
import { getCamera, initCamera } from "./camera.controller";

let mouse: THREE.Vector2,
  renderer: THREE.WebGLRenderer,
  raycaster: THREE.Raycaster;

const onHover3DObject = () => {
  raycaster.setFromCamera(mouse, getCamera());
  const intersections = raycaster.intersectObjects(getMoveableObjects());
  if (intersections.length > 0) {
    document.body.style.cursor = "pointer";
    getOrbitController().enableRotate = false;
    getOrbitController().enablePan = false;
  } else {
    document.body.style.cursor = "grab";
    getOrbitController().enableRotate = true;
    getOrbitController().enablePan = true;
  }
};

const onMouseMove = (event: MouseEvent) => {
  event.preventDefault();
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
};

const animate = () => {
  notifySubscribers();
  getOrbitController().update();
  onHover3DObject();
  renderer.render(getScene(), getCamera());
};

export const initialize = (rootId: string) => {
  if (!WebGL.isWebGL2Available()) {
    alert("Your browser does not supper WebGL");
    return;
  }

  mouse = new THREE.Vector2();
  raycaster = new THREE.Raycaster();
  renderer = new THREE.WebGLRenderer({ alpha: true });

  initCamera();
  initOrbitController(getCamera(), renderer);
  initDragControl(
    getCamera(),
    renderer,
    raycaster,
    getOrbitController(),
    mouse
  );

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setAnimationLoop(animate);
  document.getElementById(rootId)?.appendChild(renderer.domElement);
  document.addEventListener("mousemove", onMouseMove);
};

export const dispose = (rootId: string) => {
  document.getElementById(rootId)?.removeChild(renderer.domElement);
  document.removeEventListener("mousemove", onMouseMove);
};
