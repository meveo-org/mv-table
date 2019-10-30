import {
	LitElement,
	html,
	css
} from 'https://cdn.jsdelivr.net/gh/manaty/mv-dependencies@master/web_modules/lit-element.js';

export class MvTable extends LitElement {
	static get properties() {
		return {
			columns: { type: Object, attribute: true },
			tableData: { type: Array, attribute: true },
			visibleColumns: { type: Array, attribute: true },
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
          ${this.visibleColumns.map(visibleColumn => {
            const column = this.columns[visibleColumn] || {};
            return html`<td>${column.title}</td>`;
          })}
          </tr>
        </thead>
        <tbody>
          ${this.tableData.map(
            rowData => html`
              <tr>
              ${this.visibleColumns.map(visibleColumn => html`<td>${rowData[visibleColumn]}</td>`)}
              </tr>
            `
          )}
        </tbody>
      </table>
    `;
	}
}

customElements.define('mv-table', MvTable);
