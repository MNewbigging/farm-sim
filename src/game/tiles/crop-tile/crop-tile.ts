import { Crop } from "../../crops/crop";
import { Wheat } from "../../crops/wheat";
import { cnoise } from "../../noise";
import { Tile } from "../tile";
import * as THREE from "three";

export class CropTile extends Tile {
  private _crop?: Crop; // hmm, should this be optional?

  constructor(rowIndex: number, colIndex: number) {
    const geometry = new THREE.PlaneGeometry().rotateX(Math.PI * -0.5);

    const scale = 0.33;
    const aridness =
      cnoise(new THREE.Vector2(rowIndex * scale, colIndex * scale)) * 0.5 + 0.5; // [0:1] range

    const color = new THREE.Color(0.03, 0.015, 0.0).lerp(
      new THREE.Color(0.05, 0.03, 0),
      aridness
    );

    const material = new THREE.MeshStandardMaterial({
      color,
    });

    super(geometry, material, rowIndex, colIndex);

    // TEMP
    const cropYieldFactor = 1.0;
    this._crop = new Wheat(aridness, cropYieldFactor);
    this.add(this._crop);
    //
  }

  setCrop() {
    // todo
  }

  update(dt: number, elapsed: number) {
    this._crop?.update(dt, elapsed);
  }

  dispose(): void {
    throw new Error("Method not implemented.");
  }

  harvest(): number | undefined {
    return this._crop?.harvest();
  }
}
