import { contrastRatio, suggestForeground } from "./contrast.js";

function rgbToHex(rgb) {
    const match = rgb.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
    if (!match) return null;
    return (
        "#" +
        [match[1], match[2], match[3]]
            .map((c) => parseInt(c).toString(16).padStart(2, "0"))
            .join("")
    );
}

function resolveBackground(el) {
    let current = el;
    while (current && current !== document.documentElement) {
        const bg = getComputedStyle(current).backgroundColor;
        if (bg && bg !== "transparent" && bg !== "rgba(0, 0, 0, 0)") {
            return rgbToHex(bg);
        }
        current = current.parentElement;
    }
    return "#ffffff";
}

function hasOwnText(el) {
    for (const node of el.childNodes) {
        if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
            return true;
        }
    }
    return false;
}

const processed = new WeakSet();

function auditElement(el, { fix, target }) {
    if (processed.has(el)) return;

    const style = getComputedStyle(el);
    if (style.display === "none" || style.visibility === "hidden" || style.opacity === "0") return;
    if (!hasOwnText(el)) return;

    const fgHex = rgbToHex(style.color);
    const bgHex = resolveBackground(el);
    if (!fgHex || !bgHex) return;

    const ratio = contrastRatio(fgHex, bgHex);
    if (ratio >= target) return;

    processed.add(el);
    const rounded = Math.round(ratio * 100) / 100;

    console.warn(
        `[a11y-contrast] ${rounded}:1 — below ${target}:1  fg: ${fgHex}  bg: ${bgHex}`, el,
    );

    if (fix) {
        el.style.color = suggestForeground(bgHex, target);
    }
}

const TEXT_SELECTOR =
    "p, span, h1, h2, h3, h4, h5, h6, a, li, td, th, label, button, code, pre, blockquote, figcaption, small, strong, em";

function auditAll(options) {
    const els = document.querySelectorAll(TEXT_SELECTOR);
    for (const el of els) {
        auditElement(el, options);
    }
}

/**
 * vue plugin — scans all text elements for contrast issues
 *
 * usage:
 *   app.use(contrastAudit)                  → warn only, 3:1 threshold
 *   app.use(contrastAudit, { fix: true })   → warn + fix colors automatically
 *   app.use(contrastAudit, { target: 4.5 }) → use 4.5:1 threshold
 */
export const contrastAudit = {
    install(app, options = {}) {
        if (typeof window === "undefined") return;

        const fix = options.fix ?? false;
        const target = options.target ?? 3;

        // single scan after everything has rendered
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                auditAll({ fix, target });
            });
        });
    },
};
