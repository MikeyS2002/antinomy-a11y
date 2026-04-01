import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
    build: {
        lib: {
            entry: {
                index: resolve(__dirname, "src/motion/index.js"),
                "motion/index": resolve(__dirname, "src/motion/index.js"),
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
});
