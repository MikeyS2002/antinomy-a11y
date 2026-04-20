function elDescriptor(el) {
    const tag = el.tagName.toLowerCase();
    const id = el.id ? `#${el.id}` : "";
    const cls =
        typeof el.className === "string" && el.className.trim()
            ? "." + el.className.trim().split(/\s+/)[0]
            : "";
    return `<${tag}${id}${cls}>`;
}

// WCAG 1.3.1 headings should follow a hierarchy with no skipped levels
function checkHeadingHierarchy() {
    const headings = document.querySelectorAll("h1, h2, h3, h4, h5, h6");
    if (headings.length === 0) return;

    const h1s = document.querySelectorAll("h1");
    if (h1s.length === 0) {
        console.warn(
            `[a11y-semantic] page has no <h1> — every page should have exactly one top-level heading (WCAG 1.3.1)`,
        );
    } else if (h1s.length > 1) {
        console.warn(
            `[a11y-semantic] page has ${h1s.length} <h1> elements — there should be exactly one (WCAG 1.3.1)`,
            Array.from(h1s),
        );
    }

    let lastLevel = 0;
    for (const h of headings) {
        const level = parseInt(h.tagName.charAt(1));
        if (lastLevel > 0 && level > lastLevel + 1) {
            console.warn(
                `[a11y-semantic] ${elDescriptor(h)} skips from h${lastLevel} to h${level} — use sequential heading levels (WCAG 1.3.1)`,
                h,
            );
        }
        lastLevel = level;
    }
}

// WCAG 1.3.1 landmarks identify regions of the page
function checkLandmarks() {
    const main = document.querySelector("main, [role=main]");
    if (!main) {
        console.warn(
            `[a11y-semantic] page has no <main> landmark — screen readers rely on this to identify primary content (WCAG 1.3.1)`,
        );
    }

    const mains = document.querySelectorAll("main, [role=main]");
    if (mains.length > 1) {
        console.warn(
            `[a11y-semantic] page has ${mains.length} <main> landmarks — there should be exactly one (WCAG 1.3.1)`,
            Array.from(mains),
        );
    }
}

// WCAG 1.3.1 lists should use <ul>/<ol>, not a stack of divs
// checks for repeated sibling elements that look like list items
function checkInteractiveNesting() {
    // buttons inside buttons, links inside buttons, etc.
    const interactive = document.querySelectorAll("button, a[href]");
    for (const el of interactive) {
        const nested = el.querySelector("button, a[href]");
        if (nested) {
            console.warn(
                `[a11y-semantic] ${elDescriptor(el)} contains a nested interactive element — interactive elements should not be nested (WCAG 1.3.1, 4.1.2)`,
                el,
            );
        }
    }
}

// WCAG 4.1.2 form inputs should have labels
function checkFormLabels() {
    const inputs = document.querySelectorAll(
        "input:not([type=hidden]):not([type=submit]):not([type=button]), textarea, select",
    );
    for (const input of inputs) {
        const id = input.id;
        const hasLabel = id && document.querySelector(`label[for="${id}"]`);
        const hasAriaLabel = input.getAttribute("aria-label");
        const hasAriaLabelledBy = input.getAttribute("aria-labelledby");
        const wrappedInLabel = input.closest("label");

        if (
            !hasLabel &&
            !hasAriaLabel &&
            !hasAriaLabelledBy &&
            !wrappedInLabel
        ) {
            console.warn(
                `[a11y-semantic] ${elDescriptor(input)} has no associated <label> — form fields need explicit labels (WCAG 4.1.2)`,
                input,
            );
        }
    }
}

function auditAll() {
    checkHeadingHierarchy();
    checkLandmarks();
    checkInteractiveNesting();
    checkFormLabels();
}

/**
 * vue plugin scans for semantic structure issues
 *
 * usage:
 *   app.use(semanticAudit)
 *
 * warns for:
 *   - missing or duplicate <h1>
 *   - skipped heading levels
 *   - missing or duplicate <main> landmark
 *   - nested interactive elements
 *   - form fields without labels
 */
export const semanticAudit = {
    install() {
        if (typeof window === "undefined") return;

        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                auditAll();
            });
        });
    },
};
