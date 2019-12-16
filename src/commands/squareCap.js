import { segmentInstanceGeometry } from './common.js';

export function squareCap(regl) {
  return regl({
    vert: `
      precision highp float;
      attribute vec2 position;
      uniform vec2 pointA, pointB;
      uniform float width;
      uniform mat4 projection;
  
      void main() {
        vec2 xBasis = normalize(pointB - pointA);
        vec2 yBasis = vec2(-xBasis.y, xBasis.x);
        vec2 point = pointB + xBasis * 0.5 * width * position.x + yBasis * width * position.y;
        gl_Position = projection * vec4(point, 0, 1);
    }`,
    frag: `
      precision highp float;
      uniform vec4 color;
      void main() {
        gl_FragColor = color;
      }`,
    depth: {
      enable: false
    },
    attributes: {
      position: {
        buffer: regl.buffer(segmentInstanceGeometry)
      }
    },
    uniforms: {
      pointA: regl.prop('pointA'),
      pointB: regl.prop('pointB'),
      width: regl.prop('width'),
      color: regl.prop('color'),
      projection: regl.prop('projection')
    },
    cull: {
      enable: true,
      face: 'back'
    },
    count: segmentInstanceGeometry.length,
    viewport: regl.prop('viewport')
  });
}
