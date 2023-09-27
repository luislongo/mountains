import * as THREE from "three";
import vertexShader from "./assets/shaders/vertexShader.glsl?raw";
import fragmentShader from "./assets/shaders/fragmentShader.glsl?raw";

export type CreatePlaneParams = {
  triangles: number[];
  uvs: number[];
  uniforms: {
    texture1: string;
    texture2: string;
    tileSize: number;
    a0: number;
    aN: number;
    f0: number;
    fN: number;
    nrOfLayers: number;
  };
};

export const createPlane = ({
  triangles,
  uvs,
  uniforms,
}: CreatePlaneParams) => {
  const uvBuffer = new Float32Array(uvs);
  const triangleBuffer = new Uint32Array(triangles);

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("uv", new THREE.BufferAttribute(uvBuffer, 2));
  geometry.setIndex(new THREE.BufferAttribute(triangleBuffer, 1));
  geometry.computeVertexNormals();

  const material = new THREE.ShaderMaterial({
    glslVersion: THREE.GLSL3,
    uniforms: {
      texture1: {
        value: new THREE.TextureLoader().load(uniforms.texture1),
      },
      texture2: {
        value: new THREE.TextureLoader().load(uniforms.texture2),
      },
      tileSize: { value: uniforms.tileSize },
      a0: { value: uniforms.a0 },
      aN: { value: uniforms.aN },
      f0: { value: uniforms.f0 },
      fN: { value: uniforms.fN },
      nrOfLayers: { value: uniforms.nrOfLayers },
    },
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    wireframe: false,
    wireframeLinewidth: 2,
  });

  const plane = new THREE.Mesh(geometry, material);

  return {
    plane,
    material,
    geometry,
  };
};
