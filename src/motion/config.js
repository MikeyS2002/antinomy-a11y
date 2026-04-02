/**
 * Values under this thresholds are considered moderate
 * Values above these are considered high risk
 */
export let thresholds = {
    translation: 50,
    scale: 0.15,
    rotation: 10,
};

/**
 * Element size threshold in pixels.
 */
export let largeElementBreakpoint = 400;

/**
 * Stricter thresholds applied when the animated element is large
 */
export let largeElementThresholds = {
    translation: 20,
    scale: 0,
    rotation: 0,
};

/**
 * Maximum duration (in seconds) for any transition when reduced motion is ON
 */
export let maxDuration = 0.3;

/**
 * Easing functions used in reduced motion mode
 * Spatial get linear
 * Opacity gets ease-out
 */
export let reducedEasing = {
    spatial: "linear",
    opacity: [0, 0, 0.58, 1], // NEW ease-out as cubic bezier
};

/**
 * Maps properties to their risk category
 */
export const propertyCategories = {
    x: "spatial",
    y: "spatial",
    translateX: "spatial",
    translateY: "spatial",
    scale: "scale",
    scaleX: "scale",
    scaleY: "scale",
    rotate: "rotation",
    rotateX: "rotation",
    rotateY: "rotation",
    rotateZ: "rotation",
    opacity: "safe",
    clipPath: "safe",
};

/**
 * Allows projects to override default thresholds and timing
 * Call once
 *
 * @param {object} config
 * @param {object} [config.thresholds]
 * @param {object} [config.largeElementThresholds]
 * @param {number} [config.largeElementBreakpoint]
 * @param {object} [config.reducedEasing]
 */
export function configureMotion(config = {}) {
    if (config.thresholds) {
        thresholds = { ...thresholds, ...config.thresholds };
    }
    if (config.largeElementThresholds) {
        largeElementThresholds = {
            ...largeElementThresholds,
            ...config.largeElementThresholds,
        };
    }
    if (config.largeElementBreakpoint !== undefined) {
        largeElementBreakpoint = config.largeElementBreakpoint;
    }
    if (config.maxDuration !== undefined) {
        maxDuration = config.maxDuration;
    }
    if (config.reducedEasing) {
        reducedEasing = { ...reducedEasing, ...config.reducedEasing };
    }
}
