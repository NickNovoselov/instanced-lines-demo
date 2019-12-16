import { mat4 } from 'gl-matrix';
import * as strips from './strips';
import * as joins from './joins';
import * as caps from './caps';

export function generateSamplePointsInterleaved(width, height) {
  const stepx = width / 9;
  const stepy = height / 3;
  const points = [];

  for (let x = 1; x < 9; x += 2) {
    points.push([(x + 0) * stepx - width / 2, 1 * stepy - height / 2]);
    points.push([(x + 1) * stepx - width / 2, 2 * stepy - height / 2]);
  }

  return points;
}

export const convertColor = (color) => [...color.map(c => c / 255), 1];

export class Demo {
  constructor({
    canvas,
    regl,
    linejoin = 'miter',
    linecap = 'butt',
    linestrip = 'regular',
    highlightCorners = true,
    color = [255, 248, 222],
    borderColor = [255, 0, 0],
    lineWidth = 2,
    borderWidth = 0
  } = {}) {
    this.regl = regl;
    this.canvas = canvas;
    this.context = {};
    this.linejoin = linejoin;
    this.linecap = linecap;
    this.linestrip = linestrip;
    this.highlightCorners = highlightCorners;
    this.color = color;
    this.borderColor = borderColor;
    this.lineWidth = lineWidth;
    this.borderWidth = borderWidth;
    this.stop = false;

    const projection = mat4.ortho(
      mat4.create(),
      -canvas.width / 2,
      canvas.width / 2,
      -canvas.height / 2,
      canvas.height / 2,
      0,
      -1
    );

    const pointData = generateSamplePointsInterleaved(
      canvas.width,
      canvas.height
    );

    const buffer = this.regl.buffer(pointData);

    let tick = 0;
    const loop = () => {
      if (this.stop) {
        return;
      }
      requestAnimationFrame(loop);

      tick++;
      const scale = 0.45 * Math.sin(tick * 0.04) + 0.75;
      const scaledData = [];

      for (const point of pointData) {
        scaledData.push([point[0] * scale, point[1]]);
      }

      buffer({
        data: scaledData
      });

      const viewport = {
        x: 0,
        y: 0,
        width: this.canvas.width,
        height: this.canvas.height
      };

      if (this.borderWidth > 0) {
        this.render({
          regl: this.regl,
          context: this.context,
          buffer,
          canvas: this.canvas,
          projection,
          viewport,
          pointData,
          scaledData,
          highlightCorners: false,
          color: this.borderColorHex,
          borderColor: this.borderColorHex,
          lineWidth: this.lineWidth + this.borderWidth * 2
        });
      }

      this.render({
        regl: this.regl,
        context: this.context,
        buffer,
        canvas: this.canvas,
        projection,
        viewport,
        pointData,
        scaledData,
        highlightCorners: this.highlightCorners,
        color: this.colorHex,
        borderColor: this.borderColorHex,
        lineWidth: this.lineWidth
      });
    };

    requestAnimationFrame(loop);
  }

  render(params) {
    this.renderStrip(params);
    this.renderJoin(params);
    this.renderCap(params);
  }

  set linestrip(linestrip) {
    const strip = strips[linestrip];

    if (!strip) {
      throw Error(`linestrip ${linestrip} is not defined`);
    }

    this.strip = linestrip;
    this.context.strip = strip.context({ regl: this.regl, canvas: this.canvas, lineWidth: this.lineWidth });
    this.renderStrip = strip.render;
  }

  get linestrip() {
    return this.strip;
  }

  set linejoin(linejoin) {
    const join = joins[linejoin];

    if (!join) {
      throw Error(`linejoin ${linejoin} is not defined`);
    }

    this.join = linejoin;
    this.context.join = join.context({ regl: this.regl, canvas: this.canvas, lineWidth: this.lineWidth });
    this.renderJoin = join.render;
  }

  get linejoin() {
    return this.join;
  }

  set linecap(linecap) {
    const cap = caps[linecap];

    if (!cap) {
      throw Error(`linejoin ${linecap} is not defined`);
    }

    this.cap = linecap;
    this.context.cap = cap.context({ regl: this.regl, canvas: this.canvas, lineWidth: this.lineWidth });
    this.renderCap = cap.render;
  }

  get linecap() {
    return this.cap;
  }

  set color(color) {
    this.colorRGB = color;
    this.colorHex = convertColor(color);
  }

  get color() {
    return this.colorRGB;
  }

  set borderColor(borderColor) {
    this.borderColorRGB = borderColor;
    this.borderColorHex = convertColor(borderColor);
  }

  get borderColor() {
    return this.borderColorRGB;
  }

  destroy() {
    this.regl.destroy();
  }
}
