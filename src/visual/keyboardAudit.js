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

function auditAll() {
    checkPositiveTabindex();
    checkClickableNonInteractive();
    checkMainLandmark();
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
