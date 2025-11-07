import { Crop } from "../../crops/crop";
import { Wheat } from "../../crops/wheat";
import { Tile } from "../tile";
import * as THREE from "three";

export class CropTile extends Tile {
  private _crop?: Crop; // hmm, should this be optional?

  constructor(rowIndex: number, colIndex: number) {
    const geometry = new THREE.PlaneGeometry().rotateX(Math.PI * -0.5);
    const material = new THREE.MeshStandardMaterial({
      color: new THREE.Color(0.05, 0.025, 0.0),
    });

    super(geometry, material, rowIndex, colIndex);

    // TEMP
    this._crop = new Wheat(0, 1);
    this.add(this._crop);
  }

  setCrop() {
    // todo
  }

  update(dt: number) {
    this._crop?.grow(dt);
  }

  dispose(): void {
    throw new Error("Method not implemented.");
  }

  harvest(): number | undefined {
    return this._crop?.harvest();
  }
}
