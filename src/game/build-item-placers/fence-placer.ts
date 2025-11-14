import * as THREE from "three";
import { keyboardListener } from "../../listeners/keyboard-listener";
import { AssetManager } from "../asset-manager";
import { nextTileEdge, Tile, TileEdge } from "../tiles/tile";
import { BuildItemPlacer } from "./build-item-mode";
import { GrassWithLeavesTile } from "../tiles/grass-tile/grass-tile";
import { FenceTile, makeFenceProp } from "../tiles/fence-tile/fence-tile";
import { WorldManager } from "../world-manager";
import { BuildCursor } from "./build-cursor";

export class FencePlacer implements BuildItemPlacer {
  private displayFence: THREE.Group;
  private fenceEdge: TileEdge = TileEdge.Down; // starts this way by default

  constructor(
    private scene: THREE.Scene,
    private assetManager: AssetManager,
    private worldManager: WorldManager,
    private reOutline: () => void
  ) {
    this.displayFence = makeFenceProp(assetManager);
    this.displayFence.visible = false;
    this.scene.add(this.displayFence);

    keyboardListener.on("r", this.onRotate);
  }

  adjustCursor(cursor: BuildCursor) {
    cursor.scale.set(1, 1, 1);
  }

  onStop() {
    keyboardListener.off("r", this.onRotate);
    this.scene.remove(this.displayFence);
  }

  isTileValid(tile: Tile) {
    // Fences extend grass tiles so check for those first
    if (tile instanceof FenceTile) {
      return tile.canAddFenceAtEdge(this.fenceEdge);
    }

    if (tile instanceof GrassWithLeavesTile) return true;

    return false;
  }

  onHoverTile(tile: Tile) {
    // Move the fence to the new tile
    this.displayFence.visible = true;
    this.displayFence.position.copy(tile.position);
  }

  onPlace(tile: Tile) {
    // If the tile is already a fence tile, place additional fence
    if (tile instanceof FenceTile) {
      tile.addFenceAtEdge(this.fenceEdge);
      return tile;
    }

    // Otherwise replace the current tile with a fence tile
    const fenceTile = new FenceTile(
      tile.rowIndex,
      tile.colIndex,
      this.assetManager,
      this.fenceEdge
    );
    this.worldManager.replaceTile(fenceTile);
    return fenceTile;
  }

  private onRotate = () => {
    this.displayFence.rotateY(-Math.PI / 2);
    this.fenceEdge = nextTileEdge(this.fenceEdge);
    this.reOutline();
  };
}
