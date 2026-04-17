// check if an element has an accessible name
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

    if (el.tagName === "INPUT") {
        if (el.id) {
            const labelEl = document.querySelector(`label[for="${el.id}"]`);
            if (labelEl && labelEl.textContent.trim()) {
                return labelEl.textContent.trim();
            }
        }
        if (el.getAttribute("title")) return el.getAttribute("title");
        if (el.getAttribute("placeholder"))
            return el.getAttribute("placeholder");
    }

    return null;
}

function elDescriptor(el) {
    const tag = el.tagName.toLowerCase();
    const cls =
        typeof el.className === "string" && el.className.trim()
            ? "." + el.className.trim().split(/\s+/)[0]
            : "";
    return `<${tag}${cls}>`;
}

/**
 * v-aria-label sets aria-label and validates accessible name
 *
 * usage:
 *   v-aria-label="'Close dialog'"
 *   v-aria-label
 *
 * note: this directive is kept as a reference for the thesis, but offers
 * no improvement over native aria-label. the ariaAudit plugin is the
 * recommended approach for automatic validation without per-element setup
 */
export const vAriaLabel = {
    mounted(el, binding) {
        if (typeof binding.value === "string" && binding.value.trim()) {
            el.setAttribute("aria-label", binding.value.trim());
        }

        requestAnimationFrame(() => {
            const name = getAccessibleName(el);
            if (!name) {
                console.warn(
                    `[a11y-aria] ${elDescriptor(el)} has no accessible name — add v-aria-label="'...'" or text content`,
                    el,
                );
            }
        });
    },

    updated(el, binding) {
        if (typeof binding.value === "string" && binding.value.trim()) {
            el.setAttribute("aria-label", binding.value.trim());
        }
    },
};
