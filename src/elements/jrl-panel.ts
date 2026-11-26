import { LitElement, css, html } from "lit";

/**
 * An outlined panel with an optional heading bar. Ported from plotter-art's
 * pa-panel onto the design tokens.
 *
 * @slot - Panel body.
 * @slot actions - Controls shown at the right of the heading bar.
 * @csspart header - The heading bar.
 * @csspart body - The body wrapper.
 * @cssprop --jrl-panel-padding - Body padding. Defaults to --jrl-space-md.
 */
export class JrlPanel extends LitElement {
  static properties = {
    heading: { type: String },
  };

  static styles = css`
    :host {
      display: block;
      border: var(--jrl-border-thick) solid var(--jrl-color-border);
      border-radius: var(--jrl-radius-ui);
      background: var(--jrl-color-surface);
      color: var(--jrl-color-text);
      box-shadow: var(--jrl-shadow-md);
      overflow: hidden;
    }

    header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--jrl-space-sm);
      padding: var(--jrl-space-sm) var(--jrl-space-md);
      border-bottom: var(--jrl-border-base) solid var(--jrl-color-border);
      font-family: var(--jrl-font-mono);
      font-size: var(--jrl-text-sm);
      font-weight: var(--jrl-font-weight-semibold);
      letter-spacing: var(--jrl-tracking-wide);
      text-transform: uppercase;
    }

    .body {
      padding: var(--jrl-panel-padding, var(--jrl-space-md));
    }
  `;

  /** Text for the heading bar. The bar is hidden when empty. */
  declare heading: string;

  constructor() {
    super();
    this.heading = "";
  }

  render() {
    const header = this.heading
      ? html`<header part="header"><span>${this.heading}</span><slot name="actions"></slot></header>`
      : null;

    return html`${header}<div class="body" part="body"><slot></slot></div>`;
  }
}

if (!customElements.get("jrl-panel")) {
  customElements.define("jrl-panel", JrlPanel);
}

declare global {
  interface HTMLElementTagNameMap {
    "jrl-panel": JrlPanel;
  }
}
