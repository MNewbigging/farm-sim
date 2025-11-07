import { Crop } from "../../crops/crop";
import { Tile } from "../tile";
import * as THREE from "three";

export class CropTile extends Tile {
  crop?: Crop; // hmm, should this be optional?

  constructor(rowIndex: number, colIndex: number) {
    const geometry = new THREE.PlaneGeometry().rotateX(Math.PI * -0.5);
    const material = new THREE.MeshStandardMaterial();

    super(geometry, material, rowIndex, colIndex);
  }

  update(dt: number) {
    this.crop?.grow(dt);
  }

  dispose(): void {
    throw new Error("Method not implemented.");
  }

  harvest(): number | undefined {
    return this.crop?.harvest();
  }
}
