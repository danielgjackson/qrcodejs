import QrCode from './qrcode.mjs';
import fs from 'fs';

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
for (let i = 2; i < process.argv.length; i++) {
    const argv = process.argv[i];
    if (matchParams && argv.startsWith('-')) {
        // Program options
        if (argv == '--help') { programOptions.help = true; }
        else if (argv.startsWith('--output:')) { programOptions.output = argv.split(':')[1]; }
        else if (argv == '--debug-data') { programOptions.output = 'large'; renderOptions.segments = ['  ', '██', '▓▓']; } // █▓▒░
        else if (argv == '--uppercase') { programOptions.uppercase = true; }
        else if (argv == '--file') { programOptions.file = process.argv[++i]; }
        // QR options
        else if (argv.startsWith('--ecl:')) { qrOptions.errorCorrectionLevel = QrCode.ErrorCorrectionLevel[argv.split(':')[1].toUpperCase()]; }
        else if (argv == '--fixecl') { qrOptions.optimizeEcc = false; }
        else if (argv == '--version') { qrOptions.minVersion = qrOptions.maxVersion = parseInt(process.argv[++i]); }
        else if (argv == '--mask') { qrOptions.maskPattern = parseInt(process.argv[++i]); }
        else if (argv == '--quiet') { qrOptions.quiet = parseInt(process.argv[++i]); }
        else if (argv == '--invert') { qrOptions.invert = true; }
        // SVG renderer options
        else if (argv == '--svg-point') { renderOptions.moduleSize = parseFloat(process.argv[++i]); }
        else if (argv == '--svg-round') { renderOptions.moduleRound = parseFloat(process.argv[++i]); }
        else if (argv == '--svg-finder-round') { renderOptions.finderRound = parseFloat(process.argv[++i]); }
        else if (argv == '--svg-alignment-round') { renderOptions.alignmentRound = parseFloat(process.argv[++i]); }
        // BMP renderer options
        else if (argv == '--bmp-scale') { renderOptions.scale = parseFloat(process.argv[++i]); }
        else if (argv == '--bmp-alpha') { renderOptions.alpha = true; }
        // End of options
        else if (argv == '--') matchParams = false;
        else {
            console.error('ERROR: Unknown parameter: ' + argv);
            process.exit(1);
        }
    } else {
        //matchParams = false;
        textParts.push(argv);
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
    fs.writeFileSync(programOptions.file, Buffer.from(output));
} else {
    console.log(output);
}
