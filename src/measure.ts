import { Size } from './types'

export const measureText = (
  text: string, fontStyle: string
): Size => {
  const span = document.createElement( 'span' )

  span.style.font = fontStyle
  span.innerText = text

  document.body.appendChild( span )

  const { width, height } = span.getBoundingClientRect()

  span.remove()

  return { width, height }
}

export const measureLines = (
  lines: string[], fontStyle: string
): Size => {
  let width = 0
  let height = 0

  lines.forEach( line => {
    const { width: w, height: h } = measureText( line, fontStyle )

    width = Math.max( width, w )
    height += h
  } )

  return { width, height }
}
