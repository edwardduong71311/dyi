import * as THREE from "three";
import { TickFunction } from "./scene.type";

const scene: THREE.Scene = new THREE.Scene();
const grid: THREE.GridHelper = new THREE.GridHelper(
  200,
  200,
  0xbdc3c7,
  0xbdc3c7
);
scene.add(grid);
let subscribers: TickFunction[] = [];
let movableObjects: THREE.Object3D[] = [];

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

export const notifySubscribers = () => {
  for (const func of subscribers) {
    func();
  }
};

export const getMoveableObjects = () => movableObjects;
export const getScene = () => scene;
