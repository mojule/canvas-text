"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fit_1 = require("../fit");
const source = document.createElement('canvas');
const context = source.getContext('2d');
source.width = 640;
source.height = 480;
const lines = ['The quick brown fox jumps over the lazy dog'];
const bounds = {
    x: 32,
    y: 32,
    width: 320,
    height: 200
};
const align = 'left';
const valign = 'top';
const lineHeightScale = 0.8;
const flush = true;
const fit = {
    minSize: 8
};
const font = {
    name: 'sans-serif',
    size: 24,
    color: '#000'
};
const textBlock = {
    lines,
    bounds,
    align,
    valign,
    lineHeightScale,
    font,
    flush,
    fit
};
const fitResult = fit_1.fitText(textBlock);
const { canvas, yOffset } = fitResult;
context.strokeStyle = 'rgba( 255, 0, 0, 0.5 )';
context.strokeRect(bounds.x, bounds.y, bounds.width, bounds.height);
context.drawImage(canvas, bounds.x, bounds.y + yOffset);
document.body.appendChild(source);
document.body.appendChild(canvas);
//# sourceMappingURL=fit.js.map