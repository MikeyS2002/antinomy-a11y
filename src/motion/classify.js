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

// compares a distance value against the threshold for a given category
function classifyDistance(category, distance, elementSize) {
    const t = isLargeElement(elementSize) ? largeElementThresholds : thresholds;

    if (category === "spatial") {
        return distance > t.translation ? "high" : "moderate";
    }
    if (category === "scale") {
        return distance > t.scale ? "high" : "moderate";
    }
    if (category === "rotation") {
        return distance > t.rotation ? "high" : "moderate";
    }

    return "unknown";
}

/**
 * Classifies the risk of animating a property based on the distance between its initial and animate values
 *
 * @param {string} property
 * @param {number|string|Array} initialValue
 * @param {number|string|Array} animateValue
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

    // keyframe arrays like x: [0, 100, 50] — merge into one sequence
    // and classify based on the largest step between consecutive values
    if (Array.isArray(initialValue) || Array.isArray(animateValue)) {
        const allValues = [
            ...(Array.isArray(initialValue) ? initialValue : [initialValue]),
            ...(Array.isArray(animateValue) ? animateValue : [animateValue]),
        ];
        const nums = allValues.map((v) =>
            typeof v === "string" ? parseFloat(v) : v,
        );
        if (nums.some(isNaN)) return "unknown";

        let distance = 0;
        if (category === "scale") {
            // for scale arrays check max deviation from 1
            for (const n of nums) {
                distance = Math.max(distance, Math.abs(n - 1));
            }
        } else {
            // max step between consecutive values
            for (let i = 1; i < nums.length; i++) {
                distance = Math.max(distance, Math.abs(nums[i] - nums[i - 1]));
            }
        }

        return classifyDistance(category, distance, elementSize);
    }

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

    return classifyDistance(category, distance, elementSize);
}
