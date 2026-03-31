/**
 * Default thresholds - can be overridden via configureMotion()
 * Values under this thresholds are considered moderate (safe enough to keep with clamping)
 * Values above these are considered high risk (should be neutralized)
 */
export let thresholds = {
    translation: 50, // pixels x/y movement beyond 50px is high risk
    scale: 0.15, // scale beyond 0.15 is high risk
    rotation: 10, // rotation beyond 10 is too high risk
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
 * @param {object} [config.thresholds] NEW - Override risk thresholds
 * @param {object} [config.reducedEasing] NEW - Override easing functions
 */
export function configureMotion(config = {}) {
    if (config.thresholds) {
        thresholds = { ...thresholds, ...config.thresholds };
    }
    if (config.reducedEasing) {
        reducedEasing = { ...reducedEasing, ...config.reducedEasing };
    }
}
