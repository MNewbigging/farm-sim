struct Normals {
  vec3 front;
  vec3 back;
};

uniform vec3 cropColor;
uniform float growth;

out vec4 pc_fragColor;

// temp
in Normals normals;
in vec3 vSunDirection;
in vec3 vPosition;
in vec3 vViewPosition;

const vec3 rootColour = vec3(0.11, 0.2, 0.01);

void main() {
  vec3 normal = normalize(gl_FrontFacing ? normals.front : normals.back);

  // diffuse
  float dotP = dot(normal, vSunDirection);
  dotP = clamp(dotP, 0.0, 1.0);

  // spec
  vec3 viewDir = normalize(vViewPosition);
  vec3 reflectDir = reflect(vSunDirection, normal);
  float spec = pow(max(dot(viewDir, reflectDir), 0.0), 32.0) * 0.5;

  float t = pow(growth, 4.0);
  vec3 color = mix(rootColour, cropColor, t);
  color = mix(rootColour, color, vPosition.y);

  vec3 final = color * (dotP + spec);

  pc_fragColor = vec4(final, 1.0);
}