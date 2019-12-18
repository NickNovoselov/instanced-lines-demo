import { miterJoin } from '../commands/miterJoin.js';

export default {
  context: function({ regl }) {
    return miterJoin(regl);
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
