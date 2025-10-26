import * as THREE from "three";
import { AssetManager } from "../asset-manager";
import { PathTile } from "../tiles/path-tile/path-tile";
import { Tile } from "../tiles/tile";
import { BuildItemPlacer } from "./build-item-behaviour";

export class PathTilePlacer implements BuildItemPlacer {
  constructor(
    private scene: THREE.Scene,
    private assetManager: AssetManager,
    private groundTiles: Tile[][],
  ) {}

  isTileValid(tile: Tile) {
    return true;
  }

  onPlace(tile: Tile) {
    // Don't replace path with path
    if (tile instanceof PathTile) return;

    // Remove this tile and replace with path tile
    const path = new PathTile(tile.rowIndex, tile.colIndex, this.assetManager);

    path.position.copy(tile.position);

    this.scene.remove(tile);
    tile.dispose();

    this.groundTiles[tile.rowIndex][tile.colIndex] = path;
    this.scene.add(path);

    this.updatePathConnections(path);
  }

  private updatePathConnections(pathTile: PathTile) {
    const { rowIndex, colIndex } = pathTile;

    const upTile =
      rowIndex - 1 >= 0 ? this.groundTiles[rowIndex - 1][colIndex] : undefined;
    if (upTile instanceof PathTile) {
      upTile.connectDown();
      pathTile.connectUp();
    }

    const downTile =
      rowIndex + 1 < this.groundTiles.length
        ? this.groundTiles[rowIndex + 1][colIndex]
        : undefined;
    if (downTile instanceof PathTile) {
      downTile.connectUp();
      pathTile.connectDown();
    }

    const leftTile =
      colIndex - 1 >= 0 ? this.groundTiles[rowIndex][colIndex - 1] : undefined;
    if (leftTile instanceof PathTile) {
      leftTile.connectRight();
      pathTile.connectLeft();
    }

    const rightTile =
      colIndex + 1 < this.groundTiles[0].length
        ? this.groundTiles[rowIndex][colIndex + 1]
        : undefined;
    if (rightTile instanceof PathTile) {
      rightTile.connectLeft();
      pathTile.connectRight();
    }
  }
}
