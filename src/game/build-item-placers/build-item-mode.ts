import * as THREE from "three";
import { eventUpdater } from "../../events/event-updater";
import { AssetManager } from "../asset-manager";
import { RenderPipeline } from "../render-pipeline";
import { Tile } from "../tiles/tile";
import { FencePlacer } from "./fence-placer";
import { PathTilePlacer } from "./path-tile-placer";
import { WorldManager } from "../world-manager";
import { Mode, ModeName } from "../mode-manager";
import { CropPlacer } from "./crop-tile-placer";
import { BuildCursor } from "./build-cursor";

export enum BuildItem {
  Path = "Path",
  Fence = "Fence",
  Crop = "Crop",
}

export interface BuildItemPlacer {
  adjustCursor: (cursor: BuildCursor) => void;
  isTileValid(tile: Tile): boolean;
  onHoverTile?(tile: Tile): void;
  onPlace(tile: Tile): Tile; // passes current tile, expects new replacement tile
  onStop?: () => void;
}

export class BuildItemMode implements Mode {
  name = ModeName.Build;
  placingBuildItem?: BuildItem;
  enabled = false;

  private currentPlacer?: BuildItemPlacer;
  private buildCursor: BuildCursor;
  private hoveredTile?: Tile;

  constructor(
    private scene: THREE.Scene,
    private renderPipeline: RenderPipeline,
    private assetManager: AssetManager,
    private worldManager: WorldManager
  ) {
    this.buildCursor = new BuildCursor();
  }

  // Called when build menu is opened
  enable() {
    if (this.enabled) return;

    this.enabled = true;
  }

  disable() {
    if (!this.enabled) return;

    this.stopPlacingBuildItem();

    this.enabled = false;
  }

  // Called when selecting a build item option
  toggleBuildItem(item: BuildItem) {
    if (!this.enabled) return;

    // Toggle off
    if (this.placingBuildItem === item) {
      this.stopPlacingBuildItem();
      return;
    } else if (this.placingBuildItem) {
      // Currently placing something else - remove it and start placing this new item
      this.stopPlacingBuildItem();
    }

    // Now placing this item
    this.placingBuildItem = item;

    // Get correct placer
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
          this.worldManager,
          this.setCursorValidity
        );
        break;
      case BuildItem.Crop:
        this.currentPlacer = new CropPlacer(this.worldManager);
    }

    // Adjust cursor to match item
    this.currentPlacer?.adjustCursor(this.buildCursor);
    this.scene.add(this.buildCursor);

    // Events
    document.body.style.cursor = "pointer";
    this.renderPipeline.canvas.addEventListener("mousemove", this.onMouseMove);
    this.renderPipeline.canvas.addEventListener("click", this.onMouseClick);
    eventUpdater.fire("build-item");
  }

  private stopPlacingBuildItem() {
    if (!this.placingBuildItem) return;

    this.scene.remove(this.buildCursor);
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

    const hitTile = this.worldManager.getIntersectedTile(event);
    if (!hitTile) return;

    this.hoveredTile = hitTile;

    // Center cursor on the hovered tile
    this.buildCursor.position.copy(hitTile.position);
    this.buildCursor.position.y += 0.01; // do this elsewhere?

    // Colour according to validity
    this.setCursorValidity();

    // Optional hover logic
    this.currentPlacer?.onHoverTile?.(hitTile);
  };

  private onMouseClick = () => {
    if (!this.hoveredTile) return; // uses tile set on mouse move
    if (!this.currentPlacer) return;

    if (this.currentPlacer.isTileValid(this.hoveredTile)) {
      const newTile = this.currentPlacer.onPlace(this.hoveredTile);
      this.hoveredTile = newTile;
      this.setCursorValidity();
    }
  };

  private setCursorValidity = () => {
    if (!this.hoveredTile) return;

    const valid = this.currentPlacer?.isTileValid(this.hoveredTile);

    this.buildCursor.setColour(valid ? "white" : "red");
  };
}
