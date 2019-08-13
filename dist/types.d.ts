export interface Point {
    x: number;
    y: number;
}
export interface Size {
    width: number;
    height: number;
}
export interface Rect extends Point, Size {
}
export interface Font {
    family: string;
    size: number;
    color: string;
    lineHeight?: number;
    style?: string;
    variant?: string;
    weight?: string;
    stretch?: string;
}
export declare type Align = 'left' | 'center' | 'right';
export declare type VAlign = 'top' | 'middle' | 'bottom';
export declare type FitMode = 'down' | 'fit';
export interface TextBlock {
    text: string;
    font: Font;
    align?: Align;
    flush?: boolean;
}
export interface TextBlockMetrics {
    lineRects: Rect[];
    size: Size;
}
export interface FitOptions {
    minFontSize: number;
    maxFontSize: number;
    fitMode: FitMode;
    valign: VAlign;
    scaleStep: number;
    autoWrap: boolean;
}
export interface FitResult {
    canvas: HTMLCanvasElement;
    fontSize: number;
    lines: string[];
    oversize?: boolean;
}
export interface MeasureText {
    (text: string): Size;
}
