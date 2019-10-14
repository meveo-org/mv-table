import {
	LitElement,
	html,
	css
} from 'https://cdn.jsdelivr.net/gh/manaty/mv-dependencies@master/web_modules/lit-element.js';

import './src/mv-table/mv-table.js';

export class MvTableDemo extends LitElement {
	static get properties() {
		return {
			tableData: { type: Object, reflect: true, attribute: false }
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

	constructor() {
		super();
		this.limit = 10;
		this.offset = 1;
		this.columns = {};
		this.visibleColumns = ['name', 'gender', 'hair_color', 'eye_color', 'birth_year', 'created', 'url'];
		this.tableData = [];
	}

	render() {
		/* eslint-disable no-console */
		console.log('='.repeat(80));
		console.log('MvTableDemo render');
		console.log('this.columns :', this.columns);
		console.log('this.tableData :', this.tableData);
		console.log('this.visibleColumns :', this.visibleColumns);
		console.log('='.repeat(80));
		/* eslint-enable */
		return html`
      <mv-table
        .columns="${this.columns}"
        .tableData="${this.tableData}"
        .visibleColumns=${this.visibleColumns}
        .totalCount="${this.count}"
        .limit="${this.limit}"
        .offset="${this.offset}"
        @to-next-page="${this.nextPageHandler}"
        @to-previous-page="${this.previousPageHandler}"
      ></mv-table>
    `;
	}

	connectedCallback() {
		fetch('https://swapi.co/api/people/schema?format=json')
			.then(schemaResult => schemaResult.json())
			.then(schema => {
				this.columns = this.parseColumns(schema.properties);
				return fetch(`https://swapi.co/api/people?limit=${this.limit}&page=${this.offset}&format=json`);
			})
			.then(result => result.json())
			.then(data => {
				this.count = data.count;
				this.nextPageHandler = this.gotoPage(data.next);
				this.previousPageHandler = this.gotoPage(data.previous);
				this.tableData = data.results;
			})
			.catch(error => {
				/* eslint-disable no-console */
				console.error('='.repeat(80));
				console.error('MvTableDemo connectedCallback error: ', error);
				console.error('='.repeat(80));
				/* eslint-enable */
			});
		super.connectedCallback();
	}

	createColumnTitle(key) {
		return key.split('_').reduce((title, word) => {
			return `${title} ${word[0].toUpperCase()}${word.slice(1)}`;
		}, '');
	}

	parseType(column) {
		if (column.format) {
			switch (column.format) {
				case 'date-time':
					return 'DATE';
				case 'uri':
					return 'URL';
				default:
					break;
			}
		}
		return column.type.toUpperCase();
	}

	parseColumns(columns) {
		return Object.keys(columns).reduce((columnsObject, key) => {
			const column = columns[key];
			column.title = this.createColumnTitle(key);
			column.type = this.parseType(column);
			delete column.format;
			columnsObject[key] = column;
			return columnsObject;
		}, {});
	}

	gotoPage(href) {
		return event => {
			event.stopImmediatePropagation();
			if (!!href) {
				window.location.href = href;
			}
		};
	}
}

customElements.define('mv-table-demo', MvTableDemo);
