import { LitElement, html, css } from "lit-element";

import "mv-checkbox";
import "./cell_types/mv-array.js";
import "./cell_types/mv-date.js";
import "./cell_types/mv-text.js";
import "./cell_types/mv-url.js";

const CELL_TYPES = props => {
  const { row, column } = props;
  const { name, target } = column;
  const value = row[name];
  return {
    ARRAY: html`<mv-array .value="${value}"></mv-array>`,
    DATE: html`<mv-date .value="${value}"></mv-date>`,
    TEXT: html`<mv-text .value="${value}"></mv-text>`,
    URL: html`<mv-url .href="${value.href}" .label="${value.label}" .target="${target}"></mv-url>`
  };
};

const SELECT_ALL = { id: "all", value: "all" };

const getCellComponent = props => {
  const { column: { type } } = props;
  return CELL_TYPES(props)[type] || CELL_TYPES(props)["TEXT"];
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
      selectedRows: { type: Array, attribute: false }
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
      }

      table {
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
        background-color: #F5F6FA;
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
      }

      tbody tr:hover, tbody tr.selected {
        background-color: #EDEDED;
      }

      td {
        color: #80828C;
        border-bottom: none;
        padding: 0 0 0 15px;
        text-align: left;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        height: var(--table-row-height);
        max-height: var(--table-row-height);
      }

      .action-header {
        text-align: center;
      }

      .mv-table-container {
        width: 100%;
      }

      .numeric {
        text-align: right;        
      }

      mv-checkbox {
        margin: auto;
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
  }

  render() {
    const withCheckbox = this["with-checkbox"];
    const hasActionColumn = !!this["action-column"];

    return html`
      <div class="mv-table-container">
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
          ${this.columns.map(column => html`<td>${column.title}</td>`)}
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
                    const cellComponent = getCellComponent({ row, column });
                    return html`
                    <td @click="${this.handleCellClick(row, column)}">
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
