import {
  LitElement,
  html,
  css
} from "https://cdn.jsdelivr.net/gh/manaty/mv-dependencies@master/web_modules/lit-element.js";

export class MvCheckbox extends LitElement {
  static get properties() {
    return {
      value: { type: Object, attribute: true },
      checked: { type: Boolean, attribute: true },
      label: { type: String, attribute: true },
      // label-position is either "before" or "after", default: "after"
      "label-position": { type: String, attribute: true }
    };
  }

  static get styles() {
    return css`
			:host {
				font-family: var(--font-family, Arial);
				font-size: var(--font-size-m, 10pt);				
      }

      label {
        display: flex;
        flex-direction: row;
        justify-items: center;
      }

      input[type="checkbox"] {
        height: var(--mv-checkbox-dimension, 16px);
        width: var(--mv-checkbox-dimension, 16px);
      }
		`;
  }

  constructor() {
    super();
    this.label = "";
    this.checked = false;
    this["label-position"] = "after";
  }

  render() {
    const { checked, label, handleClick } = this;
    return html`
    <label>
      ${this["label-position"] === "before" ? label : ""}      
      ${checked
        ? html`<input type="checkbox" @click="${handleClick}" checked/>`
        : html`<input type="checkbox" @click="${handleClick}"/>`}      
      ${this["label-position"] === "after" ? label : ""}
    </label>
    `;
  }

  handleClick(originalEvent) {
    originalEvent.stopPropagation();
    const { value, checked } = this;
    this.dispatchEvent(
      new CustomEvent("click-checkbox", {
        detail: { value, checked: !checked, originalEvent }
      })
    );
  }
}

customElements.define("mv-checkbox", MvCheckbox);
