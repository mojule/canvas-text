import { FitSettings, Rect, FitResult } from './types';
export declare const fitText: (text: string, bounds: Rect, name: string, size: number, lineHeightScale?: number, fit?: FitSettings | undefined, scaleStep?: number) => FitResult;
