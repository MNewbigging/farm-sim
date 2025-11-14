import { getRandomInRange, getRandomIntInRange, halton } from "../utils";
import { Crop } from "./crop";
import * as THREE from "three";
import { CropMaterial } from "./material/crop-material";

export class Wheat extends Crop {
  protected timeToGrow = 15;
  protected aridPreference = 0;

  constructor(tileAridness: number, tileSoilQuality: number) {
    const geometry = new THREE.PlaneGeometry(0.15, 1, 1, 4).translate(
      0,
      0.5,
      0
    );
    // const material = new THREE.MeshStandardMaterial({ side: THREE.DoubleSide });
    const material = new CropMaterial({
      color: new THREE.Color(0.95, 0.7, 0.05),
    });

    const numPlants = getRandomIntInRange(25, 45);
    super(geometry, material, {
      instanceCount: numPlants,
      cropYield: 10,
      tileAridness,
      tileSoilQuality,
    });

    const position = new THREE.Vector3();
    const rotation = new THREE.Quaternion();
    const scale = new THREE.Vector3();
    const matrix = new THREE.Matrix4();
    const halfSqrt2 = Math.sqrt(2) * 0.5;

    for (let i = 0; i < numPlants; i++) {
      const x = halton(i, 2) - 0.5;
      const z = halton(i, 3) - 0.5;

      position.set(z, 0, x); //.multiplyScalar(halfSqrt2);

      rotation.setFromAxisAngle(
        new THREE.Vector3(0, 1, 0),
        Math.random() * Math.PI * 2
      );
      scale.setScalar(getRandomInRange(0.8, 1));

      matrix.compose(position, rotation, scale);
      this.setMatrixAt(i, matrix);
    }

    this.instanceMatrix.needsUpdate = true;
  }
}
