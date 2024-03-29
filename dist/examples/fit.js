"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const text_to_canvas_1 = require("../text-to-canvas");
const fit_1 = require("../fit");
const dest = document.createElement('canvas');
const context = dest.getContext('2d');
dest.width = 640;
dest.height = 480;
const text = 'The quick brown fox jumps over the lazy dog';
const bounds = {
    x: 32,
    y: 32,
    width: 320,
    height: 200
};
const align = 'center';
const valign = 'middle';
const lineHeight = 0.8;
const flush = false;
const minFontSize = 8;
const fontSize = 64;
const font = {
    family: 'sans-serif',
    size: fontSize,
    color: '#39f',
    style: 'italic',
    variant: 'small-caps',
    weight: 'bold',
    lineHeight
};
const textBlock = {
    text,
    align,
    font,
    flush
};
context.strokeStyle = 'rgba( 255, 0, 0, 0.5 )';
context.strokeRect(bounds.x, bounds.y, bounds.width, bounds.height);
document.body.appendChild(dest);
const textCanvas = text_to_canvas_1.textToCanvas(textBlock);
document.body.appendChild(textCanvas);
const fitResult = fit_1.fitText(textBlock, bounds, { minFontSize, valign });
const { canvas } = fitResult;
context.drawImage(canvas, bounds.x, bounds.y);
//# sourceMappingURL=fit.js.map