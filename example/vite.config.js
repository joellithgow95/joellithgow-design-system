import { defineConfig } from "vite";

export default defineConfig({
  // Relative base so the built site works from any path: GitHub Pages, Cloudflare, a subfolder.
  base: "./",
  build: {
    // Browsers with native light-dark() (Baseline May 2024). Older targets make
    // LightningCSS rewrite light-dark() into --lightningcss-* fallbacks that resolve
    // at :root, which breaks color-scheme set on any element below it.
    cssTarget: ["chrome123", "firefox120", "safari17.5"],
  },
});
