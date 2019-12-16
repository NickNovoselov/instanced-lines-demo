import { circleGeometry } from './common.js';

export function roundJoin(regl, resolution) {
  const roundBuffer = circleGeometry(regl, resolution);
  return regl({
    vert: `
      precision highp float;
      attribute vec2 position;
      attribute vec2 point;
      uniform float width;
      uniform mat4 projection;
  
      void main() {
        gl_Position = projection * vec4(width * position + point, 0, 1);
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
        buffer: roundBuffer.buffer,
        divisor: 0
      },
      point: {
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
    primitive: 'triangle fan',
    count: roundBuffer.count,
    instances: regl.prop('instances'),
    viewport: regl.prop('viewport')
  });
}
