import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { ImageArrayInput } from "./components/atoms/ImageArrayInput/ImageArrayInput";
import { DatasetRangeInput } from "./components/atoms/RangeInput/DatasetRangeInput";
import { createPlane } from "./createPlane";
import { useDataset } from "./hooks/useDataset/useDataset";
import "./index.css";
import stone from "./assets/textures/stone.png";
import ice from "./assets/textures/ice.jpg";
import snow from "./assets/textures/snow.jpg";
import grass from "./assets/textures/grass2.jpg";
import { HeightMap } from "./HeightMap";
import vertexShader from "./assets/shaders/vertexShader.glsl?raw";
import fragmentShader from "./assets/shaders/fragmentShader.glsl?raw";

const quadSize = 1 / 3;
const segs = 30;

function App() {
  console.log(vertexShader);
  console.log(fragmentShader);
  const ref = useRef<HTMLDivElement>(null);
  const geoRef = useRef<THREE.BufferGeometry>();
  const matRef = useRef<THREE.ShaderMaterial>();

  const initialValue = {
    tileSize: 10,
    a0: 5,
    aN: 2,
    f0: 2,
    fN: 3,
    nrOfLayers: 5,
    vector: { x: 0, y: 0 },
    texture1: stone,
    texture2: ice,
  };

  const hmRef = new HeightMap(initialValue);
  const { register, useOnValueChange } = useDataset<{
    tileSize: number;
    a0: number;
    aN: number;
    f0: number;
    fN: number;
    nrOfLayers: number;
    texture?: string;
    vector: { x: number; y: number };
    texture1: string;
    texture2: string;
  }>({
    initialValue,
    onChange: (d) => {
      if (!geoRef.current || !matRef.current) return;

      matRef.current.uniforms.tileSize.value = d.tileSize;
      matRef.current.uniforms.a0.value = d.a0;
      matRef.current.uniforms.aN.value = d.aN;
      matRef.current.uniforms.f0.value = d.f0;
      matRef.current.uniforms.fN.value = d.fN;
      matRef.current.uniforms.nrOfLayers.value = d.nrOfLayers;
    },
  });

  useOnValueChange("texture1", (texture) => {
    if (!matRef.current) return;
    matRef.current.uniforms.texture1.value = new THREE.TextureLoader().load(
      texture
    );
  });

  useOnValueChange("texture2", (texture) => {
    if (!matRef.current) return;
    matRef.current.uniforms.texture2.value = new THREE.TextureLoader().load(
      texture
    );
  });

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75, // fov
      window.innerWidth / window.innerHeight, // aspect
      0.1, // near
      1000 // far
    );
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    ref.current?.appendChild(renderer.domElement);

    const { vertices, triangles, uvs } = createPlane({
      quadSize,
      segs,
      heightMap: hmRef,
    });
    const vertexBuffer = new Float32Array(vertices);
    const uvBuffer = new Float32Array(uvs);
    const triangleBuffer = new Uint32Array(triangles);

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(vertexBuffer, 3)
    );
    geometry.setAttribute("uv", new THREE.BufferAttribute(uvBuffer, 2));
    geometry.setIndex(new THREE.BufferAttribute(triangleBuffer, 1));
    geoRef.current = geometry;
    geometry.computeVertexNormals();

    const material = new THREE.ShaderMaterial({
      glslVersion: THREE.GLSL3,
      uniforms: {
        texture1: {
          value: new THREE.TextureLoader().load(initialValue.texture1),
        },
        texture2: {
          value: new THREE.TextureLoader().load(initialValue.texture2),
        },
        tileSize: { value: initialValue.tileSize },
        a0: { value: initialValue.a0 },
        aN: { value: initialValue.aN },
        f0: { value: initialValue.f0 },
        fN: { value: initialValue.fN },
        nrOfLayers: { value: initialValue.nrOfLayers },
      },
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      wireframe: false,
      wireframeLinewidth: 2,
    });

    matRef.current = material;

    const plane = new THREE.Mesh(geometry, material);
    scene.add(plane);

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
    const animate = () => {
      requestAnimationFrame(animate);
      material.uniforms.time = { value: performance.now() / 1000 };
      plane.rotateY(0.001);
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      ref.current?.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, [ref]);

  return (
    <div className="w-full h-full absolute">
      <div className="absolute top-0 left-0 p-3 bg-gray-100 z-10 flex flex-col items-stretch">
        <ul>
          <DatasetRangeInput
            label="Tile size"
            min={0.1}
            max={10}
            step={0.1}
            {...register("tileSize")}
          />
          <DatasetRangeInput
            label="Nr of layers"
            min={1}
            max={6}
            step={1}
            {...register("nrOfLayers")}
          />
          <DatasetRangeInput
            label="a0"
            min={0}
            max={20}
            step={0.01}
            {...register("a0")}
          />
          <DatasetRangeInput
            label="aN"
            min={0}
            max={20}
            step={0.01}
            {...register("aN")}
          />
          <DatasetRangeInput
            label="f0"
            min={0.1}
            max={3}
            step={0.01}
            {...register("f0")}
          />
          <DatasetRangeInput
            label="fN"
            min={1}
            max={3}
            step={0.01}
            {...register("fN")}
          />
          <ImageArrayInput
            label="Texture"
            {...register("texture1")}
            data={[grass, ice, snow, stone]}
          />
          <ImageArrayInput
            label="Texture"
            {...register("texture2")}
            data={[grass, ice, snow, stone]}
          />
        </ul>
      </div>
      <div className="absolute top-0 left-0" ref={ref} />
    </div>
  );
}

export default App;
