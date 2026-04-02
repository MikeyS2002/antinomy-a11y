import {
    thresholds,
    largeElementThresholds,
    largeElementBreakpoint,
    propertyCategories,
} from "./config.js";

/**
 * Returns true if the element should use the stricter large-element thresholds
 *
 * @param {{ width: number, height: number } | null} elementSize
 */
function isLargeElement(elementSize) {
    if (!elementSize) return false;
    return (
        Math.max(elementSize.width, elementSize.height) > largeElementBreakpoint
    );
}

/**
 * Classifies the risk of animating a property based on the distance between its initial and animate values
 *
 * @param {string} property
 * @param {number|string} initialValue
 * @param {number|string} animateValue
 * @param {{ width: number, height: number } | null} [elementSize]
 * @returns {'high' | 'moderate' | 'low' | 'unknown'}
 */
export function classifyProperty(
    property,
    initialValue,
    animateValue,
    elementSize = null,
) {
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

    // Large elements use stricter thresholds — even small motion covers a lot of screen area
    const t = isLargeElement(elementSize) ? largeElementThresholds : thresholds;

    // Compare distance against thresholds
    // Classify spatial properties against translation threshold
    if (category === "spatial") {
        return distance > t.translation ? "high" : "moderate";
    }

    // Classify scale properties against scale threshold
    if (category === "scale") {
        return distance > t.scale ? "high" : "moderate";
    }

    // Classify rotation properties against rotation threshold
    if (category === "rotation") {
        return distance > t.rotation ? "high" : "moderate";
    }

    return "unknown";
}
