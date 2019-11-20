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
      type: { type: String, attribute: true },
      // valid button-style values are:
      //      "gradient", "success", "error", "warning", or "info"
      // default: "success"
      "button-style": { type: String, attribute: true }
    };
  }

  static get styles() {
    return css`
			:host {
				font-family: var(--font-family, Arial);
				font-size: var(--font-size-m, 10pt);				
      }

      button {
        margin: var(--mv-button-margin, 5px);
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
        border: none;        
      }
      
      button.round:hover:not([disabled]) {
        cursor: pointer;
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
        background-color: #EAEBF0;
        color: #CACBD2;
        z-index: 100;
      }
      
      button:focus {
        outline: none;
      }

      button.default {
        border: none;
        border-radius: 5px;
        box-shadow: 0 2px 2px 0 rgba(93, 94, 97, 0.2);
        padding: var(--mv-button-padding, 16px 59px);
      }

      button.default:hover:not([disabled]) {
        cursor: pointer;        
      }

      button.default.success {
        color: #FFFFFF;
        background-color: #54CA95;
      }

      button.default.success:hover:not([disabled]) {
        background-color: #0CA361;
      }

      button.default.error {
        color: #FFFFFF;
        background-color: #DD5C55;
      }

      button.default.error:hover:not([disabled]) {
        background-color: #E71919;
      }

      button.default.info {
        color: #FFFFFF;
        background-color: #3999C1;
      }

      button.default.info:hover:not([disabled]) {
        background-color: #007FAD;
      }

		`;
  }

  constructor() {
    super();
    this.visible = true;
    this.selected = false;
    this.disabled = false;
    this.type = "default";
    this["button-style"] = "success";
  }

  handleClick(event) {
    event && event.stopImmediatePropagation();
    this.dispatchEvent(new CustomEvent("button-clicked"));
  }

  render() {
    const buttonStyle = this.type !== "round" ? ` ${this["button-style"]}` : "";
    const selectedClass = this.selected ? " selected" : "";
    const buttonClass = `${this.type}${buttonStyle}${selectedClass}`;
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
