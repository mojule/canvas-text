import { wrap } from '@mojule/wrap-text'
import { textToCanvas } from './text-to-canvas'
import { TextBlock, Size, FitResult, FitOptions, VAlign, Align } from './types'
import { isOversize, applyFontSizeToTextBlock } from './util'
import { measureWidth } from './measure'

export const fitText = (
  textBlock: TextBlock,
  fitSize: Size,
  options: Partial<FitOptions> = {}
) => {
  const { align = 'left' } = textBlock
  const opts = normalizeOptions( options )
  const { valign } = opts
  const width = Math.max( fitSize.width, 1 )
  const height = Math.max( fitSize.height, 1 )

  const fitResult = scaler( textBlock, { width, height }, opts )

  return applyAlignment( fitResult, width, height, align, valign )
}

const scaler = (
  textBlock: TextBlock,
  fitSize: Size,
  options: FitOptions
) => {
  const { fitMode, minFontSize, maxFontSize, autoWrap } = options

  textBlock = normalizeTextBlock( textBlock, minFontSize, maxFontSize )

  const { font } = textBlock
  let { size } = font

  const fitResult = tryFit( textBlock, fitSize, autoWrap )
  const { oversize } = fitResult

  // want to scale down or fit and it's oversize
  if( oversize ){
    return downScaler( textBlock, fitSize, options, size )
  }

  // want to scale down and already fits
  if( fitMode === 'down' ){
    return fitResult
  }

  // want to scale up or fit and it's too small
  return upScaler( fitResult, textBlock, fitSize, options, size )
}

const normalizeOptions = ( options: Partial<FitOptions> ) => {
  const {
    minFontSize = 8,
    maxFontSize = 1024,
    fitMode = 'down',
    valign = 'top',
    scaleStep = 0.025,
    autoWrap: wrap = true
  } = options

  if( scaleStep <= 0 || scaleStep >= 1 ){
    throw Error( 'Expected scaleStep to be a non-zero number less than 1' )
  }

  const normalized: FitOptions = {
    minFontSize, maxFontSize, fitMode, valign, scaleStep, autoWrap: wrap
  }

  return normalized
}

const normalizeTextBlock = (
  textBlock: TextBlock, minFontSize: number, maxFontSize: number
) => {
  const { font } = textBlock
  let { size } = font

  if( size < minFontSize ) size = minFontSize
  if( size > maxFontSize ) size = maxFontSize

  return applyFontSizeToTextBlock( textBlock, size )
}

const downScaler = (
  textBlock: TextBlock,
  fitSize: Size,
  options: FitOptions,
  fontSize: number
) => {
  const { scaleStep, minFontSize, autoWrap } = options
  const scaleDown = 1 - scaleStep
  const scaledTextBlock = applyFontSizeToTextBlock( textBlock, fontSize )

  const result = tryFit( scaledTextBlock, fitSize, autoWrap )

  const { oversize } = result
  const nextSize = fontSize * scaleDown

  if ( oversize && nextSize >= minFontSize )
    return downScaler( textBlock, fitSize, options, nextSize )

  return result
}

const upScaler = (
  currentResult: FitResult,
  textBlock: TextBlock,
  fitSize: Size,
  options: FitOptions,
  fontSize: number
) => {
  const { scaleStep, maxFontSize, autoWrap } = options
  const scaleUp = 1 + scaleStep
  const nextSize = fontSize * scaleUp

  if( nextSize > maxFontSize ) return currentResult

  const scaledTextBlock = applyFontSizeToTextBlock( textBlock, nextSize )
  const nextFit = tryFit( scaledTextBlock, fitSize, autoWrap )

  if( nextFit.oversize ){
    return currentResult
  }

  return upScaler( nextFit, textBlock, fitSize, options, nextSize )
}

const tryFit = (
  textBlock: TextBlock,
  fitSize: Size,
  autoWrap: boolean
) => {
  const { font } = textBlock
  const { width } = fitSize
  const { size: fontSize } = font

  const measurer = ( text: string ) =>
    measureWidth( text, font ).width

  const text = (
    autoWrap ?
    wrap( textBlock.text, width, measurer ).join( '\n' ) :
    textBlock.text
  )

  const lines = text.split( '\n' )

  const wrappedTextBlock = Object.assign(
    {},
    textBlock,
    { text, font }
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

  context.drawImage( canvas, x | 0, y | 0 )

  const result: FitResult = { canvas: fittedCanvas, oversize, fontSize, lines }

  return result
}
