uniform float growth;
uniform float elapsed;

// temp
out vec3 vSunDirection;
out vec3 vNormalFront;
out vec3 vNormalBack;
out vec3 vPosition;
out vec3 vViewPosition;

vec3 rotateVector(vec3 v, vec3 axis, float angle) {
    // Axis must be normalized
  axis = normalize(axis);

  float cosA = cos(angle);
  float sinA = sin(angle);

  return v * cosA + cross(axis, v) * sinA + axis * dot(axis, v) * (1.0 - cosA);
}

//	Classic Perlin 2D Noise
//	by Stefan Gustavson (https://github.com/stegu/webgl-noise)
//
vec2 fade(vec2 t) {
  return t * t * t * (t * (t * 6.0 - 15.0) + 10.0);
}

vec4 permute(vec4 x) {
  return mod(((x * 34.0) + 1.0) * x, 289.0);
}

float cnoise(vec2 P) {
  vec4 Pi = floor(P.xyxy) + vec4(0.0, 0.0, 1.0, 1.0);
  vec4 Pf = fract(P.xyxy) - vec4(0.0, 0.0, 1.0, 1.0);
  Pi = mod(Pi, 289.0); // To avoid truncation effects in permutation
  vec4 ix = Pi.xzxz;
  vec4 iy = Pi.yyww;
  vec4 fx = Pf.xzxz;
  vec4 fy = Pf.yyww;
  vec4 i = permute(permute(ix) + iy);
  vec4 gx = 2.0 * fract(i * 0.0243902439) - 1.0; // 1/41 = 0.024...
  vec4 gy = abs(gx) - 0.5;
  vec4 tx = floor(gx + 0.5);
  gx = gx - tx;
  vec2 g00 = vec2(gx.x, gy.x);
  vec2 g10 = vec2(gx.y, gy.y);
  vec2 g01 = vec2(gx.z, gy.z);
  vec2 g11 = vec2(gx.w, gy.w);
  vec4 norm = 1.79284291400159 - 0.85373472095314 *
    vec4(dot(g00, g00), dot(g01, g01), dot(g10, g10), dot(g11, g11));
  g00 *= norm.x;
  g01 *= norm.y;
  g10 *= norm.z;
  g11 *= norm.w;
  float n00 = dot(g00, vec2(fx.x, fy.x));
  float n10 = dot(g10, vec2(fx.y, fy.y));
  float n01 = dot(g01, vec2(fx.z, fy.z));
  float n11 = dot(g11, vec2(fx.w, fy.w));
  vec2 fade_xy = fade(Pf.xy);
  vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
  float n_xy = mix(n_x.x, n_x.y, fade_xy.y);
  return 2.3 * n_xy;
}

const float noiseScale0 = 0.1;
const float noiseAmplitude0 = 0.3;
const float noiseScale1 = 0.8;
const float noiseAmplitude1 = 0.033;
const float windSpeed = 0.5;

// float getNoiseAt(in vec3 pos) {

// }

void main() {

  // TEMP
  vec3 transformedNormal = normalize(vec3(0.0, 0.0, 1.0));

  mat3 im = mat3(instanceMatrix);
  transformedNormal /= vec3(dot(im[0], im[0]), dot(im[1], im[1]), dot(im[2], im[2]));
  transformedNormal = im * transformedNormal;

  vNormalFront = normalMatrix * transformedNormal;
  vNormalBack = normalMatrix * (transformedNormal * vec3(-1.0, 1.0, -1.0));

  vSunDirection = vec3(normalize(viewMatrix * vec4(0.5, 0.5, 0.5, 0.0)));
  // ====

  vec3 transformed = position * growth;
  vPosition = transformed;

  float rotationFactor = max(0.0, transformed.y - 0.5) * 0.1;
  transformed = rotateVector(transformed, vec3(1.0, 0.0, 0.0), rotationFactor);

  // add noise
  vec4 worldPosition = modelMatrix * instanceMatrix * vec4(transformed, 1.0);
  float noise0 = cnoise((worldPosition.xz * noiseScale0) + elapsed * windSpeed) * pow(transformed.y, 2.0) * noiseAmplitude0;
  float noise1 = cnoise((worldPosition.xz * noiseScale1) + elapsed * windSpeed) * pow(transformed.y, 2.0) * noiseAmplitude1;
  //worldPosition.xz += (noise0 + noise1);

  mat4 p_LW = inverse(mat4(modelMatrix * instanceMatrix));
  vec3 windDirection = vec3(p_LW * vec4(-1.0, 0.0, 0.0, 0.0));
  float windRotationFactor = (noise0 + noise1) * pow(transformed.y, 0.25);

  transformed = rotateVector(transformed, windDirection, windRotationFactor);
  worldPosition = modelMatrix * instanceMatrix * vec4(transformed, 1.0);

  vViewPosition = vec3(viewMatrix * worldPosition);

  gl_Position = projectionMatrix * viewMatrix * worldPosition;
}