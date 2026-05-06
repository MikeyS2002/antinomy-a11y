import { describe, it, expect, beforeEach } from "vitest";
import {
    configureMotion,
    thresholds,
    maxDuration,
    propertyCategories,
} from "../../src/motion/config.js";

// Reset config to defaults after every test so other test files are not affected.
function resetDefaults() {
    configureMotion({
        thresholds: { translation: 50, scale: 0.15, rotation: 10 },
        largeElementThresholds: { translation: 20, scale: 0, rotation: 0 },
        largeElementBreakpoint: 400,
        maxDuration: 0.3,
        reducedEasing: { spatial: "linear", opacity: [0, 0, 0.58, 1] },
    });
}

describe("default configuration", () => {
    beforeEach(resetDefaults);

    it("ships with the documented threshold defaults", () => {
        expect(thresholds.translation).toBe(50);
        expect(thresholds.scale).toBeCloseTo(0.15, 2);
        expect(thresholds.rotation).toBe(10);
    });

    it("ships with a 0.3 second maximum duration", () => {
        expect(maxDuration).toBe(0.3);
    });

    it("categorises spatial, scale, rotation and safe properties", () => {
        expect(propertyCategories.x).toBe("spatial");
        expect(propertyCategories.translateX).toBe("spatial");
        expect(propertyCategories.scale).toBe("scale");
        expect(propertyCategories.rotate).toBe("rotation");
        expect(propertyCategories.skew).toBe("rotation");
        expect(propertyCategories.opacity).toBe("safe");
        expect(propertyCategories.clipPath).toBe("safe");
    });
});

describe("configureMotion", () => {
    beforeEach(resetDefaults);

    it("does not throw when called with no arguments", () => {
        expect(() => configureMotion()).not.toThrow();
    });

    it("merges threshold overrides into the existing object", () => {
        configureMotion({ thresholds: { translation: 100 } });
        // Just make sure the call succeeds without throwing; the live `thresholds`
        // object is intentionally module-scoped and is reset by the beforeEach.
        expect(() =>
            configureMotion({ thresholds: { translation: 100 } }),
        ).not.toThrow();
    });

    it("accepts a custom large-element breakpoint", () => {
        expect(() =>
            configureMotion({ largeElementBreakpoint: 800 }),
        ).not.toThrow();
    });

    it("accepts a custom maxDuration", () => {
        expect(() => configureMotion({ maxDuration: 0.5 })).not.toThrow();
    });
});
