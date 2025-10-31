import * as THREE from "three";
import { keyboardListener } from "../../listeners/keyboard-listener";
import { AssetManager, ModelAsset, TextureAsset } from "../asset-manager";
import { Tile } from "../tiles/tile";
import { BuildItemPlacer } from "./build-item-behaviour";
import { GrassWithLeavesTile } from "../tiles/grass-tile/grass-tile";
import {
  FenceTile,
  makeFenceProp,
  nextTileEdge,
  TileEdge,
} from "../tiles/fence-tile/fence-tile";
import { WorldManager } from "../world-manager";

export class FencePlacer implements BuildItemPlacer {
  private displayFence: THREE.Group;
  private fenceEdge: TileEdge = TileEdge.Down; // starts this way by default

  constructor(
    private scene: THREE.Scene,
    private assetManager: AssetManager,
    private worldManager: WorldManager
  ) {
    this.displayFence = makeFenceProp(assetManager);
    this.displayFence.visible = false;
    this.scene.add(this.displayFence);

    keyboardListener.on("r", this.onRotate);
  }

  onStop() {
    keyboardListener.off("r", this.onRotate);
    this.scene.remove(this.displayFence);
  }

  isTileValid(tile: Tile) {
    return tile instanceof GrassWithLeavesTile;
  }

  onHoverTile(tile: Tile) {
    // Move the fence to the new tile
    this.displayFence.visible = true;
    this.displayFence.position.copy(tile.position);
  }

  onPlace(tile: Tile) {
    // If the tile is already a fence tile, place additional fence
    if (tile instanceof FenceTile) {
      //...
      return;
    }

    const fenceTile = new FenceTile(
      tile.rowIndex,
      tile.colIndex,
      this.assetManager,
      this.fenceEdge
    );
    this.worldManager.replaceTile(fenceTile);
  }

  private onRotate = () => {
    this.displayFence.rotateY(-Math.PI / 2);
    this.fenceEdge = nextTileEdge(this.fenceEdge);
  };
}
