import { roundJoin } from '../commands/roundJoin.js';

export default {
  context: function(params) {
    return roundJoin(params.regl, 16);
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
