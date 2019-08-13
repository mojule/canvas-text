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
        const nonEmpty = rowRight > -1;
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
    let left = -1;
    let right = -1;
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
const fit_1 = require("../fit");
const util_1 = require("../util");
const bounds = {
    x: 40,
    y: 40,
    width: 320,
    height: 200
};
const preWrappedText = 'The quick brown\nfox jumps over\nthe lazy dog';
const unwrappedText = preWrappedText.split('\n').join(' ').trim();
const align = 'center';
const valign = 'middle';
const lineHeight = 1;
const flush = true;
const fontSize = 128;
const smallStep = 0.025;
const largeStep = 0.1;
const font = {
    family: 'sans-serif',
    size: fontSize,
    color: '#39f',
    style: 'italic',
    weight: 'bold',
    lineHeight
};
const createTextBlock = (text, fontSize) => {
    const textBlock = util_1.applyFontSizeToTextBlock({
        text, align, font, flush
    }, fontSize);
    return textBlock;
};
const createOptions = (minFontSize, maxFontSize, fitMode, scaleStep, autoWrap) => {
    const options = {
        minFontSize, maxFontSize, fitMode, scaleStep, valign, autoWrap
    };
    return options;
};
const addFittedCanvas = (name, textBlock, options) => {
    const container = document.createElement('div');
    container.classList.add('container');
    const header = document.createElement('h3');
    header.innerText = name;
    const dest = document.createElement('canvas');
    const context = dest.getContext('2d');
    dest.width = 400;
    dest.height = 280;
    context.strokeStyle = 'rgba( 255, 0, 0, 0.5 )';
    context.strokeRect(bounds.x, bounds.y, bounds.width, bounds.height);
    const start = Date.now();
    const fitResult = fit_1.fitText(textBlock, bounds, options);
    const end = Date.now();
    const { canvas, fontSize: fittedFontSize } = fitResult;
    context.drawImage(canvas, bounds.x, bounds.y);
    const resultLines = [
        `Original size: ${textBlock.font.size}`,
        `Scaled size: ${fittedFontSize}`,
        `Took ${end - start}ms`
    ];
    const resultText = document.createElement('p');
    resultText.innerHTML = resultLines.join('<br>');
    container.appendChild(header);
    container.appendChild(dest);
    container.appendChild(resultText);
    document.body.appendChild(container);
};
const addExample = (example, textBlockOptions = {}, fitOptions = {}, fontOptions = {}) => {
    const { name, text, fontSize, fitMode, step, autoWrap } = example;
    const textBlock = Object.assign(createTextBlock(text, fontSize), textBlockOptions);
    textBlock.font = Object.assign(textBlock.font, fontOptions);
    const options = Object.assign(createOptions(8, 300, fitMode, step, autoWrap), fitOptions);
    addFittedCanvas(name, textBlock, options);
};
const examples = [];
const modeNames = ['scale down', 'scale to fit'];
const stepNames = [
    'large step (fast, imprecise)',
    'small step (fast, precise)',
];
const sizeNames = ['from undersize', 'from oversize'];
const wrapNames = ['no auto wrap', 'auto wrap'];
modeNames.forEach(modeName => {
    sizeNames.forEach(sizeName => {
        wrapNames.forEach(wrapName => {
            stepNames.forEach(stepName => {
                const name = [modeName, sizeName, wrapName, stepName].join(', ');
                let text = preWrappedText;
                let autoWrap = false;
                if (wrapName === 'auto wrap') {
                    text = unwrappedText;
                    autoWrap = true;
                }
                let fontSize = 24;
                if (sizeName === 'from oversize') {
                    fontSize = 128;
                }
                let fitMode = 'down';
                if (modeName === 'scale to fit') {
                    fitMode = 'fit';
                }
                let step = largeStep;
                if (stepName === 'small step (fast, precise)') {
                    step = smallStep;
                }
                const example = {
                    name,
                    text,
                    fontSize,
                    fitMode,
                    step,
                    autoWrap
                };
                examples.push(example);
            });
        });
    });
});
//examples.forEach( addExample )
const form = document.querySelector('form');
form.addEventListener('submit', e => {
    e.preventDefault();
    const existingContainer = document.querySelector('.container');
    if (existingContainer) {
        existingContainer.remove();
    }
    const data = new FormData(form);
    const name = 'Custom settings';
    let text = data.get('text');
    const fontSize = Number(data.get('fontSize'));
    const color = data.get('color');
    const align = data.get('align');
    const valign = data.get('valign');
    const fitMode = data.get('fitMode');
    const step = Number(data.get('step'));
    const autoWrap = data.get('autoWrap') === 'on';
    const flush = data.get('flush') === 'on';
    if (autoWrap) {
        text = text.split('\n').join(' ');
    }
    const textBlockOptions = {
        align, flush
    };
    const fontOptions = {
        color
    };
    const fitOptions = {
        valign
    };
    const example = {
        name, text, fontSize, fitMode, step, autoWrap
    };
    addExample(example, textBlockOptions, fitOptions, fontOptions);
});

},{"../fit":3,"../util":6}],3:[function(require,module,exports){
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

},{"./measure":4,"./text-to-canvas":5,"./util":6,"@mojule/wrap-text":7}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("./util");
const svgNameSpace = 'http://www.w3.org/2000/svg';
const svgEl = document.createElementNS(svgNameSpace, 'svg');
const textEl = document.createElementNS(svgNameSpace, 'text');
svgEl.appendChild(textEl);
/*
  We use SVG to measure the width as it takes into account parts of the text
  that would otherwise escape the bounding box, for example italics
*/
exports.measureWidth = (text, font) => {
    textEl.style.font = util_1.getFontStyle(font);
    textEl.textContent = text.replace(/\s/g, '\u00a0');
    document.body.appendChild(svgEl);
    const rect = textEl.getBBox();
    svgEl.remove();
    return rect;
};
exports.measureLines = (lines, font, measurer = exports.measureWidth) => {
    const { lineHeight = 1.2, size } = font;
    const scaledLineHeight = lineHeight * size;
    let width = 0;
    let height = 0;
    const blockBounds = {
        lineRects: [],
        size: { width, height }
    };
    lines.forEach((line, i) => {
        const { x, y, width: measuredWidth, height: measuredHeight } = measurer(line, font);
        const isLastLine = i === lines.length - 1;
        // the last line should be full height
        const currentHeight = (isLastLine ?
            measuredHeight :
            scaledLineHeight);
        const lineRect = {
            x, y,
            width: measuredWidth,
            height: currentHeight
        };
        blockBounds.lineRects.push(lineRect);
        width = Math.max(width, measuredWidth);
        height += currentHeight;
    });
    blockBounds.size = { width, height };
    return blockBounds;
};

},{"./util":6}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("./util");
const measure_1 = require("./measure");
const bounds_1 = require("./bounds");
exports.textToCanvas = (textBlock) => {
    const { text, font, align = 'left', flush = false } = textBlock;
    const lines = text.split('\n');
    const { color } = font;
    const fontStyle = util_1.getFontStyle(font);
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    const { size: blockSize, lineRects } = measure_1.measureLines(lines, font);
    canvas.width = Math.max(1, blockSize.width);
    canvas.height = Math.max(1, blockSize.height);
    const [head] = lines;
    if (typeof head !== 'string')
        return canvas;
    canvas.height = blockSize.height;
    context.fillStyle = color;
    context.font = fontStyle;
    context.textBaseline = 'top';
    let y = 0;
    lines.forEach((line, i) => {
        const { x: xOff, width, height } = lineRects[i];
        let x = -xOff;
        if (align === 'center') {
            x = (canvas.width - width + (x * 2)) / 2;
        }
        else if (align === 'right') {
            x = canvas.width - width + (x * 2);
        }
        context.fillText(line, x | 0, y | 0);
        y += height;
    });
    if (flush) {
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const { x, y, width, height } = bounds_1.imageBounds(imageData);
        canvas.width = width;
        canvas.height = height;
        context.putImageData(imageData, -x | 0, -y | 0);
    }
    return canvas;
};

},{"./bounds":1,"./measure":4,"./util":6}],6:[function(require,module,exports){
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
        size: fontSize | 0
    });
    return newFont;
};

},{}],7:[function(require,module,exports){
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

},{}]},{},[2]);
