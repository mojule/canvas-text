"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFontStyle = (fontSize, fontName) => `${fontSize}px ${fontName}`;
exports.isOversize = (bounds, size) => size.width > bounds.width || size.height > bounds.height;
exports.scaleSize = ({ width, height }, { width: scaleW, height: scaleH }) => ({ width: width * scaleW, height: height * scaleH });
exports.getArea = ({ width, height }) => width * height;
//# sourceMappingURL=util.js.map