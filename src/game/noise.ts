import { Vector2, Vector4 } from "three";

// Classic Perlin 2D Noise in TypeScript + Three.js
// Adapted from Stefan Gustavson's implementation

function fade(t: Vector2): Vector2 {
  return new Vector2(
    t.x * t.x * t.x * (t.x * (t.x * 6.0 - 15.0) + 10.0),
    t.y * t.y * t.y * (t.y * (t.y * 6.0 - 15.0) + 10.0)
  );
}

function permute(x: Vector4): Vector4 {
  // ((x * 34.0) + 1.0) * x mod 289.0
  return new Vector4(
    ((x.x * 34.0 + 1.0) * x.x) % 289.0,
    ((x.y * 34.0 + 1.0) * x.y) % 289.0,
    ((x.z * 34.0 + 1.0) * x.z) % 289.0,
    ((x.w * 34.0 + 1.0) * x.w) % 289.0
  );
}

export function cnoise(P: Vector2): number {
  const Pi = new Vector4(
    Math.floor(P.x),
    Math.floor(P.y),
    Math.floor(P.x) + 1.0,
    Math.floor(P.y) + 1.0
  );

  const Pf = new Vector4(
    P.x - Math.floor(P.x),
    P.y - Math.floor(P.y),
    P.x - Math.floor(P.x) - 1.0,
    P.y - Math.floor(P.y) - 1.0
  );

  const PiMod = new Vector4(
    Pi.x % 289.0,
    Pi.y % 289.0,
    Pi.z % 289.0,
    Pi.w % 289.0
  );

  const ix = new Vector4(PiMod.x, PiMod.z, PiMod.x, PiMod.z);
  const iy = new Vector4(PiMod.y, PiMod.y, PiMod.w, PiMod.w);
  const fx = new Vector4(Pf.x, Pf.z, Pf.x, Pf.z);
  const fy = new Vector4(Pf.y, Pf.y, Pf.w, Pf.w);

  const i = permute(permute(ix).add(iy));

  let gx = new Vector4(
    2.0 * ((i.x * 0.0243902439) % 1.0) - 1.0,
    2.0 * ((i.y * 0.0243902439) % 1.0) - 1.0,
    2.0 * ((i.z * 0.0243902439) % 1.0) - 1.0,
    2.0 * ((i.w * 0.0243902439) % 1.0) - 1.0
  );

  const gy = new Vector4(
    Math.abs(gx.x) - 0.5,
    Math.abs(gx.y) - 0.5,
    Math.abs(gx.z) - 0.5,
    Math.abs(gx.w) - 0.5
  );

  const tx = new Vector4(
    Math.floor(gx.x + 0.5),
    Math.floor(gx.y + 0.5),
    Math.floor(gx.z + 0.5),
    Math.floor(gx.w + 0.5)
  );

  gx.sub(tx);

  const g00 = new Vector2(gx.x, gy.x);
  const g10 = new Vector2(gx.y, gy.y);
  const g01 = new Vector2(gx.z, gy.z);
  const g11 = new Vector2(gx.w, gy.w);

  const norm = new Vector4(
    1.79284291400159 - 0.85373472095314 * g00.dot(g00),
    1.79284291400159 - 0.85373472095314 * g01.dot(g01),
    1.79284291400159 - 0.85373472095314 * g10.dot(g10),
    1.79284291400159 - 0.85373472095314 * g11.dot(g11)
  );

  g00.multiplyScalar(norm.x);
  g01.multiplyScalar(norm.y);
  g10.multiplyScalar(norm.z);
  g11.multiplyScalar(norm.w);

  const n00 = g00.dot(new Vector2(fx.x, fy.x));
  const n10 = g10.dot(new Vector2(fx.y, fy.y));
  const n01 = g01.dot(new Vector2(fx.z, fy.z));
  const n11 = g11.dot(new Vector2(fx.w, fy.w));

  const fadeXY = fade(new Vector2(Pf.x, Pf.y));
  const nx = new Vector2(
    n00 + fadeXY.x * (n10 - n00),
    n01 + fadeXY.x * (n11 - n01)
  );

  const nxy = nx.x + fadeXY.y * (nx.y - nx.x);

  return 2.3 * nxy;
}
