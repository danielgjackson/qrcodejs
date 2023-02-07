//import Matrix from './qrcode.mjs';

export function renderDebug(matrix, segments = ['  ', '██'], sep = '\n') {
    const lines = [];
    for (let y = -matrix.quiet; y < matrix.dimension + matrix.quiet; y++) {
        const parts = [];
        for (let x = -matrix.quiet; x < matrix.dimension + matrix.quiet; x++) {
            let part = matrix.identifyModule(x, y);
            const bit = matrix.getModule(x, y) ? !matrix.invert : matrix.invert;
            const value = bit ? 1 : 0;
            if (typeof part == 'undefined' || part === null) part = segments[value];
            parts.push(part);
        }
        lines.push(parts.join(''));
    }    
    return lines.join(sep);
}

export function renderTextLarge(matrix, segments = ['  ', '██'], sep = '\n') {
    const lines = [];
    for (let y = -matrix.quiet; y < matrix.dimension + matrix.quiet; y++) {
        const parts = [];
        for (let x = -matrix.quiet; x < matrix.dimension + matrix.quiet; x++) {
            const bit = matrix.getModule(x, y) ? !matrix.invert : matrix.invert;
            const value = bit ? 1 : 0;
            // If an additional segment type is specified, use it to identify data modules differently
            const chars = (segments.length >= 3 && bit && !matrix.identifyModule(x, y)) ? segments[2] : segments[value];
            parts.push(chars);
        }
        lines.push(parts.join(''));
    }    
    return lines.join(sep);
}

export function renderTextMedium(matrix, segments = [' ', '▀', '▄', '█'], sep = '\n') {
    const lines = [];
    for (let y = -matrix.quiet; y < matrix.dimension + matrix.quiet; y += 2) {
        const parts = [];
        for (let x = -matrix.quiet; x < matrix.dimension + matrix.quiet; x++) {
            const upper = matrix.getModule(x, y) ? !matrix.invert : matrix.invert;
            const lower = (y + 1 < matrix.dimension ? matrix.getModule(x, y + 1) : 0) ? !matrix.invert : matrix.invert;
            const value = (upper ? 0x01 : 0) | (lower ? 0x02 : 0);
            // '▀', '▄', '█' // '\u{0020}' space, '\u{2580}' upper half block, '\u{2584}' lower half block, '\u{2588}' block
            const c = segments[value];
            parts.push(c);
        }
        lines.push(parts.join(''));
    }    
    return lines.join(sep);
}

export function renderTextCompact(matrix, segments = [' ', '▘', '▝', '▀', '▖', '▌', '▞', '▛', '▗', '▚', '▐', '▜', '▄', '▙', '▟', '█'], sep = '\n') {
    const lines = [];
    for (let y = -matrix.quiet; y < matrix.dimension + matrix.quiet; y += 2) {
        const parts = [];
        for (let x = -matrix.quiet; x < matrix.dimension + matrix.quiet; x += 2) {
            let value = 0;
            value |= (matrix.getModule(x, y) ? !matrix.invert : matrix.invert) ? 0x01 : 0x00;
            value |= (((x + 1 < matrix.dimension) ? matrix.getModule(x + 1, y) : 0) ? !matrix.invert : matrix.invert) ? 0x02 : 0x00;
            value |= (((y + 1 < matrix.dimension) ? matrix.getModule(x, y + 1) : 0) ? !matrix.invert : matrix.invert) ? 0x04 : 0x00;
            value |= (((y + 1 < matrix.dimension) && (x + 1 < matrix.dimension) ? matrix.getModule(x + 1, y + 1) : 0) ? !matrix.invert : matrix.invert) ? 0x08 : 0x00;
            let c = segments[value];
            parts.push(c);
        }
        lines.push(parts.join(''));
    }    
    return lines.join(sep);
}

export function renderSvg(matrix, options) {
    options = Object.assign({
        moduleRound: null,
        finderRound: null,
        alignmentRound: null,
        white: false,    // Output an element for every module, not just black/dark ones but white/light ones too.
        moduleSize: 1,
    }, options || {});

    const lines = [];
    lines.push(`<?xml version="1.0"?>`);
    // viewport-fill=\"white\" 
    lines.push(`<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="currentColor" viewBox="${-matrix.quiet} ${-matrix.quiet} ${2 * matrix.quiet + matrix.dimension} ${2 * matrix.quiet + matrix.dimension}" shape-rendering="crispEdges">`);
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
            // IMPORTANT: Inverting the output for SVGs will not be correct if a single finder pattern is used (it would need inverting)
            if (matrix.invert) bit = !bit;
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
