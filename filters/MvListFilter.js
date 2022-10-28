import { html, css } from "lit";
import FilterTemplate from "@meveo-org/mv-table/filters/MvFilterTemplate";
import "@meveo-org/mv-select";

export default class MvListFilter extends FilterTemplate {
  static get properties() {
    return {
      ...super.properties,
      options: { type: Array, attribute: false },
    };
  }

  static get styles() {
    return css`
      mv-select {
        --mv-select-font-size: 16px;
        --mv-select-input-padding: 6.25px;
        --mv-select-width: calc(100% - 14px);
      }
    `;
  }

  constructor() {
    super();
    this.options = [];
  }

  connectedCallback() {
    super.connectedCallback();
    const { listValues } = this.field;
    this.options = Object.keys(this.field.listValues || {}).map((key) => ({
      label: listValues[key],
      value: key,
    }));
  }

  renderInput = () => {
    const option = this.options.find((item) => item.value === this.value);
    return html`
      <mv-select
        .value="${option}"
        .options="${this.options}"
        @select-option="${this.updateSelectedItem}"
        has-empty-option
      ></mv-select>
    `;
  };

  updateSelectedItem = ({ detail }) => {
    const {
      option: { value },
    } = detail;
    this.updateValue(value);
  };
}

customElements.define("list-filter", MvListFilter);
