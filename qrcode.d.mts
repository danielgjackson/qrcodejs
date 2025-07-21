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

export type RenderMode = 'large' | 'medium' | 'compact' | 'svg' | 'bmp' | 'svg-uri' | 'bmp-uri' | 'sixel'

export type RenderOptions = SvgRenderOptions | BmpRenderOptions | SixelRenderOptions | PngRenderOptions

export interface SvgRenderOptions {
    /** (svg / svg-uri / png) the CSS color of each module (default: 'currentColor') */
    color?: string

    /** (svg / svg-uri) the unit dimensions of each module */
    moduleSize?: number

    /** (svg / svg-uri) output the non-set modules (otherwise will be transparent background) */
    white?: boolean

    /** (svg / svg-uri / png) proportion of how rounded the modules are */
    moduleRound?: number

    /** (svg / svg-uri / png) to hide the standard finder modules and instead output a shape with the specified roundness */
    finderRound?: number

    /** (svg / svg-uri / png) to hide the standard alignment modules and instead output a shape with the specified roundness */
    alignmentRound?: number
}

export interface BmpRenderOptions {
    /** (bmp / bmp-uri) for the size of a module */
    scale?: number

    /** (bmp / bmp-uri) to use a transparent background */
    alpha?: boolean

    /** (bmp / bmp-uri) can set a specific image size (rather than scaling the matrix dimensions) */
    width?: boolean

    /** (bmp / bmp-uri) can set a specific image size (rather than scaling the matrix dimensions) */
    height?: boolean
}

export interface SixelRenderOptions {
    /** (sixel) for the size of a module */
    scale?: number
}

export interface PngRenderOptions extends SvgRenderOptions {
    /** (png) the width and height of the generated image */
    size: number

    /** (png) the CSS color to draw behind the code  */
    background: string
}

export class Matrix {}

export default class QrCode {
    static generate(data: string, options?: GenerateOptions): Matrix

    static render(mode: 'large' | 'medium' | 'compact', matrix: Matrix, options?: RenderOptions): string
    static render(mode: 'svg' | 'svg-uri', matrix: Matrix, options?: SvgRenderOptions): string
    static render(mode: 'bmp', matrix: Matrix, options?: BmpRenderOptions): Uint8Array
    static render(mode: 'bmp-uri', matrix: Matrix, options?: BmpRenderOptions): string
    static render(mode: 'sixel', matrix: Matrix, options?: SixelRenderOptions): string
    static render(mode: 'png', matrix: Matrix, options?: PngRenderOptions): Promise<Blob>
}
