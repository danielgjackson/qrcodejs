import QrCode from './index.js';

let text = "Hello, World!";
let options = {};

text = "lkjflskdjflskdjflskdjflksjdflkjsdlfkjsldkjflskjdflksjdflkjsdlfkjsldkjflskjdflksjdflkjsdflkjsdlfkjsldkjfddddd";

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

function displayLarge(matrix) {
    console.log('');
    for (let y = 0; y < matrix.dimension; y++) {
        const parts = [];
        for (let x = 0; x < matrix.dimension; x++) {
            // '▀', '▄', '█' // '\u{0020}' space, '\u{2580}' upper half block, '\u{2584}' lower half block, '\u{2588}' block
            parts.push(matrix.getModule(x, y) ? '[]' : '  '); // '██'
        }
        const line = parts.join('');
        console.log('  ' + line);
    }    
    console.log('');
}

function displayCompact(matrix) {
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

// Print
//displayLarge(matrix);
displayCompact(matrix);
//displayIdentify(matrix);

