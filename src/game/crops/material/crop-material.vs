uniform float growth;

// temp
out vec3 vSunDirection;
out vec3 vNormal;

void main() {

  // TEMP
  vec3 transformedNormal = normalize(vec3(0.0, 1.0, 0.1));

  mat3 im = mat3(instanceMatrix);
  transformedNormal /= vec3(dot(im[0], im[0]), dot(im[1], im[1]), dot(im[2], im[2]));
  transformedNormal = im * transformedNormal;
  transformedNormal = normalMatrix * transformedNormal;
  vNormal = transformedNormal;

  vSunDirection = vec3(normalize(viewMatrix * vec4(0.5, 0.5, 0.5, 0.0)));
  // ====

  vec3 transformed = position * growth;

  gl_Position = projectionMatrix * modelViewMatrix * instanceMatrix * vec4(transformed, 1.0);
}