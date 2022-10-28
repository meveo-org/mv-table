import { html, css } from "lit";
import { msg } from '@lit/localize';
import FilterTemplate from "./MvFilterTemplate";
import "@meveo-org/mv-input";
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
      max-height: 150px;
      transition: max-height 2s;
    }
    `;
  }

  renderInput = () => html`
    <mv-input
      name="${this.field.code}"
      placeholder="${this.field.description}"
      value="${this.value}"
      @input-change="${this.inputChange}"
    ></mv-input>
    ${this.advanced ? html`
    <input type="checkbox" id="includes" name="includes">
      <label for="includes">${ msg("Includes", {id: 'SP.textFilter.includes'})}</label>
    <input type="checkbox" id="excludes" name="excludes">
      <label for="excludes">${ msg("Excludes", {id: 'SP.textFilter.excludes'})}</label>
    </div>
    `:null}
  `;

  inputChange = (event) => {
    const {
      detail: { value },
    } = event;
    this.updateValue(value);
  };

  handleRadioClicked = (event) => {
    const {
      detail: { value },
    } = event
    console.log(event)
    console.log( this.field.code + " et value : " + value)
  }

}

customElements.define("text-filter", MvTextFilter);
