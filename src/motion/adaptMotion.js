import { useReducedMotion } from "motion-v";
import { classifyProperty } from "./classify.js";
import { isSafeEasing, isUnsafeTransitionType } from "./easing.js";
import {
    maxDuration,
    reducedEasing,
    thresholds,
    propertyCategories,
} from "./config.js";

/**
 * Adapts animation based on reduced motion preference
 *
 * When reduced motion is on:
 *   - high: neutralized entirely (translation to 0, scale to 1, rotation to 0)
 *   - moderate: clamped to safe threshold boundaries
 *   - low: unchanged
 *   - unknown: passed through with dev mode console warning
 *   - transition: simplified easing, max 200ms duration and spring physics remove
 *
 * @param {Record<string, any>} initial - The starting state
 * @param {Record<string, any>} animate - The end state
 * @param {Record<string, any>} [transition] - Optional transition config
 * @returns {{ initial: Record<string, any>, animate: Record<string, any>, transition: Record<string, any> }}
 */
export function adaptMotion(initial, animate, transition = {}) {
    const reducedMotion = useReducedMotion();

    if (!reducedMotion.value) {
        return { initial, animate, transition };
    }

    const adaptedInitial = {};
    const adaptedAnimate = {};

    const allProperties = new Set([
        ...Object.keys(initial),
        ...Object.keys(animate),
    ]);

    for (const property of allProperties) {
        const initialValue = initial[property] ?? getNeutralValue(property);
        const animateValue = animate[property] ?? getNeutralValue(property);
        const risk = classifyProperty(property, initialValue, animateValue);

        switch (risk) {
            case "high": {
                // Fully neutralize if the value exceeds thresholds
                const neutral = getNeutralValue(property);
                if (property in initial) adaptedInitial[property] = neutral;
                if (property in animate) adaptedAnimate[property] = neutral;
                break;
            }

            case "moderate": {
                // Clamp to safe threshold boundaries instead of fully removing
                if (property in initial)
                    adaptedInitial[property] = clampToThreshold(
                        property,
                        initialValue,
                    );
                if (property in animate)
                    adaptedAnimate[property] = clampToThreshold(
                        property,
                        animateValue,
                    );
                break;
            }

            case "low":
                if (property in initial)
                    adaptedInitial[property] = initial[property];
                if (property in animate)
                    adaptedAnimate[property] = animate[property];
                break;

            case "unknown":
                if (property in initial)
                    adaptedInitial[property] = initial[property];
                if (property in animate)
                    adaptedAnimate[property] = animate[property];
                if (import.meta.env?.DEV) {
                    console.warn(
                        `[a11y-motion] Unknown property "${property}" — passing through unchanged. ` +
                            `Consider adding it to propertyCategories in config.js.`,
                    );
                }
                break;
        }
    }

    // Build per property transitions
    const adaptedTransition = buildReducedTransition(transition, allProperties);

    return {
        initial: adaptedInitial,
        animate: adaptedAnimate,
        transition: adaptedTransition,
    };
}

// Clamps a value to the safe threshold
function clampToThreshold(property, value) {
    const category = propertyCategories[property];
    const numValue = typeof value === "string" ? parseFloat(value) : value;

    // Non-numeric values (clipPath strings like "inset(0% 100% 0% 0%)")
    // can't be clamped, return unchanged
    if (isNaN(numValue)) return value;

    if (category === "spatial") {
        // Clamp translation
        return Math.max(
            -thresholds.translation,
            Math.min(thresholds.translation, numValue),
        );
    }

    if (category === "scale") {
        // Clamp scale
        return Math.max(
            1 - thresholds.scale,
            Math.min(1 + thresholds.scale, numValue),
        );
    }

    if (category === "rotation") {
        // Clamp rotation
        return Math.max(
            -thresholds.rotation,
            Math.min(thresholds.rotation, numValue),
        );
    }

    return value;
}

/**
 * Builds reduced transitions:
 * - safe easing preserved unsafe easing replaced
 * - spring types removed
 * - opacity gets ease-out
 * - duration capped at 200ms
 */
function buildReducedTransition(originalTransition, properties) {
    const base = {
        ...originalTransition,
        duration: Math.min(
            originalTransition.duration ?? maxDuration,
            maxDuration,
        ),
    };

    // Remove spring physics
    if (isUnsafeTransitionType(originalTransition.type)) {
        base.type = undefined;
        base.stiffness = undefined;
        base.damping = undefined;
        base.bounce = undefined;
        base.mass = undefined;
        base.velocity = undefined;
    }

    // Check what property types we have
    const hasSpatial = [...properties].some((p) => {
        const cat = propertyCategories[p];
        return cat === "spatial" || cat === "scale" || cat === "rotation";
    });
    const hasOpacity = properties.has("opacity");

    // Determine spatial easing keep original if safe, replace if not
    const spatialEasing = isSafeEasing(originalTransition.ease)
        ? originalTransition.ease
        : reducedEasing.spatial;

    if (hasSpatial && hasOpacity) {
        base.ease = spatialEasing;
        base.opacity = {
            duration: Math.min(
                originalTransition.duration ?? maxDuration,
                maxDuration,
            ),
            ease: reducedEasing.opacity,
        };
    } else if (hasOpacity && !hasSpatial) {
        base.ease = reducedEasing.opacity;
    } else {
        base.ease = spatialEasing;
    }

    return base;
}

// returns the neutral (no movement) for its property
function getNeutralValue(property) {
    switch (property) {
        case "x":
        case "y":
        case "translateX":
        case "translateY":
        case "rotate":
        case "rotateX":
        case "rotateY":
        case "rotateZ":
            return 0;

        case "scale":
        case "scaleX":
        case "scaleY":
            return 1;

        default:
            return 0;
    }
}
