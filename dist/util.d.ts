import { Size } from './types';
export declare const getFontStyle: (fontSize: string | number, fontName: string) => string;
export declare const isOversize: (bounds: Size, size: Size) => boolean;
export declare const scaleSize: ({ width, height }: Size, { width: scaleW, height: scaleH }: Size) => Size;