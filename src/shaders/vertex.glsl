uniform float time;
varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;
varying vec3 vView;
varying vec3 vWorld;
uniform vec2 pixels;

void main(){
    vec4 transformed = modelViewMatrix * vec4(position, 1.0);
    vView = normalize(-transformed.xyz);

    vUv = uv;
    vNormal = normal;
    vPosition = position;
    vWorld = (transformed).xyz;
    
    gl_Position = projectionMatrix * transformed;
}