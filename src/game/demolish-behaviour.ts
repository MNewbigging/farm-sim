import { RenderPipeline } from "./render-pipeline";
import { FenceTile } from "./tiles/fence-tile/fence-tile";
import { PathTile } from "./tiles/path-tile/path-tile";
import { Tile } from "./tiles/tile";
import { WorldManager } from "./world-manager";

export class DemolishBehaviour {
  private lastTile?: Tile;

  constructor(
    private renderPipeline: RenderPipeline,
    private worldManager: WorldManager
  ) {}

  start() {
    // Change cursor
    this.renderPipeline.canvas.addEventListener("mousemove", this.onMouseMove);
  }

  stop() {
    this.renderPipeline.canvas.removeEventListener(
      "mousemove",
      this.onMouseMove
    );
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
}
