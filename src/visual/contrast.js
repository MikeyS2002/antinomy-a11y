/**
 * WCAG 2.1 contrast ratio utilities
 * All colors accepted as hex strings (#RGB or #RRGGBB)
 */

// parse hex to rgb values (0-255)
export function parseHex(hex) {
    let h = hex.replace("#", "");

    // expand shorthand (#abc -> #aabbcc)
    if (h.length === 3) {
        h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
    }

    return {
        r: parseInt(h.slice(0, 2), 16),
        g: parseInt(h.slice(2, 4), 16),
        b: parseInt(h.slice(4, 6), 16),
    };
}

// linearize a single sRGB channel (0-255 -> linear)
function linearize(channel) {
    const s = channel / 255;
    return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
}

/**
 * WCAG relative luminance
 * https://www.w3.org/TR/WCAG21/#dfn-relative-luminance
 */
export function relativeLuminance(rgb) {
    const r = linearize(rgb.r);
    const g = linearize(rgb.g);
    const b = linearize(rgb.b);
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * contrast ratio between two hex colors
 * returns a number like 4.5 or 21
 */
export function contrastRatio(color1, color2) {
    const l1 = relativeLuminance(parseHex(color1));
    const l2 = relativeLuminance(parseHex(color2));
    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);
    return (lighter + 0.05) / (darker + 0.05);
}

/**
 * check a fg/bg pair against WCAG contrast levels
 * returns the ratio and booleans for each level
 */
export function meetsContrast(fg, bg) {
    const ratio = contrastRatio(fg, bg);
    return {
        ratio: Math.round(ratio * 100) / 100,
        aa: ratio >= 4.5,
        aaa: ratio >= 7,
        aaLarge: ratio >= 3,
        aaaLarge: ratio >= 4.5,
    };
}

/**
 * given a background color, returns black or white
 * depending on which one meets the target ratio
 * defaults to AA normal text (4.5:1)
 */
export function suggestForeground(bg, targetRatio = 4.5) {
    const white = contrastRatio("#ffffff", bg);
    const black = contrastRatio("#000000", bg);

    // prefer the one that meets the target, or the higher ratio
    if (white >= targetRatio) return "#ffffff";
    if (black >= targetRatio) return "#000000";
    return white > black ? "#ffffff" : "#000000";
}
