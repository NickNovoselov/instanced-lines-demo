import * as dat from 'dat.gui';
import REGL from 'regl';
import { Demo } from './Demo.js';

const gui = new dat.GUI(/*{ autoPlace: false }*/);
// document.querySelector('.main').appendChild(gui.domElement);
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

const demo = new Demo({
  canvas,
  regl,
  linejoin: 'miter',
  linecap: 'square',
  linestrip: 'regular',
  highlightCorners: false,
  color: [255, 248, 222],
  borderColor: [255, 0, 0],
  lineWidth: Math.round(canvas.width / 18),
  borderWidth: Math.round(canvas.width / 54)
});

gui.add(demo, 'linejoin', ['miter', 'round', 'bevel']);
gui.add(demo, 'linecap', ['butt', 'round', 'square']);
gui.add(demo, 'linestrip', ['regular']);
gui.add(demo, 'highlightCorners').listen();
gui.addColor(demo, 'color');
gui.addColor(demo, 'borderColor');
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
