import * as THREE from "three";
import { CropMaterial } from "./material/crop-material";
import { easeOutSine } from "../utils";

export interface CropParams {
  instanceCount: number;
  cropYield: number;
  tileAridness: number;
  tileSoilQuality: number;
}

export abstract class Crop extends THREE.InstancedMesh {
  declare material: CropMaterial;

  protected timeElapsed = 0;
  protected abstract timeToGrow: number;

  protected maxYield: number;
  protected abstract aridPreference: number;
  protected tileAridness: number;

  constructor(
    geometry: THREE.BufferGeometry,
    material: CropMaterial,
    params: CropParams
  ) {
    super(geometry, material, params.instanceCount);

    this.tileAridness = params.tileAridness;
    this.maxYield = Math.floor(params.instanceCount * params.tileSoilQuality);
  }

  grow(dt: number) {
    if (this.timeElapsed === this.timeToGrow) return; // maybe we should have some notion of decay after fully grown...

    // growth speed is the inverse of the distance to the ideal aridness
    let growthSpeedFactor = Math.abs(
      1 - this.aridPreference - this.tileAridness
    );

    // make mismatching aridity more punishing?
    growthSpeedFactor = Math.pow(growthSpeedFactor, 2.0);

    this.timeElapsed += dt * growthSpeedFactor;
    this.timeElapsed = Math.min(this.timeElapsed, this.timeToGrow); // cap

    const growthAmount = this.timeElapsed / this.timeToGrow;
    this.material.uniforms.growth.value = easeOutSine(growthAmount);
  }

  harvest(): number {
    const cropYield = this.maxYield * (this.timeElapsed / this.timeToGrow);
    this.timeElapsed = 0; // start growing again

    return cropYield;
  }
}
