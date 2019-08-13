import { wrap } from '@mojule/wrap-text'
import { textToCanvas } from './text-to-canvas'
import { TextBlock, Size, FitResult, FitOptions, VAlign, Align, Font } from './types'
import { isOversize } from './util'
import { measureWidth } from './measure'

export const fitText = (
  textBlock: TextBlock,
  fitSize: Size,
  options: Partial<FitOptions> = {}
) => {
  const {
    minFontSize = 8,
    maxFontSize = 1024,
    fitMode = 'down',
    valign = 'top',
    scaleStep = 0.025
  } = options

  const scaleDown = 1 - scaleStep
  const scaleUp = 1 + scaleStep

  if( scaleStep <= 0 || scaleStep >= 1 ){
    throw Error( 'Expected scaleStep to be a non-zero number less than 1' )
  }

  const { text, font, align = 'left' } = textBlock
  const { size } = font
  const width = Math.max( fitSize.width, 1 )
  const height = Math.max( fitSize.height, 1 )

  const downScaler = ( fontSize: number ) => {
    const scaledFont = Object.assign(
      {},
      font,
      {
        size: fontSize
      }
    )

    const scaledTextBlock = Object.assign(
      {},
      textBlock,
      {
        font: scaledFont
      }
    )

    const measurer = ( text: string ) =>
      measureWidth( text, scaledFont ).width

    const lines = wrap( text, width, measurer )

    const wrappedTextBlock = Object.assign(
      {},
      textBlock,
      {
        text: lines.join( '\n' ),
        font: scaledFont
      }
    )

    const canvas = textToCanvas( wrappedTextBlock )
    const oversize = isOversize( fitSize, canvas )
    const nextSize = fontSize * scaleDown

    if ( oversize && nextSize >= minFontSize ) return downScaler( nextSize )

    const result: FitResult = { canvas, oversize, fontSize, lines }

    return result
  }

  const fitResult = downScaler(
    Math.max( size, minFontSize )
  )

  return applyAlignment( fitResult, width, height, align, valign )
}

const tryFit = (
  textBlock: TextBlock,
  fitSize: Size
) => {
  const { text, font } = textBlock
  const { width } = fitSize
  const { size: fontSize } = font

  const measurer = ( text: string ) =>
    measureWidth( text, font ).width

  const lines = wrap( text, width, measurer )

  const wrappedTextBlock = Object.assign(
    {},
    textBlock,
    {
      text: lines.join( '\n' ),
      font
    }
  )

  const canvas = textToCanvas( wrappedTextBlock )
  const oversize = isOversize( fitSize, canvas )

  const result: FitResult = { canvas, oversize, fontSize, lines }

  return result
}

const applyAlignment = (
  fitResult: FitResult,
  width: number, height: number,
  align: Align, valign: VAlign
) => {
  const { canvas, oversize, fontSize, lines } = fitResult

  const { width: sw, height: sh } = canvas
  const fittedCanvas = document.createElement( 'canvas' )
  const context = fittedCanvas.getContext( '2d' )!

  fittedCanvas.width = width
  fittedCanvas.height = height

  let x = 0
  let y = 0

  if ( align === 'center' ) {
    x = ( width - sw ) / 2
  } else if ( align === 'right' ) {
    x = width - sw
  }

  if ( valign === 'middle' ) {
    y = ( height - sh ) / 2
  } else if ( valign === 'bottom' ) {
    y = height - sh
  }

  context.drawImage( canvas, x, y )

  const result: FitResult = { canvas: fittedCanvas, oversize, fontSize, lines }

  return result
}