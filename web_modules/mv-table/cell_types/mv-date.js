import {
  LitElement,
  html,
  css
} from "https://cdn.jsdelivr.net/gh/manaty/mv-dependencies@master/web_modules/lit-element.js";

export class MvDate extends LitElement {
  static get properties() {
    return {
      value: { type: String, attribute: true },
      locale: { type: String, attribute: true },
      format: { type: String, attribute: true } // recognized format values are: "date", "time", or "both"
    };
  }

  static get styles() {
    return css`
			:host {
				font-family: var(--font-family, Arial);
				font-size: var(--font-size-m, 10pt);				
      }
		`;
  }

  constructor() {
    super();
    this.locale = "en-US";
    this.format = "date";
    this.formattedDate = "";
  }

  set value(value) {
    const oldValue = this.formattedDate;
    try {
      const date = new Date(value);
      if (this.format === "time") {
        this.formattedDate = date.toLocaleTimeString(this.locale);
      } else if (this.format === "both") {
        this.formattedDate = date.toLocaleString(this.locale);
      } else {
        this.formattedDate = date.toLocaleDateString(this.locale);
      }
    } catch (error) {
      /* eslint-disable no-console */
      console.log("=".repeat(80));
      console.error(`Error encountered while parsing date: ${error}`);
      console.log("=".repeat(80));
      /* eslint-enable */
    }
    this.requestUpdate("value", oldValue);
  }

  get value() {
    return this.formattedDate;
  }

  render() {
    return html`
      <td>${this.value}</td>
    `;
  }
}

customElements.define("mv-date", MvDate);
