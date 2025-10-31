import * as THREE from "three";
import { eventUpdater } from "../../events/event-updater";
import { AssetManager } from "../asset-manager";
import { RenderPipeline } from "../render-pipeline";
import { Tile } from "../tiles/tile";
import { FencePlacer } from "./fence-placer";
import { PathTilePlacer } from "./path-tile-placer";
import { WorldManager } from "../world-manager";

export enum BuildTile {
  Path = "Path",
  Fence = "Fence",
}

export interface BuildTilePlacer {
  isTileValid: (tile: Tile) => boolean;
  onHoverTile?: (tile: Tile) => void;
  onPlace: (tile: Tile) => Tile; // passes current tile, expects new replacement tile
  onStop?: () => void;
}

export class BuildTileBehaviour {
  placingBuildItem?: BuildTile;

  private currentPlacer?: BuildTilePlacer;
  private lastTile?: Tile;

  constructor(
    private scene: THREE.Scene,
    private renderPipeline: RenderPipeline,
    private assetManager: AssetManager,
    private worldManager: WorldManager
  ) {}

  toggleBuildItem(item: BuildTile) {
    // Toggle off
    if (this.placingBuildItem === item) {
      this.stopPlacingBuildItem();
      return;
    } else if (this.placingBuildItem) {
      // Currently placing something else - remove it and start placing this new item
      this.stopPlacingBuildItem();
    }

    // Start placing new item
    this.placingBuildItem = item;

    switch (item) {
      case BuildTile.Path:
        this.currentPlacer = new PathTilePlacer(
          this.assetManager,
          this.worldManager
        );
        break;
      case BuildTile.Fence:
        this.currentPlacer = new FencePlacer(
          this.scene,
          this.assetManager,
          this.worldManager,
          this.outlineLastTile
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
    if (!this.placingBuildItem) return;

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

    this.lastTile = hitTile;

    this.outlineLastTile();

    // Optional hover logic
    this.currentPlacer?.onHoverTile?.(hitTile);
  };

  private onMouseClick = () => {
    if (!this.lastTile) return; // uses tile set on mouse move
    if (!this.currentPlacer) return;

    if (this.currentPlacer.isTileValid(this.lastTile)) {
      const newTile = this.currentPlacer.onPlace(this.lastTile);
      this.lastTile = newTile;
      this.outlineLastTile();
    }
  };

  private outlineLastTile = () => {
    if (!this.lastTile) return;
    if (!this.currentPlacer) return;

    this.renderPipeline.clearOutlines();

    // Ensure outline colour is set
    if (!this.currentPlacer.isTileValid(this.lastTile)) {
      this.renderPipeline.changeOutlineColour("red");
    } else {
      this.renderPipeline.changeOutlineColour("white");
    }

    // Outline
    this.renderPipeline.outlineObject(this.lastTile);
  };
}
