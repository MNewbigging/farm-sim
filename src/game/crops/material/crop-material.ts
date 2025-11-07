import * as THREE from "three";
import cropVS from "./crop-material.vs";
import cropFS from "./crop-material.fs";

interface CropMaterialUniforms {
  growth: THREE.IUniform<number>; // normalised to 0-1
}

export class CropMaterial extends THREE.ShaderMaterial {
  // @ts-expect-error narrower than parent
  declare uniforms: CropMaterialUniforms;

  constructor() {
    super({
      glslVersion: THREE.GLSL3,
      vertexShader: cropVS,
      fragmentShader: cropFS,
      uniforms: {
        growth: { value: 1 },
      },
      side: THREE.DoubleSide,
    });
  }
}
