import * as THREE from "three";
import { GrassWithLeavesTile } from "../grass-tile/grass-tile";
import { AssetManager, ModelAsset, TextureAsset } from "../../asset-manager";

/**
 * Fences are not tiles, they are objects that sit on top of tiles.
 * However they do affect pathfinding, so tiles should be aware of their placement
 * There are also certain rules about their placement; not on paths, soil tiles etc because they are on the inside edge
 *
 * To keep things simple, I'm making a FenceTile which:
 * - being its own tile, can be classed as an obstruction for pathfinding simply
 * - makes placement simpler; replaces grass tile with itself
 * - can contain logic for having fences on each edge
 *
 */

export enum TileEdge {
  Down, // default
  Left,
  Up,
  Right,
}

export function nextTileEdge(curEdge: TileEdge) {
  const edges = [TileEdge.Down, TileEdge.Left, TileEdge.Up, TileEdge.Right];

  if (curEdge + 1 < edges.length) {
    return edges[curEdge + 1];
  } else {
    return TileEdge.Down;
  }
}

export class FenceTile extends GrassWithLeavesTile {
  constructor(
    public readonly rowIndex: number,
    public readonly colIndex: number,
    protected assetManager: AssetManager,
    edge: TileEdge
  ) {
    super(rowIndex, colIndex, assetManager);

    // Build and rotate fence to face correct edge
    const fence = makeFenceProp(assetManager);
    for (let i = 0; i < edge; i++) {
      fence.rotateY(-Math.PI / 2);
    }

    this.add(fence);
  }
}

export function makeFenceProp(assetManager: AssetManager) {
  const group = new THREE.Group();

  const fence = assetManager.getModel(ModelAsset.FenceWood) as THREE.Mesh;
  assetManager.applyModelTexture(fence, TextureAsset.Farm);

  // Would otherwise appear in middle of tile
  fence.position.z += 0.5;

  const leftPole = assetManager.getModel(ModelAsset.FenceWoodPole);
  assetManager.applyModelTexture(leftPole, TextureAsset.Farm);

  leftPole.position.z += 0.5;
  leftPole.position.x -= 0.5;

  const rightPole = assetManager.getModel(ModelAsset.FenceWoodPole);
  assetManager.applyModelTexture(rightPole, TextureAsset.Farm);

  rightPole.position.z += 0.5;
  rightPole.position.x += 0.5;

  group.add(fence, leftPole, rightPole);

  // todo merge these geometries together or be smart about pole placement?
  return group;
}
