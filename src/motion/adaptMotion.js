import { useReducedMotion } from "motion-v";
import { classifyProperty } from "./classify.js";
import { isSafeEasing, isUnsafeTransitionType } from "./easing.js";
import { reducedEasing, thresholds, propertyCategories } from "./config.js";

/**
 * Adapts a single keyframe object (initial, animate, exit).
 * This is the core logic extracted so it can be reused by both the function API and the component wrapper
 *
 * @param {Record<string, any>} from - The starting state
 * @param {Record<string, any>} to - The ending state
 * @param {Record<string, any>} target - The keyframe to adapt (like from, to, or exit)
 * @returns {Record<string, any>}
 */
export function adaptKeyframe(from, to, target) {
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
        const risk = classifyProperty(property, initialValue, animateValue);

        switch (risk) {
            case "high":
                // When a spatial property uses ±100% (a common off-screen slide pattern),
                // replace the movement with an opacity fade instead of neutralizing to 0.
                if (
                    isSpatialSlideProperty(property) &&
                    (isPercentageSlide(from[property]) ||
                        isPercentageSlide(to[property])) &&
                    !slideToFadeInjected &&
                    !("opacity" in target)
                ) {
                    // The side with ±100% is off-screen → opacity 0; the neutral side → opacity 1
                    adapted.opacity = isPercentageSlide(target[property]) ? 0 : 1;
                    slideToFadeInjected = true;
                    // Skip the spatial property — no movement at all
                } else {
                    adapted[property] = getNeutralValue(property);
                }
                break;
            case "moderate":
                adapted[property] = clampToThreshold(
                    property,
                    target[property],
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
 * @param {Record<string, any>} [exit] - Optional exit state for AnimatePresence
 * @returns {{ initial: Record<string, any>, animate: Record<string, any>, transition: Record<string, any> }}
 */
export function adaptMotion(initial, animate, transition = {}, exit = null) {
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

    const adaptedInitial = adaptKeyframe(initial, animate, initial);
    const adaptedAnimate = adaptKeyframe(initial, animate, animate);
    // Build per property transitions
    const adaptedTransition = buildReducedTransition(transition, allProperties);

    const result = {
        initial: adaptedInitial,
        animate: adaptedAnimate,
        transition: adaptedTransition,
    };

    if (exit) {
        result.exit = adaptKeyframe(initial, animate, exit);
    }

    return result;
}

/**
 * Adapts a full variants object. Each variant's keyframe values are adapted using the initial -> animate pair for risk classification
 *
 * @param {Record<string, Record<string, any>>} variants - example { initial: { y: '120%' }, animate: { y: 0 }, exit: { y: '120%' } }
 * @returns {Record<string, Record<string, any>>}
 */
export function adaptVariants(variants) {
    const initial = variants.initial || {};
    const animate = variants.animate || {};

    const adapted = {};
    for (const [key, keyframe] of Object.entries(variants)) {
        adapted[key] = adaptKeyframe(initial, animate, keyframe);
    }
    return adapted;
}

// Internal helpers

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
 * - duration and delay from the original transition
 */
function buildReducedTransition(originalTransition, properties) {
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

    return base;
}

// Returns true if a value is exactly "100%" or "-100%" (off-screen slide pattern)
function isPercentageSlide(value) {
    if (typeof value !== "string") return false;
    const trimmed = value.trim();
    return trimmed === "100%" || trimmed === "-100%";
}

// Returns true for spatial properties that can carry an off-screen slide
function isSpatialSlideProperty(property) {
    return (
        property === "x" ||
        property === "y" ||
        property === "translateX" ||
        property === "translateY"
    );
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
