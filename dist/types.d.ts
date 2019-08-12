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
    text: string;
    align: 'left' | 'center' | 'right';
    lineHeightScale: number;
    font: Font;
    flush?: boolean;
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
