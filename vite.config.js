import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
    build: {
        lib: {
            entry: {
                index: resolve(__dirname, "src/index.js"),
                "motion/index": resolve(__dirname, "src/motion/index.js"),
                "visual/index": resolve(__dirname, "src/visual/index.js"),
            },
            formats: ["es"],
            fileName: (format, entryName) => `${entryName}.js`,
        },
        rollupOptions: {
            external: ["vue", "motion-v"],
        },
        outDir: "dist",
        emptyOutDir: true,
    },
    test: {
        environment: "node",
        include: ["tests/**/*.test.js"],
        coverage: {
            provider: "v8",
            include: ["src/**/*.js"],
            exclude: [
                "src/**/index.js",
                "src/motion/adaptedMotion.js",
                "src/visual/focus.js",
                "src/visual/v*.js",
                "src/visual/*Audit.js",
                "src/visual/focusIndicator.js",
            ],
            reporter: ["text", "html"],
        },
    },
});
