varying vec3 vNormal;
varying vec2 vUv;
uniform float tileSize;
uniform float a0;
uniform float aN;
uniform float f0;
uniform float fN;
uniform int nrOfLayers;

float calcHeight(vec2 coords) {
    float height = 0.f;
    float a = a0;
    float f = f0;
    for (int i = 0; i < nrOfLayers; i++) {
        height = height + a * sin(coords.x / f) + a * cos(coords.y / f);
        a = a / aN;
        f = f / fN;
    }
    return height;
}

vec3 calcTangent(vec2 coords) {
    float dx = 0.01f;
    float dz = 0.01f;

    float heightL = calcHeight(coords + vec2(-dx, 0.f));
    float heightR = calcHeight(coords + vec2(dx, 0.f));
    float heightF = calcHeight(coords + vec2(0.f, -dz));
    float heightB = calcHeight(coords + vec2(0.f, dz));
    
    float dydx = (heightR - heightL) / (2.f * dx);
    float dydz = (heightB - heightF) / (2.f * dz);

    vec3 dyd = normalize(vec3(
        dydx,
        dydx * dydx + dydz * dydz,
        dydz
    ));

    return dyd;
}

vec3 calcNormal(vec2 coords) {
    vec3 tangent = calcTangent(coords);
    vec3 bitangent = cross(vec3(0.f, 1.f, 0.f), tangent);
    vec3 normal = cross(tangent, bitangent);
    return normalize(normal);
}

void main() {
    gl_Position = projectionMatrix * modelViewMatrix * vec4(tileSize * uv.x, calcHeight(uv), tileSize * uv.y, 1.f);
    vNormal = calcNormal(uv);
    vUv = uv;
}