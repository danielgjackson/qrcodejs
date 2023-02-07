import QrCode from './qrcode.mjs';
import { renderDebug, renderTextLarge, renderTextMedium, renderTextCompact, renderSvg } from './render-matrix.mjs';

let text = "Hello, World!";
let qrOptions = {}
let renderOptions = {};

if (process.argv && process.argv.length > 2) text = process.argv[2];
//console.log(text);

const matrix = QrCode.generate(text, qrOptions);

let output;

//output = renderDebug(matrix);
//output = renderTextLarge(matrix);
output = renderTextMedium(matrix);
//output = renderTextCompact(matrix);
//output = renderTextLarge(matrix, ['  ', '██', '▓▓']);  // █▓▒░
//output = renderSvg(matrix, renderOptions);

console.log(output);
