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
    name: string;
    size: number;
    color: string;
}
export interface TextBlock {
    lines: string[];
    bounds: Rect;
    align: 'left' | 'center' | 'right';
    valign: 'top' | 'middle' | 'bottom';
    lineHeightScale: number;
    font: Font;
    flush?: boolean;
    fit?: FitSettings;
}
export interface TextBlockSizes {
    lineSizes: Size[];
    size: Size;
}
export interface FitSettings {
    minSize: number;
}
export interface FitResult {
    canvas: HTMLCanvasElement;
    lines: string[];
    size: number;
    yOffset: number;
    oversize?: boolean;
}
export interface MeasureText {
    (text: string): Size;
}
