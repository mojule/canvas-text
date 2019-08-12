import { Rect, TextBlock, Font } from '../types'
//import { fitText } from '../fit'
import { textToCanvas } from '../text-to-canvas'

const source = document.createElement( 'canvas' )
const context = source.getContext( '2d' )!

source.width = 640
source.height = 480

const text = 'The quick brown\nfox jumps over\nthe lazy dog'

const bounds: Rect = {
  x: 32,
  y: 32,
  width: 320,
  height: 200
}

const align = 'left'
const valign = 'top'
const lineHeightScale = 1.5
const flush = true

const fit = {
  minSize: 8
}

const font: Font = {
  name: 'sans-serif',
  size: 64,
  color: '#000'
}

const textBlock: TextBlock = {
  text,
  align,
  lineHeightScale,
  font,
  flush
}

// const fitResult = fitText( textBlock )

// const { canvas, yOffset } = fitResult

// context.strokeStyle = 'rgba( 255, 0, 0, 0.5 )'

// context.strokeRect( bounds.x, bounds.y, bounds.width, bounds.height )
// context.drawImage( canvas, bounds.x, bounds.y + yOffset )

// document.body.appendChild( source )
// document.body.appendChild( canvas )

const textCanvas = textToCanvas( textBlock )
document.body.appendChild( textCanvas )