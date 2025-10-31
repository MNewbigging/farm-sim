import { AssetManager } from "./asset-manager";
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

  private lastTile?: Tile;

  constructor(
    private renderPipeline: RenderPipeline,
    private worldManager: WorldManager,
    private assetManager: AssetManager
  ) {}

  enable(): void {
    if (this.enabled) return;

    // Change cursor
    this.renderPipeline.canvas.addEventListener("mousemove", this.onMouseMove);
    this.renderPipeline.canvas.addEventListener("click", this.onClick);

    this.enabled = true;
  }

  disable(): void {
    if (!this.enabled) return;

    this.renderPipeline.canvas.removeEventListener(
      "mousemove",
      this.onMouseMove
    );
    this.renderPipeline.canvas.removeEventListener("click", this.onClick);

    this.renderPipeline.clearOutlines();

    this.enabled = false;
  }

  private onMouseMove = (event: MouseEvent) => {
    const hitTile = this.worldManager.getIntersectedTile(event);
    if (!hitTile) return;

    this.lastTile = hitTile;

    this.outlineLastTile();
  };

  private outlineLastTile() {
    if (!this.lastTile) return;

    this.renderPipeline.clearOutlines();

    // Colour depending on if it can be demolished
    this.renderPipeline.changeOutlineColour(
      this.canBeDemolished(this.lastTile) ? "white" : "red"
    );

    this.renderPipeline.outlineObject(this.lastTile);
  }

  private canBeDemolished(tile: Tile) {
    if (tile instanceof FenceTile) return true;
    if (tile instanceof PathTile) return true;

    return false;
  }

  private onClick = () => {
    if (!this.lastTile) return;
    if (!this.canBeDemolished(this.lastTile)) return;

    this.demolishTile(this.lastTile);
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
