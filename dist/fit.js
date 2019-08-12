"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const wrap_text_1 = require("@mojule/wrap-text");
const measure_1 = require("./measure");
const util_1 = require("./util");
const text_to_canvas_1 = require("./text-to-canvas");
const bounds_1 = require("./bounds");
exports.fitText = (textBlock, scaleStep = 0.975) => {
    const { lines, font, fit, bounds, flush, lineHeightScale, valign } = textBlock;
    const { name, size, color } = font;
    const text = lines.join('\n');
    const lineSizeScale = { width: 1, height: lineHeightScale };
    const tryFit = (size) => {
        size = (fit && fit.minSize ?
            Math.max(size, fit.minSize) :
            size);
        let yOffset = 0;
        const fontStyle = util_1.getFontStyle(size, name);
        const measureWidth = (text) => measure_1.measureText(text, fontStyle).width;
        const lines = wrap_text_1.wrap(text, bounds.width, measureWidth);
        const { size: blockSizeUnscaled } = measure_1.measureLines(lines, fontStyle);
        const blockSize = util_1.scaleSize(blockSizeUnscaled, lineSizeScale);
        const scaledFont = { name, size, color };
        const scaledTextBlock = Object.assign({}, textBlock, {
            lines,
            font: scaledFont
        });
        let canvas = null;
        if (flush && valign === 'top') {
            canvas = text_to_canvas_1.textToCanvas(scaledTextBlock);
            const context = canvas.getContext('2d');
            const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
            const bounds = bounds_1.imageBounds(imageData);
            blockSize.height = bounds.height;
            yOffset = -bounds.y;
        }
        const oversize = util_1.isOversize(bounds, blockSize);
        const nextSize = size * scaleStep;
        const isTryFit = (oversize && fit !== undefined && nextSize > fit.minSize);
        if (!isTryFit) {
            if (canvas === null) {
                canvas = text_to_canvas_1.textToCanvas(scaledTextBlock);
            }
            const fitResult = { canvas, lines, size, yOffset, oversize };
            return fitResult;
        }
        return tryFit(nextSize);
    };
    const fitResult = tryFit(size);
    return fitResult;
};
//# sourceMappingURL=fit.js.map