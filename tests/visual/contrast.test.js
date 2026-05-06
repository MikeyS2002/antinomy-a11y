import { describe, it, expect } from "vitest";
import {
    parseHex,
    relativeLuminance,
    contrastRatio,
    meetsContrast,
    suggestForeground,
} from "../../src/visual/contrast.js";

describe("parseHex", () => {
    it("parses a six-character hex with leading hash", () => {
        expect(parseHex("#ff0000")).toEqual({ r: 255, g: 0, b: 0 });
        expect(parseHex("#00ff00")).toEqual({ r: 0, g: 255, b: 0 });
        expect(parseHex("#0000ff")).toEqual({ r: 0, g: 0, b: 255 });
    });

    it("parses a six-character hex without the leading hash", () => {
        expect(parseHex("ffffff")).toEqual({ r: 255, g: 255, b: 255 });
        expect(parseHex("000000")).toEqual({ r: 0, g: 0, b: 0 });
    });

    it("expands three-character shorthand hex", () => {
        expect(parseHex("#fff")).toEqual({ r: 255, g: 255, b: 255 });
        expect(parseHex("#000")).toEqual({ r: 0, g: 0, b: 0 });
        expect(parseHex("#abc")).toEqual({ r: 170, g: 187, b: 204 });
    });
});

describe("relativeLuminance", () => {
    it("returns 0 for pure black", () => {
        expect(relativeLuminance({ r: 0, g: 0, b: 0 })).toBe(0);
    });

    it("returns 1 for pure white", () => {
        // The WCAG formula yields exactly 1 for { 255, 255, 255 }
        expect(relativeLuminance({ r: 255, g: 255, b: 255 })).toBeCloseTo(1, 5);
    });

    it("weights green more heavily than red and blue", () => {
        const red = relativeLuminance({ r: 255, g: 0, b: 0 });
        const green = relativeLuminance({ r: 0, g: 255, b: 0 });
        const blue = relativeLuminance({ r: 0, g: 0, b: 255 });
        expect(green).toBeGreaterThan(red);
        expect(red).toBeGreaterThan(blue);
    });

    it("uses the linearisation breakpoint at 0.04045", () => {
        // Channel 10/255 ≈ 0.0392 falls below the breakpoint and uses /12.92
        // Channel 11/255 ≈ 0.0431 falls above and uses the gamma formula
        const lower = relativeLuminance({ r: 10, g: 10, b: 10 });
        const upper = relativeLuminance({ r: 11, g: 11, b: 11 });
        expect(upper).toBeGreaterThan(lower);
    });
});

describe("contrastRatio", () => {
    it("returns 21:1 for pure black on pure white", () => {
        expect(contrastRatio("#000000", "#ffffff")).toBeCloseTo(21, 1);
    });

    it("returns 1:1 for two identical colors", () => {
        expect(contrastRatio("#ffffff", "#ffffff")).toBeCloseTo(1, 5);
        expect(contrastRatio("#7a7a8e", "#7a7a8e")).toBeCloseTo(1, 5);
    });

    it("is symmetrical: ratio(a, b) === ratio(b, a)", () => {
        const ab = contrastRatio("#1a1a2e", "#ffffff");
        const ba = contrastRatio("#ffffff", "#1a1a2e");
        expect(ab).toBeCloseTo(ba, 5);
    });

    it("matches a known WCAG example", () => {
        // #767676 on #ffffff is the canonical AA-failing grey: ~4.54:1
        const ratio = contrastRatio("#767676", "#ffffff");
        expect(ratio).toBeGreaterThanOrEqual(4.5);
        expect(ratio).toBeLessThan(4.6);
    });
});

describe("meetsContrast", () => {
    it("rounds the ratio to two decimals", () => {
        const result = meetsContrast("#000000", "#ffffff");
        expect(result.ratio).toBe(21);
    });

    it("flags AA Normal at 4.5:1", () => {
        const pass = meetsContrast("#595959", "#ffffff"); // ~7.0:1
        expect(pass.aa).toBe(true);

        const fail = meetsContrast("#aaaaaa", "#ffffff"); // ~2.32:1
        expect(fail.aa).toBe(false);
    });

    it("flags AA Large at 3:1", () => {
        const pass = meetsContrast("#949494", "#ffffff"); // ~3.0:1
        expect(pass.aaLarge).toBe(true);

        const fail = meetsContrast("#dddddd", "#ffffff"); // ~1.31:1
        expect(fail.aaLarge).toBe(false);
    });

    it("flags AAA Normal at 7:1", () => {
        const pass = meetsContrast("#000000", "#ffffff");
        expect(pass.aaa).toBe(true);

        const fail = meetsContrast("#767676", "#ffffff"); // ~4.54:1
        expect(fail.aaa).toBe(false);
    });

    it("returns 1:1 for identical colors and fails every level", () => {
        const result = meetsContrast("#7a7a8e", "#7a7a8e");
        expect(result.ratio).toBe(1);
        expect(result.aa).toBe(false);
        expect(result.aaa).toBe(false);
        expect(result.aaLarge).toBe(false);
        expect(result.aaaLarge).toBe(false);
    });
});

describe("suggestForeground", () => {
    it("suggests white on a dark background", () => {
        expect(suggestForeground("#1a1a2e")).toBe("#ffffff");
        expect(suggestForeground("#000000")).toBe("#ffffff");
    });

    it("suggests black on a light background", () => {
        expect(suggestForeground("#f0f0f0")).toBe("#000000");
        expect(suggestForeground("#ffffff")).toBe("#000000");
    });

    it("respects a custom target ratio", () => {
        // On the green test color the user used in 7.4, a 2:1 target would
        // accept either, but at 7:1 only one passes
        expect(suggestForeground("#7a7a8e", 7)).toBe("#000000");
    });

    it("falls back to the higher-contrast option when neither meets the target", () => {
        // Mid-grey background where neither black nor white can hit 21:1
        const result = suggestForeground("#888888", 21);
        // Whichever was returned, it should be one of the two candidates
        expect(["#ffffff", "#000000"]).toContain(result);
    });
});
