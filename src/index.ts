import { wrap } from '@mojule/wrap-text'
import { TextBlock, FitResult } from './types'
import { getFontStyle, isOversize } from './util'

export const textBlockToCanvas = (
  context: CanvasRenderingContext2D, textBlock: TextBlock
) => {

  const { lines: text, bounds, font } = textBlock
  const { name, size, color } = font
  const fontStyle = getFontStyle( size, name )

  context.font = fontStyle
  context.fillStyle = color




}
