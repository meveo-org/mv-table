import {
  LitElement,
  html,
  css
} from "https://cdn.jsdelivr.net/gh/manaty/mv-dependencies@master/web_modules/lit-element.js";

import "./cell_types/mv-array.js";
import "./cell_types/mv-date.js";
import "./cell_types/mv-text.js";
import "./cell_types/mv-url.js";

const CELL_TYPES = props => {
  const { rowData, column } = props;
  const { name, target } = column;
  const value = rowData[name];
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
      list: { type: Array, attribute: true }
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
        font-family: var(--font-family, Arial);
        margin: auto;
        height: 66px;
        max-height: 66px;
        font-weight: 700;
        text-transform: uppercase;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        background-color: #F5F6FA;
      }

      thead td {
        color: #80828C;
        border-bottom: none;        
        text-align: left;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
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

      tbody td {
        color: #80828C;
      }

      td {
        border-bottom: none;
        padding: 0 0 0 15px;
        text-align: left;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        height: 66px;
        max-height: 66px;
      }

      .mv-table-container {
        width: 100%;
      }
		`;
  }

  render() {
    return html`
      <div class="mv-table-container">
      <table>
        <thead>
          <tr>
          ${this.columns.map(column => html`<td>${column.title}</td>`)}
          </tr>
        </thead>
        <tbody>
          ${this.list.map(
            rowData => html`
                <tr>
                  ${this.columns.map(column => {
                    const cellComponent = getCellComponent({ rowData, column });
                    return html`<td>${cellComponent}</td>`;
                  })}
                </tr>
              `
          )}
        </tbody>
      </table>
      </div>
    `;
  }
}

customElements.define("mv-table", MvTable);
