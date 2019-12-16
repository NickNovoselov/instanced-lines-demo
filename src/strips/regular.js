import { interleavedStrip } from '../commands/interleavedStrip.js';

export default {
  context: function({ regl }) {
    return interleavedStrip(regl);
  },
  render: function(params) {
    params.context.strip({
      points: params.buffer,
      width: params.lineWidth,
      color: params.color,
      projection: params.projection,
      viewport: params.viewport,
      segments: params.pointData.length - 1
    });
  }
};
