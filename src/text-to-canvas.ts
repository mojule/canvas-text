import { TextBlock } from './types'
import { getFontStyle } from './util'
import { measureLines } from './measure'
import { imageBounds } from './bounds'

export const textToCanvas = (
  textBlock: TextBlock
) => {
  const {
    text, font,
    align = 'left',
    flush = false
  } = textBlock

  const lines = text.split( '\n' )
  const { color } = font
  const fontStyle = getFontStyle( font )
  const canvas = document.createElement( 'canvas' )
  const context = canvas.getContext( '2d' )!

  const {
    size: blockSize,
    lineRects
  } = measureLines( lines, font )

  canvas.width = Math.max( 1, blockSize.width )
  canvas.height = Math.max( 1, blockSize.height )

  const [ head ] = lines

  if( typeof head !== 'string' ) return canvas

  canvas.height = blockSize.height

  context.fillStyle = color
  context.font = fontStyle
  context.textBaseline = 'top'

  let y = 0

  lines.forEach( ( line, i ) => {
    const { x: xOff, width, height } = lineRects[ i ]
    let x = -xOff

    if( align === 'center' ){
      x = ( canvas.width - width + ( x * 2 ) ) / 2
    } else if( align === 'right' ){
      x = canvas.width - width + ( x * 2 )
    }

    context.fillText( line, x, y )

    y += height
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

