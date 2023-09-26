import { hm } from "./HeightMap";

type CreatePlaneParams = {
  segs: number;
  quadSize?: number;
};

export const createPlane = ({ segs, quadSize = 1 }: CreatePlaneParams) => {
  const triangles: number[] = [];
  const vertices: number[] = [];
  const uvs: number[] = [];

  for (let i = 0; i < segs + 1; i++) {
    for (let j = 0; j < segs + 1; j++) {
      const x = i * quadSize;
      const z = j * quadSize;

      vertices.push(x, hm.get(x, z), z);
      uvs.push(i / segs, j / segs);
    }
  }

  for (let i = 0; i < segs; i++) {
    for (let j = 0; j < segs; j++) {
      const a = i * (segs + 1) + j;
      const b = a + segs + 1;
      const c = b + 1;
      const d = a + 1;

      triangles.push(a, b, c);
      triangles.push(c, d, a);
    }
  }

  return {
    triangles,
    vertices,
    uvs,
  };
};
