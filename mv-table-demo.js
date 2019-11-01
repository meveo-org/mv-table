import {
  LitElement,
  html,
  css
} from "https://cdn.jsdelivr.net/gh/manaty/mv-dependencies@master/web_modules/lit-element.js";

import "./web_modules/mv-table/mv-table.js";

export class MvTableDemo extends LitElement {
  static get properties() {
    return {
      tableData: { type: Object, reflect: true, attribute: false }
    };
  }

  static get styles() {
    return css`
			:host {
				font-family: var(--font-family, Arial);
				font-size: var(--font-size-m, 10pt);
				line-height: var(--line-height-s, 1.625);
			}
		`;
  }

  constructor() {
    super();
    this.limit = 10;
    this.offset = 1;
    this.columns = {};
    this.columnOrder = [
      "name",
      "gender",
      "hair_color",
      "eye_color",
      "birth_year",
      "created"
    ];
    this.tableData = [];
  }

  render() {
    return (
      this.tableData &&
      this.tableData.length > 0 &&
      html`
      <mv-table
        .columns="${this.columns}"
        .tableData="${this.tableData}"
        .totalCount="${this.count}"
        .limit="${this.limit}"
        .offset="${this.offset}"
        @to-next-page="${this.nextPageHandler}"
        @to-previous-page="${this.previousPageHandler}"
      />
    `
    );
  }

  connectedCallback() {
    const baseUrl = "https://swapi.co/api/people";
    fetch(`${baseUrl}/schema?format=json`)
      .then(schemaResult => schemaResult.json())
      .then(schema => {
        this.columns = this.parseColumns(schema.properties);
        return fetch(
          `${baseUrl}?limit=${this.limit}&page=${this.offset}&format=json`
        );
      })
      .then(result => result.json())
      .then(data => {
        this.count = data.count;
        this.nextPageHandler = this.gotoPage(data.next);
        this.previousPageHandler = this.gotoPage(data.previous);
        this.tableData = data.results;
      })
      .catch(error => {
        /* eslint-disable no-console */
        console.error("=".repeat(80));
        console.error("MvTableDemo connectedCallback error: ", error);
        console.error("=".repeat(80));
        /* eslint-enable */
      });
    super.connectedCallback();
  }

  createColumnTitle(key) {
    return key.split("_").reduce((title, word) => {
      return `${title} ${word[0].toUpperCase()}${word.slice(1)}`;
    }, "");
  }

  parseType({ format, type }) {
    if (format) {
      switch (format) {
        case "date-time":
          return "DATE";
        case "uri":
          return "URL";
        default:
          break;
      }
    }
    return type.toUpperCase();
  }

  buildColumn(columns, key) {
    const isVisible = this.columnOrder.includes(key);
    if (isVisible) {
      const column = columns[key];
      const { description } = column;
      //special case for name (make the name a clickable link)
      const type = key === "name" ? "URL" : this.parseType(column);
      const result = {
        name: key,
        title: this.createColumnTitle(key),
        tooltip: description,
        type
      };
      if (result.type === "URL") {
        result.hrefProp = "url";
        result.target = key === "name" ? "_blank" : "_self";
      }
      return result;
    }
    return;
  }

  parseColumns(columns) {
    return this.columnOrder.reduce((columnList, key) => {
      const column = this.buildColumn(columns, key);
      if (column) {
        columnList.push(column);
      }
      return columnList;
    }, []);
  }

  gotoPage(href) {
    return event => {
      event.stopImmediatePropagation();
      if (!!href) {
        window.location.href = href;
      }
    };
  }
}

customElements.define("mv-table-demo", MvTableDemo);
