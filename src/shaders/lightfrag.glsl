uniform float time;
uniform float progress;
uniform sampler2D matcap;
uniform sampler2D matcap2;
uniform vec4 resolution;
uniform vec3 light;
varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;
varying vec3 vView;
varying vec3 vWorld;



float getScatter(vec3 campos, vec3 dir, vec3 lightpos, float dist){
    vec3 q = campos - lightpos;

    float b = dot(dir, q);
    float c = dot(q, q);

    float t = c- b*b;
    float s = 1./sqrt(max(0.0001,t));
    float l = s*(atan((dist+b)*s) - atan(b*s));

    return pow(max(0., l/15.), 0.4);
}

void main(){
    // lighting
    vec3 camtwo = vWorld- cameraPosition;
    vec3 ctwd = normalize(camtwo);
    float cmtwdist = length(camtwo);

    vec3 lightdir = normalize(light - vWorld);
    float diff = max(0.,dot(vNormal, lightdir));
    float dist = length(light -vPosition);

    float scatter = getScatter(cameraPosition,camtwo, light, cmtwdist);

    // // gl_FragColor = color1;
    // gl_FragColor = vec4(scatter,0.,0.,1.);

    vec3 luminanceVector = vec3(0.2125, 0.7154, 0.0721);
    vec4 c = texture2D(matcap, light.xy)*1.8;

    float luminance = dot(luminanceVector, c.xyz);
    luminance = max(0.0, luminance - 0.05);
    c.xyz *= sign(luminance);
    c.a = 1.;

    gl_FragColor = c+scatter;
}



