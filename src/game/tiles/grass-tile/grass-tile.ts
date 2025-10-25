import * as THREE from "three";
import { Tile } from "../tile";
import grassTileVS from "./grass-tile.vs";
import grassTileFS from "./grass-tile.fs";
import { AssetManager, TextureAsset } from "../../asset-manager";

export class GrassWithLeavesTile extends Tile {
  constructor(
    public readonly rowIndex: number,
    public readonly colIndex: number,
    assetManager: AssetManager
  ) {
    const textureA = assetManager.textures.get(TextureAsset.GrassDiffuse)!;
    const textureB = assetManager.textures.get(
      TextureAsset.GrassLeavesDiffuse
    )!;

    const material = new TextureBlendMaterial(textureA, textureB);
    const geometry = new THREE.PlaneGeometry().rotateX(-Math.PI / 2);

    super(geometry, material);
  }

  dispose() {
    this.geometry.dispose();
    (this.material as TextureBlendMaterial).dispose();
  }
}

class TextureBlendMaterial extends THREE.ShaderMaterial {
  readonly tDiffuseA: THREE.IUniform<THREE.Texture | null>;
  readonly tDiffuseB: THREE.IUniform<THREE.Texture | null>;

  constructor(textureA: THREE.Texture, textureB: THREE.Texture) {
    const tDiffuseA = { value: textureA };
    const tDiffuseB = { value: textureB };

    super({
      glslVersion: THREE.GLSL3,
      vertexShader: grassTileVS,
      fragmentShader: grassTileFS,
      uniforms: {
        tDiffuseA,
        tDiffuseB,
      },
    });

    this.tDiffuseA = tDiffuseA;
    this.tDiffuseB = tDiffuseB;
  }
}
