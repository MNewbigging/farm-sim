import * as THREE from "three";
import { keyboardListener } from "../../listeners/keyboard-listener";
import { AssetManager, ModelAsset, TextureAsset } from "../asset-manager";
import { Tile } from "../tiles/tile";
import { BuildItemPlacer } from "./build-item-behaviour";

export class FencePlacer implements BuildItemPlacer {
  private fenceParent = new THREE.Group();

  constructor(
    private scene: THREE.Scene,
    private assetManager: AssetManager,
  ) {
    const fence = this.makeFence();
    this.fenceParent.add(fence);

    this.fenceParent.visible = false;
    this.scene.add(this.fenceParent);

    // todo stop listening
    keyboardListener.on("r", this.onRotate);
  }

  isTileValid(tile: Tile) {
    // There cannot be a fence in the same position as current placing fence...
    // Might need to re-run this check on rotate
    return true;
  }

  onHoverTile(tile: Tile) {
    // Move the fence to the new tile
    this.fenceParent.visible = true;

    this.fenceParent.position.copy(tile.position);
  }

  onPlace(tile: Tile) {
    // Create a fence in the same position
    const fence = this.makeFence();
    const parent = new THREE.Group();
    parent.copy(this.fenceParent);
    parent.add(fence);
    this.scene.add(parent);
  }

  private makeFence() {
    const fence = this.assetManager.getModel(
      ModelAsset.FenceWood2,
    ) as THREE.Mesh;
    this.assetManager.applyModelTexture(fence, TextureAsset.Farm);

    // Would otherwise appear in middle of tile
    fence.position.z += 0.5;

    return fence;
  }

  private onRotate = () => {
    this.fenceParent.rotateY(Math.PI / 2);
  };
}
