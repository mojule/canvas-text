import { TextBlock } from './types'
import { getFontStyle, scaleSize } from './util'
import { measureLines, measureText } from './measure'

export const textToCanvas = (
  textBlock: TextBlock
) => {
  const {
    lines, bounds, lineHeightScale, font, align, valign
  } = textBlock

  const { name, size, color } = font
  const fontStyle = getFontStyle( size, name )
  const canvas = document.createElement( 'canvas' )
  const context = canvas.getContext( '2d' )!
  const lineSizeScale = { width: 1, height: lineHeightScale }

  const {
    size: blockSizeUnscaled,
    lineSizes: lineSizesUnscaled
  } = measureLines( lines, fontStyle )

  const blockSize = scaleSize( blockSizeUnscaled, lineSizeScale )

  const lineSizes = lineSizesUnscaled.map(
    s => scaleSize( s, lineSizeScale )
  )

  canvas.width = bounds.width
  canvas.height = bounds.height

  const [ head ] = lines

  if( typeof head !== 'string' ) return canvas

  const unscaledLineHeight = measureText( head, fontStyle ).height
  const scaledLineHeight = unscaledLineHeight * lineHeightScale
  const delta = scaledLineHeight - unscaledLineHeight

  let y = delta !== 0 ? delta / 2 : 0

  canvas.height = blockSize.height

  if( y < 0 ){
    canvas.height -= y
    y = 0
  }

  if( valign === 'middle' ){
    const yOffset = ( bounds.height - blockSize.height ) / 2

    y += yOffset
  } else if( valign === 'bottom' ){
    const yOffset = ( bounds.height - blockSize.height ) / 2

    y += yOffset
  }

  context.fillStyle = color
  context.font = fontStyle
  context.textBaseline = 'top'

  lines.forEach( ( line, i ) => {
    const { width } = lineSizes[ i ]
    let x = 0

    if( align === 'center' ){
      x = ( bounds.width - width ) / 2
    } else if( align === 'right' ){
      x = bounds.width - width
    }

    context.fillText( line, x, y )

    y += scaledLineHeight
  } )

  return canvas
}
