import {
  LitElement,
  html,
  css
} from "https://cdn.jsdelivr.net/gh/manaty/mv-dependencies@master/web_modules/lit-element.js";

import { getSchema, getPeople } from "./mock_data/api.js";

import "./web_modules/mv-table/mv-table.js";
import "./web_modules/mv-table/components/mv-pagination.js";

export class MvTableDemo extends LitElement {
  static get properties() {
    return {
      list: { type: Object, reflect: true, attribute: false },
      page: { type: Number, reflect: true, attribute: false }
    };
  }

  static get styles() {
    return css`
			:host {
				font-family: var(--font-family, Arial);
				font-size: var(--font-size-m, 10pt);
				line-height: var(--line-height-s, 1.625);
      }
      
      .table-demo {
        display: flex;
        flex-direction: column;
        width: calc(100% - 60px);
        margin: 0 auto;
      }

      .page-buttons {
        font-size: var(--page-button-font-size, 16px);
      }
		`;
  }

  constructor() {
    super();
    this.limit = 10;
    this.page = 1;
    this.pages = 0;
    this.columns = {};
    this.columnOrder = [
      "name",
      "gender",
      "hair_color",
      "eye_color",
      "birth_year",
      "films",
      "created"
    ];
    this.list = [];
  }

  render() {
    return (
      this.list &&
      this.list.length > 0 &&
      html`
      <div class="table-demo">
        <ul>
        <li><em>Names are links which open in a new window</em></li>
        <li><em>Click on a birth year to trigger a cell action</em></li>
        <li><em>Click on any other cell to trigger a row action</em></li>
        </ul>
        <mv-table
          .columns="${this.columns}"
          .list="${this.list}"
          @row-click="${this.handleRowClick}"
          @cell-click="${this.handleCellClick}"
        > </mv-table>
        <mv-pagination
          .page="${this.page}"
          .pages="${this.pages}"
          .count="${this.count}"
          @change-page="${this.gotoPage}"            
        >
          <span slot="first-button" class="page-buttons">&laquo;</span>
          <span slot="previous-button" class="page-buttons">&lsaquo;</span>
          <span slot="next-button" class="page-buttons">&rsaquo;</span>
          <span slot="last-button" class="page-buttons">&raquo;</span>
        </mv-pagination>
      </div>
    `
    );
  }

  connectedCallback() {
    const schema = getSchema();
    this.columns = this.parseColumns(schema.properties);
    this.loadData(1);
    super.connectedCallback();
  }

  loadData(page) {
    this.page = page < 1 ? 1 : page;
    this.offset = (this.page - 1) * this.limit;
    const people = getPeople(this.offset, this.limit);
    this.count = people.count;
    this.pages = this.limit > 0 ? Math.ceil(this.count / this.limit) : 0;
    this.list = this.buildList(people.results);
  }

  buildList(results) {
    const tableData = (results || []).reduce((list, rowItem) => {
      const row = Object.keys(rowItem).reduce((data, key) => {
        const column =
          this.columns.find(columnItem => columnItem.name === key) || {};
        const item = rowItem[key];

        // special case for URL, add href
        data[key] = column.hrefProp
          ? { label: item, href: rowItem[column.hrefProp] }
          : item;
        return data;
      }, {});
      list.push(row);
      return list;
    }, []);
    return tableData;
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
      const isName = key === "name";

      //special case for name (make the name a clickable link)
      const type = isName ? "URL" : this.parseType(column);
      const result = {
        name: key,
        title: this.createColumnTitle(key),
        tooltip: description,
        type
      };
      if (result.type === "URL") {
        result.hrefProp = isName ? "url" : key;
        result.target = isName ? "_blank" : "_self";
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

  gotoPage(event) {
    const { detail = {} } = event || {};
    if (detail.page > 0) {
      this.loadData(event.detail.page);
    }
  }

  handleRowClick(event) {
    const { detail } = event || {};
    const { row, originalEvent } = detail || {};
    originalEvent.stopPropagation();
    alert(`Row clicked: ${row.name.label}`);
  }

  handleCellClick(event) {
    const { detail } = event || {};
    const { row, column, value, originalEvent } = detail || {};
    // only show an alert if the birth_year was clicked
    if (column.name === "birth_year") {
      originalEvent.stopPropagation();
      alert(`${row.name.label} was born on ${value}`);
    }
  }
}

customElements.define("mv-table-demo", MvTableDemo);
