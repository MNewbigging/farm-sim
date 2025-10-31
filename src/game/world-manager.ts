import * as THREE from "three";
import { GrassWithLeavesTile } from "./tiles/grass-tile/grass-tile";
import { Tile } from "./tiles/tile";
import { AssetManager } from "./asset-manager";
import { setNdc } from "../utils/utils";

export class WorldManager {
  private readonly worldGridSize = 10;
  private groundTiles: Tile[][] = [];

  private ndc = new THREE.Vector2();
  private raycaster = new THREE.Raycaster();

  constructor(
    private scene: THREE.Scene,
    private camera: THREE.Camera,
    private assetManager: AssetManager
  ) {}

  buildWorld() {
    this.createGroundTiles();
  }

  getTile(rowIndex: number, colIndex: number) {
    return this.groundTiles[rowIndex][colIndex];
  }

  getTileNeighbours(
    rowIndex: number,
    colIndex: number
  ): { up?: Tile; down?: Tile; left?: Tile; right?: Tile } {
    const up =
      rowIndex - 1 >= 0 ? this.groundTiles[rowIndex - 1][colIndex] : undefined;

    const down =
      rowIndex + 1 < this.groundTiles.length
        ? this.groundTiles[rowIndex + 1][colIndex]
        : undefined;

    const left =
      colIndex - 1 >= 0 ? this.groundTiles[rowIndex][colIndex - 1] : undefined;

    const right =
      colIndex + 1 < this.groundTiles[0].length
        ? this.groundTiles[rowIndex][colIndex + 1]
        : undefined;

    return { up, down, left, right };
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
}
