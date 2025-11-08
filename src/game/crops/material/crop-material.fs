uniform vec3 cropColor;
uniform float growth;

out vec4 pc_fragColor;

// temp
in vec3 vSunDirection;
in vec3 vNormalFront;
in vec3 vNormalBack;
in vec3 vPosition;

const vec3 rootColour = vec3(0.11, 0.2, 0.01);

void main() {
  // // TEMP 
  vec3 normal = gl_FrontFacing ? vNormalFront : vNormalBack;
  // float faceDirection = gl_FrontFacing ? 1.0 : -1.0;
  // normal *= faceDirection;

  float dotP = dot(normal, vSunDirection);
  dotP = clamp(dotP, 0.0, 1.0);

  float t = pow(growth, 4.0);
  vec3 color = mix(rootColour, cropColor, t);
  color = mix(rootColour, color, vPosition.y);

  color *= dotP;

  pc_fragColor = vec4(color, 1.0);
}