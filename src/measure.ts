import { TextBlockMetrics, Font, Rect } from './types'
import { getFontStyle } from './util'

const svgNameSpace = 'http://www.w3.org/2000/svg'
const svgEl = document.createElementNS( svgNameSpace, 'svg' )
const textEl = document.createElementNS( svgNameSpace, 'text' )

svgEl.appendChild( textEl )

/*
  We use SVG to measure the width as it takes into account parts of the text
  that would otherwise escape the bounding box, for example italics
*/
export const measureWidth = (
  text: string, font: Font
) => {
  textEl.style.font = getFontStyle( font )
  textEl.textContent = text.replace( /\s+/g, '\u00a0' )

  document.body.appendChild( svgEl )

  const rect = textEl.getBBox()

  svgEl.remove()

  return rect as Rect
}

export const measureLines = (
  lines: string[], font: Font,
  measurer = measureWidth
): TextBlockMetrics => {
  const { lineHeight = 1.2, size } = font
  const scaledLineHeight = lineHeight * size

  let width = 0
  let height = 0

  const blockBounds: TextBlockMetrics = {
    lineRects: [],
    size: { width, height }
  }

  lines.forEach( ( line, i ) => {
    const {
      x, y,
      width: measuredWidth,
      height: measuredHeight
    } = measurer( line, font )

    const isLastLine = i === lines.length - 1

    // the last line should be full height
    const currentHeight = (
      isLastLine ?
      measuredHeight :
      scaledLineHeight
    )

    const lineRect = {
      x, y,
      width: measuredWidth,
      height: currentHeight
    }

    blockBounds.lineRects.push( lineRect )

    width = Math.max( width, measuredWidth )
    height += currentHeight
  } )

  blockBounds.size = { width, height }

  return blockBounds
}
