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
        border: var(--table-border, 1px solid black);
        border-collapse: collapse;
        width: 100%;
      }
      
      td {
        border: var(--table-cell-border, 1px solid black);
        height: var(--table-cell-height, 60px);
        padding: var(--table-cell-padding, 0 10px);
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
