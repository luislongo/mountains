import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { hm } from "./HeightMap";
import { createPlane } from "./createPlane";
import { useDataset } from "./hooks/useDataset/useDataset";
import "./index.css";
import { VectorInput } from "./VectorInput";

const loader = new THREE.TextureLoader();

function App() {
  const ref = useRef<HTMLDivElement>(null);
  const geoRef = useRef<THREE.BufferGeometry>();
  const matRef = useRef<THREE.MeshPhongMaterial>();

  const { register, useOnValueChange } = useDataset<{
    a0: string;
    aN: string;
    f0: string;
    fN: string;
    nrOfLayers: string;
    texture?: File;
    vector: { x: number; y: number };
  }>({
    initialValue: {
      a0: "1",
      aN: "1",
      f0: "1",
      fN: "1",
      nrOfLayers: "1",
      vector: { x: 0, y: 0 },
    },
    onChange: (dataset) => {
      hm.setA0(Number(dataset.a0));
      hm.setAN(Number(dataset.aN));
      hm.setF0(Number(dataset.f0));
      hm.setFN(Number(dataset.fN));
      hm.setNrOfLayers(Number(dataset.nrOfLayers));

      const { vertices } = createPlane({
        quadSize: 10 / 20,
        segs: 30,
      });
      const vertexBuffer = new Float32Array(vertices);

      geoRef.current?.setAttribute(
        "position",
        new THREE.BufferAttribute(vertexBuffer, 3)
      );

      geoRef.current?.computeVertexNormals();
    },
  });

  useOnValueChange("texture", (texture) => {
    if (texture && matRef.current) {
      matRef.current.map?.dispose();
      matRef.current.map = loader.load(URL.createObjectURL(texture));
      matRef.current.needsUpdate = true;
    }
  });

  useOnValueChange("vector", (vector) => {
    console.log("vector", vector);
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

    const size = 10;

    const { vertices, triangles, uvs } = createPlane({
      quadSize: size / 40,
      segs: 30,
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

    const material = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      side: THREE.DoubleSide,
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

    const animate = () => {
      requestAnimationFrame(animate);
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
      <div className="absolute top-0 left-0 p-4 bg-red-50 z-10">
        <ul>
          <li>
            <p>Nr of layers</p>
            <input
              type="range"
              min={1}
              max={30}
              step={1}
              {...register("nrOfLayers", (e) => e.target.value)}
            />
          </li>
          <li>
            <p>a0</p>
            <input
              type="range"
              min={0}
              max={20}
              step={0.01}
              {...register("a0", (e) => e.target.value)}
            />
          </li>
          <li>
            <p>aN</p>
            <input
              type="range"
              min={0}
              max={40}
              step={0.01}
              {...register("aN", (e) => e.target.value)}
            />
          </li>
          <li>
            <p>f0</p>
            <input
              type="range"
              min={0}
              max={30}
              step={0.01}
              {...register("f0", (e) => e.target.value)}
            />
          </li>
          <li>
            <p>fN</p>
            <input
              type="range"
              min={0}
              max={3}
              step={0.01}
              {...register("fN", (e) => e.target.value)}
            />
          </li>
          <li>
            <p>h0</p>
            <input
              type="file"
              accept="image/png"
              {...register(
                "texture",
                (e) => e.target.files?.[0],
                () => ""
              )}
            />
          </li>
          <li>
            <VectorInput {...register("vector", (e) => ({ x: e.x, y: e.y }))} />
          </li>
        </ul>
      </div>
      <div className="absolute top-0 left-0" ref={ref} />
    </div>
  );
}

export default App;
