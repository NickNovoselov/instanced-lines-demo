import { mat4 } from 'gl-matrix';
import * as strips from './strips';
import * as joins from './joins';
import * as caps from './caps';

export const convertColor = color => [...color.map(c => c / 255), 1];

export class Demo {
  constructor({
    canvas,
    regl,
    linejoin = 'miter',
    linecap = 'butt',
    linestrip = 'regular',
    pointData = [],
    highlightCorners = true,
    colorA = [46, 46, 46],
    colorB = [255, 255, 255],
    borderColorA = [255, 50, 50],
    borderColorB = [255, 0, 0],
    lineWidth = 2,
    borderWidth = 0
  } = {}) {
    this.regl = regl;
    this.canvas = canvas;
    this.context = {};
    this.pointData = pointData;
    this.linejoin = linejoin;
    this.linecap = linecap;
    this.linestrip = linestrip;
    this.highlightCorners = highlightCorners;
    this.colorA = colorA;
    this.colorB = colorB;
    this.borderColorA = borderColorA;
    this.borderColorB = borderColorB;
    this.lineWidth = lineWidth;
    this.borderWidth = borderWidth;
    this.stop = false;
    this.animate = true;

    const projection = mat4.ortho(
      mat4.create(),
      -canvas.width / 2,
      canvas.width / 2,
      -canvas.height / 2,
      canvas.height / 2,
      0,
      -1
    );

    let tick = 0;
    const loop = () => {
      if (this.stop) {
        return;
      }
      requestAnimationFrame(loop);
      if (this.animate) {
        tick++;
      }

      const scale = 0.45 * Math.sin(tick * 0.04) + 0.75;
      const scaledData = [];

      for (const point of this.pointData) {
        scaledData.push([point[0] * scale, point[1]]);
      }

      this.buffer({
        data: scaledData
      });

      const viewport = {
        x: 0,
        y: 0,
        width: this.canvas.width,
        height: this.canvas.height
      };

      const resolution = [this.canvas.width, this.canvas.height];

      if (this.borderWidth > 0) {
        this.render({
          regl: this.regl,
          context: this.context,
          buffer: this.buffer,
          canvas: this.canvas,
          projection,
          viewport,
          resolution,
          pointData: this.pointData,
          scaledData,
          highlightCorners: false,
          colorA: this.borderColorAHex,
          colorB: this.borderColorBHex,
          borderColorA: this.borderColorAHex,
          borderColorB: this.borderColorBHex,
          lineWidth: this.lineWidth + this.borderWidth * 2
        });
      }

      this.render({
        regl: this.regl,
        context: this.context,
        buffer: this.buffer,
        canvas: this.canvas,
        projection,
        viewport,
        resolution,
        pointData: this.pointData,
        scaledData,
        highlightCorners: this.highlightCorners,
        colorA: this.colorAHex,
        colorB: this.colorBHex,
        borderColorA: this.borderColorAHex,
        borderColorB: this.borderColorBHex,
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

  set pointData(pointData) {
    this.points = pointData;

    this.buffer = this.regl.buffer(pointData);
  }

  get pointData() {
    return this.points;
  }

  set linestrip(linestrip) {
    const strip = strips[linestrip];

    if (!strip) {
      throw Error(`linestrip ${linestrip} is not defined`);
    }

    this.strip = linestrip;
    this.context.strip = strip.context({
      regl: this.regl,
      canvas: this.canvas,
      lineWidth: this.lineWidth
    });
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
    this.context.join = join.context({
      regl: this.regl,
      canvas: this.canvas,
      lineWidth: this.lineWidth
    });
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
    this.context.cap = cap.context({
      regl: this.regl,
      canvas: this.canvas,
      lineWidth: this.lineWidth
    });
    this.renderCap = cap.render;
  }

  get linecap() {
    return this.cap;
  }

  set colorA(colorA) {
    this.colorARGB = colorA;
    this.colorAHex = convertColor(colorA);
  }

  get colorA() {
    return this.colorARGB;
  }

  set colorB(colorB) {
    this.colorBRGB = colorB;
    this.colorBHex = convertColor(colorB);
  }

  get colorB() {
    return this.colorBRGB;
  }

  set borderColorA(borderColorA) {
    this.borderColorARGB = borderColorA;
    this.borderColorAHex = convertColor(borderColorA);
  }

  get borderColorA() {
    return this.borderColorARGB;
  }

  set borderColorB(borderColorB) {
    this.borderColorBRGB = borderColorB;
    this.borderColorBHex = convertColor(borderColorB);
  }

  get borderColorB() {
    return this.borderColorBRGB;
  }

  destroy() {
    this.regl.destroy();
  }
}
