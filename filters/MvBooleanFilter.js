import { html, css } from "lit";
import FilterTemplate from "./MvFilterTemplate";
import "@meveo-org/mv-select";

const BOOLEAN_OPTIONS = [
  { value: true, label: "True" },
  { value: false, label: "False" },
];

export default class MvBooleanFilter extends FilterTemplate {
  static get styles() {
    return css`
      mv-select {
        --mv-select-font-size: 1.174vw;
        --mv-select-input-padding: 0.459vw;
        --mv-select-width: calc(100% - 1.027vw);
      }
    `;
  }

  renderInput = () => {
    const option = BOOLEAN_OPTIONS.find((item) => item.value === this.value);
    return html`
      <mv-select
        .value="${option}"
        .options="${BOOLEAN_OPTIONS}"
        @select-option="${this.selectOption}"
        has-empty-option
      ></mv-select>
    `;
  };

  selectOption = (event) => {
    const {
      detail: { option },
    } = event;
    this.updateValue(option.value);
  };
}

customElements.define("boolean-filter", MvBooleanFilter);
