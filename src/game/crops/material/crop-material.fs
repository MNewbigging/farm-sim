uniform vec3 cropColor;
uniform float growth;

out vec4 pc_fragColor;

// temp
in vec3 vSunDirection;
in vec3 vNormal;
in vec3 vPosition;

const vec3 growingColour = vec3(0.11, 0.2, 0.01);

void main() {
  // // TEMP 
  // vec3 normal = vNormal;
  // float faceDirection = gl_FrontFacing ? 1.0 : -1.0;
  // normal *= faceDirection;

  float dotP = dot(vNormal, vSunDirection);
  dotP = clamp(dotP, 0.0, 1.0);

  vec3 color = mix(growingColour, cropColor, growth);
  color = mix(growingColour, cropColor, vPosition.y);

  color *= dotP;

  pc_fragColor = vec4(color, 1.0);
}