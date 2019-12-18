import { roundCap } from '../commands/roundCap.js';

export default {
  context: function({ regl }) {
    return roundCap(regl, 16);
  },
  render: function(params) {
    params.context.cap({
      point: params.scaledData[0],
      width: params.lineWidth,
      colorA: params.highlightCorners ? params.borderColorA : params.colorA,
      colorB: params.highlightCorners ? params.borderColorB : params.colorB,
      projection: params.projection,
      resolution: params.resolution,
      viewport: params.viewport
    });
    params.context.cap({
      point: params.scaledData[params.scaledData.length - 1],
      width: params.lineWidth,
      colorA: params.highlightCorners ? params.borderColorA : params.colorA,
      colorB: params.highlightCorners ? params.borderColorB : params.colorB,
      projection: params.projection,
      resolution: params.resolution,
      viewport: params.viewport
    });
  }
};
