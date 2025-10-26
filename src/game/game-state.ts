import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { RenderPipeline } from "./render-pipeline";
import { AssetManager, TextureAsset } from "./asset-manager";
import { GrassWithLeavesTile } from "./tiles/grass-tile/grass-tile";
import { Tile } from "./tiles/tile";
import { BuildItemBehaviour } from "./build-items/build-item-behaviour";

export class GameState {
  buildItemBehaviour: BuildItemBehaviour;

  private renderPipeline: RenderPipeline;
  private clock = new THREE.Clock();

  private scene = new THREE.Scene();
  private camera = new THREE.PerspectiveCamera();
  private controls: OrbitControls;

  private groundTiles: Tile[][] = [];

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

    this.buildItemBehaviour = new BuildItemBehaviour(
      this.scene,
      this.camera,
      this.renderPipeline,
      this.assetManager,
      this.groundTiles,
    );

    // Build world
    this.createGroundTiles();

    // Start game
    this.update();
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
    for (let rowIndex = 0; rowIndex < gridSize; rowIndex++) {
      // Rows move down z axis positively
      const zPos = rowIndex; // everything 1 meter squared so easy maths here
      const tileRow: Tile[] = [];

      for (let colIndex = 0; colIndex < gridSize; colIndex++) {
        // Columns move along x axis positively
        const xPos = colIndex;
        const tile = new GrassWithLeavesTile(
          rowIndex,
          colIndex,
          this.assetManager,
        );
        tile.position.set(xPos, 0, zPos); // x from column, z from row
        tileRow.push(tile);
        this.scene.add(tile);
      }

      // Now push in the completed row
      this.groundTiles.push(tileRow);
    }
  }

  private update = () => {
    requestAnimationFrame(this.update);

    const dt = this.clock.getDelta();

    this.controls.update();

    this.renderPipeline.render(dt);
  };
}
