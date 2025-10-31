import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { RenderPipeline } from "./render-pipeline";
import { AssetManager, ModelAsset, TextureAsset } from "./asset-manager";
import { GrassWithLeavesTile } from "./tiles/grass-tile/grass-tile";
import { Tile } from "./tiles/tile";
import { BuildTileBehaviour } from "./build-tiles/build-tile-behaviour";
import { WorldManager } from "./world-manager";

export class GameState {
  buildItemBehaviour: BuildTileBehaviour;

  private renderPipeline: RenderPipeline;
  private clock = new THREE.Clock();

  private scene = new THREE.Scene();
  private camera = new THREE.PerspectiveCamera();
  private controls: OrbitControls;

  private worldManager: WorldManager;

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

    this.worldManager = new WorldManager(
      this.scene,
      this.camera,
      this.assetManager
    );

    this.buildItemBehaviour = new BuildTileBehaviour(
      this.scene,
      this.renderPipeline,
      this.assetManager,
      this.worldManager
    );

    // Build world
    this.worldManager.buildWorld();

    const fence = this.assetManager.getModel(
      ModelAsset.FenceWood
    ) as THREE.Mesh;
    this.assetManager.applyModelTexture(fence, TextureAsset.Farm);
    //this.scene.add(fence);

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
