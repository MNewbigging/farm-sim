import * as THREE from "three";

export class BuildCursor extends THREE.Mesh {
  declare material: THREE.MeshBasicMaterial;

  constructor() {
    const geometry = new THREE.PlaneGeometry(); // default size 1m sq
    const material = new THREE.MeshBasicMaterial({
      color: "white",
      transparent: true,
      opacity: 0.3,
    });

    super(geometry, material);

    this.rotateX(-Math.PI / 2);
  }

  setColour(color: THREE.ColorRepresentation) {
    this.material.color.set(color);
  }
}
