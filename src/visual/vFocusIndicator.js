import { contrastRatio } from "./contrast.js";

// convert rgb to hex
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
function pickRingColor(bgHex) {
    // try common focus colors, pick first that meets 3:1
    const candidates = ["#2563eb", "#1d4ed8", "#ffffff", "#000000"];
    for (const c of candidates) {
        if (contrastRatio(c, bgHex) >= 3) return c;
    }
    return "#2563eb";
}

const defaults = {
    width: "2px",
    offset: "2px",
    style: "solid",
    color: null, // auto-detect from background
};

function applyIndicator(el, opts) {
    const bgHex = resolveBackground(el);
    const color = opts.color || pickRingColor(bgHex);

    el._focusIndicatorHandlers = {
        focus: () => {
            el.style.outline = `${opts.width} ${opts.style} ${color}`;
            el.style.outlineOffset = opts.offset;
        },
        blur: () => {
            el.style.outline = "";
            el.style.outlineOffset = "";
        },
    };

    el.addEventListener("focus", el._focusIndicatorHandlers.focus);
    el.addEventListener("blur", el._focusIndicatorHandlers.blur);

    // make sure the element is focusable
    if (!el.hasAttribute("tabindex") && !isFocusable(el)) {
        el.setAttribute("tabindex", "0");
    }
}

function isFocusable(el) {
    const tag = el.tagName.toLowerCase();
    if (
        [
            "a",
            "button",
            "input",
            "textarea",
            "select",
            "details",
            "summary",
        ].includes(tag)
    )
        return true;
    if (el.hasAttribute("contenteditable")) return true;
    return false;
}

function cleanup(el) {
    if (el._focusIndicatorHandlers) {
        el.removeEventListener("focus", el._focusIndicatorHandlers.focus);
        el.removeEventListener("blur", el._focusIndicatorHandlers.blur);
        delete el._focusIndicatorHandlers;
    }
}

/**
 * v-focus-indicator WCAG 2.4.7
 *
 * auto-picks a ring color that meets 3:1 and give tabindex="0" to non-interactive elements
 *
 * v-focus-indicator
 * v-focus-indicator="{ color: '#ff0000' }"
 * v-focus-indicator="{ width: '3px' }"
 */
export const vFocusIndicator = {
    mounted(el, binding) {
        const opts = { ...defaults, ...(binding.value || {}) };
        requestAnimationFrame(() => applyIndicator(el, opts));
    },

    unmounted(el) {
        cleanup(el);
    },
};
