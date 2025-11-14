import { CropTile } from "../tiles/crop-tile/crop-tile";
import { GrassWithLeavesTile } from "../tiles/grass-tile/grass-tile";
import { Tile } from "../tiles/tile";
import { WorldManager } from "../world-manager";
import { BuildCursor } from "./build-cursor";
import { BuildItemPlacer } from "./build-item-mode";

export class CropPlacer implements BuildItemPlacer {
  constructor(private readonly worldManager: WorldManager) {}

  adjustCursor(cursor: BuildCursor) {
    cursor.scale.set(1, 1, 1);
  }

  isTileValid(tile: Tile): boolean {
    return tile instanceof GrassWithLeavesTile;
  }

  onPlace(tile: Tile) {
    const cropTile = new CropTile(tile.rowIndex, tile.colIndex);

    this.worldManager.replaceTile(cropTile);
  }

  onStop?: (() => void) | undefined;
}
