struct Material {
  sampler2D diffuse;
  sampler2D normal;
};

uniform Material materialA;
uniform Material materialB;

in vec2 vUv;
in float pathBlend;

in mat3 TBN;
flat in vec3 vSunDirection;

layout(location = 0) out vec4 pc_fragColor;

void main() {
  vec4 texelA = texture(materialA.diffuse, vUv);
  vec4 texelB = texture(materialB.diffuse, vUv);

  vec3 normalA = texture(materialA.normal, vUv).xyz * 2.0 - 1.0;
  vec3 normalB = texture(materialB.normal, vUv).xyz * 2.0 - 1.0;

  vec4 color = mix(texelA, texelB, pathBlend);
  vec3 normal = normalize(TBN * mix(normalA, normalB, pathBlend));

  // temp lighting
  float dotP = dot(normal, vSunDirection);
  dotP = clamp(dotP, 0.0, 1.0);

  color *= dotP;

  pc_fragColor = vec4(color.xyz, 1.0);
}
