import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { RenderPipeline } from "./render-pipeline";
import { AssetManager, TextureAsset } from "./asset-manager";
import { BuildTileMode } from "./build-tiles/build-tile-mode";
import { WorldManager } from "./world-manager";
import { ModeManager } from "./mode-manager";
import { DemolishMode } from "./demolish-mode";
import { Wheat } from "./crops/wheat";

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
  private sun: THREE.DirectionalLight;
  private sunHelper: THREE.ArrowHelper;

  private dayLength = 30; // in seconds
  private time = 0;

  private wheat: Wheat;

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
      this.worldManager,
      this.assetManager
    );

    this.modeManager = new ModeManager(this.buildTileMode, this.demolishMode);

    // Build world
    this.worldManager.buildWorld();

    this.sun = new THREE.DirectionalLight(undefined, Math.PI);
    this.sun.position.copy(new THREE.Vector3(0.75, 1, 0.75).normalize());
    this.scene.add(this.sun);
    this.sunHelper = new THREE.ArrowHelper();
    this.scene.add(this.sunHelper);

    // TESTING
    this.wheat = new Wheat(0, 1);
    this.scene.add(this.wheat);

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
  }

  private update = () => {
    requestAnimationFrame(this.update);

    const dt = this.clock.getDelta();

    this.controls.update();

    this.wheat.grow(dt);

    this.time = (this.time + dt) % this.dayLength;
    const timeNormalized = this.time / this.dayLength;
    setSunPosition(0.2, this.sun, this.sunHelper);
    this.worldManager.updateSunUniforms(this.sun);

    this.renderPipeline.render(dt);
  };
}

function setSunPosition(
  timeNormalized: number,
  sun: THREE.DirectionalLight,
  helper?: THREE.ArrowHelper
) {
  const theta = timeNormalized * 2 * Math.PI; // full day rotation
  const phi = 75; // 45° tilt: controls noon height

  const y = Math.sin(theta) * Math.cos(phi);
  const z = Math.cos(theta);
  const x = Math.sin(theta) * Math.sin(phi);

  sun.position.set(x, y, z);
  helper?.setDirection(sun.position);
}
