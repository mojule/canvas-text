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
    bounds: Rect;
    align: 'left' | 'center' | 'right';
    valign: 'top' | 'middle' | 'bottom';
    lineHeightScale: number;
    font: Font;
    flush?: boolean;
    fit?: FitSettings;
}
export interface FitSettings {
    minSize: number;
}
export interface FitResult {
    lines: string[];
    size: number;
    oversize?: boolean;
}
export interface MeasureText {
    (text: string): Size;
}