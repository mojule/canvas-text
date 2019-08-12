import { Size, TextBlockSizes } from './types'

export const measureText = (
  text: string, fontStyle: string
): Size => {
  const span = document.createElement( 'span' )

  span.style.font = fontStyle
  span.innerHTML = text.replace( /\s/g, '&nbsp;' )

  document.body.appendChild( span )

  const { width, height } = span.getBoundingClientRect()

  span.remove()

  return { width, height }
}

export const measureLines = (
  lines: string[], fontStyle: string
): TextBlockSizes => {
  let width = 0
  let height = 0

  const blockBounds: TextBlockSizes = {
    lineSizes: [],
    size: { width, height }
  }

  lines.forEach( line => {
    const lineBounds = measureText( line, fontStyle )
    const { width: w, height: h } = lineBounds

    blockBounds.lineSizes.push( lineBounds )
    width = Math.max( width, w )
    height += h
  } )

  blockBounds.size = { width, height }

  return blockBounds
}
