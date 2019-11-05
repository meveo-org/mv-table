import {
  LitElement,
  html,
  css
} from "https://cdn.jsdelivr.net/gh/manaty/mv-dependencies@master/web_modules/lit-element.js";

export class MvUrl extends LitElement {
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
      <td><a href="${this.href}" target="${this.target}">${label}</a></td>
    `;
  }
}

customElements.define("mv-url", MvUrl);
