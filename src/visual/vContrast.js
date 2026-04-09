import { contrastRatio, suggestForeground } from "./contrast.js";

function rgbToHex(rgb) {
    const match = rgb.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
    if (!match) return null;
    const r = parseInt(match[1]);
    const g = parseInt(match[2]);
    const b = parseInt(match[3]);
    return "#" + [r, g, b].map((c) => c.toString(16).padStart(2, "0")).join("");
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

function enforce(el, target) {
    const style = getComputedStyle(el);
    const fgHex = rgbToHex(style.color);
    const bgHex = resolveBackground(el);

    if (!fgHex || !bgHex) return;

    const ratio = contrastRatio(fgHex, bgHex);
    if (ratio < target) {
        el.style.color = suggestForeground(bgHex, target);
    }
}

// shared media query listener
let mq = null;
let preference = "no-preference";
const elements = new Set();

function getPreference() {
    if (typeof window === "undefined") return "no-preference";
    if (!mq) {
        mq = window.matchMedia("(prefers-contrast: more)");
        mq.addEventListener("change", () => {
            preference = mq.matches ? "more" : "no-preference";
            for (const { el, target } of elements) {
                el.style.color = "";
                enforce(el, preference === "more" ? Math.max(4.5, target) : target);
            }
        });
        preference = mq.matches ? "more" : "no-preference";
    }
    return preference;
}

/**
 * v-contrast — enforces WCAG contrast on an element
 *
 * usage:
 *   v-contrast           → 3:1 baseline, 4.5:1 with prefers-contrast: more
 *   v-contrast="4.5"     → force 4.5:1 minimum
 *   v-contrast="7"       → force 7:1 (AAA)
 */
export const vContrast = {
    mounted(el, binding) {
        const baseTarget =
            typeof binding.value === "number" ? binding.value : 3;
        const pref = getPreference();
        const target = pref === "more" ? Math.max(4.5, baseTarget) : baseTarget;

        const entry = { el, target: baseTarget };
        elements.add(entry);
        el._contrastEntry = entry;

        // one frame delay so inline styles are committed
        requestAnimationFrame(() => enforce(el, target));
    },

    unmounted(el) {
        if (el._contrastEntry) {
            elements.delete(el._contrastEntry);
            delete el._contrastEntry;
        }
    },
};
