"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("./util");
const measure_1 = require("./measure");
exports.textToCanvas = (lines, fontStyle, color, lineHeightScale = 1) => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    const blockSize = util_1.scaleSize(measure_1.measureLines(lines, fontStyle), { width: 1, height: lineHeightScale });
    canvas.width = Math.ceil(blockSize.width);
    canvas.height = Math.ceil(blockSize.height);
    const [head] = lines;
    if (typeof head !== 'string')
        return canvas;
    const unscaledLineHeight = measure_1.measureText(head, fontStyle).height;
    const scaledLineHeight = unscaledLineHeight * lineHeightScale;
    const delta = scaledLineHeight - unscaledLineHeight;
    let y = delta !== 0 ? delta / 2 : 0;
    canvas.height = scaledLineHeight * lines.length;
    if (y < 0) {
        canvas.height -= y;
        y = 0;
    }
    context.fillStyle = color;
    context.font = fontStyle;
    context.textBaseline = 'top';
    lines.forEach(line => {
        context.fillText(line, 0, y);
        y += scaledLineHeight;
    });
    return canvas;
};
exports.imageBounds = (imageData) => {
    let x = 0;
    let y = 0;
    let right = 0;
    let bottom = 0;
    let foundLeft = false;
    let foundTop = false;
    for (let py = 0; py < imageData.height; py++) {
        const { left: rowLeft, right: rowRight } = horizontalBounds(imageData, py);
        const nonEmpty = rowLeft > 0 && rowRight > 0;
        if (nonEmpty) {
            if (!foundLeft) {
                x = rowLeft;
                foundLeft = true;
            }
            x = Math.min(x, rowLeft);
            right = Math.max(right, rowRight);
            if (!foundTop) {
                foundTop = true;
                y = py;
            }
            bottom = py;
        }
    }
    const width = right - x + 1;
    const height = bottom - y + 1;
    return { x, y, width, height };
};
const horizontalBounds = (imageData, y) => {
    y = y | 0;
    const { width, data } = imageData;
    let left = 0;
    let right = 0;
    let foundLeft = false;
    for (let x = 0; x < width; x++) {
        const index = (y * width + x) * 4;
        const alpha = data[index + 3];
        const nonEmpty = alpha > 0;
        if (!foundLeft && nonEmpty) {
            left = x;
            foundLeft = true;
        }
        if (nonEmpty) {
            right = x;
        }
    }
    return {
        left, right
    };
};
//# sourceMappingURL=image.js.map