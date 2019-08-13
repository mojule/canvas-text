import { Size, Font, TextBlock } from './types';
export declare const getFontStyle: (font: Font) => string;
export declare const isOversize: (bounds: Size, size: Size) => boolean;
export declare const scaleSize: ({ width, height }: Size, { width: scaleW, height: scaleH }: Size) => Size;
export declare const getArea: ({ width, height }: Size) => number;
export declare const applyFontSizeToTextBlock: (textBlock: TextBlock, fontSize: number) => TextBlock;
export declare const applyFontSize: (font: Font, fontSize: number) => Font;
