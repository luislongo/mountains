varying vec3 vNormal;
varying vec2 vUv;
out vec4 fragColor;
uniform sampler2D texture1;
uniform sampler2D texture2;

void main() {
float normalUpDot = dot(vNormal, vec3(0, 1, 0)) ;

if (normalUpDot < 0.1) {
    fragColor = texture(texture1, vUv);
} else {
    fragColor = texture(texture2, vUv);
}
}