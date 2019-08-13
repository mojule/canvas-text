import { TextBlockMetrics, Font, Rect } from './types';
export declare const measureWidth: (text: string, font: Font) => Rect;
export declare const measureLines: (lines: string[], font: Font, measurer?: (text: string, font: Font) => Rect) => TextBlockMetrics;
