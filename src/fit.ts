// import { FitSettings, Rect, FitResult, TextBlock, Font } from './types'
// import { wrap } from '@mojule/wrap-text'
// import { measureText, measureLines } from './measure'
// import { getFontStyle, isOversize, scaleSize } from './util'
// import { textToCanvas } from './text-to-canvas'
// import { imageBounds } from './bounds';

// export const fitText = (
//   textBlock: TextBlock,
//   scaleStep = 0.975
// ): FitResult => {
//   const {
//     text, font, fit, bounds, flush, lineHeightScale, valign
//   } = textBlock

//   const { name, size, color } = font
//   const lineSizeScale = { width: 1, height: lineHeightScale }

//   const tryFit = ( size: number ) => {
//     size = (
//       fit && fit.minSize ?
//         Math.max( size, fit.minSize ) :
//         size
//     )

//     let yOffset = 0

//     const fontStyle = getFontStyle( size, name )

//     const measureWidth = ( text: string ) =>
//       measureText( text, fontStyle ).width

//     const lines = wrap( text, bounds.width, measureWidth )
//     const { size: blockSizeUnscaled } = measureLines( lines, fontStyle )
//     const blockSize = scaleSize( blockSizeUnscaled, lineSizeScale )

//     const scaledFont: Font = { name, size, color }

//     const scaledTextBlock = Object.assign(
//       {},
//       textBlock,
//       {
//         text: lines.join( '\n' ),
//         font: scaledFont
//       }
//     )

//     let canvas: HTMLCanvasElement | null = null

//     if( flush && valign === 'top' ){
//       canvas = textToCanvas( scaledTextBlock )

//       const context = canvas.getContext( '2d' )!
//       const imageData = context.getImageData(
//         0, 0, canvas.width, canvas.height
//       )

//       const bounds = imageBounds( imageData )

//       blockSize.height = bounds.height
//       yOffset = -bounds.y
//     }

//     const oversize = isOversize( bounds, blockSize )

//     const nextSize = size * scaleStep

//     const isTryFit = (
//       oversize && fit !== undefined && nextSize > fit.minSize
//     )

//     if( !isTryFit ){
//       if( canvas === null ){
//         canvas = textToCanvas( scaledTextBlock )
//       }

//       const fitResult: FitResult = { canvas, lines, size, yOffset, oversize }

//       return fitResult
//     }

//     return tryFit( nextSize )
//   }

//   const fitResult = tryFit( size )

//   return fitResult
// }
