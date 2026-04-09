import { ref, computed, onScopeDispose, toValue } from "vue";

/**
 * WCAG 2.1 contrast ratio utilities
 */

// parse hex to rgb values
export function parseHex(hex) {
    let h = hex.replace("#", "");

    // expand short hex codes like #abc to #aabbcc
    if (h.length === 3) {
        h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
    }

    return {
        r: parseInt(h.slice(0, 2), 16),
        g: parseInt(h.slice(2, 4), 16),
        b: parseInt(h.slice(4, 6), 16),
    };
}

// linearize a single sRGB
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
npm */
export function suggestForeground(bg, targetRatio = 4.5) {
    const white = contrastRatio("#ffffff", bg);
    const black = contrastRatio("#000000", bg);

    // prefer the one that meets the target, or the higher ratio
    if (white >= targetRatio) return "#ffffff";
    if (black >= targetRatio) return "#000000";
    return white > black ? "#ffffff" : "#000000";
}

/**
 * reactive prefers-contrast detection
 *  more, less, custom, no-preference,
 */
export function useContrastPreference() {
    if (typeof window === "undefined") {
        return computed(() => "no-preference");
    }

    const preference = ref("no-preference");

    const queries = {
        more: window.matchMedia("(prefers-contrast: more)"),
        less: window.matchMedia("(prefers-contrast: less)"),
        custom: window.matchMedia("(prefers-contrast: custom)"),
    };

    function update() {
        if (queries.more.matches) preference.value = "more";
        else if (queries.less.matches) preference.value = "less";
        else if (queries.custom.matches) preference.value = "custom";
        else preference.value = "no-preference";
    }

    update();

    for (const mq of Object.values(queries)) {
        mq.addEventListener("change", update);
    }

    onScopeDispose(() => {
        for (const mq of Object.values(queries)) {
            mq.removeEventListener("change", update);
        }
    });

    return computed(() => preference.value);
}

/**
 * returns an adapted foreground color based on contrast requirements
 * 3:1 is baseline, 4.5:1 when prefers-contrast is on
 *
 * @param {string} fg
 * @param {string} bg
 * @returns {import('vue').ComputedRef<string>}
 */
export function useAdaptedContrast(fg, bg) {
    const preference = useContrastPreference();

    return computed(() => {
        const fgVal = toValue(fg);
        const bgVal = toValue(bg);
        const ratio = contrastRatio(fgVal, bgVal);

        const target = preference.value === "more" ? 4.5 : 3;

        if (ratio >= target) return fgVal;

        return suggestForeground(bgVal, target);
    });
}
