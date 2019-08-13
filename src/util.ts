import { Size, Font, TextBlock } from './types'

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

export const applyFontSizeToTextBlock = (
  textBlock: TextBlock, fontSize: number
) => {
  const { font } = textBlock
  const newFont = applyFontSize( font, fontSize )
  const newTextBlock = Object.assign(
    {},
    textBlock,
    {
      font: newFont
    }
  )

  return newTextBlock as TextBlock
}

export const applyFontSize = ( font: Font, fontSize: number ) => {
  const newFont = Object.assign(
    {},
    font,
    {
      size: fontSize | 0
    }
  )

  return newFont as Font
}