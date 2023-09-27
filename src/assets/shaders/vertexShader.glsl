varying vec3 vNormal;
varying vec2 vUv;
uniform float tileSize;

void main() {
gl_Position = projectionMatrix * modelViewMatrix * vec4(tileSize * uv.x, 0, tileSize * uv.y, 1.f);
vNormal = normal;
vUv = uv;
}