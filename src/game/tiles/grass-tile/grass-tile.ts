import * as THREE from "three";
import { Tile } from "../tile";
import grassTileVS from "./grass-tile.vs";
import grassTileFS from "./grass-tile.fs";
import { AssetManager, TextureAsset } from "../../asset-manager";

export class GrassWithLeavesTile extends Tile {
  constructor(
    public readonly rowIndex: number,
    public readonly colIndex: number,
    protected assetManager: AssetManager
  ) {
    const diffuseA = assetManager.textures.get(TextureAsset.GrassDiffuse)!;
    const normalA = assetManager.textures.get(TextureAsset.GrassNormal)!;
    const diffuseB = assetManager.textures.get(
      TextureAsset.GrassLeavesDiffuse
    )!;
    const normalB = assetManager.textures.get(TextureAsset.GrassLeavesNormal)!;

    const material = new TextureBlendMaterial({
      textureA: { diffuse: diffuseA, normal: normalA },
      textureB: { diffuse: diffuseB, normal: normalB },
    });
    const geometry = new THREE.PlaneGeometry().rotateX(-Math.PI / 2);

    super(geometry, material);
  }

  dispose() {
    this.geometry.dispose();
    (this.material as TextureBlendMaterial).dispose();
  }
}

export interface Material {
  diffuse: THREE.Texture;
  normal: THREE.Texture;
}

export interface BlendMaterialParameters {
  textureA: Material;
  textureB: Material;
}

class TextureBlendMaterial extends THREE.ShaderMaterial {
  readonly materialA: THREE.IUniform<Material>;
  readonly materialB: THREE.IUniform<Material>;

  constructor(params: BlendMaterialParameters) {
    const materialA = {
      value: {
        diffuse: params.textureA.diffuse,
        normal: params.textureA.normal,
      },
    };

    const materialB = {
      value: {
        diffuse: params.textureB.diffuse,
        normal: params.textureB.normal,
      },
    };

    super({
      glslVersion: THREE.GLSL3,
      vertexShader: grassTileVS,
      fragmentShader: grassTileFS,
      uniforms: {
        materialA,
        materialB,
      },
    });

    this.materialA = materialA;
    this.materialB = materialB;
  }
}
