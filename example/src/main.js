// The example site imports the package by name, exactly as a consuming site would.
import "@fontsource-variable/fraunces";
import "@fontsource-variable/ibm-plex-sans";
import "joellithgow-design-system/index.css";
import "joellithgow-design-system";
import contrast from "joellithgow-design-system/contrast.json";
import tokens from "joellithgow-design-system/tokens.resolved.json";

import "./site.css";

const COLOR_PREFIX = "color.";

function renderSwatches() {
  const roles = Object.keys(tokens).filter((path) => path.startsWith(COLOR_PREFIX));

  for (const container of document.querySelectorAll("[data-swatches]")) {
    const mode = container.closest("[data-force]").dataset.force;

    container.innerHTML = roles
      .map((path) => {
        const { css } = tokens[path];
        return `
          <div class="swatch">
            <span class="chip" style="background: var(${css})"></span>
            <code>${path.slice(COLOR_PREFIX.length)}</code>
            <span class="hex">${tokens[path][mode]}</span>
          </div>`;
      })
      .join("");
  }
}

function renderContrast() {
  const rows = new Map();

  for (const result of contrast) {
    const key = `${result.fg} on ${result.bg}`;
    rows.set(key, { ...rows.get(key), min: result.min, [result.mode]: result });
  }

  const cell = (r) => `<td class="${r.pass ? "pass" : "fail"}">${r.ratio.toFixed(2)}</td>`;

  document.querySelector("[data-contrast]").innerHTML = [...rows]
    .map(
      ([key, row]) => `
        <tr>
          <td><code>${key.replaceAll(COLOR_PREFIX, "")}</code></td>
          ${cell(row.light)}${cell(row.dark)}
          <td>${row.min}:1</td>
        </tr>`,
    )
    .join("");
}

renderSwatches();
renderContrast();
