import { useEffect, useRef } from "react";
import * as THREE from "three";
import grass from "./assets/textures/grass2.jpg";
import ice from "./assets/textures/ice.jpg";
import snow from "./assets/textures/snow.jpg";
import stone from "./assets/textures/stone.png";
import { ImageArrayInput } from "./components/atoms/ImageArrayInput/ImageArrayInput";
import { DatasetRangeInput } from "./components/atoms/RangeInput/DatasetRangeInput";
import { createPlane } from "./createPlane";
import { createPlaneGeometry } from "./createPlaneGeometry";
import { createScene } from "./createScene";
import { useDataset } from "./hooks/useDataset/useDataset";
import "./index.css";

const segs = 60;

function App() {
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
    const { scene, camera, renderer } = createScene();
    ref.current?.appendChild(renderer.domElement);

    const { triangles, uvs } = createPlaneGeometry({
      segs,
    });
    const { plane, material, geometry } = createPlane({
      triangles,
      uvs,
      uniforms: { ...initialValue },
    });

    scene.add(plane);
    geoRef.current = geometry;
    matRef.current = material;

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
