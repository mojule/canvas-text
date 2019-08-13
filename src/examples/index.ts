import { Rect, TextBlock, Font, FitOptions, Align, VAlign, FitMode } from '../types'
import { textToCanvas } from '../text-to-canvas'
import { fitText } from '../fit'

const dest = document.createElement( 'canvas' )
const context = dest.getContext( '2d' )!

dest.width = 400
dest.height = 280

const text = 'The quick brown fox jumps over the lazy dog'

const bounds: Rect = {
  x: 40,
  y: 40,
  width: 320,
  height: 200
}

const align: Align = 'center'
const valign: VAlign = 'middle'
const lineHeight = 0.8
const flush = true
const minFontSize = 8
const maxFontSize = 200
const fontSize = 128
const scaleStep = 0.025
const fitMode: FitMode = 'down'

const font: Font = {
  family: 'sans-serif',
  size: fontSize,
  color: '#39f',
  style: 'italic',
  weight: 'bold',
  lineHeight
}

const textBlock: TextBlock = {
  text,
  align,
  font,
  flush
}

const options: FitOptions = {
  minFontSize, maxFontSize, fitMode, scaleStep, valign
}

context.strokeStyle = 'rgba( 255, 0, 0, 0.5 )'

context.strokeRect( bounds.x, bounds.y, bounds.width, bounds.height )

document.body.appendChild( dest )

const start = Date.now()
const fitResult = fitText( textBlock, bounds, options )
const end = Date.now()

const { canvas, fontSize: fittedFontSize } = fitResult

context.drawImage( canvas, bounds.x, bounds.y )

const fittedTextBlock = Object.assign(
  {},
  textBlock,
  {
    font: Object.assign(
      {},
      font,
      {
        size: fittedFontSize
      }
    )
  }
)

const textCanvas = textToCanvas( fittedTextBlock )
document.body.appendChild( textCanvas )

console.log( `Original size: ${ fontSize }` )
console.log( `Scaled size: ${ fittedFontSize }` )
console.log( `Took ${ end - start }ms` )
