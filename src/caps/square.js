import { squareCap } from '../commands/squareCap.js';

export default {
  context: function(params) {
    return squareCap(params.regl);
  },
  render: function(params) {
    params.context.cap({
      pointA: params.scaledData[1],
      pointB: params.scaledData[0],
      width: params.lineWidth,
      colorA: params.highlightCorners ? params.borderColorA : params.colorA,
      colorB: params.highlightCorners ? params.borderColorB : params.colorB,
      projection: params.projection,
      resolution: params.resolution,
      viewport: params.viewport
    });
    params.context.cap({
      pointA: params.scaledData[params.scaledData.length - 2],
      pointB: params.scaledData[params.scaledData.length - 1],
      width: params.lineWidth,
      colorA: params.highlightCorners ? params.borderColorA : params.colorA,
      colorB: params.highlightCorners ? params.borderColorB : params.colorB,
      projection: params.projection,
      resolution: params.resolution,
      viewport: params.viewport
    });
  }
};
