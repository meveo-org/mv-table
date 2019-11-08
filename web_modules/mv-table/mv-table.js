import {
  LitElement,
  html,
  css
} from "https://cdn.jsdelivr.net/gh/manaty/mv-dependencies@master/web_modules/lit-element.js";

import "./components/cell_types/mv-array.js";
import "./components/cell_types/mv-date.js";
import "./components/cell_types/mv-text.js";
import "./components/cell_types/mv-url.js";

const CELL_TYPES = props => {
  const { row, column } = props;
  const { name, target } = column;
  const value = row[name];
  return {
    ARRAY: html`<mv-array .value="${value}"> </mv-array>`,
    DATE: html`<mv-date .value="${value}"> <mv-date>`,
    TEXT: html`<mv-text .value="${value}"> </mv-text>`,
    URL: html`<mv-url .href="${value.href}" .label="${value.label}" .target="${target}"> </mv-url>`
  };
};

const getCellComponent = props => {
  const { column: { type } } = props;
  return CELL_TYPES(props)[type] || CELL_TYPES(props)["TEXT"];
};

export class MvTable extends LitElement {
  static get properties() {
    return {
      columns: { type: Array, attribute: true },
      list: { type: Array, attribute: true },
      "action-column": { type: Object, attribute: true }
    };
  }

  static get styles() {
    return css`
			:host {
				font-family: var(--font-family, Arial);
				font-size: var(--font-size-m, 10pt);				
      }

      table {
        border-collapse: collapse;
        width: 100%;
      }

      thead {
        font-family: var(--header-font-family, Arial);
        margin: auto;
        height: var(--table-row-height, 66px);
        max-height: var(--table-row-height, 66px);
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
      }

      tbody tr:hover {
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
        height: var(--table-row-height, 66px);
        max-height: var(--table-row-height, 66px);
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
		`;
  }

  constructor() {
    super();
    this.columns = [];
    this.list = [];
    this["action-column"] = null;
  }

  render() {
    const hasActionColumn = !!this["action-column"];
    return html`
      <div class="mv-table-container">
      <table>
        <thead>
          <tr>
          ${this.columns.map(column => html`<td>${column.title}</td>`)}
          ${hasActionColumn
            ? html`<td class="action-header">${this["action-column"]
                .label}</td>`
            : html``}
          </tr>
        </thead>
        <tbody>
          ${this.list.map(
            row => html`
                <tr @click="${this.handleRowClick(row)}">
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
              `
          )}
        </tbody>
      </table>
      </div>
    `;
  }

  handleRowClick(row) {
    return originalEvent => {
      this.dispatchEvent(
        new CustomEvent("row-click", { detail: { row, originalEvent } })
      );
    };
  }

  handleCellClick(row, column) {
    return originalEvent => {
      const { name } = column;
      const value = row[name];
      this.dispatchEvent(
        new CustomEvent("cell-click", {
          detail: { row, column, value, originalEvent }
        })
      );
    };
  }
}

customElements.define("mv-table", MvTable);
