import {
  LitElement,
  html,
  css
} from "https://cdn.jsdelivr.net/gh/manaty/mv-dependencies@master/web_modules/lit-element.js";

export class MvButton extends LitElement {
  static get properties() {
    return {
      visible: { type: Boolean, attribute: true },
      selected: { type: Boolean, attribute: true },
      disabled: { type: Boolean, attribute: true },

      // valid type values are: "default", "round", or "outline"
      type: { type: String, attribute: true }
    };
  }

  static get styles() {
    return css`
			:host {
				font-family: var(--font-family, Arial);
				font-size: var(--font-size-m, 10pt);				
      }

      button.round {
        width: 55px;
        min-width: 55px;
        height: 55px;
        font-size: 16px;
        background-color: #EAEBF0;
        color: #80828C;
        border-radius: 55px;
        box-shadow: unset;
        margin: var(--mv-button-margin, 5px);
        border: none;
        cursor: pointer;
      }
      
      button.round:hover:not([disabled]) {
        background-color: #FFFFFF;
        color: #1D9BC9;
        border: 1px solid #1D9BC9;
        box-shadow: inset 0px 0px 9px 0px rgba(29, 155, 201, 0.3);
      }
      
      button.round.selected, button.round.selected:disabled {
        background-color: #008FC3;
        color: #FFFFFF;
        box-shadow: 0px 0px 10px 0px rgba(0, 143, 195, 0.6);
        z-index: 100;
      }

      button.round:disabled {
        cursor: unset;
        background-color: #EAEBF0;
        color: #CACBD2;
        z-index: 100;
      }
      
      button.round:focus {
        outline: none !important;
      }
		`;
  }

  constructor() {
    super();
    this.visible = true;
    this.selected = false;
    this.disabled = false;
    this.type = "default";
  }

  handleClick(event) {
    event && event.stopImmediatePropagation();
    this.dispatchEvent(new CustomEvent("button-clicked"));
  }

  render() {
    const selectedClass = this.selected ? " selected" : "";
    const buttonClass = `mv-button ${this.type}${selectedClass}`;
    return !!this.visible
      ? html`
          <button
            class="${buttonClass}"
            @click="${this.handleClick}"
            ?disabled="${this.disabled}"
          >
            <slot> </slot>
          </button>
        `
      : html``;
  }
}

customElements.define("mv-button", MvButton);
