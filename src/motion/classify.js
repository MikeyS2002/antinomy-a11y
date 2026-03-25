import { thresholds, propertyCategories } from "./config.js";

/**
 * Classifies the risk of animating a property based on the distance between its initial and animate values
 *
 * Risk levels:
 * - high: animation exceeds safe thresholds, should be neutralized
 * - low: safe property
 * - unknown: unrecognized property, gives warning
 *
 * @param {string} property - The animation name (x, opacity, ect.)
 * @param {number|string} initialValue - The starting value
 * @param {number|string} animateValue - The ending value
 * @returns {'high' | 'low' | 'unknown'}
 */
export function classifyProperty(property, initialValue, animateValue) {
    const category = propertyCategories[property];

    // Unknown property
    if (!category) return "unknown";

    // Safe properties always pass through
    if (category === "safe") return "low";

    // Parse numeric values
    const numInitial =
        typeof initialValue === "string"
            ? parseFloat(initialValue)
            : initialValue;
    const numAnimate =
        typeof animateValue === "string"
            ? parseFloat(animateValue)
            : animateValue;

    // If we cant parse treat as unknown
    if (isNaN(numInitial) || isNaN(numAnimate)) return "unknown";

    // Calculate the travel distance
    const distance = Math.abs(numInitial - numAnimate);

    // Classify spatial properties against translation threshold
    if (category === "spatial") {
        return distance > thresholds.translation ? "high" : "low";
    }

    // TODO: handle scale and rotation categories
    return "unknown";
}
