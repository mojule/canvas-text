import { wrap } from '@mojule/wrap-text'
import { TextBlock, FitResult } from './types'
import { getFontStyle, isOversize } from './util'

export const drawTextBlock = (
  context: CanvasRenderingContext2D, textBlock: TextBlock
) => {

  const { text, bounds, font } = textBlock
  const { name, size, color } = font
  const fontStyle = getFontStyle( size, name )

  context.font = fontStyle
  context.fillStyle = color




}

// const fitSize = (
//   context: CanvasRenderingContext2D, textBlock: TextBlock, step = 0.95
// ): Fit => {
//   const { text, bounds, font, fit } = textBlock
//   const { name, color } = font
//   let { size } = font

//   size = fit && fit.minSize ? Math.max( size, fit.minSize ) : size

//   context.font = getFontStyle( size, name )
//   context.fillStyle = color

//   const measure = createMeasure( context )

//   let lines = wrap( text, bounds.width, measure.width )
//   let blockSize = measureLines( lines, measure )
//   let oversize = isOversize( bounds, blockSize )

//   if ( fit === undefined ) {
//     return { lines, size, oversize }
//   }

//   const { minSize } = fit

//   while( oversize && ( size * step ) > minSize ){
//     size *= step
//     context.font = getFontStyle( size, name )
//     lines = wrap( text, bounds.width, measure.width )
//     blockSize = measureLines( lines, measure )
//     oversize = isOversize( bounds, blockSize )
//   }

//   return { lines, size, oversize }
// }
