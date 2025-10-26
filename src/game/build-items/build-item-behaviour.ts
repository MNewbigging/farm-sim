import * as THREE from "three";
import { eventUpdater } from "../../events/event-updater";
import { AssetManager } from "../asset-manager";
import { RenderPipeline } from "../render-pipeline";
import { Tile } from "../tiles/tile";
import { PathTilePlacer } from "./path-tile-placer";

export enum BuildItem {
  Path = "Path",
  Fence = "Fence",
}

export interface BuildItemPlacer {
  isTileValid: (tile: Tile) => boolean;
  onPlace: (tile: Tile) => void;
}

export class BuildItemBehaviour {
  placingBuildItem?: BuildItem;

  private currentPlacer?: BuildItemPlacer;

  private ndc = new THREE.Vector2();
  private raycaster = new THREE.Raycaster();

  constructor(
    private scene: THREE.Scene,
    private camera: THREE.Camera,
    private renderPipeline: RenderPipeline,
    private assetManager: AssetManager,
    private groundTiles: Tile[][],
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
          this.scene,
          this.assetManager,
          this.groundTiles,
        );
        break;
    }

    document.body.style.cursor = "pointer";
    this.renderPipeline.canvas.addEventListener("mousemove", this.onMouseMove);
    this.renderPipeline.canvas.addEventListener("click", this.onMouseClick);
    eventUpdater.fire("build-item");
  }

  stopPlacingBuildItem() {
    this.placingBuildItem = undefined;
    this.currentPlacer = undefined;
    document.body.style.cursor = "";
    this.renderPipeline.canvas.removeEventListener(
      "mousemove",
      this.onMouseMove,
    );
    this.renderPipeline.canvas.removeEventListener("click", this.onMouseClick);
    this.renderPipeline.clearOutlines();
    eventUpdater.fire("build-item");
  }

  private getIntersectedTile(event: MouseEvent) {
    setNdc(event, this.ndc);
    this.raycaster.setFromCamera(this.ndc, this.camera);

    for (const row of this.groundTiles) {
      for (const tile of row) {
        const intersections = this.raycaster.intersectObject(tile, false);

        if (intersections.length) {
          return tile;
        }
      }
    }
  }

  private onMouseMove = (event: MouseEvent) => {
    this.renderPipeline.clearOutlines();
    const hitTile = this.getIntersectedTile(event);
    if (hitTile) {
      // todo - change outline blur colour if invalid?
      if (this.currentPlacer?.isTileValid(hitTile)) {
        this.renderPipeline.outlineObject(hitTile);
      }
    }
  };

  private onMouseClick = (event: MouseEvent) => {
    if (!this.currentPlacer) return;

    const hitTile = this.getIntersectedTile(event);
    if (!hitTile) return;

    if (this.currentPlacer.isTileValid(hitTile)) {
      this.currentPlacer.onPlace(hitTile);
    }
  };
}

function setNdc(event: MouseEvent, target: THREE.Vector2) {
  target.x = (event.clientX / window.innerWidth) * 2 - 1;
  target.y = -(event.clientY / window.innerHeight) * 2 + 1;
}
