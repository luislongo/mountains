import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

export const createScene = () => {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75, // fov
    window.innerWidth / window.innerHeight, // aspect
    0.1, // near
    1000 // far
  );
  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);

  camera.position.z = 10;
  camera.position.y = 10;
  camera.position.x = 10;
  camera.lookAt(0, 0, 0);

  new OrbitControls(camera, renderer.domElement);

  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(0, 10, 10);
  scene.add(light);

  const light2 = new THREE.DirectionalLight(0xffffff, 0.4);
  light2.position.set(0, 10, -10);
  scene.add(light2);

  renderer.setClearColor(0xffffff);

  return {
    scene,
    camera,
    renderer,
  };
};
