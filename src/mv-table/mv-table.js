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
				line-height: var(--line-height-s, 1.625);
			}
		`;
	}

	render() {
		/* eslint-disable no-console */
		console.log('='.repeat(80));
		console.log('MvTable render');
		console.log('this.columns :', this.columns);
		console.log('this.visibleColumns :', this.visibleColumns);
		console.log('this.tableData :', this.tableData);
		console.log('='.repeat(80));
		/* eslint-enable */
		return html`
      <table>
        <thead>
          <tr>
          ${this.visibleColumns.map(visibleColumn => {
				const column = this.columns[visibleColumn] || {};
				return html`
                  <td>${column.label}</td>
                `;
			})}
          </tr>
        </thead>
        <tbody>
          ${this.tableData.map(
				rowData => html`
            <tr>
            ${this.visibleColumns.map(
				visibleColumn => html`
              <td>${rowData[visibleColumn]}</td>
            `
			)}
            </tr>
          `
			)}
        </tbody>
      </table>
    `;
	}
}

customElements.define('mv-table', MvTable);
