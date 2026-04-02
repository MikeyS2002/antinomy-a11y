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
 * Stricter thresholds applied when the animated element is large (> largeElementBreakpoint)
 */
export let largeElementThresholds = {
    translation: 20,
    scale: 0,
    rotation: 0,
};

/**
 * Easing functions used in reduced motion mode
 * Spatial get linear (no acceleration is less disorienting)
 * Opacity gets ease-out (feels more natural for fades)
 */
export let reducedEasing = {
    spatial: "linear",
    opacity: [0, 0, 0.58, 1], // NEW ease-out as cubic bezier
};

/**
 * Maps properties to their risk category
 * - spatial: translation movement (x, y), can trigger vestibular responses
 * - scale: size changes can be disorienting at large values
 * - rotation: rotational movement can be disorienting at large values
 * - safe: properties that do not cause vestibular issues
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
 * @param {object} [config.thresholds] - Override risk thresholds for normal-sized elements
 * @param {object} [config.largeElementThresholds] - Override risk thresholds for large elements
 * @param {number} [config.largeElementBreakpoint] - Override the px size at which an element is considered large
 * @param {object} [config.reducedEasing] - Override easing functions
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
    if (config.reducedEasing) {
        reducedEasing = { ...reducedEasing, ...config.reducedEasing };
    }
}
