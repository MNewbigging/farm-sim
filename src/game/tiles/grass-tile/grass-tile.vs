out vec4 vWorldPosition;
out vec2 vUv;

void main() {

  vWorldPosition = modelMatrix * vec4(position, 1.0);

  vUv = uv;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}