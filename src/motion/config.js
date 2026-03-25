/**
 * Thresholds for classifying animation risk levels
 * Values under this thresholds are considered moderate (safe enough to keep with clamping)
 * Values above these are considered high risk (should be neutralized)
 */
export const thresholds = {
    translation: 50, // pixels x/y movement beyond 50px is high risk
    scale: 0.2, // scale beyond 0.2 is high risk
    rotation: 10, // rotation beyond 10 is too high risk
};

/**
 * Maximum animation duration when reduced motion is active
 * Keeps transitions perceptible but brief
 */
export const maxDuration = 0.2; // s

/**
 * Easing functions used in reduced motion mode
 * Spatial get linear (no acceleration is less disorienting)
 * Opacity gets ease-out (feels more natural for fades)
 */
export const reducedEasing = {
    spatial: "linear",
    opacity: [0, 0, 0.58, 1],
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
