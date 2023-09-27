varying vec3 vNormal;
varying vec2 vUv;

void main() {
gl_Position = projectionMatrix * modelViewMatrix * vec4(position.x, position.y, position.z, 1.0f);
vNormal = normal;
vUv = uv;
}