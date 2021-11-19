import { LitElement, html, css } from "lit-element";

export class MvListCell extends LitElement {
  static get properties() {
    return {
      options: { type: Array, attribute: false },
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
    const option = options.find((item) => item.value === this.value);
    return html` ${option.label + "" || ""} `;
  }
}

customElements.define("mv-list-cell", MvListCell);
