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
      "date-time": { type: Boolean, attribute: true },
      "date-only": { type: Boolean, attribute: true },
      "time-only": { type: Boolean, attribute: true }
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
    this["date-only"] = true;
    this["time-only"] = false;
    this["date-time"] = false;
    this.formattedDate = "";
  }

  set value(value) {
    const oldValue = this.formattedDate;
    try {
      const date = new Date(value);
      if (this["time-only"]) {
        this.formattedDate = date.toLocaleTimeString(this.locale);
      } else if (this["date-time"]) {
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
