import { LitElement, html, css } from "lit-element";

import "mv-checkbox";
import "./cell_types/mv-array.js";
import "./cell_types/mv-date.js";
import "./cell_types/mv-text.js";
import "./cell_types/mv-url.js";
import "./cell_types/mv-image.js";

const CELL_TYPES = props => {
  const { row, column, datePattern } = props;
  const { name, target } = column;
  const value = row[name] || {};
  return {
    ARRAY: html`<mv-array .value="${value}"></mv-array>`,
    DATE: html`<mv-date .value="${value}" .datePattern="${datePattern}"></mv-date>`,
    STRING: html`<mv-text .value="${value}"></mv-text>`,
    TEXT: html`<mv-text .value="${value}"></mv-text>`,
    URL: html`<mv-url .href="${value.href}" .label="${value.label}" .target="${target}"></mv-url>`,
    IMAGE: html`<mv-image .href="${value.href}" .alt="${value.alt}" .title="${value.title}" .content="${value.content}"></mv-image>`
  };
};

const SELECT_ALL = { id: "all", value: "all" };

const getCellComponent = props => {
  const { column: { type } } = props;
  return CELL_TYPES(props)[type] || CELL_TYPES(props)["TEXT"];
};

const getStyle = (columnsStyle, column, type) => {
  if (columnsStyle.some(columnStyle => columnStyle.name === column)) {
    return columnsStyle.find(columnStyle => columnStyle.name === column)[type]
  }
  return "";
};

export class MvTable extends LitElement {
  static get properties() {
    return {
      rows: { type: Array, attribute: false, reflect: true },
      columns: { type: Array, attribute: true },
      selectable: { type: Boolean, attribute: true },
      "with-checkbox": { type: Boolean, attribute: true },
      "checkbox-column-label": { type: String, attribute: true },
      "action-column": { type: Object, attribute: true },
      selectedRows: { type: Array, attribute: false },

      //  valid theme values are: "light", "dark"
      //    default: "light"
      theme: { type: String, attribute: false },
      datePattern: { type: String, attribute: "date-pattern", reflect: true },
      columnsStyle: { type: Array, attribute: false }
    };
  }

  static get styles() {
    return css`
      :host {
        font-family: var(--font-family, Arial);
        font-size: var(--font-size-m, 10pt);
        --table-header-font-family: var(--mv-table-header-font-family, var(--font-family, Arial));
        --table-row-height: var(--mv-table-row-height, 66px);
        --table-row-cursor: var(--mv-table-row-cursor, default);
        
        --head-light-background: var(--mv-table-head-light-background, #F5F6FA);
        --body-light-background: var(--mv-table-body-light-background);
        --hover-light-background: var(--mv-table-hover-light-background, #EDEDED);
        
        --head-dark-background: var(--mv-table-head-dark-background, #23404C);
        --body-dark-background: var(--mv-table-body-dark-background, #373E48);
        --hover-dark-background: var(--mv-table-hover-dark-background, #4E686D);
        --color: var(--mv-table-color);
      }

      table {
        display: block;
        border-collapse: collapse;
        width: 100%;
      }

      thead {
        font-family: var(--table-header-font-family);
        margin: auto;
        height: var(--table-row-height);
        max-height: var(--table-row-height);
        font-weight: 700;
        text-transform: uppercase;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        background-color: var(--head-background);
      }

      thead td {
        cursor: default;
      }

      thead td:first-child {
        border-radius: 10px 0 0 0;
      }

      thead td:last-child {
        border-radius: 0 10px 0 0;
      }

      tbody tr {
        border-bottom: 1px solid #E9E9E9;
        cursor: var(--table-row-cursor);
        background-color: var(--body-background);
      }

      tbody tr:hover, tbody tr.selected {
        background-color: var(--hover-background);
      }
      
      td {
        border-bottom: none;
        padding: 0 15px 0 15px;
        text-align: left;
        overflow: initial;
        white-space: nowrap;
        text-overflow: ellipsis;
        height: var(--table-row-height);
        max-height: var(--table-row-height);
        color: var(--color);
        white-space: normal;
        word-wrap: break-word;
      }

      .action-header {
        text-align: center;
      }

      .mv-table-container {
        width: 100%;
        overflow: auto;
      }

      .numeric {
        text-align: right;        
      }

      mv-checkbox {
        margin: auto;
      }
      
      .light {
        --head-background: var(--head-light-background);
        --body-background: var(--body-light-background);
        --hover-background: var(--hover-light-background);
        --color: #80828C;
        --mv-checkbox-border-color: var(--color);
        --mv-table-url-color: var(--color);
      }
      
      .dark {
        --head-background: var(--head-dark-background);
        --body-background: var(--body-dark-background);
        --hover-background: var(--hover-dark-background);
        --color: #FFFFFF;
        --mv-checkbox-border-color: var(--color);
        --mv-table-url-color: var(--color);
      }
    `;
  }

  constructor() {
    super();
    this.columns = [];
    this.rows = [];
    this.selectable = false;
    this.selectedRows = [];
    this["with-checkbox"] = false;
    this["checkbox-column-label"] = "";
    this["action-column"] = null;
    this.isAllSelected = false;
    this.theme = "light";
    this.datePattern = null;
    this.columnsStyle = [];
  }

  render() {
    const withCheckbox = this["with-checkbox"];
    const hasActionColumn = !!this["action-column"];
    const { datePattern } = this;

    return html`
      <div class="mv-table-container ${this.theme}">
      <table>
        <thead>
          <tr>
          ${withCheckbox
            ? html`
              <td @click="${this.handleCellClick()}">
                <mv-checkbox
                  .value="${SELECT_ALL}"
                  .checked="${this.isAllSelected}"
                  @click-checkbox="${this.handleClickCheckbox}"
                  label="${this["checkbox-column-label"]}"
                > </mv-checkbox>
              </td>`
            : html``}
          ${this.columns.map(column => html`<td style="${getStyle(this.columnsStyle, column.name, "header")}">${column.title}</td>`)}
          ${hasActionColumn
            ? html`
            <td class="action-header">
              ${this["action-column"].label}
            </td>`
            : html``}
          </tr>
        </thead>
        <tbody>
          ${this.rows.map(row => {
            const selected = this.selectedRows.includes(row);
            const rowClass = `mv-table-row${selected ? " selected" : ""}`;
            return html`
                <tr
                  @click="${this.handleRowClick(row)}"
                  class="${rowClass}"
                >
                  ${withCheckbox
                    ? html`
                      <td>
                        <mv-checkbox
                          .value="${row}"
                          .checked="${selected}"
                          @click-checkbox="${this.handleClickCheckbox}"
                        > </mv-checkbox>
                      </td>`
                    : html``}
                  ${this.columns.map(column => {
                    const cellComponent = getCellComponent({ row, column, datePattern });
                    return html`
                    <td @click="${this.handleCellClick(row, column)}" style="${getStyle(this.columnsStyle, column.name, "cell")}">
                      ${cellComponent}
                    </td>`;
                  })}
                  ${hasActionColumn
                    ? html`<td>
                        ${this["action-column"].getActionComponent(row)}
                      </td>`
                    : html``}
                </tr>
              `;
          })}
        </tbody>
      </table>
      </div>
    `;
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "rows") {
      this.selectedRows = [];
      this.isAllSelected = false;
    }
    super.attributeChangedCallback(name, oldValue, newValue);
  }

  handleClickCheckbox(event) {
    const { detail: { value, checked, originalEvent } } = event;
    this.selectRow(value, checked, originalEvent);
  }

  handleRowClick(row) {
    return originalEvent => {
      this.dispatchEvent(
        new CustomEvent("row-click", { detail: { row, originalEvent } })
      );
      if (this.selectable) {
        const isSelected = this.selectedRows.some(
          selectedRow => selectedRow === row
        );
        this.selectRow(row, !isSelected, originalEvent);
      }
    };
  }

  handleCellClick(row, column) {
    return originalEvent => {
      if (!row && !column) {
        originalEvent.stopPropagation();
      } else {
        const { name } = column;
        const value = row[name];
        this.dispatchEvent(
          new CustomEvent("cell-click", {
            detail: { row, column, value, originalEvent }
          })
        );
      }
    };
  }

  selectRow(row, checked, originalEvent) {
    const isAllSelected = this.hasAllSelected();
    let removed = [];
    let added = [];
    if (row === SELECT_ALL) {
      if (isAllSelected) {
        removed = [...this.selectedRows];
        added = [];
        this.selectedRows = [];
        this.isAllSelected = false;
      } else {
        removed = [];
        added = this.rows.filter(
          item => !this.selectedRows.some(selectedRow => selectedRow === item)
        );
        this.selectedRows = [...this.rows];
        this.isAllSelected = true;
      }
    } else {
      if (checked) {
        removed = [];
        added = [row];
        this.selectedRows = [...this.selectedRows, row];
        this.isAllSelected = this.hasAllSelected();
      } else {
        const index = this.selectedRows.indexOf(row);
        if (index > -1) {
          removed = [this.selectedRows[index]];
          added = [];
          this.selectedRows = [
            ...this.selectedRows.slice(0, index),
            ...this.selectedRows.slice(index + 1)
          ];
          this.isAllSelected = false;
        }
      }
    }
    this.dispatchEvent(
      new CustomEvent("select-row", {
        detail: {
          originalEvent,
          removed,
          added,
          selected: this.selectedRows
        }
      })
    );
  }

  hasAllSelected() {
    return (
      this.rows.length > 0 &&
      this.selectedRows.length > 0 &&
      this.rows.every(row => this.selectedRows.includes(row))
    );
  }
}

customElements.define("mv-table", MvTable);
