import * as THREE from "three";

export abstract class Tile extends THREE.Mesh {
  abstract readonly rowIndex: number;
  abstract readonly colIndex: number;

  constructor(material: THREE.Material) {
    const geometry = new THREE.PlaneGeometry().rotateX(-Math.PI / 2);
    super(geometry, material);
  }
}
