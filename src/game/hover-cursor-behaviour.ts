import * as THREE from "three";
import { RenderPipeline } from "./render-pipeline";
import { WorldManager } from "./world-manager";
import { eventUpdater } from "../events/event-updater";
import { Tile } from "./tiles/tile";

/**
 * Adds a cursor to the scene
 * The cursor colour can be changed (later may want to feed different cursors in)
 * Cursor spans a single 1m sq tile by default, but can be resized
 * On mouse move, finds nearest hovered tile and moves center of cursor there
 */

/**
 * Needs to notify when hovering over a new tile:
 *
 * 1: Global under game-state, consumers add/remove listeners to hovered-tile events
 * + only need to pass down the already-created hover class
 * - need to manage adding/removing listeners
 *
 * 2: Consumers create own instances of this class, pass in a fn to call on hovered-tile
 * - would need to pass down props into consumer in order to make hover class
 * + no need to manage any listeners
 *
 */

export class HoverCursorBehaviour {
  enabled = false;
  cursor: HoverCursor;

  lastHoveredTile?: Tile;

  constructor(
    private scene: THREE.Scene,
    private renderPipeline: RenderPipeline,
    private worldManager: WorldManager
  ) {
    this.cursor = new HoverCursor();
  }

  enable() {
    if (this.enabled) return;
    this.renderPipeline.canvas.addEventListener("mousemove", this.onMouseMove);
    this.enabled = true;
  }

  disable() {
    if (!this.enabled) return;
    this.scene.remove(this.cursor);
    this.renderPipeline.canvas.removeEventListener(
      "mousemove",
      this.onMouseMove
    );
    this.enabled = false;
  }

  private onMouseMove = (event: MouseEvent) => {
    const hitTile = this.worldManager.getIntersectedTile(
      event.clientX,
      event.clientY
    );

    // Hit nothing
    if (!hitTile) {
      this.lastHoveredTile = undefined;
      this.scene.remove(this.cursor);
      return;
    }

    // Hit something - ensure cursor is in the scene
    if (!this.cursor.parent) this.scene.add(this.cursor);

    // Only move & notify on hovering a new tile
    if (this.lastHoveredTile !== hitTile) {
      this.cursor.position.copy(hitTile.position);
      this.cursor.position.y += 0.01; // do this in the cursor itself somehow?
      eventUpdater.fire("hovered-tile");
    }
  };
}

class HoverCursor extends THREE.Mesh {
  declare material: THREE.MeshBasicMaterial;

  constructor() {
    const geometry = new THREE.PlaneGeometry(); // default size 1m sq
    const material = new THREE.MeshBasicMaterial({
      color: "white",
      transparent: true,
      opacity: 0.3,
    });

    super(geometry, material);

    this.rotateX(-Math.PI / 2);
  }

  setColour(color: THREE.ColorRepresentation) {
    this.material.color.set(color);
  }
}
