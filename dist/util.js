"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFontStyle = (font) => {
    const { family, size, lineHeight = 1, style = 'normal', variant = 'normal', weight = 'normal', stretch = 'normal', } = font;
    return [
        style, variant, weight, stretch, `${size}px/${lineHeight}`, family
    ].join(' ');
};
exports.isOversize = (bounds, size) => size.width > bounds.width || size.height > bounds.height;
exports.scaleSize = ({ width, height }, { width: scaleW, height: scaleH }) => ({ width: width * scaleW, height: height * scaleH });
exports.getArea = ({ width, height }) => width * height;
exports.applyFontSizeToTextBlock = (textBlock, fontSize) => {
    const { font } = textBlock;
    const newFont = exports.applyFontSize(font, fontSize);
    const newTextBlock = Object.assign({}, textBlock, {
        font: newFont
    });
    return newTextBlock;
};
exports.applyFontSize = (font, fontSize) => {
    const newFont = Object.assign({}, font, {
        size: fontSize
    });
    return newFont;
};
//# sourceMappingURL=util.js.map