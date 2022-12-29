import { html, css } from "lit";
import FilterTemplate from "./MvFilterTemplate";
import "@meveo-org/mv-select";

export default class MvSelectFilter extends FilterTemplate {
  static get styles() {
    return css`
    .advanced {
      display: inline-block;
      color: black;
      overflow: hidden;
    }

    .hide {
      max-height: 0px;
      transition: max-height 2s;
    }

    .show {
      max-height: 11.005vw;
      transition: max-height 2s;
    }
    `;
  }


  static get properties() {
    return {
      ...super.properties,
      field: { type: Array, attribute: false },
      options: { type: Array, attribute: false },
      filtersInTable: { type: Boolean, attribute: false, reflect: true },
    };
  }

  constructor() {
    super();
    this.field = [];
    this.options = [];
    this.filtersInTable = false;

  }

  renderInput(){
  return html`
    <mv-select
        name="${this.field.code}"
        .options="${this.options}"
        no-transparency
        is-filter
        has-empty-option
        @on-clear="${this.clear}"
        @select-option="${this.inputChange}"
    
    ></mv-select>
  `;  }

  clear = (event) => {
    this.dispatchEvent(
      new CustomEvent("on-clear", event)
    );
    event.path[0].value=this.emptyOption
  }

  inputChange = (event) => {
    const {
      detail: { option },
    } = event;
    this.updateValue(option);
  };
}

customElements.define("select-filter", MvSelectFilter);
