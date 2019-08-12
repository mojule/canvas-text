"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("./util");
const measure_1 = require("./measure");
const bounds_1 = require("./bounds");
exports.textToCanvas = (textBlock) => {
    const { text, lineHeightScale, font, align, flush } = textBlock;
    const lines = text.split('\n');
    const { name, size, color } = font;
    const fontStyle = util_1.getFontStyle(size, name);
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    const lineSizeScale = { width: 1, height: lineHeightScale };
    const { size: blockSizeUnscaled, lineSizes: lineSizesUnscaled } = measure_1.measureLines(lines, fontStyle);
    const blockSize = util_1.scaleSize(blockSizeUnscaled, lineSizeScale);
    const lineSizes = lineSizesUnscaled.map(s => util_1.scaleSize(s, lineSizeScale));
    canvas.width = blockSize.width;
    canvas.height = blockSize.height;
    const [head] = lines;
    if (typeof head !== 'string')
        return canvas;
    const unscaledLineHeight = measure_1.measureText(head, fontStyle).height;
    const scaledLineHeight = unscaledLineHeight * lineHeightScale;
    const delta = scaledLineHeight - unscaledLineHeight;
    let y = delta !== 0 ? delta : 0;
    canvas.height = blockSize.height;
    if (y < 0) {
        canvas.height -= y;
        y = 0;
    }
    context.fillStyle = color;
    context.font = fontStyle;
    context.textBaseline = 'top';
    lines.forEach((line, i) => {
        const { width } = lineSizes[i];
        let x = 0;
        if (align === 'center') {
            x = (canvas.width - width) / 2;
        }
        else if (align === 'right') {
            x = canvas.width - width;
        }
        context.fillText(line, x, y);
        y += scaledLineHeight;
    });
    if (flush) {
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const { x, y, width, height } = bounds_1.imageBounds(imageData);
        canvas.width = width;
        canvas.height = height;
        context.putImageData(imageData, -x, -y);
    }
    return canvas;
};
//# sourceMappingURL=text-to-canvas.js.map