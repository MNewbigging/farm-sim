import * as THREE from "three";
import { Tile } from "../tile";
import pathTileVS from "./path-tile.vs";
import pathTileFS from "./path-tile.fs";
import { AssetManager, TextureAsset } from "../../asset-manager";
import { BlendMaterialParameters, Material } from "../grass-tile/grass-tile";

export class PathTile extends Tile {
  private readonly vertices: number;

  constructor(rowIndex: number, colIndex: number, assetManager: AssetManager) {
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

    super(geometry, material, rowIndex, colIndex);

    this.vertices = vertices;
  }

  dispose() {
    this.geometry.dispose();
    (this.material as PathTileMaterial).dispose();
  }

  setConnectUpLeft(connected: boolean) {
    const pathAttrib = this.geometry.getAttribute("pathAttribute");

    const value = connected ? 255 : 0;

    pathAttrib.array[0] === value;

    pathAttrib.needsUpdate = true;
  }

  setConnectUp(connected: boolean) {
    const pathAttrib = this.geometry.getAttribute("pathAttribute");

    const value = connected ? 255 : 0;

    pathAttrib.array[1] = value;
    pathAttrib.array[2] = value;
    pathAttrib.array[3] = value;

    pathAttrib.needsUpdate = true;
  }

  setConnectUpRight(connected: boolean) {
    const pathAttrib = this.geometry.getAttribute("pathAttribute");

    const value = connected ? 255 : 0;

    pathAttrib.array[4] === value;

    pathAttrib.needsUpdate = true;
  }

  setConnectRight(connected: boolean) {
    const pathAttrib = this.geometry.getAttribute("pathAttribute");

    const value = connected ? 255 : 0;

    pathAttrib.array[9] = value;
    pathAttrib.array[14] = value;
    pathAttrib.array[19] = value;

    pathAttrib.needsUpdate = true;
  }

  setConnectDownRight(connected: boolean) {
    const pathAttrib = this.geometry.getAttribute("pathAttribute");

    const value = connected ? 255 : 0;

    pathAttrib.array[24] === value;

    pathAttrib.needsUpdate = true;
  }

  setConnectDown(connected: boolean) {
    const pathAttrib = this.geometry.getAttribute("pathAttribute");

    const value = connected ? 255 : 0;

    pathAttrib.array[21] = value;
    pathAttrib.array[22] = value;
    pathAttrib.array[23] = value;

    pathAttrib.needsUpdate = true;
  }

  setConnectDownLeft(connected: boolean) {
    const pathAttrib = this.geometry.getAttribute("pathAttribute");

    const value = connected ? 255 : 0;

    pathAttrib.array[20] === value;

    pathAttrib.needsUpdate = true;
  }

  setConnectLeft(connected: boolean) {
    const pathAttrib = this.geometry.getAttribute("pathAttribute");

    const value = connected ? 255 : 0;

    pathAttrib.array[5] = value;
    pathAttrib.array[10] = value;
    pathAttrib.array[15] = value;

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
