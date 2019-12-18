import { instanceMiterJoin } from './common.js';

export function miterJoin(regl) {
  return regl({
    vert: `
      precision highp float;
      attribute vec2 pointA, pointB, pointC;
      attribute vec3 position;
      uniform float width;
      uniform mat4 projection;
  
      void main() {
        // Find the miter vector.
        vec2 tangent = normalize(normalize(pointC - pointB) + normalize(pointB - pointA));
        vec2 miter = vec2(-tangent.y, tangent.x);

        // Find the perpendicular vectors.
        vec2 ab = pointB - pointA;
        vec2 cb = pointB - pointC;
        vec2 abNorm = normalize(vec2(-ab.y, ab.x));
        vec2 cbNorm = -normalize(vec2(-cb.y, cb.x));

        // Determine the bend direction.
        float sigma = sign(dot(ab + cb, miter));

        // Calculate the basis vectors for the miter geometry.
        vec2 p0 = 0.5 * width * sigma * (sigma < 0.0 ? abNorm : cbNorm);
        vec2 p1 = 0.5 * miter * sigma * width / dot(miter, abNorm);
        vec2 p2 = 0.5 * width * sigma * (sigma < 0.0 ? cbNorm : abNorm);

        // Calculate the final point position.
        vec2 point = pointB + position.x * p0 + position.y * p1 + position.z * p2;
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
        buffer: regl.buffer(instanceMiterJoin),
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
    count: instanceMiterJoin.length,
    instances: regl.prop('instances'),
    viewport: regl.prop('viewport')
  });
}
