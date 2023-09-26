/* eslint-disable no-prototype-builtins */
"use strict";
export const perlin = {
  gradients: {} as Record<string, { x: number; y: number }>,
  memory: {} as Record<string, number>,
  rand_vect: function () {
    const theta = Math.random() * 2 * Math.PI;
    return { x: Math.cos(theta), y: Math.sin(theta) };
  },
  dot_prod_grid: function (x: number, y: number, vx: number, vy: number) {
    let g_vect;
    const d_vect = { x: x - vx, y: y - vy };
    if (this.gradients[`${vx},${vy}`]) {
      g_vect = this.gradients[`${vx},${vy}`];
    } else {
      g_vect = this.rand_vect();
      this.gradients[`${vx},${vy}`] = g_vect;
    }
    return d_vect.x * g_vect.x + d_vect.y * g_vect.y;
  },
  smootherstep: function (x: number) {
    return 6 * x ** 5 - 15 * x ** 4 + 10 * x ** 3;
  },
  interp: function (x: number, a: number, b: number) {
    return a + this.smootherstep(x) * (b - a);
  },
  seed: function () {
    this.gradients = {};
    this.memory = {};
  },
  get: function (x: number, y: number) {
    if (this.memory.hasOwnProperty(`${x},${y}`))
      return this.memory[`${x},${y}`];
    const xf = Math.floor(x);
    const yf = Math.floor(y);
    //interpolate
    const tl = this.dot_prod_grid(x, y, xf, yf);
    const tr = this.dot_prod_grid(x, y, xf + 1, yf);
    const bl = this.dot_prod_grid(x, y, xf, yf + 1);
    const br = this.dot_prod_grid(x, y, xf + 1, yf + 1);
    const xt = this.interp(x - xf, tl, tr);
    const xb = this.interp(x - xf, bl, br);
    const v = this.interp(y - yf, xt, xb);
    this.memory[`${x},${y}`] = v;

    return v;
  },
};
perlin.seed();
