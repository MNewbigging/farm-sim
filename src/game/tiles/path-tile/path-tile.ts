import * as THREE from "three";
import { Tile, TileNeighbours } from "../tile";
import pathTileVS from "./path-tile.vs";
import pathTileFS from "./path-tile.fs";
import { AssetManager, TextureAsset } from "../../asset-manager";
import { BlendMaterialParameters, Material } from "../grass-tile/grass-tile";

export class PathTile extends Tile {
  private readonly vertices: number;

  constructor(
    public readonly rowIndex: number,
    public readonly colIndex: number,
    assetManager: AssetManager
  ) {
    const diffuseA = assetManager.textures.get(TextureAsset.GrassDiffuse)!;
    const normalA = assetManager.textures.get(TextureAsset.GrassNormal)!;
    const diffuseB = assetManager.textures.get(TextureAsset.FootpathDiffuse)!;
    const normalB = assetManager.textures.get(TextureAsset.FootpathNormal)!;

    const material = new PathTileMaterial({
      textureA: { diffuse: diffuseA, normal: normalA },
      textureB: { diffuse: diffuseB, normal: normalB },
    });

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

    geometry.computeVertexNormals();
    geometry.computeTangents();

    super(geometry, material);

    this.vertices = vertices;
  }

  dispose() {
    this.geometry.dispose();
    (this.material as PathTileMaterial).dispose();
  }

  connectUpLeft() {
    const pathAttrib = this.geometry.getAttribute("pathAttribute");

    pathAttrib.array[0] === 255;

    pathAttrib.needsUpdate = true;
  }

  connectUp() {
    const pathAttrib = this.geometry.getAttribute("pathAttribute");

    pathAttrib.array[1] = 255;
    pathAttrib.array[2] = 255;
    pathAttrib.array[3] = 255;

    pathAttrib.needsUpdate = true;
  }

  connectUpRight() {
    const pathAttrib = this.geometry.getAttribute("pathAttribute");

    pathAttrib.array[4] === 255;

    pathAttrib.needsUpdate = true;
  }

  connectRight() {
    const pathAttrib = this.geometry.getAttribute("pathAttribute");

    pathAttrib.array[9] = 255;
    pathAttrib.array[14] = 255;
    pathAttrib.array[19] = 255;

    pathAttrib.needsUpdate = true;
  }

  connectDownRight() {
    const pathAttrib = this.geometry.getAttribute("pathAttribute");

    pathAttrib.array[24] === 255;

    pathAttrib.needsUpdate = true;
  }

  connectDown() {
    const pathAttrib = this.geometry.getAttribute("pathAttribute");

    pathAttrib.array[21] = 255;
    pathAttrib.array[22] = 255;
    pathAttrib.array[23] = 255;

    pathAttrib.needsUpdate = true;
  }

  connectDownLeft() {
    const pathAttrib = this.geometry.getAttribute("pathAttribute");

    pathAttrib.array[20] === 255;

    pathAttrib.needsUpdate = true;
  }

  connectLeft() {
    const pathAttrib = this.geometry.getAttribute("pathAttribute");

    pathAttrib.array[5] = 255;
    pathAttrib.array[10] = 255;
    pathAttrib.array[15] = 255;

    pathAttrib.needsUpdate = true;
  }
}

class PathTileMaterial extends THREE.ShaderMaterial {
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
      vertexShader: pathTileVS,
      fragmentShader: pathTileFS,
      uniforms: {
        materialA,
        materialB,
        sunDirection_W: { value: new THREE.Vector3() },
      },
      // wireframe: true,
    });

    this.materialA = materialA;
    this.materialB = materialB;
  }
}
