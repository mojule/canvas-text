"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const wrap_text_1 = require("@mojule/wrap-text");
const measure_1 = require("./measure");
const util_1 = require("./util");
exports.fitText = (text, bounds, name, size, lineHeightScale = 1, fit, scaleStep = 0.95) => {
    const tryFit = (size) => {
        size = (fit && fit.minSize ?
            Math.max(size, fit.minSize) :
            size);
        const fontStyle = util_1.getFontStyle(size, name);
        const measureWidth = (text) => measure_1.measureText(text, fontStyle).width;
        const lines = wrap_text_1.wrap(text, bounds.width, measureWidth);
        const blockSize = util_1.scaleSize(measure_1.measureLines(lines, fontStyle), { width: 1, height: lineHeightScale });
        const oversize = util_1.isOversize(bounds, blockSize);
        const fitResult = { lines, size, oversize };
        if (!oversize)
            return fitResult;
        if (fit === undefined)
            return fitResult;
        if (size * scaleStep < fit.minSize)
            return fitResult;
        return tryFit(size * scaleStep);
    };
    return tryFit(size);
};
//# sourceMappingURL=fit.js.map