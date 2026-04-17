function getAccessibleName(el) {
    const label = el.getAttribute("aria-label");
    if (label && label.trim()) return label.trim();

    const labelledBy = el.getAttribute("aria-labelledby");
    if (labelledBy) {
        const ref = document.getElementById(labelledBy);
        if (ref && ref.textContent.trim()) return ref.textContent.trim();
    }

    const text = el.textContent?.trim();
    if (text) return text;

    if (
        el.tagName === "INPUT" ||
        el.tagName === "TEXTAREA" ||
        el.tagName === "SELECT"
    ) {
        if (el.id) {
            const labelEl = document.querySelector(`label[for="${el.id}"]`);
            if (labelEl && labelEl.textContent.trim())
                return labelEl.textContent.trim();
        }
        if (el.getAttribute("title")) return el.getAttribute("title");
    }

    if (el.tagName === "IMG") {
        const alt = el.getAttribute("alt");
        if (alt !== null) return alt;
    }

    return null;
}

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

function auditElement(el) {
    if (audited.has(el)) return;

    const style = getComputedStyle(el);
    if (style.display === "none" || style.visibility === "hidden") return;

    const name = getAccessibleName(el);
    if (name) return;

    // images need explicit alt="" for decorative
    if (el.tagName === "IMG") {
        if (el.getAttribute("alt") === null) {
            audited.add(el);
            console.warn(
                `[a11y-aria] ${elDescriptor(el)} is missing alt attribute`,
                el,
            );
        }
        return;
    }

    audited.add(el);
    console.warn(`[a11y-aria] ${elDescriptor(el)} has no accessible name`, el);
}

const SELECTOR =
    "button, a[href], input:not([type=hidden]), textarea, select, [role=button], [role=link], img";

function auditAll() {
    const els = document.querySelectorAll(SELECTOR);
    for (const el of els) {
        auditElement(el);
    }
}

/**
 * vue plugin scans interactive elements for missing accessible names
 *
 * usage:
 *   app.use(ariaAudit)
 *
 * warns for buttons, links, inputs, and images without a label, text or alt
 */
export const ariaAudit = {
    install() {
        if (typeof window === "undefined") return;

        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                auditAll();
            });
        });
    },
};
