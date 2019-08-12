"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("./util");
exports.textBlockToCanvas = (context, textBlock) => {
    const { lines: text, bounds, font } = textBlock;
    const { name, size, color } = font;
    const fontStyle = util_1.getFontStyle(size, name);
    context.font = fontStyle;
    context.fillStyle = color;
};
//# sourceMappingURL=index.js.map