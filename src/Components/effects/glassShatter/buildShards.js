/**
 * glassShatter/buildShards.js
 * ─────────────────────────────────────────────────────────────────────
 * Generates a single non-indexed BufferGeometry of hundreds of glass
 * shards covering a plane (W×H, centered at origin, z=0), with per-shard
 * attributes that the vertex shader uses to explode them from an impact.
 *
 * Method: a jittered grid. Grid vertices are randomly nudged (border
 * vertices stay pinned to the plane edges so the plane is fully covered
 * with no gaps and UVs stay in [0,1]). Each cell becomes a quad shard,
 * fan-triangulated from its centroid (centroid → edge glint via aEdge).
 *
 * Shard motion attributes radiate from `impact`, with random depth (z),
 * rotation axis/amount, and a delay that grows with distance from impact
 * (so the break propagates outward from where the user clicked).
 */

import * as THREE from "three";

export function buildShards({ W, H, impactX, impactY, cols, rows, zFactor = 0.55 }) {
  const gx = cols + 1;
  const gy = rows + 1;
  const cellW = W / cols;
  const cellH = H / rows;

  // Jittered grid points (border pinned)
  const pts = new Array(gx * gy);
  for (let j = 0; j < gy; j++) {
    for (let i = 0; i < gx; i++) {
      let x = -W / 2 + (i / cols) * W;
      let y = -H / 2 + (j / rows) * H;
      if (i !== 0 && i !== cols) x += (Math.random() - 0.5) * cellW * 0.62;
      if (j !== 0 && j !== rows) y += (Math.random() - 0.5) * cellH * 0.62;
      pts[j * gx + i] = new THREE.Vector2(x, y);
    }
  }
  const P = (i, j) => pts[j * gx + i];

  const position = [];
  const uv = [];
  const aCenter = [];
  const aDir = [];
  const aAxis = [];
  const aSpin = [];
  const aDelay = [];
  const aEdge = [];

  const maxDist = Math.hypot(W, H) / 2;

  const push = (pt, edge, s) => {
    position.push(pt.x, pt.y, 0);
    uv.push((pt.x + W / 2) / W, (pt.y + H / 2) / H);
    aEdge.push(edge);
    aCenter.push(s.cx, s.cy, 0);
    aDir.push(s.dx, s.dy, s.dz);
    aAxis.push(s.ax, s.ay, s.az);
    aSpin.push(s.spin);
    aDelay.push(s.delay);
  };

  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      const p0 = P(i, j);
      const p1 = P(i + 1, j);
      const p2 = P(i + 1, j + 1);
      const p3 = P(i, j + 1);
      const cx = (p0.x + p1.x + p2.x + p3.x) / 4;
      const cy = (p0.y + p1.y + p2.y + p3.y) / 4;

      // explosion direction: radiate from impact in xy, random depth in z
      let dx = cx - impactX;
      let dy = cy - impactY;
      const len = Math.hypot(dx, dy) || 1;
      dx /= len; dy /= len;
      const mag = 0.6 + Math.random() * 0.85;
      const dz = (Math.random() * 2 - 1) * zFactor;

      // random unit rotation axis
      let ax = Math.random() * 2 - 1;
      let ay = Math.random() * 2 - 1;
      let az = Math.random() * 2 - 1;
      const al = Math.hypot(ax, ay, az) || 1;
      ax /= al; ay /= al; az /= al;

      const dist = Math.hypot(cx - impactX, cy - impactY);
      const s = {
        cx, cy,
        dx: dx * mag, dy: dy * mag, dz,
        ax, ay, az,
        spin: (Math.random() - 0.5) * 4.0,
        delay: (dist / maxDist) * 0.32 + Math.random() * 0.06,
      };

      const c = new THREE.Vector2(cx, cy);
      // fan-triangulate the quad from its centroid
      const tris = [[c, p0, p1], [c, p1, p2], [c, p2, p3], [c, p3, p0]];
      for (let t = 0; t < tris.length; t++) {
        push(tris[t][0], 0, s);   // centroid → edge 0
        push(tris[t][1], 1, s);
        push(tris[t][2], 1, s);
      }
    }
  }

  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(position, 3));
  g.setAttribute("uv",       new THREE.Float32BufferAttribute(uv, 2));
  g.setAttribute("aCenter",  new THREE.Float32BufferAttribute(aCenter, 3));
  g.setAttribute("aDir",     new THREE.Float32BufferAttribute(aDir, 3));
  g.setAttribute("aAxis",    new THREE.Float32BufferAttribute(aAxis, 3));
  g.setAttribute("aSpin",    new THREE.Float32BufferAttribute(aSpin, 1));
  g.setAttribute("aDelay",   new THREE.Float32BufferAttribute(aDelay, 1));
  g.setAttribute("aEdge",    new THREE.Float32BufferAttribute(aEdge, 1));
  return g;
}
