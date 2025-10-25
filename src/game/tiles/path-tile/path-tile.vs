in float pathAttribute;

out float pathBlend;
out vec2 vUv;

void main() {
  pathBlend = pathAttribute;
  vUv = uv;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
