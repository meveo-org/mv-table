import { LitElement, html, css } from "lit-element";

export class MvBooleanCell extends LitElement {
  static get properties() {
    return {
      value: { type: String, attribute: true },
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

  render() {
    return html` ${this.value + "" || ""} `;
  }
}

customElements.define("mv-boolean-cell", MvBooleanCell);
