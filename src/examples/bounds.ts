import { imageBounds } from '../image'

const source = document.createElement( 'canvas' )
const context = source.getContext( '2d' )!

source.width = 640
source.height = 480

context.font = '64px sans-serif'
context.textBaseline = 'bottom'

context.fillStyle = '#000'
context.fillText( 'Hello!', 64, 128 )
context.fillText( 'World!', 192, 192 )

const imageData = context.getImageData( 0, 0, 640, 480 )

const bounds = imageBounds( imageData )

console.log( bounds )

const { x, y, width, height } = bounds

context.strokeStyle = 'rgba( 255, 0, 0, 0.5 )'

context.strokeRect( x, y, width, height )

// context.beginPath()

// context.moveTo( left, top )
// context.lineTo( right, top )
// context.lineTo( right, bottom )
// context.lineTo( left, bottom )
// context.lineTo( left, top )

// context.stroke()

const dest = document.createElement( 'canvas' )
const destContext = dest.getContext( '2d' )!

dest.width = width
dest.height = height

const sourceData = context.getImageData( x, y, width, height )

destContext.putImageData( sourceData, 0, 0 )

document.body.appendChild( dest )