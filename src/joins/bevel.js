import { bevelJoin } from '../commands/bevelJoin.js';

export default {
  context: function({ regl }) {
    return bevelJoin(regl);
  },
  render: function(params) {
    params.context.join({
      points: params.buffer,
      width: params.lineWidth,
      color: params.highlightCorners ? params.borderColor : params.color,
      projection: params.projection,
      viewport: params.viewport,
      instances: params.pointData.length - 2
    });
  }
};
