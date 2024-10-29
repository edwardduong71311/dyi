import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import WebGL from "three/examples/jsm/capabilities/WebGL.js";
import { TickFunction } from "./main.type";

let mouse: THREE.Vector2,
  raycaster: THREE.Raycaster,
  renderer: THREE.WebGLRenderer,
  scene: THREE.Scene,
  camera: THREE.PerspectiveCamera,
  controls: OrbitControls,
  grid: THREE.GridHelper,
  movableObjects: THREE.Object3D[] = [];
let subscribers: TickFunction[] = [];

const tick = () => {
  for (const func of subscribers) {
    func();
  }
};

const animate = () => {
  tick();
  controls.update();

  raycaster.setFromCamera(mouse, camera);
  // Check for intersections
  const intersections = raycaster.intersectObjects(movableObjects);
  if (intersections.length > 0) {
    document.body.style.cursor = "pointer";
    controls.enableRotate = false;
    controls.enablePan = false;
  } else {
    document.body.style.cursor = "grab";
    controls.enableRotate = true;
    controls.enablePan = true;
  }

  renderer.render(scene, camera);
};

const onMouseMove = (event: MouseEvent) => {
  event.preventDefault();
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
};

export const add3DObject = (object: THREE.Object3D, func?: TickFunction) => {
  if (scene) {
    scene.add(object);
    movableObjects.push(object);

    if (func) subscribers.push(func);
  }
};

export const remove3DObject = (object: THREE.Object3D, func?: TickFunction) => {
  if (scene) {
    scene.remove(object);
    movableObjects = movableObjects.filter((o) => o === object);

    if (func) subscribers = subscribers.filter((f) => f === func);
  }
};

export const initialize = (rootId: string) => {
  if (!WebGL.isWebGL2Available()) {
    alert("Your browser does not supper WebGL");
    return;
  }

  mouse = new THREE.Vector2();
  raycaster = new THREE.Raycaster();
  renderer = new THREE.WebGLRenderer({ alpha: true });
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(
    40,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(5, 5, 5);

  grid = new THREE.GridHelper(200, 200, 0xbdc3c7, 0xbdc3c7);
  scene.add(grid);

  controls = new OrbitControls(camera, renderer.domElement);
  controls.maxDistance = 50;
  controls.minDistance = 5;
  controls.maxPolarAngle = Math.PI / 2.2;

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setAnimationLoop(animate);
  document.getElementById(rootId)?.appendChild(renderer.domElement);

  document.addEventListener("mousemove", onMouseMove);
};

export const dispose = (rootId: string) => {
  document.getElementById(rootId)?.removeChild(renderer.domElement);
  document.removeEventListener("mousemove", onMouseMove);
};
