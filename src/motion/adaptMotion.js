import { useReducedMotion } from "motion-v";
import { classifyProperty } from "./classify.js";
import { isSafeEasing, isUnsafeTransitionType } from "./easing.js";
import {
    reducedEasing,
    maxDuration,
    thresholds,
    largeElementThresholds,
    largeElementBreakpoint,
    propertyCategories,
} from "./config.js";

function isLargeElement(elementSize) {
    if (!elementSize) return false;
    return (
        Math.max(elementSize.width, elementSize.height) > largeElementBreakpoint
    );
}

/**
 * Adapts a single keyframe object (initial, animate, exit).
 * This is the core logic extracted so it can be reused by both the function API and the component wrapper
 *
 * @param {Record<string, any>} from
 * @param {Record<string, any>} to
 * @param {Record<string, any>} target
 * @param {{ width: number, height: number } | null} [elementSize]
 * @returns {Record<string, any>}
 */
export function adaptKeyframe(from, to, target, elementSize = null) {
    const adapted = {};
    const allProperties = new Set([
        ...Object.keys(from),
        ...Object.keys(to),
        ...Object.keys(target),
    ]);

    // Track whether we've already injected an opacity fade for a slide replacement
    let slideToFadeInjected = false;

    for (const property of allProperties) {
        if (!(property in target)) continue;

        const initialValue = from[property] ?? getNeutralValue(property);
        const animateValue = to[property] ?? getNeutralValue(property);
        const risk = classifyProperty(
            property,
            initialValue,
            animateValue,
            elementSize,
        );

        switch (risk) {
            case "high":
                // Replace certain appear or disappear patterns with an opacity fade
                // Instead of just neutralizing the property
                if (
                    !slideToFadeInjected &&
                    !("opacity" in target) &&
                    isAppearPattern(property, from[property], to[property])
                ) {
                    // The invisible side = opacity 0 and the visible side = opacity 1
                    adapted.opacity = isInvisibleSide(
                        property,
                        target[property],
                    )
                        ? 0
                        : 1;
                    slideToFadeInjected = true;
                    // no movement
                } else {
                    adapted[property] = getNeutralValue(property);
                }
                break;
            case "moderate":
                adapted[property] = clampToThreshold(
                    property,
                    target[property],
                    elementSize,
                );
                break;
            case "low":
                adapted[property] = target[property];
                break;
            case "unknown":
                adapted[property] = target[property];
                if (import.meta.env?.DEV) {
                    console.warn(
                        `[a11y-motion] Unknown property "${property}" — passing through unchanged. ` +
                            `Consider adding it to propertyCategories in config.js.`,
                    );
                }
                break;
        }
    }

    return adapted;
}

/**
 * Adapts animation based on reduced motion preference
 *
 * @param {Record<string, any>} initial
 * @param {Record<string, any>} animate
 * @param {Record<string, any>} [transition]
 * @param {Record<string, any>} [exit]
 * @param {{ width: number, height: number } | null} [elementSize]
 * @returns {{ initial: Record<string, any>, animate: Record<string, any>, transition: Record<string, any> }}
 */
export function adaptMotion(
    initial,
    animate,
    transition = {},
    exit = null,
    elementSize = null,
) {
    const reducedMotion = useReducedMotion();

    if (!reducedMotion.value) {
        const result = { initial, animate, transition };
        if (exit) result.exit = exit;
        return result;
    }

    const allProperties = new Set([
        ...Object.keys(initial),
        ...Object.keys(animate),
        ...(exit ? Object.keys(exit) : []),
    ]);

    const adaptedInitial = adaptKeyframe(
        initial,
        animate,
        initial,
        elementSize,
    );
    const adaptedAnimate = adaptKeyframe(
        initial,
        animate,
        animate,
        elementSize,
    );
    // Build per property transitions
    const adaptedTransition = buildReducedTransition(transition, allProperties);

    const result = {
        initial: adaptedInitial,
        animate: adaptedAnimate,
        transition: adaptedTransition,
    };

    if (exit) {
        result.exit = adaptKeyframe(initial, animate, exit, elementSize);
    }

    return result;
}

/**
 * Adapts a full variants object. Each variant's keyframe values are adapted using the initial -> animate pair for risk classification
 *
 * @param {Record<string, Record<string, any>>} variants
 * @param {{ width: number, height: number } | null} [elementSize]
 * @returns {Record<string, Record<string, any>>}
 */
export function adaptVariants(variants, elementSize = null) {
    const initial = variants.initial || {};
    const animate = variants.animate || {};

    const adapted = {};
    for (const [key, keyframe] of Object.entries(variants)) {
        adapted[key] = adaptKeyframe(initial, animate, keyframe, elementSize);
    }
    return adapted;
}

// Helpers

// Clamps a value to the safe threshold
export function clampToThreshold(property, value, elementSize = null) {
    const category = propertyCategories[property];
    const numValue = typeof value === "string" ? parseFloat(value) : value;

    // can't be clamped, return unchanged
    if (isNaN(numValue)) return value;

    const t = isLargeElement(elementSize) ? largeElementThresholds : thresholds;

    if (category === "spatial") {
        // Clamp translation
        return Math.max(-t.translation, Math.min(t.translation, numValue));
    }
    if (category === "scale") {
        // Clamp scale
        return Math.max(1 - t.scale, Math.min(1 + t.scale, numValue));
    }
    if (category === "rotation") {
        // Clamp rotation
        return Math.max(-t.rotation, Math.min(t.rotation, numValue));
    }
    return value;
}

/**
 * Builds reduced transitions
 */
export function buildReducedTransition(originalTransition, properties) {
    const base = { ...originalTransition };

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

    if (hasOpacity && !hasSpatial) {
        base.ease = reducedEasing.opacity;
    } else {
        base.ease = spatialEasing;
    }

    // Cap duration so residual animations stay brief
    if (base.duration !== undefined && base.duration > maxDuration) {
        base.duration = maxDuration;
    }

    return base;
}

// Returns true when a value is a percentage string whose absolute value is >= 100%
export function isOffScreenPercent(value) {
    if (typeof value !== "string") return false;
    const n = parseFloat(value);
    return !isNaN(n) && Math.abs(n) >= 100 && value.trim().endsWith("%");
}

// Returns true when the property and values represent an appear/disappear
export function isAppearPattern(property, fromVal, toVal) {
    const category = propertyCategories[property];
    if (category === "spatial") {
        return isOffScreenPercent(fromVal) || isOffScreenPercent(toVal);
    }
    if (category === "scale") {
        return fromVal === 0 || toVal === 0;
    }
    return false;
}

export function isInvisibleSide(property, value) {
    const category = propertyCategories[property];
    if (category === "spatial") return isOffScreenPercent(value);
    if (category === "scale") return value === 0;
    return false;
}

// returns the neutral (no movement) for its property
export function getNeutralValue(property) {
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
