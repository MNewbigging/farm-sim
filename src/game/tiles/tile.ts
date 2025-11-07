import * as THREE from "three";

export abstract class Tile extends THREE.Mesh {
  readonly rowIndex: number;
  readonly colIndex: number;

  readonly soilQuality: number;
  readonly aridness: number;

  declare material: THREE.Material;

  constructor(
    geometry: THREE.BufferGeometry,
    material: THREE.Material,
    rowIndex: number,
    colIndex: number
  ) {
    super(geometry, material);

    this.rowIndex = rowIndex;
    this.colIndex = colIndex;

    // temp
    this.soilQuality = 1;
    this.aridness = 0;
  }

  dispose(): void {
    this.geometry.dispose();
    this.material.dispose();
  }
}

export enum TileEdge {
  Down, // default
  Left,
  Up,
  Right,
}

export function nextTileEdge(curEdge: TileEdge) {
  const edges = [TileEdge.Down, TileEdge.Left, TileEdge.Up, TileEdge.Right];

  if (curEdge + 1 < edges.length) {
    return edges[curEdge + 1];
  } else {
    return TileEdge.Down;
  }
}

export interface TileNeighbours {
  upLeft?: Tile;
  up?: Tile;
  upRight?: Tile;
  right?: Tile;
  downRight?: Tile;
  down?: Tile;
  downLeft?: Tile;
  left?: Tile;
}
