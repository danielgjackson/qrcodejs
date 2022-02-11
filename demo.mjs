import QrCode from './qrcode.mjs';

let text = "Hello, World!";
let options = {};

if (process.argv && process.argv.length > 2) text = process.argv[2];
//console.log(text);

const matrix = QrCode.generate(text, options);


function displayIdentify(matrix) {
    console.log('');
    for (let y = 0; y < matrix.dimension; y++) {
        const parts = [];
        for (let x = 0; x < matrix.dimension; x++) {
            let part = matrix.identifyModule(x, y);
            let bit = matrix.getModule(x, y);
            if (typeof part == 'undefined' || part === null) part = bit ? "██" : "  ";
            parts.push(part);
        }
        const line = parts.join('');
        console.log('  ' + line);
    }    
    console.log('');
}

function displayLarge(matrix, light = '  ', dark = '██', data = '██') {
    console.log('');
    for (let y = 0; y < matrix.dimension; y++) {
        const parts = [];
        for (let x = 0; x < matrix.dimension; x++) {
            const bit = matrix.getModule(x, y);
            const ident = matrix.identifyModule(x, y);

            let chars = bit ? dark : light;
            if (bit && !ident) chars = data;
            parts.push(chars);
        }
        const line = parts.join('');
        console.log('  ' + line);
    }    
    console.log('');
}

function displayMedium(matrix) {
    console.log('');
    for (let y = 0; y < matrix.dimension; y += 2) {
        const parts = [];
        for (let x = 0; x < matrix.dimension; x++) {
            const upper = matrix.getModule(x, y);
            const lower = y + 1 < matrix.dimension ? matrix.getModule(x, y + 1) : 0;
            let c = '?';
            // '▀', '▄', '█' // '\u{0020}' space, '\u{2580}' upper half block, '\u{2584}' lower half block, '\u{2588}' block
            if (upper && lower) c = '█';
            else if (upper && !lower) c = '▀';
            else if (!upper && lower) c = '▄';
            else if (!upper && !lower) c = ' ';
            parts.push(c);
        }
        const line = parts.join('');
        console.log('  ' + line);
    }    
    console.log('');
}

function displayCompact(matrix) {
    const lookup = " ▘▝▀▖▌▞▛▗▚▐▜▄▙▟█";
    console.log('');
    for (let y = 0; y < matrix.dimension; y += 2) {
        const parts = [];
        for (let x = 0; x < matrix.dimension; x += 2) {
            let value = 0;
            value |= matrix.getModule(x, y) ? 0x01 : 0x00;
            if (x + 1 < matrix.dimension) value |= matrix.getModule(x + 1, y) ? 0x02 : 0x00;
            if (y + 1 < matrix.dimension) {
                value |= matrix.getModule(x, y + 1) ? 0x04 : 0x00;
                if (x + 1 < matrix.dimension) value |= matrix.getModule(x + 1, y + 1) ? 0x08 : 0x00;
            }
            let c = lookup[value];
            parts.push(c);
        }
        const line = parts.join('');
        console.log('  ' + line);
    }    
    console.log('');
}

// Print
//displayLarge(matrix);
displayMedium(matrix);
//displayCompact(matrix);
//displayLarge(matrix, '  ', '██', '▓▓');  // █▓▒░
//displayIdentify(matrix);
