import { FitSettings, Rect, FitResult } from './types'
import { wrap } from '@mojule/wrap-text'
import { measureText, measureLines } from './measure'
import { getFontStyle, isOversize, scaleSize } from './util'

export const fitText = (
  text: string, bounds: Rect,
  name: string, size: number,
  lineHeightScale = 1, fit?: FitSettings,
  scaleStep = 0.95
): FitResult => {
  const tryFit = ( size: number ) => {
    size = (
      fit && fit.minSize ?
        Math.max( size, fit.minSize ) :
        size
    )

    const fontStyle = getFontStyle( size, name )

    const measureWidth = ( text: string ) =>
      measureText( text, fontStyle ).width

    const lines = wrap( text, bounds.width, measureWidth )

    const blockSize = scaleSize(
      measureLines( lines, fontStyle ),
      { width: 1, height: lineHeightScale }
    )

    const oversize = isOversize( bounds, blockSize )

    const fitResult = { lines, size, oversize }

    if( !oversize ) return fitResult

    if( fit === undefined ) return fitResult

    if( size * scaleStep < fit.minSize ) return fitResult

    return tryFit( size * scaleStep )
  }

  return tryFit( size )
}
