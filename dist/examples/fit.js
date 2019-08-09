"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fit_1 = require("../fit");
const measure_1 = require("../measure");
const util_1 = require("../util");
const source = document.createElement('canvas');
const context = source.getContext('2d');
source.width = 640;
source.height = 480;
const text = 'The quick brown fox jumps over the lazy dog';
const bounds = {
    x: 32,
    y: 32,
    width: 320,
    height: 200
};
const fontName = 'sans-serif';
const fontSize = 24;
const fitResult = fit_1.fitText(text, bounds, fontName, fontSize, 1, { minSize: 8 });
const { lines, size } = fitResult;
const fontStyle = util_1.getFontStyle(size, fontName);
let y = bounds.y;
context.fillStyle = '#000';
context.textBaseline = 'bottom';
context.font = fontStyle;
context.strokeStyle = 'rgba( 255, 0, 0, 0.5 )';
context.strokeRect(bounds.x, bounds.y, bounds.width, bounds.height);
lines.forEach(line => {
    const { height } = measure_1.measureText(line, fontStyle);
    y += height;
    context.fillText(line, bounds.x, y);
});
document.body.appendChild(source);
//# sourceMappingURL=fit.js.map