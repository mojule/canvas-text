import { Rect, TextBlock, Font, FitOptions, Align, VAlign, FitMode } from '../types'
import { fitText } from '../fit'
import { applyFontSizeToTextBlock } from '../util'

const bounds: Rect = {
  x: 40,
  y: 40,
  width: 320,
  height: 200
}

const preWrappedText = 'The quick brown\nfox jumps over\nthe lazy dog'
const unwrappedText = preWrappedText.split( '\n' ).join( ' ' ).trim()

const align: Align = 'center'
const valign: VAlign = 'middle'
const lineHeight = 1
const flush = true
const fontSize = 128
const smallStep = 0.025
const largeStep = 0.1

const font: Font = {
  family: 'sans-serif',
  size: fontSize,
  color: '#39f',
  style: 'italic',
  weight: 'bold',
  lineHeight
}

const createTextBlock = ( text: string, fontSize: number ) => {
  const textBlock: TextBlock = applyFontSizeToTextBlock( {
    text, align, font, flush
  }, fontSize )

  return textBlock
}

const createOptions = (
  minFontSize: number, maxFontSize: number, fitMode: FitMode, scaleStep: number,
  autoWrap: boolean
) => {
  const options: FitOptions = {
    minFontSize, maxFontSize, fitMode, scaleStep, valign, autoWrap
  }

  return options
}

const addFittedCanvas = (
  name: string, textBlock: TextBlock, options: FitOptions
) => {
  const canvasContainer = document.querySelector( '.canvas-container' )!
  const container = document.createElement( 'div' )

  container.classList.add( 'container' )

  const header = document.createElement( 'h3' )

  header.innerText = name

  const dest = document.createElement( 'canvas' )
  const context = dest.getContext( '2d' )!

  dest.width = 400
  dest.height = 280

  context.strokeStyle = 'rgba( 255, 0, 0, 0.5 )'

  context.strokeRect( bounds.x, bounds.y, bounds.width, bounds.height )

  const start = Date.now()
  const fitResult = fitText( textBlock, bounds, options )
  const end = Date.now()

  const { canvas, fontSize: fittedFontSize } = fitResult

  context.drawImage( canvas, bounds.x, bounds.y )

  const resultLines = [
    `Original size: ${ textBlock.font.size }`,
    `Scaled size: ${ fittedFontSize }`,
    `Took ${ end - start }ms`
  ]

  const resultText = document.createElement( 'p' )

  resultText.innerHTML = resultLines.join( '<br>' )

  container.appendChild( header )
  container.appendChild( dest )
  container.appendChild( resultText )

  canvasContainer.appendChild( container )
}

interface Example {
  name: string
  text: string
  fontSize: number
  fitMode: FitMode
  step: number
  autoWrap: boolean
}

const addExample = (
  example: Example,
  textBlockOptions: Partial<TextBlock> = {},
  fitOptions: Partial<FitOptions> = {},
  fontOptions: Partial<Font> = {}
) => {
  const { name, text, fontSize, fitMode, step, autoWrap } = example

  const textBlock = Object.assign(
    createTextBlock( text, fontSize ),
    textBlockOptions
  )

  textBlock.font = Object.assign( textBlock.font, fontOptions )

  const options = Object.assign(
    createOptions( 8, 300, fitMode, step, autoWrap ),
    fitOptions
  )

  addFittedCanvas( name, textBlock, options )
}

const examples: Example[] = []

const modeNames = [ 'scale down', 'scale to fit' ]

const stepNames = [
  'large step (fast, imprecise)',
  'small step (fast, precise)',
]

const sizeNames = [ 'from undersize', 'from oversize' ]

const wrapNames = [ 'no auto wrap', 'auto wrap' ]

modeNames.forEach( modeName => {
  sizeNames.forEach( sizeName => {
    wrapNames.forEach( wrapName => {
      stepNames.forEach( stepName => {
        const name = [ modeName, sizeName, wrapName, stepName ].join( ', ' )

        let text = preWrappedText
        let autoWrap = false

        if ( wrapName === 'auto wrap' ) {
          text = unwrappedText
          autoWrap = true
        }

        let fontSize = 24

        if ( sizeName === 'from oversize' ) {
          fontSize = 128
        }

        let fitMode: FitMode = 'down'

        if ( modeName === 'scale to fit' ) {
          fitMode = 'fit'
        }

        let step = largeStep

        if ( stepName === 'small step (fast, precise)' ) {
          step = smallStep
        }

        const example: Example = {
          name,
          text,
          fontSize,
          fitMode,
          step,
          autoWrap
        }

        examples.push( example )
      } )
    } )
  } )
} )

const form = document.querySelector( 'form' )!

const updateFromForm = () => {
  const existingContainer = document.querySelector( '.container' )

  if ( existingContainer ) {
    existingContainer.remove()
  }

  const data = new FormData( form )

  const name = 'Custom settings'

  let text = data.get( 'text' ) as string
  const align = data.get( 'align' ) as Align
  const flush = data.get( 'flush' ) === 'on'

  const family = data.get( 'family' ) as string
  const fontSize = Number( data.get( 'fontSize' ) )
  const color = data.get( 'color' ) as string
  const lineHeight = Number( data.get( 'lineHeight' ) )
  const style = data.get( 'style' ) as string
  const variant = data.get( 'variant' ) as string
  const weight = data.get( 'weight' ) as string
  const stretch = data.get( 'stretch' ) as string

  const minFontSize = Number( data.get( 'minFontSize' ) )
  const maxFontSize = Number( data.get( 'maxFontSize' ) )
  const fitMode = data.get( 'fitMode' ) as FitMode
  const valign = data.get( 'valign' ) as VAlign
  const step = Number( data.get( 'step' ) )
  const autoWrap = data.get( 'autoWrap' ) === 'on'

  if ( autoWrap ) {
    text = text.split( '\n' ).join( ' ' )
  }

  const textBlockOptions: Partial<TextBlock> = {
    align, flush
  }

  const fontOptions: Partial<Font> = {
    color, family, lineHeight, style, variant, weight, stretch
  }

  const fitOptions: Partial<FitOptions> = {
    valign, minFontSize, maxFontSize
  }

  const example: Example = {
    name, text, fontSize, fitMode, step, autoWrap
  }

  addExample( example, textBlockOptions, fitOptions, fontOptions )
}

form.addEventListener( 'submit', e => {
  e.preventDefault()

  updateFromForm()
} )

updateFromForm()
