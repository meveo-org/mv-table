import {
  LitElement,
  html,
  css
} from "https://cdn.jsdelivr.net/gh/manaty/mv-dependencies@master/web_modules/lit-element.js";

export class MvArray extends LitElement {
  static get properties() {
    return {
      value: { type: Array, attribute: true },
      scrollable: { type: Boolean, attribute: true }
    };
  }

  static get styles() {
    return css`
			:host {
				font-family: var(--font-family, Arial);
				font-size: var(--font-size-m, 10pt);				
      }
      ul {
        list-style: none;
        padding-left: 0;
      }      
		`;
  }

  constructor() {
    super();
  }

  render() {
    return (
      this.value &&
      this.value.length > 0 &&
      html`
      <td>      
        <ul>
          ${this.value.map(value => html`<li>${value}</li>`)}
        </ul>
      </td>
    `
    );
  }
}

customElements.define("mv-array", MvArray);
