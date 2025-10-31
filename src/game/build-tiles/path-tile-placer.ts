import { AssetManager } from "../asset-manager";
import { PathTile } from "../tiles/path-tile/path-tile";
import { Tile } from "../tiles/tile";
import { BuildTilePlacer } from "./build-tile-mode";
import { WorldManager } from "../world-manager";
import { GrassWithLeavesTile } from "../tiles/grass-tile/grass-tile";
import { FenceTile } from "../tiles/fence-tile/fence-tile";

export class PathTilePlacer implements BuildTilePlacer {
  constructor(
    private assetManager: AssetManager,
    private worldManager: WorldManager
  ) {}

  isTileValid(tile: Tile) {
    // Fences extend grass tiles so check for that first
    if (tile instanceof FenceTile) return false;

    return tile instanceof GrassWithLeavesTile;
  }

  onPlace(tile: Tile) {
    // Remove this tile and replace with path tile
    const path = new PathTile(tile.rowIndex, tile.colIndex, this.assetManager);

    this.worldManager.replaceTile(path);

    this.updatePathConnections(path);

    return path;
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
