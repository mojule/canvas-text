import { TextBlock } from './types'
import { getFontStyle, scaleSize } from './util'
import { measureLines, measureText } from './measure'
import { imageBounds } from './bounds'

export const textToCanvas = (
  textBlock: TextBlock
) => {
  const {
    text, lineHeightScale, font, align, flush
  } = textBlock

  const lines = text.split( '\n' )
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

  canvas.width = blockSize.width
  canvas.height = blockSize.height

  const [ head ] = lines

  if( typeof head !== 'string' ) return canvas

  const unscaledLineHeight = measureText( head, fontStyle ).height
  const scaledLineHeight = unscaledLineHeight * lineHeightScale
  const delta = scaledLineHeight - unscaledLineHeight

  let y = delta !== 0 ? delta : 0

  canvas.height = blockSize.height

  if( y < 0 ){
    canvas.height -= y
    y = 0
  }

  context.fillStyle = color
  context.font = fontStyle
  context.textBaseline = 'top'

  lines.forEach( ( line, i ) => {
    const { width } = lineSizes[ i ]
    let x = 0

    if( align === 'center' ){
      x = ( canvas.width - width ) / 2
    } else if( align === 'right' ){
      x = canvas.width - width
    }

    context.fillText( line, x, y )

    y += scaledLineHeight
  } )

  if( flush ){
    const imageData = context.getImageData( 0, 0, canvas.width, canvas.height )
    const { x, y, width, height } = imageBounds( imageData )

    canvas.width = width
    canvas.height = height

    context.putImageData( imageData, -x, -y )
  }

  return canvas
}
