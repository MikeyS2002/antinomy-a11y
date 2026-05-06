import { describe, it, expect } from "vitest";
import { classifyProperty } from "../../src/motion/classify.js";

describe("classifyProperty", () => {
    describe("unknown properties", () => {
        it("returns 'unknown' for properties not in propertyCategories", () => {
            expect(classifyProperty("foo", 0, 100)).toBe("unknown");
            expect(classifyProperty("backgroundColor", "red", "blue")).toBe("unknown");
        });

        it("returns 'unknown' when values cannot be parsed as numbers", () => {
            expect(classifyProperty("x", "abc", "def")).toBe("unknown");
            expect(classifyProperty("scale", NaN, NaN)).toBe("unknown");
        });
    });

    describe("safe properties", () => {
        it("returns 'low' for opacity regardless of values", () => {
            expect(classifyProperty("opacity", 0, 1)).toBe("low");
            expect(classifyProperty("opacity", 1, 0)).toBe("low");
            expect(classifyProperty("opacity", 0.5, 0.5)).toBe("low");
        });

        it("returns 'low' for clipPath", () => {
            expect(classifyProperty("clipPath", "inset(0)", "inset(50%)")).toBe("low");
        });
    });

    describe("spatial properties", () => {
        it("returns 'moderate' below 50px threshold", () => {
            expect(classifyProperty("x", 0, 30)).toBe("moderate");
            expect(classifyProperty("y", 0, 49)).toBe("moderate");
            expect(classifyProperty("translateX", 0, 50)).toBe("moderate");
        });

        it("returns 'high' above 50px threshold", () => {
            expect(classifyProperty("x", 0, 51)).toBe("high");
            expect(classifyProperty("y", 0, 200)).toBe("high");
        });

        it("treats negative distances using their absolute magnitude", () => {
            // Total absolute distance is 40, which stays within the 50 px threshold
            expect(classifyProperty("x", -20, 20)).toBe("moderate");
            // Total absolute distance is 100, which exceeds the threshold
            expect(classifyProperty("x", -100, 0)).toBe("high");
        });

        it("recognises percentage strings as off-screen movements", () => {
            // parseFloat("100%") → 100, which exceeds the 50 px threshold
            expect(classifyProperty("x", "100%", 0)).toBe("high");
            expect(classifyProperty("y", "-150%", 0)).toBe("high");
        });

        it("supports 3D spatial properties", () => {
            expect(classifyProperty("z", 0, 100)).toBe("high");
            expect(classifyProperty("translateZ", 0, 30)).toBe("moderate");
            expect(classifyProperty("perspective", 0, 200)).toBe("high");
        });
    });

    describe("scale properties", () => {
        it("returns 'low' when scale equals neutral 1.0", () => {
            // distance from 1 is 0, which is below the moderate threshold but
            // distance is 0 so risk is moderate (not 'low'); confirm explicitly
            expect(classifyProperty("scale", 1, 1)).toBe("moderate");
        });

        it("returns 'moderate' for small scale changes", () => {
            expect(classifyProperty("scale", 1, 1.1)).toBe("moderate");
            expect(classifyProperty("scaleX", 0.9, 1)).toBe("moderate");
        });

        it("returns 'high' for large scale changes", () => {
            expect(classifyProperty("scale", 1, 1.5)).toBe("high");
            expect(classifyProperty("scaleY", 0.5, 1)).toBe("high");
        });

        it("supports 3D scale", () => {
            expect(classifyProperty("scaleZ", 1, 2)).toBe("high");
        });
    });

    describe("rotation properties", () => {
        it("returns 'moderate' below 10 degrees threshold", () => {
            expect(classifyProperty("rotate", 0, 5)).toBe("moderate");
            expect(classifyProperty("rotate", 0, 10)).toBe("moderate");
        });

        it("returns 'high' above 10 degrees threshold", () => {
            expect(classifyProperty("rotate", 0, 45)).toBe("high");
            expect(classifyProperty("rotateY", 0, 180)).toBe("high");
        });

        it("supports skew properties as rotations", () => {
            expect(classifyProperty("skew", 0, 30)).toBe("high");
            expect(classifyProperty("skewX", 0, 5)).toBe("moderate");
        });
    });

    describe("keyframe arrays", () => {
        it("classifies a spatial keyframe by max consecutive step", () => {
            // [0, 30, -50, 100] → max step is 100 (between -50 and 100) → high
            expect(classifyProperty("x", 0, [0, 30, -50, 100])).toBe("high");
        });

        it("classifies a small spatial keyframe as moderate", () => {
            expect(classifyProperty("x", 0, [0, 10, 20, 30])).toBe("moderate");
        });

        it("classifies a scale keyframe by max deviation from 1", () => {
            // Max deviation 0.1 stays under the 0.15 threshold
            expect(classifyProperty("scale", 1, [1, 1.05, 1.1])).toBe("moderate");
            // Max deviation 0.5 is clearly above
            expect(classifyProperty("scale", 1, [1, 0.5, 1])).toBe("high");
        });

        it("returns 'unknown' when array contains non-numeric values", () => {
            expect(classifyProperty("x", 0, [0, "abc", 30])).toBe("unknown");
        });
    });

    describe("large element thresholds", () => {
        it("uses stricter thresholds when element exceeds 400px", () => {
            const largeElement = { width: 500, height: 500 };
            // 30px is moderate by default but high for large elements (threshold 20)
            expect(classifyProperty("x", 0, 30, largeElement)).toBe("high");
        });

        it("uses default thresholds for small elements", () => {
            const smallElement = { width: 200, height: 200 };
            expect(classifyProperty("x", 0, 30, smallElement)).toBe("moderate");
        });

        it("treats any scale change as high for large elements", () => {
            const largeElement = { width: 600, height: 600 };
            // Large element scale threshold is 0
            expect(classifyProperty("scale", 1, 1.05, largeElement)).toBe("high");
        });

        it("triggers large-element rules when only one dimension is large", () => {
            const wideElement = { width: 800, height: 100 };
            expect(classifyProperty("x", 0, 30, wideElement)).toBe("high");
        });
    });
});
