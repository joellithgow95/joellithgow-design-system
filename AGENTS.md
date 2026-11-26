# AGENTS.md: joellithgow-design-system

Read `README.md` for layout and commands, and `llms.txt` for the rules that consuming code must follow.

## Working here

- Edit tokens in `tokens/tokens.json`. Keep it valid DTCG 2025.10: colours as `{colorSpace, components, hex}`, dimensions as `{value, unit}`. Dark values go in `$extensions["com.joellithgow.modes"].dark`. Semantic `color.*` tokens alias `palette.*`; components use only the semantic tokens.
- Run `npm run check` before finishing. It must pass: the build fails on unresolved aliases, and the contrast check fails below WCAG 2.1 AA.
- A new element is one file in `src/elements/jrl-<name>.ts`:
  - Declare properties with `static properties` and `declare` fields, without decorators, so no compiler flags are needed.
  - Guard the registration with `customElements.get()`.
  - Add JSDoc `@slot`, `@csspart`, `@cssprop` and `@fires` tags so the manifest documents it.
  - Re-export it from `src/index.ts`, add it to `llms.txt`, and show it on the example site.
- Prefer CSS classes on native elements when no behaviour is needed. Prefer native platform features (popover, `<dialog>`, `:state()`, `light-dark()`) over JavaScript.
- Package CSS stays inside `@layer jrl.*`. Example-site CSS stays unlayered.

## Releases

Commits drive versions: write Conventional Commits, and let release-please open the release PR. Don't hand-edit `version` in `package.json`, `.release-please-manifest.json` or `CHANGELOG.md`, and never run `npm publish` locally; CI publishes when Joel merges the release PR.

## Hosting the example

`example/` deploys on every push to `main` (Cloudflare Workers static assets, `wrangler.jsonc`). The `ds.joellithgow.com` hostname is Terraform in jlithgow-ops (`terraform/workers.tf`), not wrangler; keep `routes` out of `wrangler.jsonc`. Don't deploy it, publish to npm, or push without Joel's go-ahead.
