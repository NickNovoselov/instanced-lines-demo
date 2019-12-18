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
        buffer: regl.buffer(segmentInstanceGeometry)
      }
    },
    uniforms: {
      pointA: regl.prop('pointA'),
      pointB: regl.prop('pointB'),
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
    count: segmentInstanceGeometry.length,
    viewport: regl.prop('viewport')
  });
}
