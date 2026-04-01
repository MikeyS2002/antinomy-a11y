import { h, computed, defineComponent, ref, onMounted, getCurrentInstance } from "vue";
import { motion, AnimatePresence, useReducedMotion } from "motion-v";
import { adaptKeyframe, adaptVariants } from "./adaptMotion.js";
import { reducedEasing, propertyCategories } from "./config.js";
import { isSafeEasing, isUnsafeTransitionType } from "./easing.js";

/**
 * Builds a reduced transition for the component wrapper
 */
function buildReducedTransition(originalTransition, properties) {
    const base = { ...originalTransition };

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

    if (hasOpacity && !hasSpatial) {
        base.ease = reducedEasing.opacity;
    } else {
        base.ease = spatialEasing;
    }

    return base;
}

/**
 * Returns true if initial or animate contains a ±100% slide on a spatial property.
 * Used to decide whether to wait for an exiting sibling before fading in.
 */
function hasSlideToFade(initial, animate) {
    if (!initial || !animate) return false;
    for (const prop of ["x", "y", "translateX", "translateY"]) {
        const a = initial[prop];
        const b = animate[prop];
        if (
            (typeof a === "string" &&
                (a.trim() === "100%" || a.trim() === "-100%")) ||
            (typeof b === "string" &&
                (b.trim() === "100%" || b.trim() === "-100%"))
        )
            return true;
    }
    return false;
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

            // When a slide is replaced with a fade inside a plain <AnimatePresence>,
            // hold the entering element at opacity:0 until the exiting sibling is done.
            // null = no hold needed, false = holding, true = released (animate immediately)
            const slideReady = ref(null);

            onMounted(() => {
                if (!reducedMotion.value) return;
                if (!hasSlideToFade(attrs.initial, attrs.animate)) return;

                // motion-v stamps every presence-managed element with data-ap="<presenceId>"
                const el = getCurrentInstance()?.proxy?.$el;
                const presenceId = el?.getAttribute?.("data-ap");
                if (!presenceId) return;

                // More than one element sharing this presenceId means there's an exiting sibling
                if (
                    document.querySelectorAll(`[data-ap="${presenceId}"]`)
                        .length <= 1
                )
                    return;

                slideReady.value = false;
                const exitMs = (attrs.transition?.duration ?? 0.3) * 1000;
                setTimeout(() => {
                    slideReady.value = null;
                }, exitMs);
            });

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

                // Hold the entering element at opacity:0 while an exiting sibling is
                // still playing its fade. When slideReady flips back to null, the
                // computed re-runs and motion-v picks up the { opacity: 1 } change.
                if (slideReady.value === false) {
                    result.animate = { opacity: 0 };
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
 * AnimatePresence wrapper that enforces mode="wait" when reduced motion is on,
 * so exit animations (fades) always complete before entering animations start.
 */
const AdaptedAnimatePresence = defineComponent({
    name: "AdaptedAnimatePresence",
    setup(_, { attrs, slots }) {
        const reducedMotion = useReducedMotion();
        const adaptedAttrs = computed(() => {
            if (!reducedMotion.value) return attrs;
            return { ...attrs, mode: "wait" };
        });
        return () => h(AnimatePresence, adaptedAttrs.value, slots);
    },
});

/**
 * Proxy that creates accessibility adapted motion components on demand.
 *
 * Usage: adaptedMotion.div, adaptedMotion.span, adaptedMotion.button, etc.
 * Use adaptedMotion.AnimatePresence in place of AnimatePresence — it automatically
 * applies mode="wait" when reduced motion is on so exit fades finish before enters.
 */
export const adaptedMotion = new Proxy(
    { AnimatePresence: AdaptedAnimatePresence },
    {
        get(target, element) {
            if (element in target) return target[element];
            if (!componentCache[element]) {
                componentCache[element] = createAdaptedMotionComponent(element);
            }
            return componentCache[element];
        },
    },
);
