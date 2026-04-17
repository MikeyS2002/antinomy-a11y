import { contrastRatio } from "./contrast.js";

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

// pick a ring color that meets 3:1 against the background
function pickRingColor(bgHex, preferred) {
    const candidates = [preferred, "#2563eb", "#ffffff", "#000000"];
    for (const c of candidates) {
        if (contrastRatio(c, bgHex) >= 3) return c;
    }
    return preferred;
}

const INTERACTIVE =
    "a[href], button, input:not([type=hidden]), textarea, select, details, summary, [tabindex]:not([tabindex='-1']), [role=button], [role=link]";

function isInteractive(el) {
    if (!el.matches) return false;
    return el.matches(INTERACTIVE);
}

let installedOptions = null;

function onFocusIn(e) {
    const el = e.target;
    if (!isInteractive(el)) return;

    // only apply on keyboard focus, not mouse click
    if (!el.matches(":focus-visible")) return;

    const bgHex = resolveBackground(el);
    const color = pickRingColor(bgHex, installedOptions.color);

    el.dataset._a11yFocusOriginalOutline = el.style.outline || "";
    el.dataset._a11yFocusOriginalOffset = el.style.outlineOffset || "";
    el.style.outline = `${installedOptions.width} ${installedOptions.style} ${color}`;
    el.style.outlineOffset = installedOptions.offset;
}

function onFocusOut(e) {
    const el = e.target;
    if (!("_a11yFocusOriginalOutline" in el.dataset)) return;

    el.style.outline = el.dataset._a11yFocusOriginalOutline;
    el.style.outlineOffset = el.dataset._a11yFocusOriginalOffset;
    delete el.dataset._a11yFocusOriginalOutline;
    delete el.dataset._a11yFocusOriginalOffset;
}

const defaults = {
    width: "2px",
    offset: "2px",
    style: "solid",
    color: "#2563eb",
};

/**
 * vue plugin — applies a contrast-aware focus ring to every interactive element
 *
 * usage:
 *   app.use(focusIndicator)
 *   app.use(focusIndicator, { width: "3px", color: "#e53e3e" })
 *
 * uses event delegation on document — works for dynamically added elements
 * only activates on keyboard focus (:focus-visible), not mouse clicks
 */
export const focusIndicator = {
    install(app, options = {}) {
        if (typeof window === "undefined") return;

        installedOptions = { ...defaults, ...options };

        document.addEventListener("focusin", onFocusIn, true);
        document.addEventListener("focusout", onFocusOut, true);
    },
};
