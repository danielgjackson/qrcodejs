import QrCode from './qrcode.mjs';
import fs from 'node:fs';

const programOptions = {
    text: 'Hello, world!',
    help: false,
    output: 'medium',
    uppercase: false,
    file: null,
}
const qrOptions = {}
const renderOptions = {};

let matchParams = true;
const textParts = [];

// Get args on Deno or Node
const args = globalThis.Deno ? Deno.args : process.argv.slice(2);

for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (matchParams && arg.startsWith('-')) {
        // Program options
        if (arg == '--help') { programOptions.help = true; }
        else if (arg.startsWith('--output:')) { programOptions.output = arg.split(':')[1]; }
        else if (arg == '--debug-data') { programOptions.output = 'large'; renderOptions.segments = ['  ', '██', '▓▓']; } // █▓▒░
        else if (arg == '--uppercase') { programOptions.uppercase = true; }
        else if (arg == '--file') { programOptions.file = args[++i]; }
        // QR options
        else if (arg.startsWith('--ecl:')) { qrOptions.errorCorrectionLevel = QrCode.ErrorCorrectionLevel[arg.split(':')[1].toUpperCase()]; }
        else if (arg == '--fixecl') { qrOptions.optimizeEcc = false; }
        else if (arg == '--version') { qrOptions.minVersion = qrOptions.maxVersion = parseInt(args[++i]); }
        else if (arg == '--mask') { qrOptions.maskPattern = parseInt(args[++i]); }
        else if (arg == '--quiet') { qrOptions.quiet = parseInt(args[++i]); }
        else if (arg == '--invert') { qrOptions.invert = true; }
        // SVG renderer options
        else if (arg == '--svg-point') { renderOptions.moduleSize = parseFloat(args[++i]); }
        else if (arg == '--svg-round') { renderOptions.moduleRound = parseFloat(args[++i]); }
        else if (arg == '--svg-finder-round') { renderOptions.finderRound = parseFloat(args[++i]); }
        else if (arg == '--svg-alignment-round') { renderOptions.alignmentRound = parseFloat(args[++i]); }
        // BMP renderer options
        else if (arg == '--bmp-scale') { renderOptions.scale = parseFloat(args[++i]); }
        else if (arg == '--bmp-alpha') { renderOptions.alpha = true; }
        // End of options
        else if (arg == '--') matchParams = false;
        else {
            console.error('ERROR: Unknown parameter: ' + arg);
            process.exit(1);
        }
    } else {
        //matchParams = false;
        textParts.push(arg);
    }
}

if (programOptions.help) {
    console.log('USAGE: [--ecl:<l|m|q|h>] [--uppercase] [--invert] [--quiet 4] [--output:<large|medium|compact|bmp|svg>] [--file filename] <text>');
    console.log('')
    console.log('For --output:svg:  [--svg-point 1.0] [--svg-round 0.0] [--svg-finder-round 0.0] [--svg-alignment-round 0.0]');

    process.exit(1);
}

if (textParts.length > 0) {
    programOptions.text = textParts.join(' ');
}
if (programOptions.uppercase) {
    programOptions.text = programOptions.text.toUpperCase();
}
//console.log('output=' + programOptions.output + ' \"' + programOptions.text + '\"');
const matrix = QrCode.generate(programOptions.text, qrOptions);
const output = QrCode.render(programOptions.output, matrix, renderOptions);
if (programOptions.file) {
    if (typeof output != 'string') {
        output = new Uint8Array(output)
    }
    fs.writeFileSync(programOptions.file, output);
} else {
    console.log(output);
}
