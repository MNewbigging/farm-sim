import * as THREE from "three";

export abstract class Tile extends THREE.Mesh {
  abstract readonly rowIndex: number;
  abstract readonly colIndex: number;
}
