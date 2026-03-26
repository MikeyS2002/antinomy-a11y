/**
 * Known as safe easing keywords
 */
const SAFE_EASINGS = ["linear", "ease", "ease-in", "ease-out", "ease-in-out"];

/**
 * Checks if an easing value is safe for motion sensitive users.
 *
 * no overshoot, no oscillation, no bounce
 *
 * - cubic bezier with values < 0 or > 1 = overshoot so unsafe
 * - unknown = treated as unsafe
 *
 * @param {string|number[]|undefined} easing
 * @returns {boolean}
 */
export function isSafeEasing(easing) {
    // No easing specified
    if (!easing) return true;

    // String keywords
    if (typeof easing === "string") {
        return SAFE_EASINGS.includes(easing);
    }

    if (Array.isArray(easing) && easing.length === 4) {
        // y1 and y2 cause overshoot when outside 0 1
        const [, y1, , y2] = easing;
        return y1 >= 0 && y1 <= 1 && y2 >= 0 && y2 <= 1;
    }

    // Anything else — not safe
    return false;
}
