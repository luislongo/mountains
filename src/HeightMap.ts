import { perlin } from "./perlin";

type NoiseLayer = {
  amplitude: number;
  frequency: number;
};

type HeightMapParams = {
  nrOfLayers: number;
  a0: number;
  f0: number;
  aN: number;
  fN: number;
};

export class HeightMap {
  layers: NoiseLayer[];
  nrOfLayers: number;
  a0: number;
  f0: number;
  aN: number;
  fN: number;

  constructor({ nrOfLayers, a0, f0, aN, fN }: HeightMapParams) {
    this.nrOfLayers = nrOfLayers;
    this.a0 = a0;
    this.f0 = f0;
    this.aN = aN;
    this.fN = fN;

    this.layers = [];
    this.updateLayers();
  }

  setA0(a0: number) {
    this.a0 = a0;
    this.updateLayers();
  }

  setF0(f0: number) {
    this.f0 = f0;
    this.updateLayers();
  }

  setAN(aN: number) {
    this.aN = aN;
    this.updateLayers();
  }

  setFN(fN: number) {
    this.fN = fN;
    this.updateLayers();
  }

  setNrOfLayers(nrOfLayers: number) {
    this.nrOfLayers = nrOfLayers;
    this.updateLayers();
  }

  get(x: number, y: number) {
    return this.layers.reduce((acc, layer) => {
      return (
        acc +
        layer.amplitude *
          (-0.5 + perlin.get(x / layer.frequency, y / layer.frequency))
      );
    }, 0);
  }

  updateLayers() {
    this.layers = [];

    let a = this.a0;
    let f = this.f0;
    for (let i = 0; i < this.nrOfLayers; i++) {
      this.layers.push({
        amplitude: a,
        frequency: f,
      });

      a = a / this.aN;
      f = f * this.fN;
    }
  }
}

export const hm = new HeightMap({
  nrOfLayers: 15,
  a0: 3,
  f0: 4,
  aN: 2.6,
  fN: 1.1,
});
