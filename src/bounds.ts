import { Rect } from './types'

export const imageBounds = ( imageData: ImageData ): Rect => {
  let x = 0
  let y = 0
  let right = 0
  let bottom = 0

  let foundLeft = false
  let foundTop = false

  for ( let py = 0; py < imageData.height; py++ ) {
    const {
      left: rowLeft,
      right: rowRight
    } = horizontalBounds( imageData, py )

    const nonEmpty = rowRight > -1

    if ( nonEmpty ) {
      if ( !foundLeft ) {
        x = rowLeft
        foundLeft = true
      }

      x = Math.min( x, rowLeft )
      right = Math.max( right, rowRight )

      if ( !foundTop ) {
        foundTop = true
        y = py
      }

      bottom = py
    }
  }

  const width = right - x + 1
  const height = bottom - y + 1

  return { x, y, width, height }
}

const horizontalBounds = ( imageData: ImageData, y: number ) => {
  y = y | 0

  const { width, data } = imageData

  let left = -1
  let right = -1
  let foundLeft = false

  for ( let x = 0; x < width; x++ ) {
    const index = ( y * width + x ) * 4
    const alpha = data[ index + 3 ]
    const nonEmpty = alpha > 0

    if ( !foundLeft && nonEmpty ) {
      left = x
      foundLeft = true
    }

    if ( nonEmpty ) {
      right = x
    }
  }

  return {
    left, right
  }
}
