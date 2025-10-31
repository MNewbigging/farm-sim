in float pathAttribute;
in vec3 tangent;

out float pathBlend;
out vec2 vUv;

out mat3 TBN;
flat out vec3 vSunDirection;

void main() {
  pathBlend = pathAttribute;
  vUv = uv;

  // TBN matrix
  vec3 bitangent = cross(tangent, normal);
  vec3 T = normalize(vec3(normalMatrix * tangent));
  vec3 B = normalize(vec3(normalMatrix * bitangent));
  vec3 N = normalize(normalMatrix * normal);
  TBN = mat3(T, B, N);

  vSunDirection = vec3(viewMatrix * vec4(1.0, 0.5, 1.0, 0.0));

  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
