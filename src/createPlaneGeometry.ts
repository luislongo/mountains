type CreatePlaneParams = {
  segs: number;
};

export const createPlaneGeometry = ({ segs }: CreatePlaneParams) => {
  const triangles: number[] = [];
  const uvs: number[] = [];

  for (let i = 0; i < segs + 1; i++) {
    for (let j = 0; j < segs + 1; j++) {
      uvs.push(i / segs, j / segs);
    }
  }

  for (let i = 0; i < segs; i++) {
    for (let j = 0; j < segs; j++) {
      const a = i * (segs + 1) + j;
      const b = a + segs + 1;
      const c = b + 1;
      const d = a + 1;

      triangles.push(a, c, b);
      triangles.push(c, a, d);
    }
  }

  return {
    triangles,
    uvs,
  };
};
