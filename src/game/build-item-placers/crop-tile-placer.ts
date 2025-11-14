import { CropTile } from "../tiles/crop-tile/crop-tile";
import { GrassWithLeavesTile } from "../tiles/grass-tile/grass-tile";
import { Tile } from "../tiles/tile";
import { WorldManager } from "../world-manager";
import { BuildItemPlacer } from "./build-tile-mode";

export class CropPlacer implements BuildItemPlacer {
  constructor(private readonly worldManager: WorldManager) {}

  isTileValid(tile: Tile): boolean {
    return tile instanceof GrassWithLeavesTile;
  }

  onPlace(tile: Tile): Tile {
    const cropTile = new CropTile(tile.rowIndex, tile.colIndex);

    this.worldManager.replaceTile(cropTile);

    return cropTile;
  }

  onStop?: (() => void) | undefined;
}
