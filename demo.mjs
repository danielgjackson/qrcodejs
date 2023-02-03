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

function createSvg(matrix, options) {
    options = Object.assign({
        moduleRound: null,
        finderRound: null,
        alignmentRound: null,
        invert: false,
        quiet: 4,
        white: false,    // Output an element for every module, not just black/dark ones but white/light ones too.
        moduleSize: 1,
    }, options || {});

    let lines = [];
    lines.push(`<?xml version="1.0"?>`);
    // viewport-fill=\"white\" 
    lines.push(`<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="currentColor" viewBox="${-options.quiet} ${-options.quiet} ${2 * options.quiet + matrix.dimension} ${2 * options.quiet + matrix.dimension}" shape-rendering="crispEdges">`);
    //lines.push(`<desc>${data}</desc>`);
    lines.push(`<defs>`);

    // module data bit (dark)
    lines.push(`<rect id="b" x="${-options.moduleSize / 2}" y="${-options.moduleSize / 2}" width="${options.moduleSize}" height="${options.moduleSize}" rx="${0.5 * (options.moduleRound || 0) * options.moduleSize}" />`);

    // module data bit (light). 
    if (options.white) { // Light modules as a ref to a placeholder empty element
        lines.push(`<path id="w" d="" visibility="hidden" />`);
    }

    // Use one item for the finder marker
    if (options.finderRound != null) {
        // Hide finder module, use finder part
        lines.push(`<path id="f" d="" visibility="hidden" />`);
        if (options.white) lines.push(`<path id="fw" d="" visibility="hidden" />`);
        lines.push(`<g id="fc"><rect x="-3" y="-3" width="6" height="6" rx="${3.0 * options.finderRound}" stroke="currentColor" stroke-width="1" fill="none" /><rect x="-1.5" y="-1.5" width="3" height="3" rx="${1.5 * options.finderRound}" /></g>`);
        lines.push(`<g id="fc"><rect x="-3" y="-3" width="6" height="6" rx="${3.0 * options.finderRound}" stroke="currentColor" stroke-width="1" fill="none" /><rect x="-1.5" y="-1.5" width="3" height="3" rx="${1.5 * options.finderRound}" /></g>`);
    } else {
        // Use normal module for finder module, hide finder part
        lines.push(`<use id="f" xlink:href="#b" />`);
        if (options.white) lines.push(`<use id="fw" xlink:href="#w" />`);
        lines.push(`<path id="fc" d="" visibility="hidden" />`);
    }

    // Use one item for the alignment marker
    if (options.alignmentRound != null) {
        // Hide alignment module, use alignment part
        lines.push(`<path id="a" d="" visibility="hidden" />`);
        if (options.white) lines.push(`<path id="aw" d="" visibility="hidden" />`);
        lines.push(`<g id="ac"><rect x="-2" y="-2" width="4" height="4" rx="${2.0 * options.alignmentRound}" stroke="currentColor" stroke-width="1" fill="none" /><rect x="-0.5" y="-0.5" width="1" height="1" rx="${0.5 * options.alignmentRound}" /></g>`);
    } else {
        // Use normal module for alignment module, hide alignment part
        lines.push(`<use id="a" xlink:href="#b" />`);
        if (options.white) lines.push(`<use id="aw" xlink:href="#w" />`);
        lines.push(`<path id="ac" d="" visibility="hidden" />`);
    }

    lines.push(`</defs>`);

    for (let y = 0; y < matrix.dimension; y++) {
        for (let x = 0; x < matrix.dimension; x++) {
            const mod = matrix.identifyModule(x, y);
            let bit = matrix.getModule(x, y);
            if (options.invert) bit = !bit;
            let type = bit ? 'b' : 'w';

            // Draw finder/alignment as modules (define to nothing if drawing as whole parts)
            if (mod == 'Fi' || mod == 'FI') { type = bit ? 'f' : 'fw'; }
            else if (mod == 'Al' || mod == 'AL') { type = bit ? 'a' : 'aw'; }

            if (bit || options.white) {
                lines.push(`<use x="${x}" y="${y}" xlink:href="#${type}" />`);
            }
        }
    }

    // Draw finder/alignment as whole parts (define to nothing if drawing as modules)
    for (let y = 0; y < matrix.dimension; y++) {
        for (let x = 0; x < matrix.dimension; x++) {
            const mod = matrix.identifyModule(x, y);
            let type = null;
            if (mod == 'FI') type = 'fc';
            else if (mod == 'AL') type = 'ac';
            if (type == null) continue;
            lines.push(`<use x="${x}" y="${y}" xlink:href="#${type}" />`);
        }
    }

    lines.push(`</svg>`);

    const svgString = lines.join('\n');
    return svgString;
}


// Print
//displayLarge(matrix);
//displayMedium(matrix);
//displayCompact(matrix);
//displayLarge(matrix, '  ', '██', '▓▓');  // █▓▒░
//displayIdentify(matrix);

// SVG
const svg = createSvg(matrix);
console.log(svg);
