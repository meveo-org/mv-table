import { LitElement, html, css } from "lit";
import "@meveo-org/mv-checkbox";
import "@meveo-org/mv-font-awesome";
import "@meveo-org/mv-progress-bar";
import "./cell_types/mv-array-cell.js";
import "./cell_types/mv-boolean-cell.js";
import "./cell_types/mv-date-cell.js";
import "./cell_types/mv-entity-cell.js";
import "./cell_types/mv-text-cell.js";
import "./cell_types/mv-url-cell.js";
import "./cell_types/mv-image-cell.js";
import "./cell_types/mv-list-cell.js";

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
    LIST: html`<mv-list-cell
      .value="${value}"
      .options="${column.options}"
    ></mv-list-cell>`,
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
      "selected-rows": { type: Array, attribute: false },

      //  valid theme values are: "light", "dark"
      //    default: "light"
      theme: { type: String, attribute: false },
      datePattern: { type: String, attribute: "date-pattern" },
      "sort-order": { type: Object, attribute: false },
      sortable: { type: Boolean },
      dataIsLoading: { type: Boolean },
    };
  }

  static get styles() {
    return css`
      :host {
        font-family: var(--font-family, Arial);
        --font-size: var(--font-size-m, 1rem);
        --font-size-s: 12px;
        --font-size-m: 13px;
        --table-header-font-family: var(
          --mv-table-header-font-family,
          var('OpenSans')
        );
        --table-row-cursor: var(--mv-table-row-cursor, default);

        --head-light-background: var(--mv-table-head-light-background, #f5f6fa);
        --body-light-background: var(--mv-table-body-light-background);
        --hover-light-background: var(
          --mv-table-hover-light-background,
          #ededed
        );

        --head-lightV2-background: var(--mv-table-head-lightV2-background, #328cc0);
        --body-lightV2-background: var(--mv-table-body-lightV2-background, #dedede);
        --hover-lightV2-background: var(
          --mv-table-hover-lightV2-background,
          #ededed
        );


        --head-dark-background: var(--mv-table-head-dark-background, #23404c);
        --body-dark-background: var(--mv-table-body-dark-background, #373e48);
        --hover-dark-background: var(--mv-table-hover-dark-background, #4e686d);
        --color: var(--mv-table-color);
      }

      table {
        display: table;
        border-collapse: var(--border-colapse);
        width: 100%;
        /* Espace blanc entre chaque ligne*/
        border-spacing: var(--border-spacing);
        background-color: var(--transparent-background);
        position: var(--table-position);
      }

      thead>tr:not(#filter){
        margin: auto;
        height: var(--table-head-height);
        max-height: var(--table-head-height);
        background-color: var(--head-background);
        border-spacing: var(--no-border-spacing);
        // 9 because filters contains mv-select with z-index: 10.
        z-index: 9;
      }
      
      thead td {
        cursor: default;
        color: var(--color);
      }

      .sortable thead td {
        cursor: pointer;
      }

      .sortable thead td:hover:not(.action-header) {
        color: var(--hover-color);
      }

      thead td .title {
        font-family: var(--table-header-font-family);
        font-size: var(--font-size-s);
        font-weight: 700;
        text-transform: uppercase;
        white-space: nowrap;
      }

       thead td:first-child {
        border-radius: var(--head-first-child-radius);
      }
      thead td:last-child {
        border-radius: var(--head-last-child-radius);
      }

      td:first-child {
        border-radius: var(--body-td-first-child-radius);
      }

      td:last-child {
        border-radius: var(--body-td-last-child-radius);
      }

      tbody tr {
        border-bottom: 1px solid #e9e9e9;
        cursor: var(--table-row-cursor);
        background-color: var(--body-background);
        z-index: 8;
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
        height: var(--table-lightV2-row-height);
        max-height: var(--table-lightV2-row-height);
        color: var(--td-color);
        white-space: normal;
        word-wrap: var(--word-wrap);
        border: var(--mv-table-body-td-border);
        border-style: var(--mv-table-body-td-border-style);
      }

      .action-header {
        text-align: center;
      }

      .mv-table-container {
        width: 100%;
        max-height: 80%;
        overflow-x: auto;
        overflow-y: var(--mv-table-overflow-y);
        
      }

      .numeric {
        text-align: right;
      }

      mv-checkbox {
        --mv-checkbox-label-width: 15px;
        margin: auto;
      }

      .light {
        --head-background: var(--head-light-background);
        --body-background: var(--body-light-background);
        --hover-background: var(--hover-light-background);
        --color: #80828c;
        --td-color: #6C6C6C // Couleur proposée par contrast-finder.tanaguru.com avec constrat de 3.9 #9e9e9e;
        --hover-color: #5c5e65;
        --mv-checkbox-border-color: var(--color);
        --mv-table-url-color: var(--td-color);
        --border-colapse: collapse;
        --table-head-height: var(--mv-table-head-height, 60px);
        --table-row-height: var(--mv-table-row-height, 66px);
        --head-first-child-radius:var(--mv-table-head-classic-first-radius);
        --head-last-child-radius:var(--mv-table-head-classic-last-radius);
        --word-wrap: break-word;
        --mv-table-overflow-y: hidden;
      }

      .lightV2 {
        --head-background: var(--head-lightV2-background);
        --body-background: var(--body-lightV2-background);
        --hover-background: var(--hover-lightV2-background);
        --color: white;
        --td-color: #6C6C6C // Couleur proposée par contrast-finder.tanaguru.com avec constrat de 3.9 #9e9e9e;
        --hover-color: #5c5e65;
        --mv-checkbox-border-color: var(--color);
        --mv-table-url-color: var(--td-color);
        --border-colapse: inherit;
        --border-spacing: 0px 14px !important;
        --transparent-background: transparent;
        --table-head-height: var(--mv-table-lightV2-head-height, 60px);
        --table-row-height: var(--lightV2-row-height, 60px);
        --table-lightV2-row-height: var(--lightV2-row-height, 26px);
        --no-border-spacing: 0px 0px !important;
        --head-first-child-radius: var(--mv-table-lightV2-first-radius);
        --head-last-child-radius: var(--mv-table-lightV2-last-radius);
        --body-td-first-child-radius: var(--mv-table-lightV2-first-radius);
        --body-td-last-child-radius: var(--mv-table-lightV2-last-radius);
        --word-wrap: anywhere;
        --mv-table-body-td-border: solid 1px #00000000;
        --mv-table-body-td-border-style: solid none;
        --mv-table-overflow-y: auto;
      }

      .dark {
        --head-background: var(--head-dark-background);
        --body-background: var(--body-dark-background);
        --hover-background: var(--hover-dark-background);
        --color: #ffffff;
        --td-color: #ffffff;
        --hover-color: #b3b3b3;
        --mv-checkbox-border-color: var(--color);
        --mv-table-url-color: var(--td-color);
        --border-colapse: collapse;
        --table-head-height: var(--mv-table-head-height, 60px);
        --table-row-height: var(--mv-table-row-height, 66px);
        --head-first-child-radius:var(--mv-table-head-classic-first-radius);
        --head-last-child-radius:var(--mv-table-head-classic-last-radius);
        --word-wrap: break-word;
        --mv-table-overflow-y: hidden;
      }

      .no-data {
        font-size: 24px;
        font-weight: bold;
        text-align: center;
        color: var(--warning-color);
        padding-top: 15px;
        padding-bottom: 15px;
      }

      tr.is-loading {
        height: 80px !important;
      }

      td.is-loading {
        height: 80px !important;
      }

      div.progress_container {
        line-height: 40px !important;
      }

      .is-loading {
        padding-top: 15px;
        padding-bottom: 15px;
      }

      .loading {
        display: block;
        text-align: center;
        font-weight: 500;
        color: #FFFFFF;
      }

      .progressbar mv-progressbar, mv-progressbar[type="infinite"] {
        --mv-progressbar-height: 20px;
      }

      .container_progressbar {
        padding-top: 30px;
        padding-bottom: 30px;
      }

      /**
      * ? Si filtre appliqué sur la colonne (class filtered)
      */
      td.filtered {
        background-color: #8cc032 !important; 
      }
    `;
  }

  constructor() {
    super();
    this.columns = [];
    this.rows = [];
    this.selectable = false;
    this.selectOne = false;
    this.withCheckbox = false;
    this.checkboxColumnLabel = "";
    this.isAllSelected = false;
    this.theme = "light";
    this.datePattern = null;
    this.sortable = false;
    this["selected-rows"] = [];
    this["action-column"] = null;
    this["row-actions"] = [];
    this["sort-order"] = {};
    this.dataIsLoading = true;
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
    const rowActions = this["row-actions"];
    const hasRowActions = rowActions && rowActions.length > 0;
    const hasActionColumn = !!this["action-column"] || hasRowActions;
    const sortableClass = this.sortable ? " sortable" : "";
    const { datePattern } = this;
    const isAllSelected = this.hasAllSelected();

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
                        ?checked="${isAllSelected}"
                        @click-checkbox="${this.handleClickCheckbox(
                          isAllSelected
                        )}"
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
          ${this.dataIsLoading==true && this.rows.length==0 ? html`
          <tr>
            <td colspan="100" class="container_progressbar">
                  <div class="progressbar">
                <mv-progressbar
                  animated
                  striped
                  value=100
                >
                <span class="loading">Please wait<span class="dotdotdot"></span></span>
              </mv-progressbar></div>            </td></tr>
            ` :null }

            ${this.rows.length==0 && !this.dataIsLoading ?  
              html`
              <tr>
                <td colspan="100" class="no-data"> No data to show</td>
              </tr>
              `
              : null}
            ${this.rows.map((row) => {
              const selected = this.isSelected(row);
              const rowClass = `mv-table-row${selected ? " selected" : ""}`;
              return html`
                <tr @click="${this.handleRowClick(row)}" class="${rowClass}">
                  ${withCheckbox
                    ? html`
                        <td>
                          <mv-checkbox
                            .value="${row}"
                            ?checked="${selected}"
                            @click-checkbox="${this.handleClickCheckbox(
                              selected
                            )}"
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
                          ${this["action-column"].getActionComponent(
                            row,
                            rowActions
                          )}
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

  isSelected = (row) =>
    this["selected-rows"].some((selectedRow) => selectedRow.uuid === row.uuid);

  handleClickCheckbox = (checked) => (event) => {
    const {
      detail: { value, originalEvent },
    } = event;
    this.selectRow(value, !checked, originalEvent);
  };

  handleRowClick = (row) => (originalEvent) => {
    this.dispatchEvent(
      new CustomEvent("row-click", { detail: { row, originalEvent } })
    );
    if (this.selectable || this.selectOne) {
      this.selectRow(row, !this.isSelected(row), originalEvent);
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
      const isCurrentlySelected = this.isSelected(row);
      removed = [...this["selected-rows"]];
      added = isCurrentlySelected ? [] : [row];
      this["selected-rows"] = isCurrentlySelected ? [] : [row];
    } else {
      if (row === SELECT_ALL) {
        const isAllSelected = this.hasAllSelected();
        if (isAllSelected) {
          removed = [...this.rows];
          added = [];
          this["selected-rows"] = [
            ...this["selected-rows"].filter(
              (selectedRow) =>
                !this.rows.some((item) => item.uuid === selectedRow.uuid)
            ),
          ];
        } else {
          removed = [];
          added = this.rows.filter((item) => !this.isSelected(item));
          this["selected-rows"] = [...this.rows];
        }
      } else {
        if (checked) {
          removed = [];
          added = [row];
          const isExists = this.isSelected(row);
          this["selected-rows"] = isExists
            ? this["selected-rows"]
            : [...this["selected-rows"], row];
        } else {
          const index = this["selected-rows"].findIndex(
            (item) => item.uuid === row.uuid
          );
          if (index > -1) {
            removed = [this["selected-rows"][index]];
            added = [];
            this["selected-rows"] = [
              ...this["selected-rows"].slice(0, index),
              ...this["selected-rows"].slice(index + 1),
            ];
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
          selected: this["selected-rows"],
        },
      })
    );
  };

  hasAllSelected = () => {
    return (
      this.rows.length > 0 &&
      this["selected-rows"].length > 0 &&
      this.rows.every((row) => this.isSelected(row))
    );
  };
}

customElements.define("mv-table", MvTable);
