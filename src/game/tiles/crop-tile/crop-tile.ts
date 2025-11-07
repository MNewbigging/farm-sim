import { Crop } from "../../crops/crop";
import { Tile } from "../tile";
import * as THREE from "three";

export class CropTile extends Tile {
  readonly crop: Crop;

  constructor(rowIndex: number, colIndex: number, crop: Crop) {
    const geometry = new THREE.PlaneGeometry().rotateX(Math.PI * -0.5);
    const material = new THREE.MeshStandardMaterial();

    super(geometry, material, rowIndex, colIndex);

    this.crop = crop;
  }

  dispose(): void {
    throw new Error("Method not implemented.");
  }
}
