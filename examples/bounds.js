(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fit_1 = require("../fit");
const measure_1 = require("../measure");
const util_1 = require("../util");
const source = document.createElement('canvas');
const context = source.getContext('2d');
source.width = 640;
source.height = 480;
const text = 'The quick brown fox jumps over the lazy dog';
const bounds = {
    x: 32,
    y: 32,
    width: 320,
    height: 200
};
const fontName = 'sans-serif';
const fontSize = 24;
const fitResult = fit_1.fitText(text, bounds, fontName, fontSize, 1, { minSize: 8 });
const { lines, size } = fitResult;
const fontStyle = util_1.getFontStyle(size, fontName);
let y = bounds.y;
context.fillStyle = '#000';
context.textBaseline = 'bottom';
context.font = fontStyle;
context.strokeStyle = 'rgba( 255, 0, 0, 0.5 )';
context.strokeRect(bounds.x, bounds.y, bounds.width, bounds.height);
lines.forEach(line => {
    const { height } = measure_1.measureText(line, fontStyle);
    y += height;
    context.fillText(line, bounds.x, y);
});
document.body.appendChild(source);

},{"../fit":2,"../measure":3,"../util":4}],2:[function(require,module,exports){
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

},{"./measure":3,"./util":4,"@mojule/wrap-text":5}],3:[function(require,module,exports){
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

},{}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFontStyle = (fontSize, fontName) => `${fontSize}px ${fontName}`;
exports.isOversize = (bounds, size) => size.width > bounds.width || size.height > bounds.height;
exports.scaleSize = ({ width, height }, { width: scaleW, height: scaleH }) => ({ width: width * scaleW, height: height * scaleH });

},{}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.measureMonospaced = (text) => text.length;
exports.wrap = (text, width = 80, measureText = exports.measureMonospaced) => {
    const wrapped = [];
    const lines = text.trim().replace(/\r\n/g, '\n').split('\n');
    const pushWithEnsureSingleNewline = (line) => {
        if (wrapped[wrapped.length - 1] === '' && line.trim() === '')
            return;
        wrapped.push(line.trim());
    };
    lines.forEach(line => {
        if (line === '') {
            pushWithEnsureSingleNewline(line);
            return;
        }
        const words = line.split(' ').filter(s => s.trim() !== '');
        let currentWidth = 0;
        let currentLine = '';
        words.forEach(word => {
            const wordWidth = measureText(word);
            const wordWidthWithSpace = measureText(word + ' ');
            if (currentWidth + wordWidth <= width) {
                currentWidth += wordWidthWithSpace;
                currentLine += word + ' ';
            }
            else {
                pushWithEnsureSingleNewline(currentLine);
                currentLine = word + ' ';
                currentWidth = wordWidthWithSpace;
            }
        });
        pushWithEnsureSingleNewline(currentLine);
    });
    return wrapped;
};

},{}]},{},[1]);
