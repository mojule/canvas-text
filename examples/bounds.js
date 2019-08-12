(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.imageBounds = (imageData) => {
    let x = 0;
    let y = 0;
    let right = 0;
    let bottom = 0;
    let foundLeft = false;
    let foundTop = false;
    for (let py = 0; py < imageData.height; py++) {
        const { left: rowLeft, right: rowRight } = horizontalBounds(imageData, py);
        const nonEmpty = rowLeft > 0 && rowRight > 0;
        if (nonEmpty) {
            if (!foundLeft) {
                x = rowLeft;
                foundLeft = true;
            }
            x = Math.min(x, rowLeft);
            right = Math.max(right, rowRight);
            if (!foundTop) {
                foundTop = true;
                y = py;
            }
            bottom = py;
        }
    }
    const width = right - x + 1;
    const height = bottom - y + 1;
    return { x, y, width, height };
};
const horizontalBounds = (imageData, y) => {
    y = y | 0;
    const { width, data } = imageData;
    let left = 0;
    let right = 0;
    let foundLeft = false;
    for (let x = 0; x < width; x++) {
        const index = (y * width + x) * 4;
        const alpha = data[index + 3];
        const nonEmpty = alpha > 0;
        if (!foundLeft && nonEmpty) {
            left = x;
            foundLeft = true;
        }
        if (nonEmpty) {
            right = x;
        }
    }
    return {
        left, right
    };
};

},{}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//import { fitText } from '../fit'
const text_to_canvas_1 = require("../text-to-canvas");
const source = document.createElement('canvas');
const context = source.getContext('2d');
source.width = 640;
source.height = 480;
const text = 'The quick brown\nfox jumps over\nthe lazy dog';
const bounds = {
    x: 32,
    y: 32,
    width: 320,
    height: 200
};
const align = 'left';
const valign = 'top';
const lineHeightScale = 1.5;
const flush = true;
const fit = {
    minSize: 8
};
const font = {
    name: 'sans-serif',
    size: 64,
    color: '#000'
};
const textBlock = {
    text,
    align,
    lineHeightScale,
    font,
    flush
};
// const fitResult = fitText( textBlock )
// const { canvas, yOffset } = fitResult
// context.strokeStyle = 'rgba( 255, 0, 0, 0.5 )'
// context.strokeRect( bounds.x, bounds.y, bounds.width, bounds.height )
// context.drawImage( canvas, bounds.x, bounds.y + yOffset )
// document.body.appendChild( source )
// document.body.appendChild( canvas )
const textCanvas = text_to_canvas_1.textToCanvas(textBlock);
document.body.appendChild(textCanvas);

},{"../text-to-canvas":4}],3:[function(require,module,exports){
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

},{}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("./util");
const measure_1 = require("./measure");
const bounds_1 = require("./bounds");
exports.textToCanvas = (textBlock) => {
    const { text, lineHeightScale, font, align, flush } = textBlock;
    const lines = text.split('\n');
    const { name, size, color } = font;
    const fontStyle = util_1.getFontStyle(size, name);
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    const lineSizeScale = { width: 1, height: lineHeightScale };
    const { size: blockSizeUnscaled, lineSizes: lineSizesUnscaled } = measure_1.measureLines(lines, fontStyle);
    const blockSize = util_1.scaleSize(blockSizeUnscaled, lineSizeScale);
    const lineSizes = lineSizesUnscaled.map(s => util_1.scaleSize(s, lineSizeScale));
    canvas.width = blockSize.width;
    canvas.height = blockSize.height;
    const [head] = lines;
    if (typeof head !== 'string')
        return canvas;
    const unscaledLineHeight = measure_1.measureText(head, fontStyle).height;
    const scaledLineHeight = unscaledLineHeight * lineHeightScale;
    const delta = scaledLineHeight - unscaledLineHeight;
    let y = delta !== 0 ? delta : 0;
    canvas.height = blockSize.height;
    if (y < 0) {
        canvas.height -= y;
        y = 0;
    }
    context.fillStyle = color;
    context.font = fontStyle;
    context.textBaseline = 'top';
    lines.forEach((line, i) => {
        const { width } = lineSizes[i];
        let x = 0;
        if (align === 'center') {
            x = (canvas.width - width) / 2;
        }
        else if (align === 'right') {
            x = canvas.width - width;
        }
        context.fillText(line, x, y);
        y += scaledLineHeight;
    });
    if (flush) {
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const { x, y, width, height } = bounds_1.imageBounds(imageData);
        canvas.width = width;
        canvas.height = height;
        context.putImageData(imageData, -x, -y);
    }
    return canvas;
};

},{"./bounds":1,"./measure":3,"./util":5}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFontStyle = (fontSize, fontName) => `${fontSize}px ${fontName}`;
exports.isOversize = (bounds, size) => size.width > bounds.width || size.height > bounds.height;
exports.scaleSize = ({ width, height }, { width: scaleW, height: scaleH }) => ({ width: width * scaleW, height: height * scaleH });
exports.getArea = ({ width, height }) => width * height;

},{}]},{},[2]);
