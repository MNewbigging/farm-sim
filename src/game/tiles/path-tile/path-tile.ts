import * as THREE from "three";
import { Tile } from "../tile";
import pathTileVS from "./path-tile.vs";
import pathTileFS from "./path-tile.fs";
import { AssetManager, TextureAsset } from "../../asset-manager";

export class PathTile extends Tile {
  private readonly vertices: number;

  constructor(
    public readonly rowIndex: number,
    public readonly colIndex: number,
    assetManager: AssetManager
  ) {
    const textureA = assetManager.textures.get(TextureAsset.GrassDiffuse)!;
    const textureB = assetManager.textures.get(TextureAsset.FootpathDiffuse)!;

    const material = new PathTileMaterial(textureA, textureB);

    // Create custom path tile geometry
    const divisions = 4;
    const vertices = divisions + 1;
    const geometry = new THREE.PlaneGeometry(
      1,
      1,
      divisions,
      divisions
    ).rotateX(-Math.PI / 2);

    // Create custom attribute for shader to use
    const pathVertexArray = new Uint8Array(vertices ** 2).fill(255);

    // By default no edges are made of path
    for (let y = 0; y < vertices; y++) {
      for (let x = 0; x < vertices; x++) {
        if (x === 0 || y === 0 || x === vertices - 1 || y === vertices - 1) {
          const stride = y * vertices + x;

          pathVertexArray[stride] = 0;
        }
      }
    }

    const pathAttrib = new THREE.Uint8BufferAttribute(pathVertexArray, 1, true);
    geometry.setAttribute("pathAttribute", pathAttrib);

    super(geometry, material);

    this.vertices = vertices;
  }

  dispose() {
    this.geometry.dispose();
    (this.material as PathTileMaterial).dispose();
  }
}

class PathTileMaterial extends THREE.ShaderMaterial {
  readonly tDiffuseA: THREE.IUniform<THREE.Texture | null>;
  readonly tDiffuseB: THREE.IUniform<THREE.Texture | null>;

  constructor(textureA: THREE.Texture, textureB: THREE.Texture) {
    const tDiffuseA = { value: textureA };
    const tDiffuseB = { value: textureB };

    super({
      glslVersion: THREE.GLSL3,
      vertexShader: pathTileVS,
      fragmentShader: pathTileFS,
      uniforms: {
        tDiffuseA,
        tDiffuseB,
      },
      // wireframe: true,
    });

    this.tDiffuseA = tDiffuseA;
    this.tDiffuseB = tDiffuseB;
  }
}
