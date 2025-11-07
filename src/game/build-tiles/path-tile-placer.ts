import { AssetManager } from "../asset-manager";
import { PathTile } from "../tiles/path-tile/path-tile";
import { Tile } from "../tiles/tile";
import { BuildTilePlacer } from "./build-tile-mode";
import { WorldManager } from "../world-manager";
import { GrassWithLeavesTile } from "../tiles/grass-tile/grass-tile";
import { FenceTile } from "../tiles/fence-tile/fence-tile";
import { CropTile } from "../tiles/crop-tile/crop-tile";

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
    const { upLeft, up, upRight, right, downRight, down, downLeft, left } =
      this.worldManager.getTileNeighbours(pathTile);

    if (upLeft instanceof PathTile) {
      upLeft.setConnectDownRight(true);
      pathTile.setConnectUpLeft(true);
    }

    if (up instanceof PathTile) {
      up.setConnectDown(true);
      pathTile.setConnectUp(true);
    }

    if (upRight instanceof PathTile) {
      upRight.setConnectDownLeft(true);
      pathTile.setConnectUpRight(true);
    }

    if (right instanceof PathTile) {
      right.setConnectLeft(true);
      pathTile.setConnectRight(true);
    }

    if (downRight instanceof PathTile) {
      downRight.setConnectUpLeft(true);
      pathTile.setConnectDownRight(true);
    }

    if (down instanceof PathTile) {
      down.setConnectUp(true);
      pathTile.setConnectDown(true);
    }

    if (downLeft instanceof PathTile) {
      downLeft.setConnectUpRight(true);
      pathTile.setConnectDownLeft(true);
    }

    if (left instanceof PathTile) {
      left.setConnectRight(true);
      pathTile.setConnectLeft(true);
    }
  }
}
