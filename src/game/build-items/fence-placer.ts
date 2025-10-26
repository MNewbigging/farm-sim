import * as THREE from "three";
import { keyboardListener } from "../../listeners/keyboard-listener";
import { AssetManager, ModelAsset, TextureAsset } from "../asset-manager";
import { Tile } from "../tiles/tile";
import { BuildItemPlacer } from "./build-item-behaviour";

export class FencePlacer implements BuildItemPlacer {
  private fenceParent: THREE.Group;

  constructor(
    private scene: THREE.Scene,
    private assetManager: AssetManager,
  ) {
    this.fenceParent = this.makeFence();
    this.fenceParent.visible = false;
    this.scene.add(this.fenceParent);

    // todo stop listening
    keyboardListener.on("r", this.onRotate);
  }

  onStop() {
    keyboardListener.off("r", this.onRotate);
    this.scene.remove(this.fenceParent);
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
    fence.copy(this.fenceParent);
    this.scene.add(fence);
  }

  private makeFence() {
    const group = new THREE.Group();

    const fence = this.assetManager.getModel(
      ModelAsset.FenceWood,
    ) as THREE.Mesh;
    this.assetManager.applyModelTexture(fence, TextureAsset.Farm);

    // Would otherwise appear in middle of tile
    fence.position.z += 0.5;

    const leftPole = this.assetManager.getModel(ModelAsset.FenceWoodPole);
    this.assetManager.applyModelTexture(leftPole, TextureAsset.Farm);

    leftPole.position.z += 0.5;
    leftPole.position.x -= 0.5;

    const rightPole = this.assetManager.getModel(ModelAsset.FenceWoodPole);
    this.assetManager.applyModelTexture(rightPole, TextureAsset.Farm);

    rightPole.position.z += 0.5;
    rightPole.position.x += 0.5;

    group.add(fence, leftPole, rightPole);

    // todo merge these geometries together or be smart about pole placement?
    return group;
  }

  private onRotate = () => {
    this.fenceParent.rotateY(Math.PI / 2);
  };
}
