import { Size, Font } from './types';
export declare const getFontStyle: (font: Font) => string;
export declare const isOversize: (bounds: Size, size: Size) => boolean;
export declare const scaleSize: ({ width, height }: Size, { width: scaleW, height: scaleH }: Size) => Size;
export declare const getArea: ({ width, height }: Size) => number;
