import { instanceBevelJoin } from './common.js';

export function bevelJoin(regl) {
  return regl({
    vert: `
    precision highp float;
    attribute vec2 pointA, pointB, pointC;
    attribute vec2 position;
    uniform float width;
    uniform mat4 projection;

    void main() {
      vec2 tangent = normalize(normalize(pointC - pointB) + normalize(pointB - pointA));
      vec2 normal = vec2(-tangent.y, tangent.x);
      vec2 ab = pointB - pointA;
      vec2 cb = pointB - pointC;
      float sigma = sign(dot(ab + cb, normal));
      vec2 abn = normalize(vec2(-ab.y, ab.x));
      vec2 cbn = -normalize(vec2(-cb.y, cb.x));
      vec2 p0 = 0.5 * sigma * width * (sigma < 0.0 ? abn : cbn);
      vec2 p1 = 0.5 * sigma * width * (sigma < 0.0 ? cbn : abn);
      vec2 point = pointB + position.x * p0 + position.y * p1;
      gl_Position = projection * vec4(point, 0, 1);
    }`,
    frag: `
      precision highp float;
      uniform vec4 colorA;
      uniform vec4 colorB;
      uniform vec2 resolution;
      void main() {
        vec2 st = gl_FragCoord.xy / resolution.xy;
        vec3 pct = vec3(st.x);
        vec3 color = mix(vec3(colorA), vec3(colorB), pct);
    
        gl_FragColor = vec4(color, 1.0);
      }`,
    depth: {
      enable: false
    },
    attributes: {
      position: {
        buffer: regl.buffer(instanceBevelJoin),
        divisor: 0
      },
      pointA: {
        buffer: regl.prop('points'),
        divisor: 1,
        offset: Float32Array.BYTES_PER_ELEMENT * 0
      },
      pointB: {
        buffer: regl.prop('points'),
        divisor: 1,
        offset: Float32Array.BYTES_PER_ELEMENT * 2
      },
      pointC: {
        buffer: regl.prop('points'),
        divisor: 1,
        offset: Float32Array.BYTES_PER_ELEMENT * 4
      }
    },
    uniforms: {
      width: regl.prop('width'),
      colorA: regl.prop('colorA'),
      colorB: regl.prop('colorB'),
      projection: regl.prop('projection'),
      resolution: regl.prop('resolution')
    },
    cull: {
      enable: true,
      face: 'back'
    },
    count: instanceBevelJoin.length,
    instances: regl.prop('instances'),
    viewport: regl.prop('viewport')
  });
}
