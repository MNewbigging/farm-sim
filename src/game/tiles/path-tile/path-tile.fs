struct Material {
  sampler2D diffuse;
  sampler2D normal;
};

uniform Material materialA;
uniform Material materialB;

in vec2 vUv;
in float pathBlend;

layout(location = 0) out vec4 pc_fragColor;

void main() {
  vec4 texelA = texture(materialA.diffuse, vUv);
  vec4 texelB = texture(materialB.diffuse, vUv);

  vec3 normalA = texture(materialA.normal, vUv).xzy * 2.0 - 1.0; // temp swizzle and unpack
  vec3 normalB = texture(materialB.normal, vUv).xzy * 2.0 - 1.0; // temp swizzle and unpack

  vec4 color = mix(texelA, texelB, pathBlend);
  vec3 normal = mix(normalA, normalB, pathBlend);

  // temp lighting
  vec3 sunDir_W = normalize(vec3(1.0, 0.5, 1.0));
  float dotP = dot(normal, sunDir_W);
  dotP = clamp(dotP, 0.0, 1.0);

  color *= dotP;

  pc_fragColor = vec4(color.xyz, 1.0);
}
