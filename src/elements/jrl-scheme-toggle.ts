import { LitElement, css, html } from "lit";

import { SCHEMES, SCHEME_CHANGE_EVENT, getScheme, setScheme, type Scheme } from "../scheme.js";

const LABELS: Record<Scheme, string> = {
  system: "Auto",
  light: "Light",
  dark: "Dark",
};

/**
 * A three-way light/dark/auto switch. Pair it with SCHEME_INIT_SCRIPT in
 * <head> so the stored choice applies before first paint.
 *
 * Several toggles on one page stay in sync through the jrl-scheme-change event.
 *
 * @fires jrl-scheme-change - On window, with the new scheme as detail.
 * @csspart button - Each option button.
 */
export class JrlSchemeToggle extends LitElement {
  static properties = {
    scheme: { state: true, attribute: false },
  };

  static styles = css`
    :host {
      display: inline-flex;
      border: var(--jrl-border-base) solid var(--jrl-color-border);
      border-radius: var(--jrl-radius-ui);
      overflow: hidden;
    }

    button {
      padding: var(--jrl-space-xs) var(--jrl-space-sm);
      border: 0;
      background: var(--jrl-color-surface);
      color: var(--jrl-color-text);
      font: inherit;
      font-family: var(--jrl-font-mono);
      font-size: var(--jrl-text-xs);
      letter-spacing: var(--jrl-tracking-wide);
      text-transform: uppercase;
      cursor: pointer;
    }

    button + button {
      border-left: var(--jrl-border-base) solid var(--jrl-color-border);
    }

    button[aria-pressed="true"] {
      background: var(--jrl-color-accent);
      color: var(--jrl-color-on-accent);
    }

    /* Inset ring: :host clips an outside outline. On the coral fill the
       focus colour is under 3:1, so the pressed button uses on-accent ink. */
    button:focus-visible {
      outline: var(--jrl-border-base) solid var(--jrl-color-focus);
      outline-offset: -4px;
    }

    button[aria-pressed="true"]:focus-visible {
      outline-color: var(--jrl-color-on-accent);
    }
  `;

  declare scheme: Scheme;

  constructor() {
    super();
    this.scheme = "system";
  }

  connectedCallback() {
    super.connectedCallback();
    this.scheme = getScheme();
    window.addEventListener(SCHEME_CHANGE_EVENT, this.onSchemeChange);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener(SCHEME_CHANGE_EVENT, this.onSchemeChange);
  }

  private onSchemeChange = (event: Event) => {
    this.scheme = (event as CustomEvent<Scheme>).detail;
  };

  render() {
    return html`${SCHEMES.map(
      (scheme) => html`
        <button
          part="button"
          type="button"
          aria-pressed=${scheme === this.scheme ? "true" : "false"}
          @click=${() => setScheme(scheme)}
        >
          ${LABELS[scheme]}
        </button>
      `,
    )}`;
  }
}

if (!customElements.get("jrl-scheme-toggle")) {
  customElements.define("jrl-scheme-toggle", JrlSchemeToggle);
}

declare global {
  interface HTMLElementTagNameMap {
    "jrl-scheme-toggle": JrlSchemeToggle;
  }
}
