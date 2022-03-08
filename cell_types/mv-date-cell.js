import { LitElement, html, css } from "lit";

export class MvDateCell extends LitElement {
  static get properties() {
    return {
      value: { type: String, attribute: true },
      locale: { type: String, attribute: true },
      format: { type: String, attribute: true } , // recognized format values are: "date", "time", or "both"
      datePattern: { type: String, attribute: "date-pattern", reflect: true }
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
    this.datePattern = null;
  }

  formatDateByPattern = (pattern, value) => {
    const date = new Date(value);
    let month = date.getMonth() + 1;
    let day = date.getDate();
    const year = date.getFullYear();
    if (day < 10) {
      day = `0${day}`;
    }
    if (month < 10) {
      month = `0${month}`;
    }
    if (pattern === "mm/dd/yyyy") {
      return `${month}/${day}/${year}`;
    }
    if (pattern === "yyyy/dd/mm") {
      return `${year}/${day}/${month}`;
    }
    return `${month}/${day}/${year}`;
  };

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
    const value = this.datePattern ? this.formatDateByPattern(this.datePattern, this.value) : this.value;
    return html`
      ${value}
    `;
  }
}

customElements.define("mv-date-cell", MvDateCell);
