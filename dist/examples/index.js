"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const text_to_canvas_1 = require("../text-to-canvas");
const fit_1 = require("../fit");
const dest = document.createElement('canvas');
const context = dest.getContext('2d');
dest.width = 400;
dest.height = 280;
const text = 'The quick brown fox jumps over the lazy dog';
const bounds = {
    x: 40,
    y: 40,
    width: 320,
    height: 200
};
const align = 'center';
const valign = 'middle';
const lineHeight = 0.8;
const flush = true;
const minFontSize = 8;
const maxFontSize = 200;
const fontSize = 128;
const scaleStep = 0.025;
const fitMode = 'down';
const font = {
    family: 'sans-serif',
    size: fontSize,
    color: '#39f',
    style: 'italic',
    weight: 'bold',
    lineHeight
};
const textBlock = {
    text,
    align,
    font,
    flush
};
const options = {
    minFontSize, maxFontSize, fitMode, scaleStep, valign
};
context.strokeStyle = 'rgba( 255, 0, 0, 0.5 )';
context.strokeRect(bounds.x, bounds.y, bounds.width, bounds.height);
document.body.appendChild(dest);
const start = Date.now();
const fitResult = fit_1.fitText(textBlock, bounds, options);
const end = Date.now();
const { canvas, fontSize: fittedFontSize } = fitResult;
context.drawImage(canvas, bounds.x, bounds.y);
const fittedTextBlock = Object.assign({}, textBlock, {
    font: Object.assign({}, font, {
        size: fittedFontSize
    })
});
const textCanvas = text_to_canvas_1.textToCanvas(fittedTextBlock);
document.body.appendChild(textCanvas);
console.log(`Original size: ${fontSize}`);
console.log(`Scaled size: ${fittedFontSize}`);
console.log(`Took ${end - start}ms`);
//# sourceMappingURL=index.js.map