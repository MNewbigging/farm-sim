import * as THREE from "three";
import { GrassWithLeavesTile } from "./tiles/grass-tile/grass-tile";
import { Tile, TileNeighbours } from "./tiles/tile";
import { AssetManager } from "./asset-manager";
import { setNdc } from "../utils/utils";
import { CropTile } from "./tiles/crop-tile/crop-tile";

export class WorldManager {
  private readonly worldGridSize = 50;
  private groundTiles: Tile[][] = [];

  private ndc = new THREE.Vector2();
  private raycaster = new THREE.Raycaster();

  constructor(
    private scene: THREE.Scene,
    private camera: THREE.Camera,
    private assetManager: AssetManager
  ) {}

  // todo don't loop here and above...
  // we should probably store a set of each type, so that we can update them explicitly
  updateTiles(dt: number, elapsed: number, sun: THREE.DirectionalLight) {
    for (const row of this.groundTiles) {
      for (const tile of row) {
        if (tile instanceof CropTile) {
          tile.update(dt, elapsed);
        }

        this.updateSunUniforms(tile, sun);
      }
    }
  }

  buildWorld() {
    this.createGroundTiles();
  }

  getTile(rowIndex: number, colIndex: number) {
    return this.groundTiles[rowIndex][colIndex];
  }

  getTileNeighbours(tile: Tile): TileNeighbours {
    const { rowIndex, colIndex } = tile;

    const upRow = rowIndex - 1;
    const downRow = rowIndex + 1;
    const leftCol = colIndex - 1;
    const rightCol = colIndex + 1;

    const upOk = () => upRow >= 0;
    const downOk = () => downRow < this.groundTiles.length;
    const leftOk = () => leftCol >= 0;
    const rightOk = () => rightCol < this.groundTiles[0].length;

    // Always in order of TileNeighbour enum for easier lookup
    const upLeft =
      upOk() && leftOk() ? this.groundTiles[upRow][leftCol] : undefined;

    const up = upOk() ? this.groundTiles[upRow][colIndex] : undefined;

    const upRight =
      upOk() && rightOk() ? this.groundTiles[upRow][rightCol] : undefined;

    const right = rightOk() ? this.groundTiles[rowIndex][rightCol] : undefined;

    const downRight =
      downOk() && rightOk() ? this.groundTiles[downRow][rightCol] : undefined;

    const down = downOk() ? this.groundTiles[downRow][colIndex] : undefined;

    const downLeft =
      downOk() && leftOk() ? this.groundTiles[downRow][leftCol] : undefined;

    const left = leftOk() ? this.groundTiles[rowIndex][leftCol] : undefined;

    return { upLeft, up, upRight, right, downRight, down, downLeft, left };
  }

  replaceTile(newTile: Tile) {
    const { rowIndex, colIndex } = newTile;

    // Remove & dispose of last tile
    const oldTile = this.getTile(rowIndex, colIndex);
    this.scene.remove(oldTile);
    oldTile.dispose();

    // Position, replace and show new tile
    this.positionTile(newTile);
    this.groundTiles[rowIndex][colIndex] = newTile;
    this.scene.add(newTile);
  }

  getIntersectedTile(event: MouseEvent) {
    setNdc(event, this.ndc);
    this.raycaster.setFromCamera(this.ndc, this.camera);

    for (const row of this.groundTiles) {
      for (const tile of row) {
        const intersections = this.raycaster.intersectObject(tile, false);

        if (intersections.length) {
          return tile;
        }
      }
    }
  }

  private createGroundTiles() {
    // Ground tiles
    for (let rowIndex = 0; rowIndex < this.worldGridSize; rowIndex++) {
      // Rows move down z axis positively
      const tileRow: Tile[] = [];

      for (let colIndex = 0; colIndex < this.worldGridSize; colIndex++) {
        // Columns move along x axis positively
        const tile = new GrassWithLeavesTile(
          rowIndex,
          colIndex,
          this.assetManager
        );
        this.positionTile(tile);
        tileRow.push(tile);
        this.scene.add(tile);
      }

      // Now push in the completed row
      this.groundTiles.push(tileRow);
    }
  }

  private positionTile(tile: Tile) {
    const { rowIndex, colIndex } = tile; // will have already been set in constructor
    // For now, tiles are 1m squared meaning we can just use the index itself as the positional value
    tile.position.set(colIndex, 0, rowIndex); // note rows are along z axis
  }

  private updateSunUniforms(tile: Tile, sun: THREE.DirectionalLight) {
    if (!(tile.material instanceof THREE.ShaderMaterial)) return;

    tile.material.uniforms["sunDirection_W"].value
      .set(sun.position.x * -1, sun.position.y, sun.position.z * -1)
      .normalize();
  }
}
