"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const wrap_text_1 = require("@mojule/wrap-text");
const text_to_canvas_1 = require("./text-to-canvas");
const util_1 = require("./util");
const measure_1 = require("./measure");
exports.fitText = (textBlock, fitSize, options = {}) => {
    const { align = 'left' } = textBlock;
    const opts = normalizeOptions(options);
    const { valign } = opts;
    const width = Math.max(fitSize.width, 1);
    const height = Math.max(fitSize.height, 1);
    const fitResult = scaler(textBlock, { width, height }, opts);
    return applyAlignment(fitResult, width, height, align, valign);
};
const scaler = (textBlock, fitSize, options) => {
    const { fitMode, minFontSize, maxFontSize, autoWrap } = options;
    textBlock = normalizeTextBlock(textBlock, minFontSize, maxFontSize);
    const { font } = textBlock;
    let { size } = font;
    const fitResult = tryFit(textBlock, fitSize, autoWrap);
    const { oversize } = fitResult;
    // want to scale down or fit and it's oversize
    if (oversize) {
        return downScaler(textBlock, fitSize, options, size);
    }
    // want to scale down and already fits
    if (fitMode === 'down') {
        return fitResult;
    }
    // want to scale up or fit and it's too small
    return upScaler(fitResult, textBlock, fitSize, options, size);
};
const normalizeOptions = (options) => {
    const { minFontSize = 8, maxFontSize = 1024, fitMode = 'down', valign = 'top', scaleStep = 0.025, autoWrap: wrap = true } = options;
    if (scaleStep <= 0 || scaleStep >= 1) {
        throw Error('Expected scaleStep to be a non-zero number less than 1');
    }
    const normalized = {
        minFontSize, maxFontSize, fitMode, valign, scaleStep, autoWrap: wrap
    };
    return normalized;
};
const normalizeTextBlock = (textBlock, minFontSize, maxFontSize) => {
    const { font } = textBlock;
    let { size } = font;
    if (size < minFontSize)
        size = minFontSize;
    if (size > maxFontSize)
        size = maxFontSize;
    return util_1.applyFontSizeToTextBlock(textBlock, size);
};
const downScaler = (textBlock, fitSize, options, fontSize) => {
    const { scaleStep, minFontSize, autoWrap } = options;
    const scaleDown = 1 - scaleStep;
    const scaledTextBlock = util_1.applyFontSizeToTextBlock(textBlock, fontSize);
    const result = tryFit(scaledTextBlock, fitSize, autoWrap);
    const { oversize } = result;
    const nextSize = fontSize * scaleDown;
    if (oversize && nextSize >= minFontSize)
        return downScaler(textBlock, fitSize, options, nextSize);
    return result;
};
const upScaler = (currentResult, textBlock, fitSize, options, fontSize) => {
    const { scaleStep, maxFontSize, autoWrap } = options;
    const scaleUp = 1 + scaleStep;
    const nextSize = fontSize * scaleUp;
    if (nextSize > maxFontSize)
        return currentResult;
    const scaledTextBlock = util_1.applyFontSizeToTextBlock(textBlock, nextSize);
    const nextFit = tryFit(scaledTextBlock, fitSize, autoWrap);
    if (nextFit.oversize) {
        return currentResult;
    }
    return upScaler(nextFit, textBlock, fitSize, options, nextSize);
};
const tryFit = (textBlock, fitSize, autoWrap) => {
    const { font } = textBlock;
    const { width } = fitSize;
    const { size: fontSize } = font;
    const measurer = (text) => measure_1.measureWidth(text, font).width;
    const text = (autoWrap ?
        wrap_text_1.wrap(textBlock.text, width, measurer).join('\n') :
        textBlock.text);
    const lines = text.split('\n');
    const wrappedTextBlock = Object.assign({}, textBlock, { text, font });
    const canvas = text_to_canvas_1.textToCanvas(wrappedTextBlock);
    const oversize = util_1.isOversize(fitSize, canvas);
    const result = { canvas, oversize, fontSize, lines };
    return result;
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
    context.drawImage(canvas, x | 0, y | 0);
    const result = { canvas: fittedCanvas, oversize, fontSize, lines };
    return result;
};
//# sourceMappingURL=fit.js.map