function elDescriptor(el) {
    const tag = el.tagName.toLowerCase();
    const id = el.id ? `#${el.id}` : "";
    const cls =
        typeof el.className === "string" && el.className.trim()
            ? "." + el.className.trim().split(/\s+/)[0]
            : "";
    return `<${tag}${id}${cls}>`;
}

const audited = new WeakSet();

// WCAG 2.4.3 tabindex > 0 breaks the natural tab order
function checkPositiveTabindex() {
    const els = document.querySelectorAll("[tabindex]");
    for (const el of els) {
        if (audited.has(el)) continue;
        const value = parseInt(el.getAttribute("tabindex"));
        if (value > 0) {
            audited.add(el);
            console.warn(
                `[a11y-keyboard] ${elDescriptor(el)} has tabindex="${value}" — positive values disrupt natural tab order (WCAG 2.4.3)`,
                el,
            );
        }
    }
}

// WCAG 2.1.1 click handlers on non-interactive elements without keyboard support
function checkClickableNonInteractive() {
    const els = document.querySelectorAll("div, span");
    for (const el of els) {
        if (audited.has(el)) continue;
        const hasClick = el.onclick !== null || el.getAttribute("onclick");
        if (!hasClick) continue;

        const role = el.getAttribute("role");
        const tabindex = el.getAttribute("tabindex");
        const isFocusable = tabindex !== null && tabindex !== "-1";
        const hasInteractiveRole = role === "button" || role === "link";

        if (!isFocusable || !hasInteractiveRole) {
            audited.add(el);
            console.warn(
                `[a11y-keyboard] ${elDescriptor(el)} has a click handler but is not keyboard-accessible — add role="button" and tabindex="0" or use a <button> (WCAG 2.1.1)`,
                el,
            );
        }
    }
}

// WCAG 2.4.1 page should have a <main> landmark for skip-to-content
function checkMainLandmark() {
    const main = document.querySelector("main, [role=main]");
    if (!main) {
        console.warn(
            `[a11y-keyboard] page has no <main> landmark — keyboard users cannot skip past repeated content (WCAG 2.4.1)`,
        );
    }
}

// WCAG 2.1.1 scrollable regions must be reachable by keyboard.
// matches axe-core's `scrollable-region-focusable`: a container that overflows
// its content needs either a focusable child or its own tabindex so a keyboard
// user can scroll it.
const SCROLLABLE_FIXED_ATTR = "data-a11y-scrollable-fix";

function isScrollable(el) {
    const style = getComputedStyle(el);
    const overflowX = style.overflowX;
    const overflowY = style.overflowY;
    // match axe-core's heuristic: the CSS declares scrollability *and* the
    // content can overflow. axe also flags overflow:auto regions even when
    // content currently fits, so be permissive — the tabindex fix is harmless
    // when the region happens not to need scrolling.
    const xScroll = overflowX === "auto" || overflowX === "scroll";
    const yScroll = overflowY === "auto" || overflowY === "scroll";
    if (!xScroll && !yScroll) return false;
    // require *some* overflowable content so we don't tabindex every random
    // overflow:auto wrapper that has no children
    return el.scrollWidth > el.clientWidth || el.scrollHeight > el.clientHeight;
}

function hasFocusableChild(el) {
    // candidates: anything that's natively focusable or has tabindex >= 0
    const candidates = el.querySelectorAll(
        "a[href], button:not([disabled]), input:not([type=hidden]):not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]",
    );
    for (const c of candidates) {
        // tabindex="-1" makes natively-focusable elements unreachable too,
        // so exclude them. focusIndicator's hidden-focusable sweep uses this
        // pattern to suppress buttons inside opacity:0 ancestors.
        const ti = c.getAttribute("tabindex");
        if (ti === "-1") continue;
        return true;
    }
    return false;
}

function fixScrollableRegions() {
    const els = document.querySelectorAll("div, section, article, ul, ol, nav");
    for (const el of els) {
        if (el.hasAttribute(SCROLLABLE_FIXED_ATTR)) continue;
        if (el.hasAttribute("tabindex")) continue;
        if (!isScrollable(el)) continue;
        if (hasFocusableChild(el)) continue;

        // safe auto-fix: make the container itself keyboard-scrollable so
        // arrow keys can pan its content. Adds it to the tab order, which is
        // the trade-off WCAG asks for.
        el.setAttribute("tabindex", "0");
        el.setAttribute(SCROLLABLE_FIXED_ATTR, "true");
        console.info(
            `[a11y-keyboard] ${elDescriptor(el)} is a scrollable region with no focusable children — added tabindex="0" so it is keyboard-reachable (WCAG 2.1.1)`,
            el,
        );
    }
}

function auditAll() {
    checkPositiveTabindex();
    checkClickableNonInteractive();
    checkMainLandmark();
    fixScrollableRegions();
}

/**
 * vue plugin scans for keyboard navigation issues
 *
 * usage:
 *   app.use(keyboardAudit)
 *
 * warns for:
 *   - tabindex > 0
 *   - click handlers on non-interactive elements without keyboard support
 *   - missing <main> landmark
 *
 * auto-fixes:
 *   - scrollable regions with no focusable children get tabindex="0"
 */
export const keyboardAudit = {
    install() {
        if (typeof window === "undefined") return;

        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                auditAll();
            });
        });
    },
};
