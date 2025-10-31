import * as THREE from "three";
import { eventUpdater } from "../../events/event-updater";
import { AssetManager } from "../asset-manager";
import { RenderPipeline } from "../render-pipeline";
import { Tile } from "../tiles/tile";
import { FencePlacer } from "./fence-placer";
import { PathTilePlacer } from "./path-tile-placer";
import { WorldManager } from "../world-manager";

export enum BuildItem {
  Path = "Path",
  Fence = "Fence",
}

export interface BuildItemPlacer {
  isTileValid: (tile: Tile) => boolean;
  onHoverTile?: (tile: Tile) => void;
  onPlace: (tile: Tile) => void;
  onStop?: () => void;
}

export class BuildItemBehaviour {
  placingBuildItem?: BuildItem;

  private currentPlacer?: BuildItemPlacer;

  constructor(
    private scene: THREE.Scene,
    private renderPipeline: RenderPipeline,
    private assetManager: AssetManager,
    private worldManager: WorldManager
  ) {}

  toggleBuildItem(item: BuildItem) {
    if (this.placingBuildItem === item) {
      this.stopPlacingBuildItem();
      return; // this is the toggle part
    } else if (this.placingBuildItem) {
      // placing something else - remove it and start placing this new item
      this.stopPlacingBuildItem();
    }

    // Start placing new item
    this.placingBuildItem = item;

    switch (item) {
      case BuildItem.Path:
        this.currentPlacer = new PathTilePlacer(
          this.assetManager,
          this.worldManager
        );
        break;
      case BuildItem.Fence:
        this.currentPlacer = new FencePlacer(
          this.scene,
          this.assetManager,
          this.worldManager
        );
        break;
    }

    if (!this.currentPlacer) {
      this.stopPlacingBuildItem();
      return;
    }

    document.body.style.cursor = "pointer";
    this.renderPipeline.canvas.addEventListener("mousemove", this.onMouseMove);
    this.renderPipeline.canvas.addEventListener("click", this.onMouseClick);
    eventUpdater.fire("build-item");
  }

  stopPlacingBuildItem() {
    this.currentPlacer?.onStop?.();
    this.placingBuildItem = undefined;
    this.currentPlacer = undefined;
    document.body.style.cursor = "";
    this.renderPipeline.canvas.removeEventListener(
      "mousemove",
      this.onMouseMove
    );
    this.renderPipeline.canvas.removeEventListener("click", this.onMouseClick);
    this.renderPipeline.clearOutlines();
    eventUpdater.fire("build-item");
  }

  private onMouseMove = (event: MouseEvent) => {
    if (!this.currentPlacer) return;

    this.renderPipeline.clearOutlines();

    const hitTile = this.worldManager.getIntersectedTile(event);
    if (!hitTile) return;

    // todo - change outline blur colour if invalid?
    if (this.currentPlacer?.isTileValid(hitTile)) {
      this.renderPipeline.outlineObject(hitTile);
    }

    this.currentPlacer?.onHoverTile?.(hitTile);
  };

  private onMouseClick = (event: MouseEvent) => {
    if (!this.currentPlacer) return;

    const hitTile = this.worldManager.getIntersectedTile(event);
    if (!hitTile) return;

    if (this.currentPlacer.isTileValid(hitTile)) {
      this.currentPlacer.onPlace(hitTile);
    }
  };
}
