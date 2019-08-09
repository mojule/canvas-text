import { Size } from './types'

export const getFontStyle = ( fontSize: string | number, fontName: string ) =>
  `${ fontSize }px ${ fontName }`

export const isOversize = ( bounds: Size, size: Size ) =>
  size.width > bounds.width || size.height > bounds.height

export const scaleSize = (
  { width, height }: Size,
  { width: scaleW, height: scaleH }: Size
): Size =>
  ( { width: width * scaleW, height: height * scaleH } )
