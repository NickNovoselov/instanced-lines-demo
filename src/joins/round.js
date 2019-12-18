import { roundJoin } from '../commands/roundJoin.js';

export default {
  context: function(params) {
    return roundJoin(params.regl, 16);
  },
  render: function(params) {
    params.context.join({
      points: params.buffer,
      width: params.lineWidth,
      colorA: params.highlightCorners ? params.borderColorA : params.colorA,
      colorB: params.highlightCorners ? params.borderColorB : params.colorB,
      projection: params.projection,
      resolution: params.resolution,
      viewport: params.viewport,
      instances: params.pointData.length - 2
    });
  }
};
