import { LitElement, html, css } from "lit-element";

import { getSchema, getPeople } from "./mock_data/api.js";

import "mv-pagination";
import "mv-button";
import "mv-toast";
import "./mv-table.js";

export class MvTableDemo extends LitElement {
  static get properties() {
    return {
      page: { type: Number, reflect: true, attribute: false },
      message: { type: String, reflect: true, attribute: false },
      hue: { type: Number, attribute: false, reflect: false },
      saturation: { type: Number, attribute: false, reflect: false },
      lightness: { type: Number, attribute: false, reflect: false }
    };
  }

  static get styles() {
    return css`
	  :host {
	    font-family: var(--font-family, Arial);
		font-size: var(--font-size-m, 10pt);
		line-height: var(--line-height-s, 1.625);
      }

      pre {
        margin: 0;
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

      .toasts {
        display: flex;
        justify-content: space-between;        
      }

      .toasts mv-toast {
        padding: 10px;
      }
      
      .slidecontainer {
        width: 500px;
      }
      
      .slider {
        -webkit-appearance: none;
        width: 100%;
        height: 15px;
        border-radius: 5px;
        background: #d3d3d3;
        outline: none;
        opacity: 0.7;
        -webkit-transition: .2s;
        transition: opacity .2s;
      }
      
      .slider:hover {
        opacity: 1;
      }
      
      .slider::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 25px;
        height: 25px;
        border-radius: 50%;
        background: #4CAF50;
        cursor: pointer;
      }
      
      .slider::-moz-range-thumb {
        width: 25px;
        height: 25px;
        border-radius: 50%;
        background: #4CAF50;
        cursor: pointer;
      }
	`;
  }

  constructor() {
    super();
    this.limit = 10;
    this.page = 1;
    this.pages = 0;
    this.columns = [];
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
    this.message = "";

    const actionColumnStyles = {
      container: `
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
      `,
      button: `
        --mv-button-min-width: 50px;
        --mv-button-padding: 11px 15px;
      `
    };
    this.actionColumn = {
      label: "Action", // label is optional
      getActionComponent: row => html`
        <div style="${actionColumnStyles.container}">
          <mv-button
            @button-clicked="${this.handleActionButton(row, "Question")}"
            button-style="info"
            style="${actionColumnStyles.button}"
          >
            ?
          </mv-button>
          <mv-button
            @button-clicked="${this.handleActionButton(row, "Check")}"
            style="${actionColumnStyles.button}"
          >
            &check;
          </mv-button>
          <mv-button
            @button-clicked="${this.handleActionButton(row, "Cross")}"
            button-style="error"
            style="${actionColumnStyles.button}"
          >
            &cross;
          </mv-button>
        </div>
      `
    };
    this.hue = 0;
    this.saturation = 0;
    this.lightness = 100;
  }

  render() {
    const hasList = this.list && this.list.length > 0;
    const color =
        `--mv-table-body-background-color: hsl(${this.hue}, ${this.saturation}%, ${this.lightness}%);
        --mv-table-head-background-color: hsl(${this.hue}, ${this.saturation}%, ${this.lightness - 15}%);
        --mv-table-color:${this.lightness < 80 ? "#FFFFFF" : "#80828C"};
        --mv-checkbox-border-color: ${this.lightness < 80 ? "#FFFFFF" : "#4E686D"};`;
    return hasList
      ? html`
        <div class="table-demo">
          <div class="toasts">
            <mv-toast type="information" .closeable="${false}"><pre>${this
          .message}</pre></mv-toast>
            <div>
              <h3>Customize theme with HSL colors</h3>
              Hue: ${this.hue}
              <div class="slidecontainer">
                <input type="range" min="0" max="360" value="${this.hue}" class="slider" @input="${this.changeHue}">
              </div>
              Saturation: ${this.saturation}%
              <div class="slidecontainer">
                <input type="range" min="0" max="100" value="${this.saturation}" class="slider" @input="${this.changeSaturation}">
              </div>
              Lightness: ${this.lightness}%
              <div class="slidecontainer">
                <input type="range" min="0" max="100" value="${this.lightness}" class="slider" @input="${this.changeLightness}">
              </div>  
            </div>
          </div>
          <ul>
            <li><em>Names are links which open in a new window</em></li>
            <li><em>Click on a birth year to trigger a cell action</em></li>
            <li><em>Click on any other cell to trigger a row action</em></li>
          </ul>
          <mv-table
            .columns="${this.columns}"
            .rows="${this.list}"
            .action-column="${this.actionColumn}"
            @row-click="${this.handleRowClick}"
            @cell-click="${this.handleCellClick}"
            @select-row="${this.handleRowSelect}"
            with-checkbox
            selectable
            style="${color}"
          ></mv-table>
          <mv-pagination
            .page="${this.page}"
            .pages="${this.pages}"
            @change-page="${this.gotoPage}"
          ></mv-pagination>
        </div>
      `
      : html`<h1>Loading...</h1>`;
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
    const count = people.count || 0;
    this.pages = this.limit > 0 ? Math.ceil(count / this.limit) : 0;
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
      const url = rowItem.url.split("/");
      row.id = url[url.length - 2];
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

      //special case for URLs, add hrefProp and target
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
    this.message = `Row clicked: ${row.name.label}`;
  }

  handleCellClick(event) {
    const { detail } = event || {};
    const { row, column, value, originalEvent } = detail || {};
    // only show the message if the birth_year was clicked
    if (column.name === "birth_year") {
      originalEvent.stopPropagation();
      this.message = `${row.name.label} was born on ${value}`;
    }
    if (column.name === "name") {
      // don't fire row action when name link is clicked
      originalEvent.stopPropagation();
    }
  }

  handleActionButton(row, action) {
    return () => {
      this.message = `${action} button clicked on ${row.name.label}'s row`;
    };
  }

  handleRowSelect(event) {
    const { detail: { row, selected, removed, added, originalEvent } } = event;
    originalEvent.stopPropagation();
    this.message = `Selected rows:\n ${JSON.stringify(selected, null, 2)}`;
  }

  changeHue = event => {
    this.hue = event.currentTarget.value;
  };

  changeSaturation = event => {
    this.saturation = event.currentTarget.value;
  };

  changeLightness = event => {
    this.lightness = event.currentTarget.value;
  };
}

customElements.define("mv-table-demo", MvTableDemo);
