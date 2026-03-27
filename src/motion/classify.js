import { thresholds, propertyCategories } from "./config.js";

/**
 * Classifies the risk of animating a property based on the distance between its initial and animate values
 *
 * Risk levels:
 * - high: animation exceeds safe thresholds, should be neutralized
 * - moderate: animation is within threshold range
 * - low: safe property
 * - unknown: unrecognized property, gives warning
 *
 * @param {string} property - The animation name (x, opacity, ect.)
 * @param {number|string} initialValue - The starting value
 * @param {number|string} animateValue - The ending value
 * @returns {'high' | 'moderate' | 'low' | 'unknown'}
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

    // Calculate the animation distance
    let distance;
    if (category === "scale") {
        // How how far deviates from 1.0
        distance = Math.max(Math.abs(numInitial - 1), Math.abs(numAnimate - 1));
    } else {
        // For spatial and rotation measure the travel distance
        distance = Math.abs(numInitial - numAnimate);
    }

    // Compare distance against thresholds
    // Classify spatial properties against translation threshold
    if (category === "spatial") {
        return distance > thresholds.translation ? "high" : "moderate";
    }

    // Classify scale properties against scale threshold
    if (category === "scale") {
        return distance > thresholds.scale ? "high" : "moderate";
    }

    // Classify rotation properties against rotation threshold
    if (category === "rotation") {
        return distance > thresholds.rotation ? "high" : "moderate";
    }

    return "unknown";
}
