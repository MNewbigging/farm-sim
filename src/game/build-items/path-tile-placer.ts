import * as THREE from "three";
import { AssetManager } from "../asset-manager";
import { PathTile } from "../tiles/path-tile/path-tile";
import { Tile } from "../tiles/tile";
import { BuildItemPlacer } from "./build-item-behaviour";
import { WorldManager } from "../world-manager";

export class PathTilePlacer implements BuildItemPlacer {
  constructor(
    private assetManager: AssetManager,
    private worldManager: WorldManager
  ) {}

  isTileValid(tile: Tile) {
    return true;
  }

  onPlace(tile: Tile) {
    // Don't replace path with path
    if (tile instanceof PathTile) return;

    // Remove this tile and replace with path tile
    const path = new PathTile(tile.rowIndex, tile.colIndex, this.assetManager);

    this.worldManager.replaceTile(path);

    this.updatePathConnections(path);
  }

  private updatePathConnections(pathTile: PathTile) {
    const { rowIndex, colIndex } = pathTile;

    const { up, down, left, right } = this.worldManager.getTileNeighbours(
      rowIndex,
      colIndex
    );

    if (up instanceof PathTile) {
      up.connectDown();
      pathTile.connectUp();
    }

    if (down instanceof PathTile) {
      down.connectUp();
      pathTile.connectDown();
    }

    if (left instanceof PathTile) {
      left.connectRight();
      pathTile.connectLeft();
    }

    if (right instanceof PathTile) {
      right.connectLeft();
      pathTile.connectRight();
    }
  }
}
