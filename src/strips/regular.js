import { interleavedStrip } from '../commands/interleavedStrip.js';

export default {
  context: function({ regl }) {
    return interleavedStrip(regl);
  },
  render: function(params) {
    params.context.strip({
      points: params.buffer,
      width: params.lineWidth,
      colorA: params.colorA,
      colorB: params.colorB,
      projection: params.projection,
      resolution: params.resolution,
      viewport: params.viewport,
      segments: params.pointData.length - 1
    });
  }
};
