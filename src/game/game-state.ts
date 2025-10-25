import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { RenderPipeline } from "./render-pipeline";
import { AssetManager, TextureAsset } from "./asset-manager";
import { GrassWithLeavesTile } from "./tiles/grass-tile/grass-tile";
import { Tile } from "./tiles/tile";
import { eventUpdater } from "../events/event-updater";

export enum BuildItem {
  Path,
}

export class GameState {
  placingBuildItem?: BuildItem;

  private renderPipeline: RenderPipeline;
  private clock = new THREE.Clock();

  private scene = new THREE.Scene();
  private camera = new THREE.PerspectiveCamera();
  private controls: OrbitControls;

  private groundTiles: Tile[][] = [];

  private ndc = new THREE.Vector2();
  private raycaster = new THREE.Raycaster();

  constructor(private assetManager: AssetManager) {
    this.setupCamera();
    this.renderPipeline = new RenderPipeline(this.scene, this.camera);
    this.setupLights();

    this.controls = new OrbitControls(this.camera, this.renderPipeline.canvas);
    this.controls.enableDamping = true;
    this.controls.target.set(0, 1, 0);

    const hdr = this.assetManager.textures.get(TextureAsset.HDR)!;
    this.scene.environment = hdr;
    this.scene.background = hdr;
    //this.scene.background = new THREE.Color("#1680AF");

    // Build world
    this.createGroundTiles();

    // Start game
    this.update();
  }

  toggleBuildItem(item: BuildItem) {
    if (this.placingBuildItem === item) {
      this.stopPlacingBuildItem();
      return;
    }

    this.placingBuildItem = item;
    document.body.style.cursor = "pointer";
    this.renderPipeline.canvas.addEventListener("mousemove", this.onMouseMove);
    eventUpdater.fire("build-item");
  }

  stopPlacingBuildItem() {
    this.placingBuildItem = undefined;
    document.body.style.cursor = "";
    this.renderPipeline.canvas.removeEventListener(
      "mousemove",
      this.onMouseMove
    );
    eventUpdater.fire("build-item");
  }

  private setupCamera() {
    this.camera.fov = 75;
    this.camera.far = 500;
    this.camera.position.set(0, 1.5, 3);
  }

  private setupLights() {
    const ambientLight = new THREE.AmbientLight(undefined, 1);
    this.scene.add(ambientLight);

    const directLight = new THREE.DirectionalLight(undefined, Math.PI);
    directLight.position.copy(new THREE.Vector3(0.75, 1, 0.75).normalize());
    this.scene.add(directLight);
  }

  private createGroundTiles() {
    // Ground tiles
    const gridSize = 5;
    for (let colIndex = 0; colIndex < gridSize; colIndex++) {
      // Columns move down z axis positively
      const zPos = colIndex; // everything 1 meter squared so easy maths here
      const tileRow: Tile[] = [];

      for (let rowIndex = 0; rowIndex < gridSize; rowIndex++) {
        // Rows move along x axis positively
        const xPos = rowIndex;
        const tile = new GrassWithLeavesTile(
          rowIndex,
          colIndex,
          this.assetManager
        );
        tile.position.set(xPos, 0, zPos);
        tileRow.push(tile);
        this.scene.add(tile);
      }

      // Now push in the completed row
      this.groundTiles.push(tileRow);
    }
  }

  private onMouseMove = (event: MouseEvent) => {
    // Intersect with ground tiles to highlight them
    this.ndc.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.ndc.y = -(event.clientY / window.innerHeight) * 2 + 1;

    this.renderPipeline.clearOutlines();

    this.raycaster.setFromCamera(this.ndc, this.camera);
    for (const row of this.groundTiles) {
      for (const tile of row) {
        const intersections = this.raycaster.intersectObject(tile, false);
        if (!intersections.length) continue;

        // Outline
        this.renderPipeline.outlineObject(intersections[0].object);
        return;
      }
    }
  };

  private update = () => {
    requestAnimationFrame(this.update);

    const dt = this.clock.getDelta();

    this.controls.update();

    this.renderPipeline.render(dt);
  };
}
