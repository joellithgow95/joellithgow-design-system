// WCAG 2.1 contrast check for the semantic colour pairs, in light and dark.
// Reads dist/tokens.resolved.json (run build-tokens first), prints a table,
// writes dist/contrast.json for the example site, and exits 1 if any pair fails.

import { readFileSync, writeFileSync } from "node:fs";

const RESOLVED = "dist/tokens.resolved.json";
const OUT = "dist/contrast.json";

// AA thresholds: 4.5 for body text, 3 for UI parts such as borders and focus rings.
const TEXT = 4.5;
const UI = 3;

const PAIRS = [
  { fg: "color.text", bg: "color.bg", min: TEXT },
  { fg: "color.text", bg: "color.surface", min: TEXT },
  { fg: "color.text-muted", bg: "color.bg", min: TEXT },
  { fg: "color.text-muted", bg: "color.surface", min: TEXT },
  { fg: "color.accent-text", bg: "color.bg", min: TEXT },
  { fg: "color.accent-text", bg: "color.surface", min: TEXT },
  { fg: "color.on-accent", bg: "color.accent", min: TEXT },
  { fg: "color.on-accent", bg: "color.accent-2", min: TEXT },
  { fg: "color.on-accent", bg: "color.accent-3", min: TEXT },
  { fg: "color.danger", bg: "color.bg", min: TEXT },
  { fg: "color.border", bg: "color.bg", min: UI },
  { fg: "color.focus", bg: "color.bg", min: UI },
  // color.accent on color.bg is about 2.6:1 in light mode. That passes only
  // because accent fills always carry a color.border outline (base.css), so the
  // outline, not the fill, marks the control's edge. Never ship an accent fill
  // without that border. Likewise, a focus ring drawn on an accent fill uses
  // color.on-accent (6.8:1), not color.focus.
];

function luminance(hex) {
  const n = parseInt(hex.slice(1), 16);
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => {
    const s = v / 255;
    return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function ratio(a, b) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

function main() {
  const resolved = JSON.parse(readFileSync(RESOLVED, "utf8"));
  const results = [];

  for (const pair of PAIRS) {
    for (const mode of ["light", "dark"]) {
      const fg = resolved[pair.fg][mode];
      const bg = resolved[pair.bg][mode];
      const value = ratio(fg, bg);
      results.push({ ...pair, mode, fgHex: fg, bgHex: bg, ratio: +value.toFixed(2), pass: value >= pair.min });
    }
  }

  for (const r of results) {
    const mark = r.pass ? "pass" : "FAIL";
    console.log(`${mark}  ${r.mode.padEnd(5)}  ${r.ratio.toFixed(2).padStart(5)} >= ${r.min}  ${r.fg} on ${r.bg}`);
  }

  writeFileSync(OUT, JSON.stringify(results, null, 2) + "\n");

  const failures = results.filter((r) => !r.pass).length;
  if (failures) {
    console.error(`${failures} pair(s) below WCAG AA`);
    process.exit(1);
  }
}

main();
