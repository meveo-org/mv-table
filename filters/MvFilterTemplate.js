import { LitElement, html, css } from "lit";

export default class MvFilterTemplate extends LitElement {
  static get properties() {
    return {
      field: { type: Object, attribute: false },
      value: { type: Object, attribute: false },
      no_label: { type: Boolean, attribute: "no-label"},
    };
  }

  static get styles() {
    return css``;
  }

  constructor() {
    super();
    this.field = {};
    this.value = {};
    this.no_label = false;
  }

  render = () => html`
    <div class="filter">
      ${!this.no_label ? html`<label>${this.field.label}</label>` : null}
      ${this.renderInput()}
    </div>
  `;

  updateValue = (value) => {
    this.dispatchEvent(
      new CustomEvent("update-value", {
        detail: { value },
        bubbles: true,
        composed: true,
      })
    );
  };
}
