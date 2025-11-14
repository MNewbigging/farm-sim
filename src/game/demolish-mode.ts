import { eventUpdater } from "../events/event-updater";
import { AssetManager } from "./asset-manager";
import { HoverCursorBehaviour } from "./hover-cursor-behaviour";
import { Mode, ModeName } from "./mode-manager";
import { RenderPipeline } from "./render-pipeline";
import { FenceTile } from "./tiles/fence-tile/fence-tile";
import { GrassWithLeavesTile } from "./tiles/grass-tile/grass-tile";
import { PathTile } from "./tiles/path-tile/path-tile";
import { Tile } from "./tiles/tile";
import { WorldManager } from "./world-manager";

export class DemolishMode implements Mode {
  name = ModeName.Demolish;
  enabled = false;

  constructor(
    private renderPipeline: RenderPipeline,
    private worldManager: WorldManager,
    private assetManager: AssetManager,
    private hoverCursorBehaviour: HoverCursorBehaviour
  ) {}

  enable(): void {
    if (this.enabled) return;

    this.hoverCursorBehaviour.enable();
    this.renderPipeline.canvas.addEventListener("click", this.onClick);
    eventUpdater.on("hovered-tile", this.onHoverTile);

    this.enabled = true;
  }

  disable(): void {
    if (!this.enabled) return;

    this.hoverCursorBehaviour.disable();
    this.renderPipeline.canvas.removeEventListener("click", this.onClick);
    eventUpdater.off("hovered-tile", this.onHoverTile);

    this.enabled = false;
  }

  private onHoverTile = () => {
    // Get the newly hovered tile
    const hoveredTile = this.hoverCursorBehaviour.lastHoveredTile;
    console.log("didnt find tile");
    if (!hoveredTile) return;

    if (this.canBeDemolished(hoveredTile)) {
      this.hoverCursorBehaviour.cursor.setColour("orange");
      console.log("can be demolished");
    } else {
      this.hoverCursorBehaviour.cursor.setColour("red");
    }
  };

  private canBeDemolished(tile: Tile) {
    if (tile instanceof FenceTile) return true;
    if (tile instanceof PathTile) return true;

    return false;
  }

  private onClick = () => {
    const hoveredTile = this.hoverCursorBehaviour.lastHoveredTile;
    if (!hoveredTile) {
      console.log("no hovered tile");
      return;
    }

    if (this.canBeDemolished(hoveredTile)) {
      this.demolishTile(hoveredTile);
    }
  };

  private demolishTile(tile: Tile) {
    // Really just means to replace it with grass
    const grass = new GrassWithLeavesTile(
      tile.rowIndex,
      tile.colIndex,
      this.assetManager
    );

    if (tile instanceof PathTile) {
      this.updatePathConnections(tile);
    }

    this.worldManager.replaceTile(grass);
  }

  private updatePathConnections(pathTile: PathTile) {
    const { upLeft, up, upRight, right, downRight, down, downLeft, left } =
      this.worldManager.getTileNeighbours(pathTile);

    if (upLeft instanceof PathTile) {
      upLeft.setConnectDownRight(false);
      pathTile.setConnectUpLeft(false);
    }

    if (up instanceof PathTile) {
      up.setConnectDown(false);
      pathTile.setConnectUp(false);
    }

    if (upRight instanceof PathTile) {
      upRight.setConnectDownLeft(false);
      pathTile.setConnectUpRight(false);
    }

    if (right instanceof PathTile) {
      right.setConnectLeft(false);
      pathTile.setConnectRight(false);
    }

    if (downRight instanceof PathTile) {
      downRight.setConnectUpLeft(false);
      pathTile.setConnectDownRight(false);
    }

    if (down instanceof PathTile) {
      down.setConnectUp(false);
      pathTile.setConnectDown(false);
    }

    if (downLeft instanceof PathTile) {
      downLeft.setConnectUpRight(false);
      pathTile.setConnectDownLeft(false);
    }

    if (left instanceof PathTile) {
      left.setConnectRight(false);
      pathTile.setConnectLeft(false);
    }
  }
}
