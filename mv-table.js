import { LitElement, html, css } from "lit-element";
import "mv-checkbox";
import "mv-font-awesome";
import "./cell_types/mv-array-cell.js";
import "./cell_types/mv-boolean-cell.js";
import "./cell_types/mv-date-cell.js";
import "./cell_types/mv-entity-cell.js";
import "./cell_types/mv-text-cell.js";
import "./cell_types/mv-url-cell.js";
import "./cell_types/mv-image-cell.js";

const CELL_TYPES = (props) => {
  const { row, column, datePattern } = props;
  const { name, target } = column;
  const value = row[name];
  const { href, alt, label, title, content } = value || {};
  return {
    ARRAY: html`<mv-array-cell .value="${value || []}"></mv-array-cell>`,
    BOOLEAN: html`<mv-boolean-cell .value="${value}"></mv-boolean-cell>`,
    DATE: html`
      <mv-date-cell
        .value="${value}"
        .datePattern="${datePattern}"
      ></mv-date-cell>
    `,
    ENTITY: html`<mv-entity-cell .value="${value}"></mv-entity-cell>`,
    IMAGE: html`
      <mv-image-cell
        .href="${href}"
        .alt="${alt}"
        .title="${title}"
        .content="${content}"
      ></mv-image-cell>
    `,
    STRING: html`<mv-text-cell .value="${value || ""}"></mv-text-cell>`,
    TEXT: html`<mv-text-cell .value="${value || ""}"></mv-text-cell>`,
    URL: html`
      <mv-url-cell
        .href="${href}"
        .label="${label}"
        .target="${target}"
      ></mv-url-cell>
    `,
  };
};

const SELECT_ALL = { id: "all", value: "all" };

const getCellComponent = (props) => {
  const {
    column: { type },
  } = props;
  return CELL_TYPES(props)[type] || CELL_TYPES(props)["TEXT"];
};

export class MvTable extends LitElement {
  static get properties() {
    return {
      rows: { type: Array, attribute: false },
      columns: { type: Array },
      selectable: { type: Boolean },
      selectOne: { type: Boolean, attribute: "select-one" },
      withCheckbox: { type: Boolean, attribute: "with-checkbox" },
      checkboxColumnLabel: { type: String, attribute: "checkbox-column-label" },
      "action-column": { type: Object, attribute: false },
      "row-actions": { type: Array, attribute: false },
      selectedRows: { type: Array, attribute: false },

      //  valid theme values are: "light", "dark"
      //    default: "light"
      theme: { type: String, attribute: false },
      datePattern: { type: String, attribute: "date-pattern" },
      "sort-order": { type: Object, attribute: false },
      sortable: { type: Boolean },
    };
  }

  static get styles() {
    return css`
      :host {
        font-family: var(--font-family, Arial);
        --font-size: var(--font-size-m, 1rem);
        --table-header-font-family: var(
          --mv-table-header-font-family,
          var(--font-family, Arial)
        );
        --table-row-height: var(--mv-table-row-height, 66px);
        --table-row-cursor: var(--mv-table-row-cursor, default);

        --head-light-background: var(--mv-table-head-light-background, #f5f6fa);
        --body-light-background: var(--mv-table-body-light-background);
        --hover-light-background: var(
          --mv-table-hover-light-background,
          #ededed
        );

        --head-dark-background: var(--mv-table-head-dark-background, #23404c);
        --body-dark-background: var(--mv-table-body-dark-background, #373e48);
        --hover-dark-background: var(--mv-table-hover-dark-background, #4e686d);
        --color: var(--mv-table-color);
      }

      table {
        display: table;
        border-collapse: collapse;
        width: 100%;
      }

      thead {
        margin: auto;
        height: var(--table-row-height);
        max-height: var(--table-row-height);
        background-color: var(--head-background);
      }

      thead td {
        cursor: default;
      }

      .sortable thead td {
        cursor: pointer;
      }

      .sortable thead td:hover {
        color: var(--hover-color);
      }

      thead td .title {
        font-family: var(--table-header-font-family);
        font-size: var(--font-size);
        font-weight: 700;
        text-transform: uppercase;
        white-space: nowrap;
      }

      thead td:first-child {
        border-radius: 10px 0 0 0;
      }

      thead td:last-child {
        border-radius: 0 10px 0 0;
      }

      tbody tr {
        border-bottom: 1px solid #e9e9e9;
        cursor: var(--table-row-cursor);
        background-color: var(--body-background);
      }

      tbody tr:hover,
      tbody tr.selected {
        background-color: var(--hover-background);
      }

      tbody tr.selectable {
        cursor: pointer;
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
        overflow-x: auto;
        overflow-y: hidden;
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
        --color: #80828c;
        --hover-color: #5c5e65;
        --mv-checkbox-border-color: var(--color);
        --mv-table-url-color: var(--color);
      }

      .dark {
        --head-background: var(--head-dark-background);
        --body-background: var(--body-dark-background);
        --hover-background: var(--hover-dark-background);
        --color: #ffffff;
        --hover-color: #b3b3b3;
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
    this.selectOne = false;
    this.selectedRows = [];
    this.withCheckbox = false;
    this.checkboxColumnLabel = "";
    this.isAllSelected = false;
    this.theme = "light";
    this.datePattern = null;
    this.sortable = false;
    this["action-column"] = null;
    this["row-actions"] = [];
    this["sort-order"] = {};
  }

  sortIcon = (column) => {
    const sortOrder = this["sort-order"] || {};
    const order = sortOrder[column.name];
    if (order) {
      const isAscending = order === "ASCENDING";
      if (isAscending) {
        return html`<mv-fa icon="sort-up"></mv-fa>`;
      }
      return html`<mv-fa icon="sort-down"></mv-fa>`;
    }
    return html`<mv-fa icon="sort"></mv-fa>`;
  };

  render() {
    const withCheckbox = this.withCheckbox;
    const rowActions = !!this["row-actions"] && this["row-actions"].length > 0;
    const hasActionColumn = !!this["action-column"] || rowActions;
    const sortableClass = this.sortable ? " sortable" : "";
    const { datePattern } = this;

    return html`
      <div class="mv-table-container${sortableClass} ${this.theme}">
        <table>
          <thead>
            <tr>
              ${withCheckbox && !this.selectOne
                ? html`
                    <td @click="${this.handleCellClick()}">
                      <mv-checkbox
                        .value="${SELECT_ALL}"
                        .checked="${this.isAllSelected}"
                        @click-checkbox="${this.handleClickCheckbox}"
                        label="${this.checkboxColumnLabel}"
                      >
                      </mv-checkbox>
                    </td>
                  `
                : this.selectOne
                ? html`<td></td>`
                : html``}
              ${this.columns.map((column) =>
                this.sortable
                  ? html`
                      <td @click="${this.handleSort(column)}">
                        <span class="title">${column.title}</span>
                        <span>${this.sortIcon(column)}</span>
                      </td>
                    `
                  : html`
                      <td>
                        <span class="title">${column.title}</span>
                      </td>
                    `
              )}
              ${hasActionColumn
                ? html`
                    <td class="action-header">
                      ${this["action-column"].label}
                    </td>
                  `
                : html``}
            </tr>
          </thead>
          <tbody>
            ${this.rows.map((row) => {
              const selected = this.selectedRows.includes(row);
              const rowClass = `mv-table-row${selected ? " selected" : ""}`;
              return html`
                <tr @click="${this.handleRowClick(row)}" class="${rowClass}">
                  ${withCheckbox
                    ? html`
                        <td>
                          <mv-checkbox
                            .value="${row}"
                            .checked="${selected}"
                            @click-checkbox="${this.handleClickCheckbox}"
                          >
                          </mv-checkbox>
                        </td>
                      `
                    : html``}
                  ${this.columns.map((column) => {
                    const cellComponent = getCellComponent({
                      row,
                      column,
                      datePattern,
                    });
                    return html`
                      <td @click="${this.handleCellClick(row, column)}">
                        ${cellComponent}
                      </td>
                    `;
                  })}
                  ${hasActionColumn
                    ? html`
                        <td>
                          ${this["action-column"].getActionComponent(row, rowActions)}
                        </td>
                      `
                    : html``}
                </tr>
              `;
            })}
          </tbody>
        </table>
      </div>
    `;
  }

  attributeChangedCallback = (name, oldValue, newValue) => {
    if (name === "rows") {
      this.selectedRows = [];
      this.isAllSelected = false;
    }
    super.attributeChangedCallback(name, oldValue, newValue);
  };

  handleClickCheckbox = (event) => {
    const {
      detail: { value, checked, originalEvent },
    } = event;
    this.selectRow(value, checked, originalEvent);
  };

  handleRowClick = (row) => (originalEvent) => {
    this.dispatchEvent(
      new CustomEvent("row-click", { detail: { row, originalEvent } })
    );
    if (this.selectable || this.selectOne) {
      const isSelected = this.selectedRows.some(
        (selectedRow) => selectedRow === row
      );
      this.selectRow(row, !isSelected, originalEvent);
    }
  };

  handleCellClick = (row, column) => (originalEvent) => {
    if (!row && !column) {
      originalEvent.stopPropagation();
    } else {
      const { name } = column;
      const value = row[name];
      this.dispatchEvent(
        new CustomEvent("cell-click", {
          detail: { row, column, value, originalEvent },
        })
      );
    }
  };

  handleSort = (column) => (originalEvent) => {
    const sortOrder = this["sort-order"] || {};
    const order =
      sortOrder[column.name] === "ASCENDING" ? "DESCENDING" : "ASCENDING";
    this.dispatchEvent(
      new CustomEvent("column-sort", {
        detail: { column, order, originalEvent },
      })
    );
  };

  selectRow = (row, checked, originalEvent) => {
    let removed = [];
    let added = [];
    if (this.selectOne) {
      const isCurrentlySelected = !!this.selectedRows.find(
        (item) => item.uuid === row.uuid
      );
      removed = [...this.selectedRows];
      added = isCurrentlySelected ? [] : [row];
      this.selectedRows = isCurrentlySelected ? [] : [row];
    } else {
      const isAllSelected = this.hasAllSelected();
      if (row === SELECT_ALL) {
        if (isAllSelected) {
          removed = [...this.selectedRows];
          added = [];
          this.selectedRows = [];
          this.isAllSelected = false;
        } else {
          removed = [];
          added = this.rows.filter(
            (item) =>
              !this.selectedRows.some((selectedRow) => selectedRow === item)
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
              ...this.selectedRows.slice(index + 1),
            ];
            this.isAllSelected = false;
          }
        }
      }
    }
    this.dispatchEvent(
      new CustomEvent("select-row", {
        detail: {
          originalEvent,
          removed,
          added,
          selected: this.selectedRows,
        },
      })
    );
  };

  hasAllSelected = () => {
    return (
      this.rows.length > 0 &&
      this.selectedRows.length > 0 &&
      this.rows.every((row) => this.selectedRows.includes(row))
    );
  };
}

customElements.define("mv-table", MvTable);
