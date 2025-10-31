import * as THREE from "three";

export abstract class Tile extends THREE.Mesh {
  abstract readonly rowIndex: number;
  abstract readonly colIndex: number;

  abstract dispose(): void;
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
