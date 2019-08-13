"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const wrap_text_1 = require("@mojule/wrap-text");
const text_to_canvas_1 = require("./text-to-canvas");
const util_1 = require("./util");
const measure_1 = require("./measure");
exports.fitText = (textBlock, fitSize, options = {}) => {
    const { minFontSize = 8, maxFontSize = 1024, fitMode = 'down', valign = 'top', scaleStep = 0.025 } = options;
    const scaleDown = 1 - scaleStep;
    const scaleUp = 1 + scaleStep;
    if (scaleStep <= 0 || scaleStep >= 1) {
        throw Error('Expected scaleStep to be a non-zero number less than 1');
    }
    const { text, font, align = 'left' } = textBlock;
    const { size } = font;
    const width = Math.max(fitSize.width, 1);
    const height = Math.max(fitSize.height, 1);
    const tryFit = (fontSize) => {
        const scaledFont = Object.assign({}, font, {
            size: fontSize
        });
        const measurer = (text) => measure_1.measureWidth(text, scaledFont).width;
        const lines = wrap_text_1.wrap(text, width, measurer);
        const wrappedTextBlock = Object.assign({}, textBlock, {
            text: lines.join('\n'),
            font: scaledFont
        });
        const canvas = text_to_canvas_1.textToCanvas(wrappedTextBlock);
        const oversize = util_1.isOversize(fitSize, canvas);
        const nextSize = fontSize * scaleDown;
        if (oversize && nextSize >= minFontSize)
            return tryFit(nextSize);
        const result = { canvas, oversize, fontSize, lines };
        return result;
    };
    const fitResult = tryFit(Math.max(size, minFontSize));
    return applyAlignment(fitResult, width, height, align, valign);
};
const applyAlignment = (fitResult, width, height, align, valign) => {
    const { canvas, oversize, fontSize, lines } = fitResult;
    const { width: sw, height: sh } = canvas;
    const fittedCanvas = document.createElement('canvas');
    const context = fittedCanvas.getContext('2d');
    fittedCanvas.width = width;
    fittedCanvas.height = height;
    let x = 0;
    let y = 0;
    if (align === 'center') {
        x = (width - sw) / 2;
    }
    else if (align === 'right') {
        x = width - sw;
    }
    if (valign === 'middle') {
        y = (height - sh) / 2;
    }
    else if (valign === 'bottom') {
        y = height - sh;
    }
    context.drawImage(canvas, x, y);
    const result = { canvas: fittedCanvas, oversize, fontSize, lines };
    return result;
};
//# sourceMappingURL=fit.js.map