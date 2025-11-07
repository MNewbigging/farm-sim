import * as THREE from "three";
import cropVS from "./crop-material.vs";
import cropFS from "./crop-material.fs";

interface CropMaterialParameters {
  color: THREE.Color;
}

interface CropMaterialUniforms {
  growth: THREE.IUniform<number>; // normalised to 0-1
  cropColor: THREE.IUniform<THREE.Color>;
  elapsed: THREE.IUniform<number>;
}

export class CropMaterial extends THREE.ShaderMaterial {
  // @ts-expect-error narrower than parent
  declare uniforms: CropMaterialUniforms;

  constructor(params: CropMaterialParameters) {
    super({
      glslVersion: THREE.GLSL3,
      vertexShader: cropVS,
      fragmentShader: cropFS,
      uniforms: {
        growth: { value: 1 },
        cropColor: { value: params.color },
        elapsed: { value: 0 },
      },
      side: THREE.DoubleSide,
    });
  }
}
