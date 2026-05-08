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

// ---- Hidden-but-focusable sweep ----
const ORIGINAL_TABINDEX_ATTR = "data-a11y-original-tabindex";
const HIDING_PROPS = ["opacity", "visibility"];
const watchedAncestors = new WeakSet();
let hiddenObserver = null;

function isAncestorHidden(el) {
    let current = el.parentElement;
    while (current && current !== document.documentElement) {
        const style = getComputedStyle(current);
        if (style.opacity === "0") return current;
        if (style.visibility === "hidden") return current;
        current = current.parentElement;
    }
    return null;
}

function suppressTabindex(el) {
    if (el.hasAttribute(ORIGINAL_TABINDEX_ATTR)) return;
    const original = el.getAttribute("tabindex");
    el.setAttribute(ORIGINAL_TABINDEX_ATTR, original ?? "__none__");
    el.setAttribute("tabindex", "-1");
}

function restoreTabindex(el) {
    if (!el.hasAttribute(ORIGINAL_TABINDEX_ATTR)) return;
    const original = el.getAttribute(ORIGINAL_TABINDEX_ATTR);
    el.removeAttribute(ORIGINAL_TABINDEX_ATTR);
    if (original === "__none__") {
        el.removeAttribute("tabindex");
    } else {
        el.setAttribute("tabindex", original);
    }
}

function evaluateElement(el) {
    const hider = isAncestorHidden(el);
    if (hider) {
        suppressTabindex(el);
        watchAncestor(hider);
    } else {
        restoreTabindex(el);
    }
}

function watchAncestor(ancestor) {
    if (watchedAncestors.has(ancestor)) return;
    watchedAncestors.add(ancestor);
    hiddenObserver?.observe(ancestor, {
        attributes: true,
        attributeFilter: ["style", "class"],
    });
}

function reEvaluateAllInteractive() {
    const els = document.querySelectorAll(INTERACTIVE);
    for (const el of els) {
        evaluateElement(el);
    }
}

function startHiddenSweep() {
    if (typeof window === "undefined") return;

    hiddenObserver = new MutationObserver(() => {
        reEvaluateAllInteractive();
    });

    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            reEvaluateAllInteractive();
        });
    });
}

// ---- Clickable-non-interactive sweep ----
// finds <div>, <span> etc. with a click handler and promotes them to tabindex=0
// so the focus ring delegation can attach a visible indicator.
const PROMOTED_ATTR = "data-a11y-promoted";
const NON_INTERACTIVE_TAGS =
    "div, span, article, section, li, p, figure, aside, header, footer, nav";
let clickableObserver = null;

function hasClickHandler(el) {
    // inline onclick attribute (rare in modern code but unambiguous)
    if (el.hasAttribute("onclick")) return true;
    // role=button / role=link signals "i act like a widget" — if the dev added
    // the role but forgot tabindex, we can safely promote.
    const role = el.getAttribute("role");
    if (role === "button" || role === "link") return true;
    // heuristic: cursor: pointer set by author CSS usually signals clickability.
    // cursor inherits, so a <span> inside a clickable <article> would also match.
    // only promote if this element is the *origin* of the pointer cursor — its
    // parent must not also be pointer.
    const cursor = getComputedStyle(el).cursor;
    if (cursor !== "pointer") return false;
    const parent = el.parentElement;
    if (parent && getComputedStyle(parent).cursor === "pointer") return false;
    return true;
}

function shouldPromote(el) {
    if (el.hasAttribute("tabindex")) return false;
    // natively interactive elements (button, a[href], input...) already focusable
    const tag = el.tagName.toLowerCase();
    const nativelyFocusable =
        tag === "a" ||
        tag === "button" ||
        tag === "input" ||
        tag === "textarea" ||
        tag === "select" ||
        tag === "details" ||
        tag === "summary";
    if (nativelyFocusable) return false;
    return hasClickHandler(el);
}

function promoteElement(el) {
    if (el.hasAttribute(PROMOTED_ATTR)) return;
    el.setAttribute("tabindex", "0");
    el.setAttribute(PROMOTED_ATTR, "true");
    // tabindex alone doesnt make Enter/Space fire the click — wire that up too
    el.addEventListener("keydown", onPromotedKeydown);
}

function onPromotedKeydown(e) {
    if (e.key !== "Enter" && e.key !== " ") return;
    e.preventDefault();
    e.currentTarget.click();
}

function reEvaluateClickables() {
    const els = document.querySelectorAll(NON_INTERACTIVE_TAGS);
    for (const el of els) {
        if (shouldPromote(el)) promoteElement(el);
    }
}

function startClickableSweep() {
    if (typeof window === "undefined") return;

    clickableObserver = new MutationObserver(() => {
        reEvaluateClickables();
    });
    clickableObserver.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ["onclick", "style", "class"],
    });

    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            reEvaluateClickables();
        });
    });
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

        startHiddenSweep();
        startClickableSweep();
    },
};
