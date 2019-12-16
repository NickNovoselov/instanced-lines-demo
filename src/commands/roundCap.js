import { circleGeometry } from './common.js';

export function roundCap(regl, resolution) {
  const roundBuffer = circleGeometry(regl, resolution);
  return regl({
    vert: `
    precision highp float;
    attribute vec2 position;
    uniform vec2 point;
    uniform float width;
    uniform mat4 projection;

    void main() {
      gl_Position = projection * vec4(point + width * position, 0, 1);
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
        buffer: roundBuffer.buffer
      }
    },
    uniforms: {
      point: regl.prop('point'),
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
    viewport: regl.prop('viewport')
  });
}
