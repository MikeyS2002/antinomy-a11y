import { h, computed, defineComponent } from "vue";
import { motion, useReducedMotion } from "motion-v";
import { adaptKeyframe, adaptVariants } from "./adaptMotion.js";
import { maxDuration, reducedEasing, propertyCategories } from "./config.js";
import { isSafeEasing, isUnsafeTransitionType } from "./easing.js";

/**
 * Builds a reduced transition for the component wrapper
 */
function buildReducedTransition(originalTransition, properties) {
    const base = {
        ...originalTransition,
        duration: Math.min(
            originalTransition.duration ?? maxDuration,
            maxDuration,
        ),
    };

    if (isUnsafeTransitionType(originalTransition.type)) {
        base.type = undefined;
        base.stiffness = undefined;
        base.damping = undefined;
        base.bounce = undefined;
        base.mass = undefined;
        base.velocity = undefined;
    }

    const hasSpatial = [...properties].some((p) => {
        const cat = propertyCategories[p];
        return cat === "spatial" || cat === "scale" || cat === "rotation";
    });
    const hasOpacity = properties.has("opacity");

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

/**
 * Creates a a11y adapted motion component for an HTML element
 * It intercepts motion props (initial, animate, exit, transition, variants)
 * Runs them through the risk check
 */
function createAdaptedMotionComponent(element) {
    return defineComponent({
        name: `adaptedMotion.${element}`,
        inheritAttrs: false,
        setup(_, { attrs, slots }) {
            const reducedMotion = useReducedMotion();

            const adaptedAttrs = computed(() => {
                // When reduced motion is off, just pass everything through unchanged
                if (!reducedMotion.value) return attrs;

                const result = { ...attrs };

                // example :variants="{ initial: { y: '120%' }, animate: { y: 0 }, exit: { y: '120%' } }"
                if (result.variants && typeof result.variants === "object") {
                    result.variants = adaptVariants(result.variants);
                }

                // --- Handle inline :initial / :animate / :exit ---
                const initial =
                    result.initial && typeof result.initial === "object"
                        ? result.initial
                        : null;
                const animate =
                    result.animate && typeof result.animate === "object"
                        ? result.animate
                        : null;

                if (initial && animate) {
                    result.initial = adaptKeyframe(initial, animate, initial);
                    result.animate = adaptKeyframe(initial, animate, animate);

                    if (result.exit && typeof result.exit === "object") {
                        result.exit = adaptKeyframe(
                            initial,
                            animate,
                            result.exit,
                        );
                    }
                }

                // Handle :exit
                if (
                    result.exit &&
                    typeof result.exit === "object" &&
                    result.exit.transition
                ) {
                    const exitTransition = result.exit.transition;
                    const { transition: _, ...exitKeyframe } = result.exit;
                    const exitProps = new Set(Object.keys(exitKeyframe));
                    result.exit = {
                        ...exitKeyframe,
                        transition: buildReducedTransition(
                            exitTransition,
                            exitProps,
                        ),
                    };
                }

                // Adapt :transition
                if (
                    result.transition &&
                    typeof result.transition === "object"
                ) {
                    const properties = new Set([
                        ...Object.keys(initial || {}),
                        ...Object.keys(animate || {}),
                    ]);
                    result.transition = buildReducedTransition(
                        result.transition,
                        properties,
                    );
                }

                // Handle :animate with embedded transition
                if (animate && animate.transition) {
                    const { transition: animTransition, ...animKeyframe } =
                        result.animate;
                    const animProps = new Set(Object.keys(animKeyframe));
                    result.animate = {
                        ...animKeyframe,
                        transition: buildReducedTransition(
                            animTransition,
                            animProps,
                        ),
                    };
                }

                return result;
            });

            return () => h(motion[element], adaptedAttrs.value, slots);
        },
    });
}

// Cache component so we do not recreate on every access
const componentCache = {};

/**
 * Usage: adaptedMotion.div, adaptedMotion.span, adaptedMotion.button, etc.
 * AnimatePresence, transitions, variants stay the same
 */
export const adaptedMotion = new Proxy(
    {},
    {
        get(_, element) {
            if (!componentCache[element]) {
                componentCache[element] = createAdaptedMotionComponent(element);
            }
            return componentCache[element];
        },
    },
);
