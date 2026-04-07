import { ref, watch, isRef, onScopeDispose, toValue } from "vue";
import { createFocusTrap } from "focus-trap";

/**
 * Reactive focus trap composable. Pass an `active` ref (eg isOpen) and the trap activates/deactivates automaticly
 *
 * @param {import('vue').Ref<HTMLElement | null>} target
 * @param {object} [options]
 * @param {import('vue').Ref<boolean>} [options.active]
 * @param {boolean} [options.escapeDeactivates=true]
 * @param {boolean} [options.clickOutsideDeactivates=false]
 * @param {boolean} [options.returnFocusOnDeactivate=true]
 * @param {string | HTMLElement | false} [options.initialFocus]
 */
export function useFocusTrap(target, options = {}) {
    const {
        escapeDeactivates = true,
        clickOutsideDeactivates = false,
        returnFocusOnDeactivate = true,
        initialFocus,
    } = options;

    const hasFocus = ref(false);
    let trap = null;
    let triggerElement = null;

    function resolveElement() {
        return toValue(target);
    }

    function activate() {
        if (hasFocus.value) return;

        const el = resolveElement();
        if (!el) return;

        // remember what was focused before so we can return to it
        if (typeof document !== "undefined") {
            triggerElement = document.activeElement;
        }

        if (trap) {
            trap.activate();
            hasFocus.value = true;
            return;
        }

        trap = createFocusTrap(el, {
            escapeDeactivates,
            clickOutsideDeactivates,
            initialFocus,
            returnFocusOnDeactivate: false,
            fallbackFocus: el,
            onActivate() {
                hasFocus.value = true;
            },
            onDeactivate() {
                hasFocus.value = false;

                // sync back to the active ref so consumer state stays correct
                if (options.active && isRef(options.active)) {
                    options.active.value = false;
                }

                if (returnFocusOnDeactivate && triggerElement) {
                    triggerElement.focus();
                    triggerElement = null;
                }
            },
        });

        trap.activate();
    }

    function deactivate() {
        if (!hasFocus.value || !trap) return;
        trap.deactivate();
    }

    // flush post so the DOM has updated
    if (options.active !== undefined) {
        watch(
            () => toValue(options.active),
            (isActive) => {
                if (isActive) activate();
                else deactivate();
            },
            { flush: "post" },
        );

        // edge case: active is already true but element ref is still null
        watch(
            resolveElement,
            (el) => {
                if (el && toValue(options.active)) activate();
            },
            { flush: "post" },
        );
    }

    onScopeDispose(() => {
        if (trap) {
            trap.deactivate();
            trap = null;
        }
    });

    return { hasFocus, activate, deactivate };
}
