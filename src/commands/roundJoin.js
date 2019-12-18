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
      colorA: regl.prop('colorA'),
      colorB: regl.prop('colorB'),
      projection: regl.prop('projection'),
      resolution: regl.prop('resolution')
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
