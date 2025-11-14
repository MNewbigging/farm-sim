import { GrassWithLeavesTile } from "../tiles/grass-tile/grass-tile";
import { Tile } from "../tiles/tile";
import { BuildItemPlacer } from "./build-tile-mode";

export class CabinPlacer implements BuildItemPlacer {
  isTileValid(tile: Tile) {
    return tile instanceof GrassWithLeavesTile;
  }

  onPlace(tile: Tile) {
    // This expects a single tile back so that the buid tile mode can run the highlight check on it
    // But this item spans multiple tiles...
    // Need to change from outlining a single tile to a placement cursor system
  }
}
