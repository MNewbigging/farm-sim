import * as THREE from "three";

export abstract class Crop extends THREE.InstancedMesh {
  protected timeElapsed = 0;
  protected abstract timeToGrow: number;

  protected maxYield: number;
  protected abstract aridPreference: number;
  protected tileAridness: number;

  constructor(
    geometry: THREE.BufferGeometry,
    material: THREE.Material,
    instanceCount: number,
    tileAridness: number,
    tileSoilQuality: number,
    cropYield: number
  ) {
    super(geometry, material, instanceCount);

    this.tileAridness = tileAridness;
    this.maxYield = cropYield * tileSoilQuality;
  }

  grow(dt: number) {
    if (this.timeElapsed === this.timeToGrow) return; // maybe we should have some notion of decay after fully grown...

    // growth speed is the inverse of the distance to the ideal aridness
    const growthSpeedFactor = Math.abs(
      1 - this.aridPreference - this.tileAridness
    );

    this.timeElapsed += dt * growthSpeedFactor;
    this.timeElapsed = Math.min(this.timeElapsed, this.timeToGrow); // cap
  }

  harvest(): number {
    return this.maxYield * (this.timeElapsed / this.timeToGrow);
  }
}
