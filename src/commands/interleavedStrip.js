import { segmentInstanceGeometry } from './common.js';

export function interleavedStrip(regl) {
  return regl({
    vert: `
      precision highp float;
      attribute vec2 position;
      attribute vec2 pointA, pointB;
      uniform float width;
      uniform mat4 projection;
  
      void main() {
        vec2 xBasis = pointB - pointA;
        vec2 yBasis = normalize(vec2(-xBasis.y, xBasis.x));
        vec2 point = pointA + xBasis * position.x + yBasis * width * position.y;
        gl_Position = projection * vec4(point, 0, 1);
      }`,

    frag: `
      precision highp float;
      uniform vec4 color;
      void main() {
        gl_FragColor = color;
      }`,

    attributes: {
      position: {
        buffer: regl.buffer(segmentInstanceGeometry),
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
      }
    },

    uniforms: {
      width: regl.prop('width'),
      color: regl.prop('color'),
      projection: regl.prop('projection')
    },

    cull: {
      enable: true,
      face: 'back'
    },

    depth: {
      enable: false
    },

    count: segmentInstanceGeometry.length,
    instances: regl.prop('segments'),
    viewport: regl.prop('viewport')
  });
}
