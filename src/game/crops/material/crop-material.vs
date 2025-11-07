uniform float growth;

// temp
out vec3 vSunDirection;
out vec3 vNormal;
out vec3 vPosition;

vec3 rotateVector(vec3 v, vec3 axis, float angle) {
    // Axis must be normalized
  axis = normalize(axis);

  float cosA = cos(angle);
  float sinA = sin(angle);

  return v * cosA + cross(axis, v) * sinA + axis * dot(axis, v) * (1.0 - cosA);
}

void main() {

  // TEMP
  vec3 transformedNormal = normalize(vec3(0.0, 1.0, 0.2));

  mat3 im = mat3(instanceMatrix);
  transformedNormal /= vec3(dot(im[0], im[0]), dot(im[1], im[1]), dot(im[2], im[2]));
  transformedNormal = im * transformedNormal;
  transformedNormal = normalMatrix * transformedNormal;
  vNormal = transformedNormal;

  vSunDirection = vec3(normalize(viewMatrix * vec4(0.5, 0.5, 0.5, 0.0)));
  // ====

  vec3 transformed = position * growth;
  vPosition = transformed;

  float rotationFactor = max(0.0, transformed.y - 0.5) * 0.1;
  transformed = rotateVector(transformed, vec3(1.0, 0.0, 0.0), rotationFactor);
  // transformed.x *= 1.0 + max(0.0, pow(growth * transformed.y, 5.));

  gl_Position = projectionMatrix * modelViewMatrix * instanceMatrix * vec4(transformed, 1.0);
}