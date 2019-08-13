import { Size, Font } from './types'

export const getFontStyle = ( font: Font ) => {
  const {
    family,
    size,
    lineHeight = 1,
    style = 'normal',
    variant = 'normal',
    weight = 'normal',
    stretch = 'normal',
  } = font

  return [
     style, variant, weight, stretch, `${ size }px/${ lineHeight }`, family
  ].join( ' ' )
}

export const isOversize = ( bounds: Size, size: Size ) =>
  size.width > bounds.width || size.height > bounds.height

export const scaleSize = (
  { width, height }: Size,
  { width: scaleW, height: scaleH }: Size
): Size =>
  ( { width: width * scaleW, height: height * scaleH } )

export const getArea = ({ width, height }: Size ) => width * height
