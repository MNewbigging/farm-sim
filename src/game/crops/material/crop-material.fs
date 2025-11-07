out vec4 pc_fragColor;

// temp
in vec3 vSunDirection;
in vec3 vNormal;

void main() {
  // TEMP 
  vec3 normal = vNormal;
  float faceDirection = gl_FrontFacing ? 1.0 : -1.0;
  normal *= faceDirection;

  float dotP = dot(vNormal, vSunDirection);
  dotP = clamp(dotP, 0.0, 1.0);

  pc_fragColor = vec4(vec3(dotP), 1.0);
}