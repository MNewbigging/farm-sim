import * as THREE from "three";
import * as SkeletonUtils from "three/examples/jsm/utils/SkeletonUtils";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";

export enum AnimationAsset {
  BANDIT_IDLE = "idle.fbx",
}

export enum ModelAsset {
  FenceWood = "SM_Prop_Fence_Wood_02.fbx",
  FenceWoodPole = "SM_Prop_Fence_Wood_Pole_01.fbx",
  StoneCabin = "SM_Bld_Stone_Cabin_01.fbx",
  FarmerMale = "SK_Chr_Farmer_Male_01.fbx",
  FarmerMaleOld = "SK_Chr_Farmer_Male_Old_01.fbx",
}

export enum TextureAsset {
  HDR = "orchard_cartoony.hdr",
  GrassDiffuse = "grass/Grass_Texture_01.png",
  GrassNormal = "grass/Ground_Normals_01.png",
  GrassLeavesDiffuse = "grass-leaves/Grass_Leaves_Texture_01.png",
  GrassLeavesNormal = "grass-leaves/Ground_Leaves_Normals_01.png",
  FootpathDiffuse = "footpath/Footpath_Tiles_Texture_01.png",
  FootpathNormal = "footpath/Footpath_Tiles_Normals_01.png",
  Farm = "PolygonFarm_Texture_01_A.png",
  Meadow = "PolygonNatureBiomes_Meadow_Texture_01.png",
}

export class AssetManager {
  private models = new Map<ModelAsset, THREE.Group>();
  textures = new Map<TextureAsset, THREE.Texture>();
  animations = new Map<AnimationAsset, THREE.AnimationClip>();

  private loadingManager = new THREE.LoadingManager();
  private fbxLoader = new FBXLoader(this.loadingManager);
  private gltfLoader = new GLTFLoader(this.loadingManager);
  private rgbeLoader = new RGBELoader(this.loadingManager);
  private textureLoader = new THREE.TextureLoader(this.loadingManager);

  applyModelTexture(model: THREE.Object3D, textureName: TextureAsset) {
    const texture = this.textures.get(textureName);
    if (!texture) {
      return;
    }

    model.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.material.map = texture;
        child.material.vertexColors = false;
      }
    });
  }

  getModel(name: ModelAsset): THREE.Object3D {
    const model = this.models.get(name);
    if (model) {
      return SkeletonUtils.clone(model);
    }

    // Ensure we always return an object 3d
    return new THREE.Mesh(
      new THREE.SphereGeometry(),
      new THREE.MeshBasicMaterial({ color: "red" })
    );
  }

  load(): Promise<void> {
    this.loadModels();
    this.loadTextures();
    this.loadAnimations();

    return new Promise((resolve) => {
      this.loadingManager.onLoad = () => {
        resolve();
      };
    });
  }

  private loadModels() {
    // General scaling:
    [
      ModelAsset.StoneCabin,
      ModelAsset.FarmerMale,
      ModelAsset.FarmerMaleOld,
    ].forEach((asset) =>
      this.loadModel(asset, (group: THREE.Group) => {
        group.scale.multiplyScalar(0.01);
      })
    );

    // Specific scaling:
    this.loadModel(ModelAsset.FenceWood, (fence: THREE.Group) => {
      fence.scale.set(0.004, 0.005, 0.005);
      fence.translateX(-0.5);
    });

    this.loadModel(ModelAsset.FenceWoodPole, (pole: THREE.Group) => {
      pole.scale.set(0.005, 0.005, 0.005);
    });
  }

  private loadTextures() {
    this.loadTexture(
      TextureAsset.HDR,
      (texture) => (texture.mapping = THREE.EquirectangularReflectionMapping)
    );

    // todo - change color space on these?
    this.loadTexture(
      TextureAsset.GrassDiffuse,
      (texture) => (texture.colorSpace = THREE.SRGBColorSpace)
    );
    this.loadTexture(
      TextureAsset.GrassNormal,
      (texture) => (texture.colorSpace = THREE.LinearSRGBColorSpace)
    );
    this.loadTexture(
      TextureAsset.GrassLeavesDiffuse,
      (texture) => (texture.colorSpace = THREE.SRGBColorSpace)
    );
    this.loadTexture(
      TextureAsset.GrassLeavesNormal,
      (texture) => (texture.colorSpace = THREE.LinearSRGBColorSpace)
    );
    this.loadTexture(
      TextureAsset.FootpathDiffuse,
      (texture) => (texture.colorSpace = THREE.SRGBColorSpace)
    );
    this.loadTexture(
      TextureAsset.FootpathNormal,
      (texture) => (texture.colorSpace = THREE.LinearSRGBColorSpace)
    );

    this.loadTexture(
      TextureAsset.Farm,
      (texture) => (texture.colorSpace = THREE.SRGBColorSpace)
    );

    this.loadTexture(
      TextureAsset.Meadow,
      (texture) => (texture.colorSpace = THREE.SRGBColorSpace)
    );
  }

  private loadAnimations() {
    // Object.values(AnimationAsset).forEach((filename) =>
    //   this.loadAnimation(filename)
    // );
  }

  private loadModel(
    filename: ModelAsset,
    onLoad?: (group: THREE.Group) => void
  ) {
    const path = `${getPathPrefix()}/models/${filename}`;
    const url = getUrl(path);

    const filetype = filename.split(".")[1];

    // FBX
    if (filetype === "fbx") {
      this.fbxLoader.load(url, (group: THREE.Group) => {
        onLoad?.(group);
        this.models.set(filename, group);
      });

      return;
    }

    // GLTF
    this.gltfLoader.load(url, (gltf: GLTF) => {
      onLoad?.(gltf.scene);
      this.models.set(filename, gltf.scene);
    });
  }

  private loadTexture(
    filename: TextureAsset,
    onLoad?: (texture: THREE.Texture) => void
  ) {
    const path = `${getPathPrefix()}/textures/${filename}`;
    const url = getUrl(path);

    const filetype = filename.split(".")[1];
    const loader = filetype === "png" ? this.textureLoader : this.rgbeLoader;

    loader.load(url, (texture) => {
      onLoad?.(texture);
      this.textures.set(filename, texture);
    });
  }

  private loadAnimation(filename: AnimationAsset) {
    const path = `${getPathPrefix()}/anims/${filename}`;
    const url = getUrl(path);

    this.fbxLoader.load(url, (group) => {
      if (group.animations.length) {
        const clip = group.animations[0];
        clip.name = filename;
        this.animations.set(filename, clip);
      }
    });
  }
}

function getPathPrefix() {
  // Using template strings to create url paths breaks on github pages
  // We need to manually add the required /repo/ prefix to the path if not on localhost
  return location.hostname === "localhost" ? "" : "/farm-sim";
}

function getUrl(path: string) {
  return new URL(path, import.meta.url).href;
}
