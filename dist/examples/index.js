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
    const canvasContainer = document.querySelector('.canvas-container');
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
    canvasContainer.appendChild(container);
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
const form = document.querySelector('form');
const updateFromForm = () => {
    const existingContainer = document.querySelector('.container');
    if (existingContainer) {
        existingContainer.remove();
    }
    const data = new FormData(form);
    const name = 'Custom settings';
    let text = data.get('text');
    const align = data.get('align');
    const flush = data.get('flush') === 'on';
    const family = data.get('family');
    const fontSize = Number(data.get('fontSize'));
    const color = data.get('color');
    const lineHeight = Number(data.get('lineHeight'));
    const style = data.get('style');
    const variant = data.get('variant');
    const weight = data.get('weight');
    const stretch = data.get('stretch');
    const minFontSize = Number(data.get('minFontSize'));
    const maxFontSize = Number(data.get('maxFontSize'));
    const fitMode = data.get('fitMode');
    const valign = data.get('valign');
    const step = Number(data.get('step'));
    const autoWrap = data.get('autoWrap') === 'on';
    if (autoWrap) {
        text = text.split('\n').join(' ');
    }
    const textBlockOptions = {
        align, flush
    };
    const fontOptions = {
        color, family, lineHeight, style, variant, weight, stretch
    };
    const fitOptions = {
        valign, minFontSize, maxFontSize
    };
    const example = {
        name, text, fontSize, fitMode, step, autoWrap
    };
    addExample(example, textBlockOptions, fitOptions, fontOptions);
};
form.addEventListener('submit', e => {
    e.preventDefault();
    updateFromForm();
});
updateFromForm();
//# sourceMappingURL=index.js.map