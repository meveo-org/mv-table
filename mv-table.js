import { LitElement, html, css } from "lit";
import { msg } from '@lit/localize'
import "@meveo-org/mv-checkbox";
import "@meveo-org/mv-font-awesome";
import "@meveo-org/mv-progress-bar";
import "@meveo-org/mv-button";
import "./cell_types/mv-array-cell.js";
import "./cell_types/mv-boolean-cell.js";
import "./cell_types/mv-date-cell.js";
import "./cell_types/mv-entity-cell.js";
import "./cell_types/mv-text-cell.js";
import "./cell_types/mv-url-cell.js";
import "./cell_types/mv-image-cell.js";
import "./cell_types/mv-list-cell.js";
import "./filters/MvDateFilter";
import "./filters/MvIconFilter";
import "./filters/MvListFilter";
import "./filters/MvSelectFilter";
import "./filters/MvTextFilter";
import "./filters/MvBooleanFilter";
import "./mv-table-options.js";

const SELECT_PAGE = { id: 'page', value: 'page' }
const SELECT_ALL = { id: 'all', value: 'all' }

export class MvTable extends LitElement {
  selectFilter = [{
    label: msg('Est égale à ...', {id: 'table.equalsFilter'}),
    value: ""
  }, {
    label: msg('Est different de ...', {id: 'table.differentFilter'}),
    value: "ne"
  }]

  selectFilterString = [{
    label: msg('Contient', {id: 'table.containsFilter'}),
    value: "likeCriterias"
  }]
  selectFilterNum = [{
    label: msg('Supérieur à ...', {id: 'table.moreThanFilter'}),
    value: "fromRange"
  },
  {
    label: msg('Inférieur à ...', {id: 'table.lessThanFilter'}),
    value: "toRange"
  }, 
  {
    label: msg('Entre', {id: 'table.betweenFilter'}),
    value: "inList"
  }]
  selectFilterDate = [{
    label: msg('Avant ...', {id: 'table.beforeFilter'}),
    value: "toRange"
  },
  {
    label: msg('Après ...', {id: 'table.afterFilter'}),
    value: "fromRange"
  },
  {
    label: msg('Entre', {id: 'table.betweenFilter'}),
    value: "minmaxRange"
  }]

  static get properties() {
    return {
      formFields: { type: Array, attribute: false },
      rows: { type: Array, attribute: false },
      columns: { type: Object },
      selectable: { type: Boolean },
      selectOne: { type: Boolean, attribute: "select-one" },
      withCheckbox: { type: Boolean, attribute: "with-checkbox" },
      checkboxColumnLabel: { type: String, attribute: "checkbox-column-label" },
      "action-column": { type: Object, attribute: false },
      "row-actions": { type: Array, attribute: false },
      "selected-rows": { type: Array, attribute: false },
      pagination: { type: Array },
      theme: { type: String, attribute: false },
      datePattern: { type: String, attribute: "date-pattern" },
      "sort-order": { type: Object, attribute: false },
      sortable: { type: Boolean, attribute: true },
      dataIsLoading: { type: Boolean, reflect: true },
      filterValues: { type: Object, reflect: true },
      customTypes: { type: Object },
      position: { type: String},
      isButtonVisible: { type: Boolean },
      openDateFilter: { type: Boolean },
    };
  }

  static get styles() {
    return css`
      :host {
        --calendar-font-size: 0.600vw;
        scrollbar-color: #B8C0C2 #676767;
        scrollbar-width: thin !important;
        font-family: var(--font-family, Arial);
        --font-size: var(--font-size-s, 1rem);
        --font-size-s: 0.587vw;
        --font-size-m: 0.683vw;
        --td-light-color: var(--mv-table-td-light-color);
        --light-color: var(--mv-table-light-color);
        --table-header-font-family: var(
          --mv-table-header-font-family,
          var(--font-family, Arial)
        );
        --no-border-spacing: var(--mv-table-no-border-spacing);
        --mv-input-inactive-box-shadow: var(--mv-table-input-inactive-box-shadow);
        --mv-checkbox-shadow: var(--mv-table-checkbox-shadow);
        --transparent-background: var(--mv-table-transparent-background);
        --table-row-height: var(--mv-table-row-height, 66px);
        --table-row-cursor: var(--mv-table-row-cursor, default);
        --table-td-font-size: var(--mv-table-td-font-size);
        --body-light-background: var(--mv-table-body-light-background);
        --hover-light-background: var(
          --mv-table-hover-light-background,
          #ededed
        );
        --table-light-row-height: var(--mv-table-light-row-height);
        --action-header-background: var(--mv-table-action-header-background);
        --head-dark-background: var(--mv-table-head-dark-background, #23404c);
        --body-dark-background: var(--mv-table-body-dark-background, #373e48);
        --hover-dark-background: var(--mv-table-hover-dark-background, #4e686d);
        --color: var(--mv-table-color);
        --mv-button-padding: 5px 5px;
        --input-border: var(--mv-input-border);
        --content-max-height: none;
        --mv-dropdown-content-max-height: max-content;
        --mv-dropdown-min-width: 200px;
        --mv-dropdown-content-overflow: visible;
        --mv-dropdown-light-border: none;
        --mv-dropdown-background: var(--mv-dropdown-light-background);
        --mv-input-box-padding: none;
        --font-size: 0.734vw;
        --mv-input-font-size: 0.734vw;
        --mv-table-input-box-padding: 0.073vw;
        --tr-max-height: var(--mv-table-tr-max-height, 30px);
        --mv-modal-width: auto;
        --mv-modal-content-width: auto;
      }

      .advancedFilter > mv-select {
        /* mv-select */
        --mv-select-max-height: 20px;
        --mv-select-selected-option-font-size: 10px;
        --mv-select-background-color: #328cc0;
        --mv-select-option-background: #328cc0;
        --mv-select-color: white;
        --mv-select-width: 90px;
        --mv-select-border: none;
        --mv-select-font-size: var(--font-size-s);
        --mv-select-input-padding: 1px 4px;
        --mv-select-selected-option-font-size: 8px;
      }

      *::-webkit-scrollbar {
            width: 27px;
            height: 30px;
        }
        *::-webkit-scrollbar-track {
          border-radius: 3px;
          background-color: #CECECE;
          border: 10px solid #FFFFFF;
        }
        *::-webkit-scrollbar-track:hover {
            background-color: #B8C0C2;
        }
        *::-webkit-scrollbar-track:active {
            background-color: #B8C0C2;
        }   
        *::-webkit-scrollbar-thumb {
            border-radius: 16px;
            background-color: #676767;
            border: 10px solid #FFFFFF;
        }
        *::-webkit-scrollbar-thumb:hover {
            background-color: #328cc0
        }
        *::-webkit-scrollbar-thumb:active {
            background-color: #328cc0
        }
        .action-header {
          background-color: var(--action-header-background);
          padding-left: 0px;
        }
        .action-header>span:hover {
          color: var(--hover-color);
        }
        .active {
          color: #C0328C;
        }
        .advancedFilter {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: space-around;
          max-height: 18px;
        }
        
        .advancedFilter > * {
          margin: 4px;
        }
        .advancedFilter mv-input {
          border: var(--input-border);
          --mv-input-min-width: 80px;
          width: 90px;
          --mv-input-max-width: 90px;
        }
        .button_container {
          text-align: end;
        }
        .cell_container {
          display: flex;
          align-items: center;
          overflow: hidden;
          font-size: var(--table-td-font-size);
        }
        .cell_container>table-actions {
          margin: auto;
          width: 100%;
        }
        .cell_container {
          overflow: visible;
        }
        .checkbox {
          width: 5px;
        }
        .container_progressbar {
          padding-top: 30px;
          padding-bottom: 30px;
        }
        .dark {
          --head-background: var(--head-dark-background);
          --body-background: var(--body-dark-background);
          --hover-background: var(--hover-dark-background);
          --color: var(--dark-color, #ffffff);
          --hover-color: #b3b3b3;
          --mv-checkbox-border-color: var(--color);
          --mv-table-url-color: var(--td-color);
          --border-colapse: collapse;
          --table-head-height: var(--mv-table-head-height, 60px);
          --table-row-height: var(--mv-table-row-height, 66px);
          --head-first-child-radius:var(--mv-table-head-classic-first-radius);
          --body-td-first-child-radius: var(--mv-table-head-classic-first-radius);
          --head-last-child-radius:var(--mv-table-head-classic-last-radius);
          --word-wrap: break-word;
          --table-overflow-y: hidden;
        }
        .header_menu {
          text-transform: none;
          font-weight: normal;
          font-size: 10px;
          padding-left: 10px !important;
          padding-right: 10px !important;
        }
        .header_menu > div {
          width: 8.437vw;
        }
        .is-loading {
          padding-top: 1.101vw;
          padding-bottom: 1.101vw;
        }
        .light {
          --head-background: var(--head-light-background);
          --body-background: var(--body-light-background);
          --hover-background: var(--hover-light-background);
          --mv-input-box-padding: var(--mv-table-input-box-padding);
          --border-spacing: var(--mv-table-border-spacing);
          --color: var(--light-color, #80828c);
          --td-color: var(--td-light-color)
          --hover-color: #5c5e65;
          --mv-checkbox-border-color: var(--color);
          --mv-table-url-color: var(--td-color);
          --border-colapse: var(--mv-table-border-colapse, collapse)
          --table-head-height: var(--mv-table-head-height, 60px);
          --table-row-height: var(--mv-table-row-height, 66px);
          --head-first-child-radius: var(--mv-table-head-light-first-radius);
          --head-last-child-radius: var(--mv-table-head-light-last-radius);
          --body-td-first-child-radius: var(--mv-table-head-light-first-radius);
          --body-td-last-child-radius: var(--mv-table-head-light-last-radius);
          --word-wrap: var(--mv-table-word-wrap, break-word);
          --table-overflow-y: var(--mv-table-overflow-y, hidden);
        }

        .loading {
          display: block;
          text-align: center;
          font-weight: 500;
          color: #FFFFFF;
        }
        .mv-input.box {
          box-shadow: inset 1px 2px 3px rgba(0, 0, 0, 0.15);
        }
        .mv-table-container {
          width: 100%;
          height: var(--mv-table-height, 100%);
          max-height: 87%;
          overflow-x: auto;
          overflow-y: var(--table-overflow-y);
        }
        
        .no-data {
          font-size: 1.761vw;
          font-weight: bold;
          text-align: center;
          color: var(--warning-color);
          padding-top: 1.101vw;
          padding-bottom: 1.101vw;
        }
        .numeric {
          text-align: right;
        }
        .progressbar mv-progressbar, mv-progressbar[type="infinite"] {
          --mv-progressbar-height: 1.467vw;
        }
        .selected {
          color: #328cc0;
        }
        .sortable thead td {
          cursor: pointer;
        }
        .sortable thead td:hover {
          color: var(--hover-color);
        }
        .sortable thead td:hover:not(.action-header) {
          color: var(--hover-color);
        }
        .subMenu {
          position: absolute;
          left: calc(var(--mv-dropdown-min-width) + 10px);
          top: -25px;
          min-width: max-content;
          width: calc(max-content + 40px);
          color: var(--mv-dropdown-light-color, #328cc0);
          background: var(--mv-dropdown-background, #3f4753);
          border-radius: 5px;
          border: none;
          padding: 5px;
          font-size: 10px;
      }
        .subMenu div,
        .header_menu div {
          margin-bottom: 5px;
        }
        .table-container {
        max-height: 85%;
      }
        a {
          font-style: normal;
          font-weight: 400;
          font-size: 0.88vw;
          line-height: 0px;
          font-feature-settings: 'kern' off;
          color: #02657e;
          text-decoration: none;
          margin-left: 2.201vw;
        }
        div.progress_container {
          line-height: 40px !important;
        }
        hr {
          background-color: white;
          border: 0px;
          border-color: white;
          width: 95%;
          height: 0.073vw;
        }
        mv-dropdown {
          font-size: 0.734vw;
        }
        span>mv-fa:hover {
          cursor: pointer;
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
        table thead #table_header {
          position: -webkit-sticky;
          position: sticky;
          top: 0;
          z-index: 9;
          height: var(--table-light-row-height)
        }
        tbody {
          overflow-y: scroll;
          position: relative;
          top: -14px;
        }

        tbody tr {
          border-bottom: 0.073vw solid #e9e9e9;
          cursor: var(--table-row-cursor);
          z-index: 8;
        }

        tbody tr.selected {
          background-color: var(--hover-background);
        }
        tbody tr.selectable {
          cursor: pointer;
        }

        tbody > tr:hover > td {
          z-index: 10;
          background-color: var(--hover-background);
        }

        tbody tr:hover > td:first-child {
          background-color: var(--hover-background);
          border-radius: var(--body-td-first-child-radius);
        }
        tbody tr:hover > td:last-child {
          background-color: var(--hover-background);
          border-radius: var(--body-td-last-child-radius);
        }

        td {
          border-bottom: none;
          padding: 0 15px 0 15px;
          text-align: left;
          overflow: initial;
          white-space: nowrap;
          text-overflow: ellipsis;
          height: var(--table-light-row-height);
          max-height: var(--table-light-row-height);
          color: var(--td-light-color);
          white-space: normal;
          word-wrap: var(--word-wrap);
          border: var(--mv-table-body-td-border);
          border-style: var(--mv-table-body-td-border-style);
          background-color: var(--body-background);
        }

        .filtered {
          border-radius: 14px;
          background-color: #317297 !important;
          height: var(--table-row-height);
          padding: 0 8px 0 8px;
        }

        .display-middle {
          display: inline-flex;
          align-items: center;
          height: 100%;
        }

        td:first-child {
          border-radius: var(--body-td-first-child-radius);
        }
        td:last-child {
          border-radius: var(--body-td-last-child-radius);
        }
        td.td-filters {
          vertical-align: top;
        }
        td.is-loading {
          height: 80px !important;
        }
        thead {
          margin: auto;
          height: var(--table-row-height);
          max-height: var(--table-row-height);
          background-color: transparent;
          position: relative;
          top: -14px;
        }
        thead>tr:not(#filter){
        margin: auto;
        max-height: var(--table-head-height);
        background-color: transparent;
        border-spacing: var(--no-border-spacing);
        // 9 because filters contains mv-select with z-index: 10.
        z-index: 9;
      }
        thead td {
          cursor: default;
          color: var(--color);
          background-color: var(--head-background);
        }
        thead td .title {
          font-family: var(--table-header-font-family);
          font-size: var(--font-size-m);
          font-weight: 700;
          text-transform: uppercase;
          white-space: nowrap;
          display: flex;
          align-items: center;
          vertical-align: middle;
          height: 30px;
        }
        thead td:first-child {
          border-radius: var(--head-first-child-radius);
        }
        thead td:last-child {
          border-radius: var(--head-last-child-radius);
        }
        tr {
          max-height: var(--tr-max-height);
          height: 26px;
          // 8 because, need to pass under thead, and thead have 9 in z-index
          z-index: 8;
        }
        tr.is-loading {
          height: 80px !important;
        }

        ul {
          padding: 0 10px;
        }
        
        .locked {
          --mv-checkbox-checked-content: '🔒'
        }

        span.dropdown-trigger {
          float: right;
        }
    `;
  }

  constructor() {
    super();
    this.pagination = {};
    this.formFields = [];
    this.pages = 1;
    this.filterValues = {};
    this.filterType = "";
    this.filterValue = "";
    this.columns = [];
    this.rows = [];
    this.selectable = false;
    this.selectOne = false;
    this.withCheckbox = false;
    this.checkboxColumnLabel = "";
    this.isAllSelected = false;
    this.selectionOption = "";
    this.theme = "light";
    this.datePattern = null;
    this.sortable = false;
    this["selected-rows"] = [];
    this["action-column"] = null;
    this["row-actions"] = [];
    this["sort-order"] = {};
    this.dataIsLoading = true;
    this.selection = { 
      selectedRows: [],
      selectAll: false,
      filters: {}
    };
    this.hasActiveFilter = false;
    // Values : top or bottom. Other ignored. Default top
    this.position = "top";
    this.isButtonVisible = true;
    this.openDateFilter = false;
    this.filterTarget = "";
  }

  getCellComponent (props) {
    const {
      column: { type, name, render},
      row,
    } = props;

    if (render) {
      return render(props)
    }

    return this.CELL_TYPES(props)[type] || this.CELL_TYPES(props)["TEXT"]
  }

  CELL_TYPES (props) {
    const { row, column, datePattern } = props;
    const { name, target } = column;
    const value = row[name];
    const { href, alt, label, title, content } = value || {};
    let customCell;
    if(this.customTypes){
      customCell = this.customTypes(props)
    }

    const defaultCellTypes = {
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

    customCell ? defaultCellTypes[column.code] = customCell : null
    if(column.render) {
      defaultCellTypes[column.code] = customCell
    } else {
      defaultCellTypes;
    }
    return defaultCellTypes;
  }

  openCloseModal = () => {
    this.openDateFilter = !this.openDateFilter;
  }

  render() {
    const withCheckbox = this.withCheckbox;
    const rowActions = this["row-actions"];
    const hasRowActions = rowActions && rowActions.length > 0;
    const hasActionColumn = !!this["action-column"] || hasRowActions;
    const sortableClass = this.sortable ? " sortable" : "";
    const { datePattern } = this;
    const displayColumns = this.columns.filter(col => col.displayed !== false);
    this.isPageSelected = this.hasPageSelected();
    this.isAllSelected = this.hasAllSelected();
    return html`
      <div id="mv-table-container" class="mv-table-container${sortableClass} ${this.theme}">
        <table>
          <thead>
            <tr id="table_header">
              ${withCheckbox && !this.selectOne
                ? html`
                  <td>
                    <mv-dropdown
                      container
                      justify="left"
                      position="bottom"
                      theme="${this.theme}"
                    >
                      <mv-dropdown trigger>
                          <mv-checkbox
                            .theme="${this.theme}"
                            ?checked="${this.selectionOption == "page" || this.selectionOption == "all"}"
                            @click-checkbox="${this.handleOptionCheckbox}"
                            label="${this.checkboxColumnLabel}"
                          >
                          </mv-checkbox>
                      </mv-dropdown>
                      <mv-dropdown header theme="${this.theme}">Selection</mv-dropdown>
                        <mv-dropdown content theme="${this.theme}">
                          <ul>
                          <mv-checkbox
                            .value="${SELECT_PAGE}"
                            .theme="${this.theme}"
                            ?checked="${this.selectionOption == "page"}"
                            @click-checkbox="${this.handleClickCheckbox(
                              this.isPageSelected
                            )}"
                            label="${"Page"}"
                          >
                          </mv-checkbox>
                          <mv-checkbox
                            .value="${SELECT_ALL}"
                            .theme="${this.theme}"
                            ?checked="${this.selectionOption == "all"}"
                            @click-checkbox="${this.handleClickCheckbox(
                              this.isAllSelected
                            )}"
                            label="${"All"}"
                          >
                          </mv-checkbox>
                          </ul>
                        </mv-dropdown>  
                    </mv-dropdown>
                  </td>
                  `
                : this.selectOne
                ? html`<td></td>`
                : html``}
              ${displayColumns.map((column) =>
                column.disabled ? null : 
                this.sortable
                  ? html`
                    <td>
                      <div class="title ${this.filterValues.hasOwnProperty(column.name) && this.hasActiveFilter ? 'filtered' : '' }">
                        <div class="${this.filterValues.hasOwnProperty(column.name) && this.hasActiveFilter ? 'display-middle' : '' }" style="width: calc(100% - 1.467vw)">${column.label}</div>
                        ${column.filter ? html`
                        <span class="dropdown-trigger ${this.filterValues.hasOwnProperty(column.name) && this.hasActiveFilter ? 'display-middle' : '' }">
                        <mv-dropdown
                          container
                            justify="right"
                            position="bottom"
                            theme="${this.theme}"
                          >
                          <mv-dropdown trigger>
                            <span @click="${(e) => this.filterTarget = column.name}" style="font-size: 1.321vw;">&#9662;</span>
                          </mv-dropdown>
                          <mv-dropdown content theme="${this.theme}" style="overflow: visible !important">
                            <ul class="header_menu" style="padding-left: 0.734vw; padding-right: 0.734vw">
                            <div @click="${this.handleSort(column, "asc")}"><mv-fa icon="sort-alpha-down" ></mv-fa>${msg("Tri croissant", {id: 'table.sortAZ'})}</div>
                            <div @click="${this.handleSort(column, "desc")}"><mv-fa icon="sort-alpha-up-alt"></mv-fa>${msg("Tri decroissant", {id: 'table.sortZA'})}</div>
                            <div>${this.renderFilterItem(column)}</div>
                              <mv-dropdown
                                container
                                justify="left"
                                position="bottom"
                                theme="${this.theme}"
                              >
                                <mv-dropdown trigger>
                                  <mv-fa icon="filter"></mv-fa>${msg("Advanced filters", {id: 'popup.advancedFilters'})}<mv-fa icon="angle-right"></mv-fa>
                                </mv-dropdown>
                                <mv-dropdown content theme="${this.theme}">
                                  <div class="subMenu" >
                                    <div>${msg("Advanced filters", {id: 'popup.advancedFilters'})}</div> 
                                    <div>
                                      ${this.renderAdvancedFilter(column)}
                                    </div>
                                    <div class="button_container">
                                      <mv-button
                                        type="default" style="--mv-button-custom-color: #4f4f7a;" theme="${this.theme}"
                                        @button-clicked="${this.applyFilters}"
                                      >OK</mv-button>
                                      <mv-button
                                        type="default" style="--mv-button-custom-color: #4f4f7a;" theme="${this.theme}"
                                        @button-clicked="${this.clearFilters}"
                                      >Annuler</mv-button>
                                    </div>
                                  </div>
                                </mv-dropdown>
                              </mv-dropdown>
                              <hr/> 
                              <div class="button_container">
                                <mv-button
                                  type="default" style="--mv-button-custom-color: #4f4f7a;" theme="${this.theme}"
                                  @button-clicked="${this.applyFilters}"
                                >Appliquer</mv-button>
                              </div>
                            </ul>
                          </mv-dropdown>  
                        </mv-dropdown>
                      </span>
                    `: null }
                    </div>
                  </td>
                  `
                  : this.sortable ? html`
                      <td @click="${this.handleSort(column)}">
                        <span class="title">${column.label}</span>
                        <span>${this.sortIcon(column)}</span>
                      </td>
                    `
                  : html`
                      <td>
                        <span class="title">${column.label}</span>
                      </td>
                    `

              )}
              ${hasActionColumn
                ? html`
                    <td class="action-header">
                      <slot name="columnPicker"></slot>
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
              </mv-progressbar></div></td></tr>
            ` :null }
            ${this.rows.length==0 && !this.dataIsLoading ?  
              html`
              <tr>
                <td colspan="100" class="no-data"> No data to show</td>
              </tr>
              `
              : null}
            ${this.rows.map((row) => {
              const selected = this.selection.selectAll ? true : this.isSelectVisible(row);
              const rowClass = `mv-table-row${selected ? " selected" : ""}`;
              return html`
                <tr @click="${this.theme=="light" ? null : this.handleRowClick(row)}" class="${rowClass} ${this.selectionOption=="all" ? "disabled" : ""}">
                  ${withCheckbox
                    ? html`
                        <td>
                          <mv-checkbox class="${this.selectionOption=="all" ? "locked" : ""}"
                            .value="${row}"
                            .theme="${this.selectionOption=="all" ? "" : this.theme}"
                            ?checked="${selected}"
                            ?disabled="${this.selectionOption=="all"}"
                            @click-checkbox="${this.handleClickCheckbox(
                              selected
                            )}"
                          >
                          </mv-checkbox>
                        </td>
                      `
                    : html``}
                  ${displayColumns.map((column) => {
                    const cellComponent = this.getCellComponent({
                      row,
                      column,
                      datePattern,
                    });
                    return html`
                      <td @click="${this.handleCellClick(row, column)}">
                      <div class="cell_container">
                        ${cellComponent}
                        </div>
                      </td>
                    `;
                  })}
                  ${hasActionColumn
                    ? html`
                        <td>
                        <div class="cell_container">
                          ${this["action-column"].getActionComponent(
                            row,
                            rowActions
                          )}
                          </div>
                        </td>
                      `
                    : html``}
                </tr>
              `;
            })}
          </tbody>
        </table>
      </div>`
  }

  applyFilters = () => {
    this.filterValues.length > 0 ? this.hasActiveFilter = true : this.hasActiveFilter = false;
    this.dispatchEvent(
      new CustomEvent("apply-filters", {
        detail: { filters: this.filterValues },
        bubbles: true,
        composed: true,
      })
    );
  };

  clearFilters = () => {  
    this.filterValues = {}
    this.dispatchEvent(
      new CustomEvent("clear-filters", {
        detail: { filters: (this.filterValues = {}) },
        bubbles: true,
        composed: true,
      })
    );
    this.applyFilters();
  }

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

  handleClickCheckbox = (checked) => (event) => {
    const {
      detail: { value, originalEvent },
    } = event;
    this.selectRow(value, !checked, originalEvent);
  };

  handleOptionCheckbox = (event) => {
    if (this.selectionOption == "") {
      event.target.shadowRoot.querySelector("input").checked = false;
    } else {
      event.target.shadowRoot.querySelector("input").checked = true;
    }
  }

  handleRowClick = (row) => (originalEvent) => {
    if(!this.selection.selectAll){
      this.dispatchEvent(
        new CustomEvent("row-click", { detail: { row, originalEvent } })
      );
      if (this.selectable || this.selectOne) {
        this.selectRow(row, !this.isSelected(row), originalEvent);
      }
    }
  };

  handleSelectOption = (event) => {
    const { detail: { option }, } = event;
    this.filterType = option.value;
    let objKey = ''
    Object.entries(this.filterValues).forEach(([key]) => key.includes(this.filterTarget) ? objKey = key : objKey = null);
    if(objKey != null){
      let temp = this.filterValues[objKey];
      delete this.filterValues[objKey]
      let column = objKey.split(" ")[1]
      let concatOperatorAndField = option.value + " "+ column
      this.filterValues[concatOperatorAndField] = temp
    }
  }

  handleSort = (column, direction) => (originalEvent) => {
    const sortOrder = this["sort-order"] || {};
    const order = direction == "desc" ? "DESCENDING" : "ASCENDING";
    this.dispatchEvent(
      new CustomEvent("column-sort", {
        detail: { column, order, originalEvent },
      })
    );
  };

  hasAllSelected = () => {
    return (
      this.rows.length > 0 &&
      this.selection.selectAll == true
    );
  }

  isSelectVisible = (row) =>  
  this["selected-rows"].includes(row)

  isSelected = (row) =>
      this["selected-rows"].some((selectedRow) => selectedRow.uuid === row.uuid);
  
  renderAdvancedFilter = (column) => {
    var selectFilterValues;
    column.type == "STRING" || "URL" ? selectFilterValues = [...this.selectFilter, ...this.selectFilterString] : selectFilterValues = [...this.selectFilter, ...this.selectFilterNum];
    return html`
    <div id="${column.name}" class="advancedFilter">
      <mv-select
        .theme="${this.theme}"
        .value="${selectFilterValues[0] || ""}"
        .options="${selectFilterValues}"
        @select-option="${this.handleSelectOption}"
        no-clear-button
        no-transparency
      ></mv-select>
      ${this.renderFilterItem(column, "advanced")}
    </div>`
  } 
  
  renderFilterItem = (column, type="simple") => {
    const value = this.filterValues.hasOwnProperty[column?.name] != undefined ? 
      this.filterValues.hasOwnProperty[column?.name] : 
      "";
    if (column?.filter) {
      switch (column.type) {
        case "BOOLEAN":
          return html`
            <boolean-filter
              no-label
              .field="${column}"
              .value="${value}"
              @update-value="${this.updateValue(column, type)}"
            ></boolean-filter>
          `;
        case "DATE":
          const { start, end } = value || {};
          return html`
          <span @click="${this.openCloseModal}">
          <mv-fa icon="calendar-check"></mv-fa> ${msg("Date selection", {id: 'table.chooseDate'})}
          </span>
            <mv-modal
              ?open="${this.openDateFilter}"
              @close-modal="${this.openCloseModal}"
            >
              <div slot="header">
                <div style="text-align: center">Selectionnez la période</div>
              </div>
                <date-filter slot="body"
                  no-label
                  .field="${column}"
                  start="${start || ""}"
                  end="${end || ""}"
                  @update-value="${this.updateValue(column, type)}"
                ></date-filter>
            </mv-modal>
          `;
        case "LIST":
          return html`
            <list-filter
              no-label
              .field="${column}"
              .value="${value}"
              @update-value="${this.updateValue(column, type)}"
            ></list-filter>
          `;
        case "BINARY":
        case "CHILD_ENTITY":
        case "DOUBLE":
        case "EMBEDDED_ENTITY":
        case "ENTITY":
        case "EXPRESSION":
        case "LONG":
        case "LONG_TEXT":
        case "SECRET":
        case "STRING":
        case "URL":
        case "TEXT_AREA":
          return html`
            <text-filter
              no-label
              .field="${column}"
              .value="${value}"
              @update-value="${this.updateValue(column, type)}"
            ></text-filter>  
          `;
        default:
          console.error("Unsupported field: ", column);
          return html` ${!this.filtersInTable ? html`
          <div>
            <div>Filter: ${column.code}</div>
            <div>Filter Type: ${column.fieldType}</div>
            <div>Storage Type: ${column.storageType}</div>
          </div>`
        : null}`
      }
    }
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
      if (row === SELECT_PAGE) {
        this.selectionOption = "page";
        const isPageSelected = this.hasPageSelected();
        if (isPageSelected) {
          this.selectionOption = ""
          removed = [...this.rows];
          added = [];
          this["selected-rows"] = [
            ...this["selected-rows"].filter(
              (selectedRow) =>
                !this.rows.some((item) => item.id === selectedRow.id)
            ),
          ];
          this.selection.selectAll = false
          this.selection.selectedRows = []
          this.selection.filters = {}
          this.selectionOption = "";
        } else {
          removed = [];
          added = this.rows.filter((item) => !this.isSelected(item));
          this["selected-rows"] = [...this.rows];
          this.selection.selectAll = false
          this.selection.selectedRows = this["selected-rows"]
          this.selection.filters = this.filterValues
        }
      } else {
        if (row === SELECT_ALL) {
          this.selectionOption = "all";
          const isAllSelected = this.hasAllSelected();
          if (isAllSelected) {
            this["selected-rows"] = [];
            this.selection.selectAll = false;
            this.selection.selectedRows = [];
            this.selection.filters = {};
            this.selectionOption = "";
          } else {
            this["selected-rows"] = [];
            this.selection.selectAll = true;
            this.selection.selectedRows = [];
            this.selection.filters = this.filterValues;
          }
      } else {
        if (checked) {
          removed = [];
          added = [row];
          const isExists = this.isSelectVisible(row);
          this["selected-rows"] = isExists
            ? this["selected-rows"]
            : [...this["selected-rows"], row];
            this.selection.selectAll = false
            this.selection.selectedRows = this["selected-rows"]
            this.selection.filters = this.filterValues
        } else {
          let identifier
          this.formFields[0].fields.forEach((elt) => 
            elt.identifier ? identifier = elt.code : null
          )
          const index = this["selected-rows"].findIndex(
            (item) => item[identifier] === row[identifier]
          );
          if (index > -1) {
            removed = [this["selected-rows"][index]];
            added = [];
            this.selection.selectAll = false
            this.selection.selectedRows = []
            this.selection.filters = {}
            this["selected-rows"] = [
              ...this["selected-rows"].slice(0, index),
              ...this["selected-rows"].slice(index + 1),
            ];
            this.selection.selectedRows = this["selected-rows"]
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
          selected: this.selection,
        }
      })
    );
  };
}

  hasPageSelected = () => {
    return (
      this.rows.length > 0 &&
      this["selected-rows"].length > 0 &&
      this.rows.every((row) => this.isSelected(row))
    );
  };

  hasAllSelected = () => {
    return (
      this.rows.length > 0 &&
      this.selection.selectAll == true
    );
  }

  sortIcon = (column) => {
    // Get the `sort-order` property of the current element, or an empty object if it is not defined
    const sortOrder = this["sort-order"] || {};
    // Get the sort order for the specified `column`
    const order = sortOrder[column.name];
    // If the sort order is not defined, return a sort icon
    if (!order) return html`<mv-fa icon="sort"></mv-fa>`;
    // If the sort order is "ASCENDING", return an ascending sort icon, otherwise return a descending sort icon
    return order === "ASCENDING" ?
      html`<mv-fa icon="sort-up"></mv-fa>` :
      html`<mv-fa icon="sort-down"></mv-fa>`;
  };

  updateValue = (field, simpleOrAdvanced="simple") => (event) => {
    const code = field.name;
    const {
      detail: { value },
    } = event;
    Object.entries(this.filterValues).forEach(([key, value]) => value=="" || key.includes(code) ? delete this.filterValues[key] : null )
      let operatorAndField = simpleOrAdvanced != "advanced" ? "eq "+code : (this.filterType || "eq")+" "+code
      if (this.filterValues.hasOwnProperty(operatorAndField)) {
        value != '' ? this.filterValues[operatorAndField] = value : delete this.filterValues[operatorAndField]
      } else {
        const filter = { [operatorAndField]: value}
        this.filterValues = {
          ...this.filterValues,
          ...filter,
      };
    }
    Object.entries(this.filterValues).forEach(([key, value]) => value=="" ? delete this.filterValues[key] : null )
  };
}
customElements.define("mv-table", MvTable);