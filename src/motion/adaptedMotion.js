import {
    h,
    computed,
    defineComponent,
    ref,
    onMounted,
    getCurrentInstance,
} from "vue";
import { motion, AnimatePresence, useReducedMotion } from "motion-v";
import {
    adaptKeyframe,
    adaptVariants,
    buildReducedTransition,
} from "./adaptMotion.js";
import { propertyCategories } from "./config.js";

/**
 * Returns true if initial or animate contains a ±100% slide on a spatial property.
 * Used to decide whether to wait for an exiting sibling before fading in.
 */
function willBecomeAFade(initial, animate) {
    if (!initial || !animate) return false;

    // Spatial endpoints that are fully off-screen
    for (const prop of ["x", "y", "translateX", "translateY"]) {
        const a = initial[prop];
        const b = animate[prop];
        const isOffScreen = (v) => {
            if (typeof v !== "string") return false;
            const n = parseFloat(v);
            return !isNaN(n) && Math.abs(n) >= 100 && v.trim().endsWith("%");
        };
        if (isOffScreen(a) || isOffScreen(b)) return true;
    }

    // Scale 0 on either end
    for (const prop of ["scale", "scaleX", "scaleY"]) {
        if (initial[prop] === 0 || animate[prop] === 0) return true;
    }

    return false;
}

/**
 * Creates a a11y adapted motion component for an HTML element
 * Runs them through the risk check
 */
function createAdaptedMotionComponent(element) {
    return defineComponent({
        name: `adaptedMotion.${element}`,
        inheritAttrs: false,
        setup(_, { attrs, slots }) {
            const reducedMotion = useReducedMotion();

            // When a slide is replaced with a fade inside a plain <AnimatePresence>,
            // hold the entering element at opacity:0 until the exiting sibling is done
            const slideReady = ref(null);

            // Measured element size — populated on mount and used to pick size-appropriate thresholds
            const elementSize = ref(null);

            onMounted(() => {
                const el = getCurrentInstance()?.proxy?.$el;
                if (el?.getBoundingClientRect) {
                    const { width, height } = el.getBoundingClientRect();
                    elementSize.value = { width, height };
                }

                if (!reducedMotion.value) return;
                if (!willBecomeAFade(attrs.initial, attrs.animate)) return;

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

                // When size hasn't been measured yet, assume large so we don't
                // play animations that would be stripped post-measurement.
                const sizeForAdapt = elementSize.value ?? { width: Infinity, height: Infinity };

                if (result.variants && typeof result.variants === "object") {
                    result.variants = adaptVariants(
                        result.variants,
                        sizeForAdapt,
                    );
                }

                const initial =
                    result.initial && typeof result.initial === "object"
                        ? result.initial
                        : null;
                const animate =
                    result.animate && typeof result.animate === "object"
                        ? result.animate
                        : null;

                if (initial && animate) {
                    result.initial = adaptKeyframe(
                        initial,
                        animate,
                        initial,
                        sizeForAdapt,
                    );
                    result.animate = adaptKeyframe(
                        initial,
                        animate,
                        animate,
                        sizeForAdapt,
                    );

                    if (result.exit && typeof result.exit === "object") {
                        result.exit = adaptKeyframe(
                            initial,
                            animate,
                            result.exit,
                            sizeForAdapt,
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

                if (slideReady.value === false) {
                    result.animate = { opacity: 0 };
                }

                // Strip scroll-driven MotionValues from :style (parallax suppression)
                if (result.style && typeof result.style === "object") {
                    const filteredStyle = {};
                    for (const [key, val] of Object.entries(result.style)) {
                        const isMotionValue =
                            val !== null &&
                            typeof val === "object" &&
                            typeof val.get === "function";
                        if (!isMotionValue) {
                            filteredStyle[key] = val;
                        }
                    }
                    result.style = filteredStyle;
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
 * AnimatePresence wrapper that enforces mode="wait" when reduced motion is on
 * Exit animations always complete before entering animations start
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
