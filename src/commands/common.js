export const segmentInstanceGeometry = [
  [0, -0.5],
  [1, -0.5],
  [1, 0.5],
  [0, -0.5],
  [1, 0.5],
  [0, 0.5]
];

export function circleGeometry(regl, resolution) {
  const position = [[0, 0]];
  for (let wedge = 0; wedge <= resolution; wedge++) {
    const theta = (2 * Math.PI * wedge) / resolution;
    position.push([0.5 * Math.cos(theta), 0.5 * Math.sin(theta)]);
  }
  return {
    buffer: regl.buffer(position),
    count: position.length
  };
}

export const instanceMiterJoin = [
  [0, 0, 0],
  [1, 0, 0],
  [0, 1, 0],
  [0, 0, 0],
  [0, 1, 0],
  [0, 0, 1]
];

export const instanceBevelJoin = [[0, 0], [1, 0], [0, 1]];
