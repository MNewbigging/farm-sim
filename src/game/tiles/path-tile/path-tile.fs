uniform sampler2D tDiffuseA;
uniform sampler2D tDiffuseB;

in vec2 vUv;
in float pathBlend;

layout(location = 0) out vec4 pc_fragColor;

void main() {
  vec4 texelA = texture(tDiffuseA, vUv);
  vec4 texelB = texture(tDiffuseB, vUv);

  vec4 result = mix(texelA, texelB, pathBlend);

  pc_fragColor = result;
}
