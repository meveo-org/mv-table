import {
  LitElement,
  html,
  css
} from "https://cdn.jsdelivr.net/gh/manaty/mv-dependencies@master/web_modules/lit-element.js";

export class MvButton extends LitElement {
  static get properties() {
    return {
      selected: { type: Boolean, attribute: true },
      disabled: { type: Boolean, attribute: true }
    };
  }

  static get styles() {
    return css`
			:host {
				font-family: var(--font-family, Arial);
				font-size: var(--font-size-m, 10pt);				
      }

      button {
        cursor: pointer;
      }

      button:disabled {
        cursor: unset;
      }
		`;
  }

  constructor() {
    super();
    this.selected = false;
    this.disabled = false;
    this.clickEvent = new CustomEvent("button-clicked");
  }

  handleClick(event) {
    event && event.stopImmediatePropagation();
    this.dispatchEvent(this.clickEvent);
  }

  render() {
    const selectedClass = this.selected ? " selected" : "";
    const buttonClass = `mv-button${selectedClass}`;
    return html`
      <button
        class="${buttonClass}"
        @click="${this.handleClick}"
        ?disabled="${this.selected || this.disabled}"
      >
        <slot> </slot>
      </button>
    `;
  }
}

customElements.define("mv-button", MvButton);
