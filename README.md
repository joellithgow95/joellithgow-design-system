# joellithgow-design-system

The shared design system for Joel Lithgow's projects (joellithgow.com, plotter-art and future ones):

- **Tokens:** [DTCG 2025.10](https://www.designtokens.org/tr/2025.10/) JSON in `tokens/tokens.json`, built to CSS custom properties prefixed `--jrl-`.
- **Light and dark:** every colour role is a CSS `light-dark()` value. There is one look and no themes.
- **Base CSS:** a reset, page defaults, and CSS-only buttons, cards and badges. It sits in `@layer jrl.*` so any site overrides it from plain CSS.
- **Web components:** Lit elements (`jrl-*`) for the parts that need behaviour, documented in a Custom Elements Manifest.
- **Agent-readable:** `llms.txt`, the manifest and the resolved tokens let agents use the system correctly.

The `example/` site shows everything in light and dark, including the contrast results. It is live at https://ds.joellithgow.com.

## Use it

```bash
npm install joellithgow-design-system
```

```js
import "joellithgow-design-system/index.css"; // tokens + base CSS
import "joellithgow-design-system";           // registers <jrl-*> elements
```

Inline the scheme snippet in `<head>`, before stylesheets, so a stored light/dark choice applies before the first paint:

```astro
---
import { SCHEME_INIT_SCRIPT } from "joellithgow-design-system/scheme.js";
---
<script is:inline set:html={SCHEME_INIT_SCRIPT} />
```

Override anything from unlayered CSS:

```css
:root {
  --jrl-radius-ui: 8px;
  --jrl-color-accent: light-dark(#ff6b6b, #ff8a8a);
}
```

**Vite and Astro sites must target modern browsers for CSS.** Vite 8 minifies CSS with LightningCSS. With older targets it rewrites `light-dark()` into `--lightningcss-*` fallbacks that resolve at `:root`, so `color-scheme` set on an element no longer flips the colours inside it. Set:

```js
build: { cssTarget: ["chrome123", "firefox120", "safari17.5"] } // Baseline for light-dark()
```

Fonts are left to the consuming site. The tokens name Fraunces (display), IBM Plex Sans (body) and a Monaco stack (mono). `@fontsource-variable/fraunces` and `@fontsource-variable/ibm-plex-sans` load the first two.

## Develop

```bash
npm install
npm run check          # build tokens, CSS, TS and manifest, then the WCAG AA contrast check
npm run example:dev    # build, then serve the example site
npm run example:build  # check, then build the example to example/dist
```

| Path | What |
|------|------|
| `tokens/tokens.json` | Token source. Edit this, never `dist/tokens.css` |
| `scripts/build-tokens.mjs` | DTCG → CSS, with `light-dark()`, `clamp()` and alias checks |
| `scripts/check-contrast.mjs` | AA check for every semantic colour pair in both schemes |
| `src/css/` | Reset, base styles and CSS patterns |
| `src/elements/` | Lit components, one file per tag |
| `src/scheme.ts` | Light/dark preference helpers and the pre-paint snippet |
| `example/` | Static showcase site; imports the package by name |

## Releasing

Releases are automated (`.github/workflows/release.yml`):

1. Merge PRs with Conventional Commits. While below 1.0, `feat:` bumps the minor version and `fix:` the patch. `docs:`, `chore:` and `ci:` alone don't release.
2. release-please keeps a "chore(main): release X.Y.Z" PR open with the version bump and `CHANGELOG.md`.
3. Merging it tags the release, and CI publishes to npm through Trusted Publishing, with provenance.

Never edit the version or `CHANGELOG.md` by hand, and never `npm publish` locally. To force a version, add a `Release-As: X.Y.Z` footer to a commit.
