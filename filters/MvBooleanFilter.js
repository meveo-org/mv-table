import { html, css } from "lit";
import FilterTemplate from "@meveo-org/mv-table/filters/MvFilterTemplate";
import "@meveo-org/mv-select";

const BOOLEAN_OPTIONS = [
  { value: true, label: "True" },
  { value: false, label: "False" },
];

export default class MvBooleanFilter extends FilterTemplate {
  static get styles() {
    return css`
      mv-select {
        --mv-select-font-size: 16px;
        --mv-select-input-padding: 6.25px;
        --mv-select-width: calc(100% - 14px);
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
