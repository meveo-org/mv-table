import {
  LitElement,
  html,
  css
} from "https://cdn.jsdelivr.net/gh/manaty/mv-dependencies@master/web_modules/lit-element.js";

import "./cell_types/mv-date.js";
import "./cell_types/mv-text.js";
import "./cell_types/mv-url.js";

const CELL_TYPES = ({ rowData, column }) => {
  const { name, hrefProp, target } = column;
  const value = rowData[name];
  return {
    DATE: html`<mv-date .value="${value}" />`,
    TEXT: html`<mv-text .value="${value}" />`,
    URL: hrefProp
      ? html`
      <mv-url
      .href="${rowData[hrefProp]}"
      .label="${value}"
      .target="${target}" />
      `
      : html`
      <mv-url .href="${value}" .label="${value}" .target="${target}" />
      `
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
      tableData: { type: Array, attribute: true },
      totalCount: { type: Number, attribute: true },
      limit: { type: Number, attribute: true },
      offset: { type: Number, attribute: true }
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
      }
      
      td {
        border: var(--table-cell-border, 1px solid black);
        height: var(--table-cell-height, 60px);
        padding: var(--table-cell-padding, 0 10px);
      }
		`;
  }

  render() {
    return html`
      <table>
        <thead>
          <tr>
          ${this.columns.map(column => html`<td>${column.title}</td>`)}
          </tr>
        </thead>
        <tbody>
          ${this.tableData.map(
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
    `;
  }
}

customElements.define("mv-table", MvTable);
