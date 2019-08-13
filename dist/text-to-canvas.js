"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("./util");
const measure_1 = require("./measure");
const bounds_1 = require("./bounds");
exports.textToCanvas = (textBlock) => {
    const { text, font, align = 'left', flush = false } = textBlock;
    const lines = text.split('\n');
    const { color } = font;
    const fontStyle = util_1.getFontStyle(font);
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    const { size: blockSize, lineRects } = measure_1.measureLines(lines, font);
    canvas.width = Math.max(1, blockSize.width);
    canvas.height = Math.max(1, blockSize.height);
    const [head] = lines;
    if (typeof head !== 'string')
        return canvas;
    canvas.height = blockSize.height;
    context.fillStyle = color;
    context.font = fontStyle;
    context.textBaseline = 'top';
    let y = 0;
    lines.forEach((line, i) => {
        const { x: xOff, width, height } = lineRects[i];
        let x = -xOff;
        if (align === 'center') {
            x = (canvas.width - width + (x * 2)) / 2;
        }
        else if (align === 'right') {
            x = canvas.width - width + (x * 2);
        }
        context.fillText(line, x | 0, y | 0);
        y += height;
    });
    if (flush) {
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const { x, y, width, height } = bounds_1.imageBounds(imageData);
        canvas.width = width;
        canvas.height = height;
        context.putImageData(imageData, -x | 0, -y | 0);
    }
    return canvas;
};
//# sourceMappingURL=text-to-canvas.js.map