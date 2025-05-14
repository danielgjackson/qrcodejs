export interface GenerateOptions {
  
  /** 0 to 3 */
  errorCorrectionLevel?: number
  
  /** default true, to maximize the error-correction level within the chosen output size */
  optimizeEcc?: boolean
  
  /** 1 to 40 */
  minVersion?: number
  
  /** 1 to 40 */
  maxVersion?: number

  /** 0 to 7 */
  maskPattern?: number

  /** boolean flag to invert the code, not as widely supported */
  invert?: boolean

  /** the size, in modules, of the quiet area around the code */
  quiet?: number
}

export type RenderMode = 'large' | 'medium' | 'compact' | 'svg' | 'bmp' | 'svg-uri' | 'bmp-uri'

export type RenderOptions = SvgRenderOptions | BmpRenderOptions

export interface SvgRenderOptions {
  /** (svg / svg-uri only) the unit dimensions of each module */
  moduleSize?: number
  
  /** (svg / svg-uri only) output the non-set modules (otherwise will be transparent background) */
  white?: boolean

  /** (svg / svg-uri only) proportion of how rounded the modules are */
  moduleRound?: number

  /** (svg / svg-uri only) to hide the standard finder modules and instead output a shape with the specified roundness */
  finderRound?: number

  /** (svg / svg-uri only) to hide the standard alignment modules and instead output a shape with the specified roundness */
  alignmentRound?: number
}

export interface BmpRenderOptions {
  /** (bmp / bmp-uri only) for the size of a module */
  scale?: number
  
  /** (bmp / bmp-uri only) to use a transparent background */
  alpha?: boolean
  
  /** (bmp / bmp-uri only) can set a specific image size (rather than scaling the matrix dimensions) */
  width?: boolean
  
  /** (bmp / bmp-uri only) can set a specific image size (rather than scaling the matrix dimensions) */
  height?: boolean
}

export class Matrix {}

export default class QrCode {
  static generate(data: string, options?: GenerateOptions): Matrix
  
  static render(mode: 'large' | 'medium' | 'compact', matrix: Matrix, options?: RenderOptions): string
  static render(mode: 'svg' | 'svg-uri', matrix: Matrix, options?: SvgRenderOptions): string
  static render(mode: 'bmp', matrix: Matrix, options?: BmpRenderOptions): Uint8Array
  static render(mode: 'bmp-uri', matrix: Matrix, options?: BmpRenderOptions): string
}
