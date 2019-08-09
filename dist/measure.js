"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.measureText = (text, fontStyle) => {
    const span = document.createElement('span');
    span.style.font = fontStyle;
    span.innerText = text;
    document.body.appendChild(span);
    const { width, height } = span.getBoundingClientRect();
    span.remove();
    return { width, height };
};
exports.measureLines = (lines, fontStyle) => {
    let width = 0;
    let height = 0;
    lines.forEach(line => {
        const { width: w, height: h } = exports.measureText(line, fontStyle);
        width = Math.max(width, w);
        height += h;
    });
    return { width, height };
};
//# sourceMappingURL=measure.js.map