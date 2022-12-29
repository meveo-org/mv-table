import { html, css } from "lit";
import FilterTemplate from "./MvFilterTemplate";
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
        --mv-select-font-size: 1.174vw;
        --mv-select-input-padding: 0.459vw;
        --mv-select-width: calc(100% - 1.027vw);
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
