"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.measureText = (text, fontStyle) => {
    const span = document.createElement('span');
    span.style.font = fontStyle;
    span.innerHTML = text.replace(/\s/g, '&nbsp;');
    document.body.appendChild(span);
    const { width, height } = span.getBoundingClientRect();
    span.remove();
    return { width, height };
};
exports.measureLines = (lines, fontStyle) => {
    let width = 0;
    let height = 0;
    const blockBounds = {
        lineSizes: [],
        size: { width, height }
    };
    lines.forEach(line => {
        const lineBounds = exports.measureText(line, fontStyle);
        const { width: w, height: h } = lineBounds;
        blockBounds.lineSizes.push(lineBounds);
        width = Math.max(width, w);
        height += h;
    });
    blockBounds.size = { width, height };
    return blockBounds;
};
//# sourceMappingURL=measure.js.map