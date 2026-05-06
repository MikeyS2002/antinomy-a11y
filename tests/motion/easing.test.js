import { describe, it, expect } from "vitest";
import { isSafeEasing, isUnsafeTransitionType } from "../../src/motion/easing.js";

describe("isSafeEasing", () => {
    describe("absent or default values", () => {
        it("treats undefined as safe", () => {
            expect(isSafeEasing(undefined)).toBe(true);
        });

        it("treats null as safe", () => {
            expect(isSafeEasing(null)).toBe(true);
        });

        it("treats empty string as safe", () => {
            expect(isSafeEasing("")).toBe(true);
        });
    });

    describe("string keywords", () => {
        it("accepts the standard CSS easing keywords", () => {
            expect(isSafeEasing("linear")).toBe(true);
            expect(isSafeEasing("ease")).toBe(true);
            expect(isSafeEasing("ease-in")).toBe(true);
            expect(isSafeEasing("ease-out")).toBe(true);
            expect(isSafeEasing("ease-in-out")).toBe(true);
        });

        it("rejects unknown string keywords", () => {
            expect(isSafeEasing("backOut")).toBe(false);
            expect(isSafeEasing("bounce")).toBe(false);
            expect(isSafeEasing("anticipate")).toBe(false);
        });
    });

    describe("cubic bezier arrays", () => {
        it("accepts curves with y1 and y2 inside [0, 1]", () => {
            expect(isSafeEasing([0, 0, 0.58, 1])).toBe(true); // ease-out
            expect(isSafeEasing([0.42, 0, 0.58, 1])).toBe(true); // ease-in-out
            expect(isSafeEasing([0.65, 0, 0.35, 1])).toBe(true); // Adyen IN_OUT_BASE
        });

        it("rejects curves with y1 below 0 (overshoot)", () => {
            expect(isSafeEasing([1, -0.4, 0.35, 0.95])).toBe(false); // ANTICIPATE
        });

        it("rejects curves with y2 above 1 (overshoot)", () => {
            expect(isSafeEasing([0.34, 1.56, 0.64, 1])).toBe(false);
        });

        it("rejects arrays of unexpected length", () => {
            expect(isSafeEasing([0, 0, 1])).toBe(false);
            expect(isSafeEasing([0, 0])).toBe(false);
        });
    });

    describe("invalid types", () => {
        it("rejects numbers", () => {
            expect(isSafeEasing(42)).toBe(false);
        });

        it("rejects objects", () => {
            expect(isSafeEasing({ type: "spring" })).toBe(false);
        });
    });
});

describe("isUnsafeTransitionType", () => {
    it("returns true for spring", () => {
        expect(isUnsafeTransitionType("spring")).toBe(true);
    });

    it("returns true for inertia", () => {
        expect(isUnsafeTransitionType("inertia")).toBe(true);
    });

    it("returns false for tween (the default)", () => {
        expect(isUnsafeTransitionType("tween")).toBe(false);
    });

    it("returns false for undefined", () => {
        expect(isUnsafeTransitionType(undefined)).toBe(false);
    });

    it("returns false for an empty string", () => {
        expect(isUnsafeTransitionType("")).toBe(false);
    });
});
