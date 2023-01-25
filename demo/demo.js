import { LitElement, html, css } from "lit";
import { ref, createRef } from "lit/directives/ref.js";

import { getPeople, people } from "../mock_data/api.js";
import schemaAsTxt from "../mock_data/schema.txt";

import "@meveo-org/mv-button";
import "@meveo-org/mv-toast";
import "@meveo-org/mv-dialog";

import "../mv-table.js";
import "../mv-pagination.js";

export class MvTableDemo extends LitElement {
  static get properties() {
    return {
      page: { type: Number, reflect: true, attribute: false },
      message: { type: String, reflect: true, attribute: false },
      theme: { type: String, attribute: false, reflect: false },
      isDialogSchemaOpen: {type: Boolean, state: true },
      isDialogDataOpen: {type: Boolean, state: true },
      columns : { type: Array, state: true, reflect: true },
      list: { type: Array, state: true },
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
        width: calc(100% - 4.402vw);
        margin: 0 auto;
      }
      
      .page-buttons {
        font-size: var(--page-button-font-size, 1.174vw);
      }

      .toasts {
        display: flex;
        justify-content: space-between;        
      }

      .toasts mv-toast {
        padding: 0.734vw;
      }
      
      fieldset > label, label > input {
        cursor: pointer;
      }
      
      fieldset {
        width: 8.804vw;
        margin-left: 0.734vw;
        border:0.147vw solid red;
        -moz-border-radius: 0.587vw;
        -webkit-border-radius: 0.587vw;	
        border-radius: 0.587vw;
        color: #818181;
        height: 3.302vw;
      }
      
      legend {
        font-weight: 500;
        color: red;
      }
    `;
  }

  schemaRef = createRef();
  dataRef = createRef();

  constructor() {
    super();
    this.data = people;
    this.columnsClass = schemaAsTxt;
    this.sortType = '';
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
    this.sortedColumn = "";
    const actionColumnStyles = {
      container: `
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
      `,
      button: `
        --mv-button-min-width: 3.668vw;
        --mv-button-padding: 0.807vw 1.101vw;
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
    this.theme = "light";
  }

  toggleDialog(modalName) {
    return () => {
      this[modalName] = !this[modalName];
    }
  }

  updateSchema() {
    this.isDialogSchemaOpen = false;
    this.columnsClass = this.schemaRef.value.value;
    this.columns = eval(this.columnsClass)
    this.loadData(1);
  }

  updateData() {
    this.isDialogDataOpen = false;

    this.data = JSON.parse(this.dataRef.value.value);
    this.loadData(1);
  }

  render() {
    const hasList = this.list && this.list.length > 0;
    const { theme } = this;
    return hasList
      ? html`
        <div class="table-demo">
          <div class="toasts">
            <mv-toast type="information" .closeable="${false}" .theme="${theme}"><pre>${this.message}</pre></mv-toast>
            <mv-button @button-clicked="${this.toggleDialog('isDialogSchemaOpen')}" button-style="info" .theme="${theme}">Edit schema</mv-button>
            <mv-button @button-clicked="${this.toggleDialog('isDialogDataOpen')}" button-style="info" .theme="${theme}">Edit data</mv-button>

            <mv-dialog
                ?open="${this.isDialogSchemaOpen}"
                closeable
                .theme="${theme}"
                header-label="Edit schema"
                @close-dialog="${this.toggleDialog('isDialogSchemaOpen')}"
                @ok-dialog="${this.updateSchema}"
              >
                <textarea
                  ${ref(this.schemaRef)}
                  style="width: 100%; height: 95%; resize: none"
                >${this.columnsClass}</textarea>
            </mv-dialog>

            <mv-dialog
              ?open="${this.isDialogDataOpen}"
              closeable
              header-label="Edit data"
              .theme="${theme}"
              @close-dialog="${this.toggleDialog('isDialogDataOpen')}"
              @ok-dialog="${this.updateData}"
            >
              <textarea
                ${ref(this.dataRef)}
                style="width: 100%; height: 95%; resize: none"
              >${JSON.stringify(people, null, 2)}</textarea>
            </mv-dialog>

            <fieldset>
              <legend>Theme</legend>
              <label><input type="radio" name="theme" value="light" checked @change="${this.changeTheme}" />Light</label>
              <label><input type="radio" name="theme" value="dark" @change="${this.changeTheme}" />Dark</label>
            </fieldset>
          </div>

          <ul>
            <li><em>Names are links which open in a new window</em></li>
            <li><em>Click on a birth year to trigger a cell action</em></li>
            <li><em>Click on any other cell to trigger a row action</em></li>
          </ul>

          <mv-table-options
            .theme="${theme}"
            .columns="${this.columns}"
            .isButtonVisible="${this.isButtonVisible}"
            @changeRowsPerPage="${this.changeRowPerPage}"
            @changeColumnsDiplayed=${this.changeColumnsDiplayed}
          >
            <mv-pagination
                slot="pagination"
                type="text"
                max-button="1"
                page="${this.page}"
                pages="${this.pages}"
                @change-page="${this.gotoPage}"
                .theme="${theme}"
              ></mv-pagination>
          </mv-table-options>

          <mv-table
            .columns="${this.columns}"
            .rows="${this.list}"
            .action-column="${this.actionColumn}"
            @row-click="${this.handleRowClick}"
            @cell-click="${this.handleCellClick}"
            @select-row="${this.handleRowSelect}"
            @column-sort="${this.sortData}"
            @change-page="${this.gotoPage}"
            @apply-filters="${this.applyFilters}"
            @clear-filters="${this.clearFilters}"
            with-checkbox
            selectable
            sortable

            .theme="${theme}"
          ></mv-table>

          <mv-pagination
            page="${this.page}"
            pages="${this.pages}"
            @change-page="${this.gotoPage}"
            .theme="${theme}"
          ></mv-pagination>
        </div>
      `
      : html`<h1>Loading...</h1>`;
  }

  connectedCallback() {
    window.html = html;
    this.columns = eval(`(${schemaAsTxt})`);
    this.loadData(1);
    super.connectedCallback();
  }

  loadData(page) {
    this.page = page < 1 ? 1 : page;
    this.offset = (this.page - 1) * this.limit;
    // sort data
    if(this.sortType != '') {
      this.data.list.sort((a, b) => a[this.sortedColumn].localeCompare(b[this.sortedColumn]))
      this.sortType == 'DESCENDING' ?
        this.data.list.reverse()
      : null
      this.sortType == '';
    }
    const people = getPeople(this.data, this.offset, this.limit, this.filters);
    const count = people.count || 0;
    if (this.offset > count) {
      this.page = 1;
    }
    this.pages = this.limit > 0 ? Math.ceil(count / this.limit) : 0;
    this.list = this.buildList(people.results);
  }

  buildList(results) {
    const tableData = (results || []).reduce((list, rowItem) => {
      const row = Object.keys(rowItem).reduce((data, key) => {
        const column = this.columns.find(columnItem => columnItem.name === key) || {};
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

  sortData(event) {
    const { detail = {} } = event || {};
    this.sortType = detail.order;
    this.sortedColumn = detail.column.name;
    this.loadData(this.page);
  }

  applyFilters(event) {
    const {
      detail: { filters },
    } = event
    this.filters = { ...filters }
    this.loadData(this.page);
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

  changeRowPerPage(event) {
    const { detail = {} } = event || {};
    this.limit = detail.value;
    this.loadData(this.page);
  }

  changeColumnsDiplayed() {
    this.columns = [ ...this.columns ]; // Trigger component update
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

  changeTheme = originalEvent => {
    const { target: { value } } = originalEvent;
    this.theme = value;
  };
}

customElements.define("mv-table-demo", MvTableDemo);
