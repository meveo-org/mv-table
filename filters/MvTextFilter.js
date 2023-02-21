import { html, css } from "lit";
import { msg } from '@lit/localize';
import FilterTemplate from "./MvFilterTemplate";
import "@meveo-org/mv-radio";


export default class MvTextFilter extends FilterTemplate {
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

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener('clear-filters', this.clearFilters);
  
  }

  renderInput = () => html`
    <mv-input
      name="${this.field.code}"
      value="${this.value}"
      @input-change="${this.inputChange}"
    ></mv-input>
  `;

  inputChange = (event) => {
    const {
      detail: { value },
    } = event;
    this.updateValue(value);
  };

  clearFilters = (event) => {
    this.updateValue("")
  }

  handleRadioClicked = (event) => {
    const {
      detail: { value },
    } = event
    console.log(event)
    console.log( this.field.code + " et value : " + value)
  }

}

customElements.define("text-filter", MvTextFilter);
