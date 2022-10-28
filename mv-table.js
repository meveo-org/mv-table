import { LitElement, html, css } from "lit";
import { msg } from '@lit/localize'
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
import "./filters/MvDateFilter";
import "./filters/MvIconFilter";
import "./filters/MvListFilter";
import "./filters/MvSelectFilter";
import "./filters/MvTextFilter";
import "./filters/MvBooleanFilter";

import { updateWhenLocaleChanges, configureLocalization } from '@lit/localize'
import { targetLocales, sourceLocale } from "./src/generated/locales/module.js";

const SELECT_PAGE = { id: 'page', value: 'page' }
const SELECT_ALL = { id: 'all', value: 'all' }

export class MvTable extends LitElement {
  selectFilter = [{
    label: msg('Est égale à ...', {id: 'table.equalsFilter'}),
    value: "="
  }, {
    label: msg('Est different de ...', {id: 'table.differentFilter'}),
    value: "!="
  }]

  selectFilterString = [{
    label: msg('Contient', {id: 'table.containsFilter'}),
    value: "contain"
  },
  {
    label: msg('Ne contient pas', {id: 'table.notContainsFilter'}),
    value: "notContain"
  }]
  selectFilterNum = [{
    label: msg('Supérieur à ...', {id: 'table.moreThanFilter'}),
    value: ">"
  },
  {
    label: msg('Inférieur à ...', {id: 'table.lessThanFilter'}),
    value: "<"
  }, 
  {
    label: msg('Entre', {id: 'table.betweenFilter'}),
    value: "between"
  }]
  selectFilterDate = [{
    label: msg('Avant ...', {id: 'table.beforeFilter'}),
    value: "before"
  },
  {
    label: msg('Après ...', {id: 'table.afterFilter'}),
    value: "after"
  },
  {
    label: msg('Entre', {id: 'table.betweenFilter'}),
    value: "between"
  }]

  static get properties() {
    return {
      formFields: { type: Array, attribute: false },
      rows: { type: Array, attribute: false },
      columns: { type: Array },
      selectable: { type: Boolean },
      selectOne: { type: Boolean, attribute: "select-one" },
      withCheckbox: { type: Boolean, attribute: "with-checkbox" },
      checkboxColumnLabel: { type: String, attribute: "checkbox-column-label" },
      "action-column": { type: Object, attribute: false },
      "row-actions": { type: Array, attribute: false },
      "selected-rows": { type: Array, attribute: false },
      pagination: { type: Array },
      //  valid theme values are: "light", "dark"
      //    default: "light"
      theme: { type: String, attribute: false },
      datePattern: { type: String, attribute: "date-pattern" },
      "sort-order": { type: Object, attribute: false },
      sortable: { type: Boolean },
      dataIsLoading: { type: Boolean },
      filterValues: { type: Array, reflect: true },
      customTypes: { type: Object },
      position: { type: String}
    };
  }

  static get styles() {
    return css`
      :host {
        font-family: var(--font-family, Arial);
        --font-size: var(--font-size-s, 1rem);
        --font-size-s: 8px;
        --font-size-m: 13px;
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

        --table-light-row-height: var(--mv-table-light-row-height)
        --head-dark-background: var(--mv-table-head-dark-background, #23404c);
        --body-dark-background: var(--mv-table-body-dark-background, #373e48);
        --hover-dark-background: var(--mv-table-hover-dark-background, #4e686d);
        --color: var(--mv-table-color);
        --mv-button-padding: 5px 5px;
        --input-border: var(--mv-input-border);
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
          text-align: center;
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
          width: 115px;
        }
        .is-loading {
          padding-top: 15px;
          padding-bottom: 15px;
        }
        .light {
          --head-background: var(--head-light-background);
          --body-background: var(--body-light-background);
          --hover-background: var(--hover-light-background);
          --mv-input-box-padding: var(--mv-table-input-box-padding);
          --border-spacing: var(--mv-table-border-spacing);
          --color: var(--light-color, #80828c);
          --td-color: var(--td-light-color) // Couleur proposée par contrast-finder.tanaguru.com avec constrat de 3.9 #9e9e9e; */
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
          height: 78%;
          max-height: 78%;
          overflow-x: auto;
          overflow-y: var(--table-overflow-y);
        }
        
        .no-data {
          font-size: 24px;
          font-weight: bold;
          text-align: center;
          color: var(--warning-color);
          padding-top: 15px;
          padding-bottom: 15px;
        }
        .numeric {
          text-align: right;
        }
        .progressbar mv-progressbar, mv-progressbar[type="infinite"] {
          --mv-progressbar-height: 20px;
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
          left: 130px;
          top: -25px;
          min-width: 210px;
          width: 100%;
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
          font-size: 12px;
          line-height: 0px;
          font-feature-settings: 'kern' off;
          color: #02657e;
          text-decoration: none;
          margin-left: 30px;
        }
        div.progress_container {
          line-height: 40px !important;
        }
        hr {
          background-color: white;
          border: 0px;
          border-color: white;
          width: 95%;
          height: 1px;
        }
        mv-dropdown {
          font-size: 10px;
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
          height: var(--table-light-row-height);
          max-height: var(--table-light-row-height);
          color: var(--td-light-color);
          white-space: normal;
          word-wrap: var(--word-wrap);
          border: var(--mv-table-body-td-border);
          border-style: var(--mv-table-body-td-border-style);
        }
        /**
        * ? Si filtre appliqué sur la colonne (class filtered)
        */
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
          background-color: var(--head-background);
        }
        thead>tr:not(#filter){
        margin: auto;
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
        thead td .title {
          font-family: var(--table-header-font-family);
          font-size: var(--font-size-m);
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
        tr {
          max-height: 26px;
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
    updateWhenLocaleChanges(this);
    this.formFields = [];
    this.pages = 1;
    this.filterValues = [];
    this.filterType = "=";
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
  }

  firstUpdated(){
    const {getLocale, setLocale} = configureLocalization({
      sourceLocale,
      targetLocales,
      loadLocale: (locale) => import(`./src/generated/locales/${locale}.js`)
    })
    let language = targetLocales.includes(navigator.language.substr(0,2)) ? navigator.language.substr(0,2) : sourceLocale
    setLocale(language);
  }

  getCellComponent (props) {
    const {
      column: { type },
    } = props;
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

    customCell ? defaultCellTypes[column.type] = customCell : null

    return defaultCellTypes;
  }

  render() {
    const withCheckbox = this.withCheckbox;
    const rowActions = this["row-actions"];
    const hasRowActions = rowActions && rowActions.length > 0;
    const hasActionColumn = !!this["action-column"] || hasRowActions;
    const sortableClass = this.sortable ? " sortable" : "";
    const { datePattern } = this;
    this.isPageSelected = this.hasPageSelected();
    this.isAllSelected = this.hasAllSelected();
    return html`
      ${this.position == "top" ?
        html`      
          <mv-table-options
            .columns="${this.columns}"
            .formFields="${this.formFields}"
            .pagination="${this.pagination}"
        ></mv-table-options>`
        : null }
      <div class="mv-table-container${sortableClass} ${this.theme}">
      ${this.selection.selectAll == true ? html`<div style="text-align: center"><span style="color: red">ATTENTION TOUTES</span> les lignes sont sélectionnées</div>` : this.selection.selectedRows.length ? html`<div style="text-align: center">${this.selection.selectedRows.length} lignes sélectionnées</div>` : null}
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
              ${this.columns.map((column) =>
                column.disabled ? null : 
                this.sortable
                  ? html`
                    <td>
                      <div class="title ${this.filterValues.find(elt => elt.hasOwnProperty(column.name)) && this.hasActiveFilter ? 'filtered' : '' }">
                        <span class="${this.filterValues.find(elt => elt.hasOwnProperty(column.name)) && this.hasActiveFilter ? 'display-middle' : '' }">${column.title}</span> 
                        <span class="dropdown-trigger ${this.filterValues.find(elt => elt.hasOwnProperty(column.name)) && this.hasActiveFilter ? 'display-middle' : '' }">
                        <mv-dropdown
                          container
                            justify="right"
                            position="bottom"
                            theme="${this.theme}"
                          >
                          <mv-dropdown trigger>
                            <mv-lnr icon="chevron-down"></mv-lnr>
                          </mv-dropdown>
                          <mv-dropdown content theme="${this.theme}" style="overflow: visible !important">
                            <ul class="header_menu" style="padding-left: 10px; padding-right: 10px">
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
                    </div>
                  </td>
                  `
                  : this.sortable ? html`
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
                  ${this.columns.map((column) => {
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
      </div>
      ${this.position == "bottom" ?
        html`      
          <mv-table-options
            .columns="${this.columns}"
            .formFields="${this.formFields}"
            .pagination="${this.pagination}"
        ></mv-table-options>`
        : null }
        `
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
    this.filterValues = []
    this.applyFilters()
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
    column.type == "STRING" ? selectFilterValues = [...this.selectFilter, ...this.selectFilterString] : selectFilterValues = [...this.selectFilter, ...this.selectFilterNum];
    return html`
    <div class="advancedFilter">
      <mv-select
        .theme="${this.theme}"
        .value="${selectFilterValues[0]}"
        .options="${selectFilterValues}"
        @select-option="${this.handleSelectOption}"
        no-clear-button
        no-transparency
      ></mv-select>
      ${this.renderFilterItem(column, "advanced")}
    </div>`
  } 
  
  renderFilterItem = (column, type) => {
    const value = this.filterValues.filter ? this.filterValues.filter[column?.code] : "";
    if (column?.filter) {
      switch (column.fieldType) {
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
            <date-filter
              no-label
              .field="${column}"
              start="${start || ""}"
              end="${end || ""}"
              @update-value="${this.updateValue(column, type)}"
            ></date-filter>
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
          const isExists = this.isSelected(row);
          this["selected-rows"] = isExists
            ? this["selected-rows"]
            : [...this["selected-rows"], row];
            this.selection.selectAll = false
            this.selection.selectedRows = this["selected-rows"]
            this.selection.filters = this.filterValues
        } else {
          const index = this["selected-rows"].findIndex(
            (item) => item.id === row.id
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
        },
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

  updateValue = (field, filterType="simple") => (event) => {
    const { code } = field;
    const {
      detail: { value },
    } = event;
    const typeF = filterType != "simple" ? this.filterType : ""
    const filter = { [code]: value, type: typeF }
    if (this.filterValues.find(elt => elt.hasOwnProperty(code))) {
      let change = this.filterValues.find(elt => elt.hasOwnProperty(code))
      value != '' ? change[code] = value : this.filterValues = this.filterValues.filter(elt => !(Object.keys(elt)).includes(code))
    } else {
    const filter = { [code]: value, type: typeF }
    this.filterValues = [
      ...this.filterValues,
      filter,
    ];
  }
  };
}
customElements.define("mv-table", MvTable);