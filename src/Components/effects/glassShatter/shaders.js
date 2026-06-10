/**
 * glassShatter/shaders.js
 * ─────────────────────────────────────────────────────────────────────
 * GLSL for the glass-shatter transition. All fragment motion runs on the
 * GPU (one draw call for hundreds of shards).
 *
 * Per-shard vertex attributes (see buildShards.js):
 *   aCenter  vec3   shard centroid (rotation pivot + explosion origin)
 *   aDir     vec3   explosion direction (xy radiates from impact; z gives
 *                   depth — +z toward camera, −z away)
 *   aAxis    vec3   random unit rotation axis
 *   aSpin    float  rotation amount (turns)
 *   aDelay   float  per-shard start delay (closer to impact = earlier)
 *   aEdge    float  1 on shard outline verts, 0 at centroid (edge glint)
 */

export const vertexShader = /* glsl */ `
  uniform float uProgress;   // 0 → 1 master progress
  uniform float uTravel;     // world distance shards fly
  uniform float uGravity;    // downward pull
  uniform float uStretch;    // motion-blur-ish elongation along travel

  attribute vec3  aCenter;
  attribute vec3  aDir;
  attribute vec3  aAxis;
  attribute float aSpin;
  attribute float aDelay;
  attribute float aEdge;

  varying vec2  vUv;
  varying float vAlpha;
  varying float vEdge;

  vec3 rotateAxis(vec3 v, vec3 axis, float angle){
    float c = cos(angle);
    float s = sin(angle);
    return v * c + cross(axis, v) * s + axis * dot(axis, v) * (1.0 - c);
  }

  void main(){
    vUv = uv;
    vEdge = aEdge;

    // staggered per-shard progress
    float span = max(1.0 - aDelay, 0.0001);
    float p = clamp((uProgress - aDelay) / span, 0.0, 1.0);
    float e = 1.0 - pow(1.0 - p, 3.0);            // easeOutCubic

    // vertex relative to its shard centroid
    vec3 local = position - aCenter;

    // fake motion blur: elongate the shard along its travel direction
    vec3 dn = length(aDir) > 0.0001 ? normalize(aDir) : vec3(0.0);
    local += dn * dot(local, dn) * (e * uStretch);

    // tumble the shard about its centroid
    vec3 rotated = rotateAxis(local, normalize(aAxis + 0.0001), aSpin * e * 6.2831853);

    // fling the centroid outward + gravity
    vec3 c = aCenter + aDir * (e * uTravel);
    c.y -= uGravity * p * p;

    vec3 displaced = c + rotated;

    vAlpha = 1.0 - smoothstep(0.6, 1.0, p);        // fade out late
    gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);
  }
`;

export const fragmentShader = /* glsl */ `
  precision highp float;

  uniform sampler2D uTexture;

  varying vec2  vUv;
  varying float vAlpha;
  varying float vEdge;

  void main(){
    vec4 tex = texture2D(uTexture, vUv);

    // glass edge glint — brighten the shard outline (fake reflection/refraction)
    float rim = smoothstep(0.45, 1.0, vEdge);
    vec3 col = tex.rgb + rim * vec3(1.0, 0.58, 0.22) * 0.40;   // warm orange-500 glint
    // a touch of cool sheen on the glass body
    col += (1.0 - rim) * vec3(0.10, 0.12, 0.16) * 0.12;

    float a = tex.a * vAlpha;
    if (a < 0.02) discard;
    gl_FragColor = vec4(col, a);
  }
`;
