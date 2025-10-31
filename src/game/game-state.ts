import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { RenderPipeline } from "./render-pipeline";
import { AssetManager, ModelAsset, TextureAsset } from "./asset-manager";
import { GrassWithLeavesTile } from "./tiles/grass-tile/grass-tile";
import { Tile } from "./tiles/tile";
import { BuildTileMode } from "./build-tiles/build-tile-mode";
import { WorldManager } from "./world-manager";
import { ModeManager } from "./mode-manager";
import { DemolishMode } from "./demolish-mode";

export class GameState {
  modeManager: ModeManager;
  buildTileMode: BuildTileMode;
  demolishMode: DemolishMode;

  private renderPipeline: RenderPipeline;
  private clock = new THREE.Clock();

  private scene = new THREE.Scene();
  private camera = new THREE.PerspectiveCamera();
  private controls: OrbitControls;

  private worldManager: WorldManager;

  constructor(private assetManager: AssetManager) {
    // Scene setup
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

    // Instantiate classes
    this.worldManager = new WorldManager(
      this.scene,
      this.camera,
      this.assetManager
    );

    this.buildTileMode = new BuildTileMode(
      this.scene,
      this.renderPipeline,
      this.assetManager,
      this.worldManager
    );

    this.demolishMode = new DemolishMode(
      this.renderPipeline,
      this.worldManager
    );

    this.modeManager = new ModeManager(this.buildTileMode, this.demolishMode);

    // Build world
    this.worldManager.buildWorld();

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

  private update = () => {
    requestAnimationFrame(this.update);

    const dt = this.clock.getDelta();

    this.controls.update();

    this.renderPipeline.render(dt);
  };
}
