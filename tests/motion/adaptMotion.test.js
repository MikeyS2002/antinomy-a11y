import { describe, it, expect } from "vitest";
import {
    adaptKeyframe,
    adaptVariants,
    buildReducedTransition,
    clampToThreshold,
    getNeutralValue,
    isOffScreenPercent,
    isAppearPattern,
    isInvisibleSide,
} from "../../src/motion/adaptMotion.js";

describe("getNeutralValue", () => {
    it("returns 0 for spatial properties", () => {
        expect(getNeutralValue("x")).toBe(0);
        expect(getNeutralValue("y")).toBe(0);
        expect(getNeutralValue("translateX")).toBe(0);
        expect(getNeutralValue("translateZ")).toBe(0);
    });

    it("returns 1 for scale properties", () => {
        expect(getNeutralValue("scale")).toBe(1);
        expect(getNeutralValue("scaleX")).toBe(1);
        expect(getNeutralValue("scaleY")).toBe(1);
        expect(getNeutralValue("scaleZ")).toBe(1);
    });

    it("returns 0 for rotation and skew properties", () => {
        expect(getNeutralValue("rotate")).toBe(0);
        expect(getNeutralValue("rotateY")).toBe(0);
        expect(getNeutralValue("skew")).toBe(0);
        expect(getNeutralValue("skewX")).toBe(0);
    });

    it("returns 0 as a safe default for unknown properties", () => {
        expect(getNeutralValue("foo")).toBe(0);
    });
});

describe("isOffScreenPercent", () => {
    it("returns true for ±100% strings", () => {
        expect(isOffScreenPercent("100%")).toBe(true);
        expect(isOffScreenPercent("-100%")).toBe(true);
    });

    it("returns true for values beyond ±100%", () => {
        expect(isOffScreenPercent("150%")).toBe(true);
        expect(isOffScreenPercent("-200%")).toBe(true);
    });

    it("returns false for percentages below 100%", () => {
        expect(isOffScreenPercent("50%")).toBe(false);
        expect(isOffScreenPercent("99.9%")).toBe(false);
    });

    it("returns false for non-percentage strings", () => {
        expect(isOffScreenPercent("100px")).toBe(false);
        expect(isOffScreenPercent("100")).toBe(false);
    });

    it("returns false for non-string values", () => {
        expect(isOffScreenPercent(100)).toBe(false);
        expect(isOffScreenPercent(null)).toBe(false);
        expect(isOffScreenPercent(undefined)).toBe(false);
    });
});

describe("isAppearPattern", () => {
    it("detects spatial appear from off-screen", () => {
        expect(isAppearPattern("y", "100%", 0)).toBe(true);
        expect(isAppearPattern("x", "-100%", 0)).toBe(true);
    });

    it("detects spatial disappear to off-screen", () => {
        expect(isAppearPattern("y", 0, "-100%")).toBe(true);
    });

    it("detects scale appear from 0", () => {
        expect(isAppearPattern("scale", 0, 1)).toBe(true);
        expect(isAppearPattern("scaleX", 1, 0)).toBe(true);
    });

    it("returns false for ordinary movements", () => {
        expect(isAppearPattern("x", 0, 80)).toBe(false);
        expect(isAppearPattern("scale", 1, 1.2)).toBe(false);
    });

    it("returns false for safe properties", () => {
        expect(isAppearPattern("opacity", 0, 1)).toBe(false);
    });
});

describe("isInvisibleSide", () => {
    it("identifies the off-screen side of a spatial appear pattern", () => {
        expect(isInvisibleSide("y", "100%")).toBe(true);
        expect(isInvisibleSide("y", 0)).toBe(false);
    });

    it("identifies the zero side of a scale appear pattern", () => {
        expect(isInvisibleSide("scale", 0)).toBe(true);
        expect(isInvisibleSide("scale", 1)).toBe(false);
    });
});

describe("clampToThreshold", () => {
    it("clamps spatial values into ±50 range", () => {
        expect(clampToThreshold("x", 80)).toBe(50);
        expect(clampToThreshold("x", -80)).toBe(-50);
        expect(clampToThreshold("x", 30)).toBe(30);
    });

    it("clamps scale to 1 ± 0.15", () => {
        expect(clampToThreshold("scale", 1.5)).toBeCloseTo(1.15, 2);
        expect(clampToThreshold("scale", 0.5)).toBeCloseTo(0.85, 2);
        expect(clampToThreshold("scale", 1.1)).toBe(1.1);
    });

    it("clamps rotation to ±10 degrees", () => {
        expect(clampToThreshold("rotate", 45)).toBe(10);
        expect(clampToThreshold("rotate", -45)).toBe(-10);
    });

    it("uses stricter limits for large elements", () => {
        const large = { width: 600, height: 600 };
        expect(clampToThreshold("x", 80, large)).toBe(20);
    });

    it("returns the original value for unknown properties", () => {
        expect(clampToThreshold("foo", 100)).toBe(100);
    });
});

describe("buildReducedTransition", () => {
    it("strips spring physics fields", () => {
        const result = buildReducedTransition(
            {
                type: "spring",
                stiffness: 200,
                damping: 10,
                bounce: 0.5,
            },
            new Set(["x"]),
        );
        expect(result.type).toBeUndefined();
        expect(result.stiffness).toBeUndefined();
        expect(result.damping).toBeUndefined();
        expect(result.bounce).toBeUndefined();
    });

    it("strips repeat fields", () => {
        const result = buildReducedTransition(
            { repeat: Infinity, repeatType: "reverse", repeatDelay: 1 },
            new Set(["x"]),
        );
        expect(result.repeat).toBe(0);
        expect(result.repeatType).toBeUndefined();
        expect(result.repeatDelay).toBeUndefined();
    });

    it("caps duration at the configured maximum", () => {
        const result = buildReducedTransition(
            { duration: 2 },
            new Set(["x"]),
        );
        expect(result.duration).toBe(0.3);
    });

    it("preserves duration if already below the cap", () => {
        const result = buildReducedTransition(
            { duration: 0.2 },
            new Set(["x"]),
        );
        expect(result.duration).toBe(0.2);
    });

    it("replaces unsafe easing with linear for spatial properties", () => {
        const result = buildReducedTransition(
            { ease: [1, -0.4, 0.35, 0.95] }, // ANTICIPATE has overshoot
            new Set(["x"]),
        );
        expect(result.ease).toBe("linear");
    });

    it("uses the configured ease-out for opacity-only animations", () => {
        const result = buildReducedTransition(
            { ease: "linear" },
            new Set(["opacity"]),
        );
        expect(result.ease).toEqual([0, 0, 0.58, 1]);
    });

    it("keeps a safe easing untouched", () => {
        const result = buildReducedTransition(
            { ease: "ease-out" },
            new Set(["x"]),
        );
        expect(result.ease).toBe("ease-out");
    });
});

describe("adaptKeyframe", () => {
    it("passes safe properties through unchanged", () => {
        const adapted = adaptKeyframe(
            { opacity: 0 },
            { opacity: 1 },
            { opacity: 1 },
        );
        expect(adapted.opacity).toBe(1);
    });

    it("neutralises high-risk spatial values", () => {
        const adapted = adaptKeyframe({ x: 0 }, { x: 200 }, { x: 200 });
        expect(adapted.x).toBe(0);
    });

    it("clamps moderate-risk spatial values", () => {
        // initial→animate distance is 20 px (moderate), but the absolute target
        // value 80 still exceeds the 50 px threshold and must be clamped.
        const adapted = adaptKeyframe({ x: 60 }, { x: 80 }, { x: 80 });
        expect(adapted.x).toBe(50);
    });

    it("replaces appear-pattern slides with an opacity fade", () => {
        // Modal animating from y: '100%' to y: 0 — slide-to-fade replacement
        const adapted = adaptKeyframe(
            { y: "100%" },
            { y: 0 },
            { y: 0 }, // animate target
        );
        expect(adapted.y).toBeUndefined();
        expect(adapted.opacity).toBe(1);
    });

    it("applies opacity 0 on the invisible side of an appear pattern", () => {
        const initialAdapted = adaptKeyframe(
            { y: "100%" },
            { y: 0 },
            { y: "100%" }, // initial target
        );
        expect(initialAdapted.opacity).toBe(0);
    });

    it("does not inject an opacity fade if opacity is already animated", () => {
        const adapted = adaptKeyframe(
            { y: "100%", opacity: 0 },
            { y: 0, opacity: 1 },
            { y: 0, opacity: 1 },
        );
        // opacity is left to the explicit animation, y is neutralised
        expect(adapted.opacity).toBe(1);
        expect(adapted.y).toBe(0);
    });

    it("neutralises every value in a high-risk keyframe array", () => {
        const adapted = adaptKeyframe(
            { x: 0 },
            { x: [0, 100, -100, 200] },
            { x: [0, 100, -100, 200] },
        );
        expect(adapted.x).toEqual([0, 0, 0, 0]);
    });
});

describe("adaptVariants", () => {
    it("adapts every variant against the initial-to-animate baseline", () => {
        const variants = {
            initial: { x: "100%", opacity: 0 },
            animate: { x: 0, opacity: 1 },
            exit: { x: "-100%", opacity: 0 },
        };
        const adapted = adaptVariants(variants);
        // Spatial property is high-risk so it is replaced/neutralised;
        // opacity passes through.
        expect(adapted.animate.opacity).toBe(1);
        expect(adapted.exit.opacity).toBe(0);
        // No raw spatial movement remains
        expect(adapted.animate.x).toBeFalsy();
    });
});
