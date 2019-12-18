import * as dat from 'dat.gui';
import REGL from 'regl';
import { Demo } from './Demo.js';

const gui = new dat.GUI();
const canvas = document.querySelector('.canvas');

canvas.width = canvas.clientWidth;
canvas.height = canvas.clientHeight;

const regl = REGL({
  canvas,
  attributes: {
    antialias: true
  },
  extensions: ['ANGLE_instanced_arrays']
});

// If there's no built-in MSAA, double the resolution of the canvas
// and downsample it with CSS.
// if (regl._gl.getParameter(regl._gl.SAMPLES) < 2) {
canvas.width = canvas.clientWidth * 2;
canvas.height = canvas.clientHeight * 2;
// }

function generateSamplePointsInterleaved(width, height, count = 9) {
  const stepx = width / count;
  const stepy = height / 3;
  const points = [];

  for (let x = 1; x < count; x += 2) {
    points.push([(x + 0) * stepx - width / 2, 1 * stepy - height / 2]);
    points.push([(x + 1) * stepx - width / 2, 2 * stepy - height / 2]);
  }

  return points;
}

const current = {
  pointsCount: 9
};

const demo = new Demo({
  canvas,
  regl,
  linejoin: 'miter',
  linecap: 'square',
  linestrip: 'regular',
  pointData: generateSamplePointsInterleaved(
    canvas.width,
    canvas.height,
    current.pointsCount
  ),
  highlightCorners: false,
  colorA: [46, 46, 46],
  colorB: [255, 255, 255],
  borderColorA: [255, 50, 50],
  borderColorB: [255, 0, 0],
  lineWidth: Math.round(canvas.width / 18),
  borderWidth: Math.round(canvas.width / 54)
});

gui
  .add(current, 'pointsCount')
  .min(2)
  .max(100)
  .step(1)
  .onChange(() => {
    demo.pointData = generateSamplePointsInterleaved(
      canvas.width,
      canvas.height,
      current.pointsCount
    );
  });
gui.add(demo, 'linejoin', ['miter', 'round', 'bevel']);
gui.add(demo, 'linecap', ['butt', 'round', 'square']);
gui.add(demo, 'linestrip', ['regular']);
gui.add(demo, 'animate');
gui.add(demo, 'highlightCorners').listen();
gui.addColor(demo, 'colorA');
gui.addColor(demo, 'colorB');
gui.addColor(demo, 'borderColorA');
gui.addColor(demo, 'borderColorB');
gui
  .add(demo, 'lineWidth')
  .min(1)
  .max(200)
  .step(1);
gui
  .add(demo, 'borderWidth')
  .min(0)
  .max(100)
  .step(1);

canvas.addEventListener('click', () => {
  demo.highlightCorners = !demo.highlightCorners;
});
