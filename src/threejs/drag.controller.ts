import * as THREE from "three";
import { DragControls } from "three/addons/controls/DragControls.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

import { getMoveableObjects } from "./scene";

let dragControls: DragControls;
let offset: THREE.Vector3 = new THREE.Vector3();
const intersects = new THREE.Vector3();
const plane = new THREE.Plane(new THREE.Vector3(0, 0.1, 0), 0);

export const initDragControl = (
  camera: THREE.PerspectiveCamera,
  renderer: THREE.WebGLRenderer,
  raycaster: THREE.Raycaster,
  controls: OrbitControls,
  mouse: THREE.Vector2
) => {
  dragControls = new DragControls(
    getMoveableObjects(),
    camera,
    renderer.domElement
  );
  dragControls.addEventListener("dragstart", function (event) {
    controls.enabled = false;
    raycaster.setFromCamera(mouse, camera);
    raycaster.ray.intersectPlane(plane, intersects);
    offset = new THREE.Vector3().subVectors(intersects, event.object.position);
  });
  dragControls.addEventListener("drag", function (event) {
    raycaster.setFromCamera(mouse, camera);
    raycaster.ray.intersectPlane(plane, intersects);
    event.object.position.set(
      intersects.x - offset.x,
      intersects.y,
      intersects.z - offset.z
    );
  });
  dragControls.addEventListener("dragend", function () {
    controls.enabled = true;
  });
};
