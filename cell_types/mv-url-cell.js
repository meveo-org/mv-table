import { LitElement, html, css } from "lit-element";

export class MvUrlCell extends LitElement {
  static get properties() {
    return {
      href: { type: String, attribute: true },
      label: { type: String, attribute: true },
      target: { type: String, attribute: true }
    };
  }

  static get styles() {
    return css`
	  :host {
		font-family: var(--font-family, Arial);
		font-size: var(--font-size-m, 10pt);
		--color: var(--mv-table-url-color, #80828C);				
      }

      a {
        color: var(--color);
        text-decoration: none;
      }

      a:hover {
        text-decoration: underline;
      }
	`;
  }

  constructor() {
    super();
    this.target = "_self";
  }

  render() {
    const label = this.label || this.href;
    return html`
      <a href="${this.href}" target="${this.target}">${label}</a>
    `;
  }
}

customElements.define("mv-url-cell", MvUrlCell);
