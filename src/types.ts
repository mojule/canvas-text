export interface Point {
  x: number
  y: number
}

export interface Size {
  width: number
  height: number
}

export interface Rect extends Point, Size {}

export interface Font {
  family: string
  size: number
  color: string
  lineHeight?: number
  style?: string
  variant?: string
  weight?: string
  stretch?: string
}

export type Align = 'left' | 'center' | 'right'
export type VAlign = 'top' | 'middle' | 'bottom'
export type FitMode = 'down' | 'fit'

export interface TextBlock {
  text: string
  font: Font,
  align?: Align
  flush?: boolean
}

export interface TextBlockMetrics {
  lineRects: Rect[]
  size: Size
}

export interface FitOptions {
  minFontSize: number
  maxFontSize: number
  fitMode: FitMode
  valign: VAlign
  scaleStep: number
  autoWrap: boolean
}

export interface FitResult {
  canvas: HTMLCanvasElement
  fontSize: number
  lines: string[]
  oversize?: boolean
}

export interface MeasureText {
  ( text: string ): Size
}
