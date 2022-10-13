import { LitElement, html, css } from "lit";
import "@meveo-org/mv-button";
import "@meveo-org/mv-select";
import "@meveo-org/mv-pagination";
import "@meveo-org/mv-button";
import "@meveo-org/mv-checkbox";
import { msg, str } from '@lit/localize';

const ROWS_PER_PAGE = [
  { label: '10', value: 10 },
  { label: '20', value: 20 },
  { label: '50', value: 50 },
  { label: '100', value: 100 },
]

export class MvTableOptions extends LitElement {
  static get properties() {
    return {
      //  valid theme values are: "light", "dark", "lightV2"
      //    default: "lightV2"
      theme: { type: String, attribute: true },
      fields: { type: Array },
      formFields: { type: Array, attribute: false },
      columns: { type: Array, reflect: true },
      displayed: { type: Boolean },
      pagination: { type: Array }
    };
  }

  static get styles() {
    return css`
      :host {
        font-family: var(--font-family, Arial);
        font-size: var(--font-size-m, 13px);
        --light-background: var(--mv-pagination-light-background, #eaebf0);
        --dark-background: var(--mv-pagination-dark-background, #3999c1);
        --mv-select-width: 50px;
        --mv-select-selected-option-font-size: 13px;
        position: sticky;
        top: 0px;
        z-index: 20;
      }
      
      .container {
        display: flex;
        justify-content: space-evenly;
        height: 90px;
        max-height: 110px;
        background-color: white;
      }

      .container div {
        display: flex;
        flex-basis: 33%;
        height:100%;
      }

      .rows-per-page {
        display: flex;
        align-items: center;
        flex-shrink: 2;
        flex-wrap: wrap;
      }

      .rows-per-page > mv-select {
        margin: 0 5px;
      }

      .choose-columns {
        display: flex;
        justify-content: left;
        align-items: center;
        flex-shrink: 3;
      }

      .displayed-rows {
        justify-content: right;
        flex-grow: 2;
      }


      .action-buttons {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-grow: 2;
      }

      .small-button:hover {
        --hover-color: #328cc0;
        --mv-button-color: #E6E6E6;
      }

      .small-button {
        --mv-button-min-width: 28px;
        --mv-button-padding: 10px;
        --mv-button-color: #328cc0;
        --mv-button-custom-color: #E6E6E6;
      }

      .pagination {
        justify-content: center;
        align-items: center;
      }
      `;
  }

  constructor() {
    super();
    this.rowsPerPage = ROWS_PER_PAGE[0].value
    this.selectedRowsPerPage = ROWS_PER_PAGE[0];
    this.pages = 1;
    this.currentPage = 1;
    this.theme = "lightV2";
    this.formFields = [];
    this.columns = [];
    this.displayed = true;
    this.maxButtons = 5;
  }
  
  selectColumn = (group, item) => () => {
    this.dispatchEvent(
      new CustomEvent('changeColumnsDiplayed', {
        detail: { group, item },
        bubbles: true,
        composed: true
      }),
    )
  }

  /**
  * ? Fonctions pour le choix des colonnes à afficher
  */

  renderFieldGroup = (group) => {
    const { fields, label } = group
    return html`
      <mv-dropdown header theme="light">${label}</mv-dropdown>
      <mv-dropdown content theme="light">
        <ul>
          ${fields.map((item) => this.renderFieldItem(group, item))}
        </ul>
      </mv-dropdown>
    `
  }

  renderFieldItem = (group, item) => {
    const { summary, label } = item
    return summary ? html`
      <li style="list-style-type: none">
        <mv-checkbox
          .theme="${this.theme}"
          .checked="${summary}"
          @click-checkbox="${this.selectColumn(group, item)}"
          label="${label}"
        ></mv-checkbox>
      </li> 
    ` : null
  }

  /**
  * ? Fonctions pour le choix du nombre de lignes affichées
  */

  renderRowsPerPage = () => html`
    <div class="rows-per-page">
      <span>${ msg("Show", {id: 'SP.listContent.show'}) } </span>
      <mv-select
        .value="${this.selectedRowsPerPage}"
        .options="${ROWS_PER_PAGE}"
        .theme="${this.theme}"
        @select-option="${this.changeRowsPerPage}"
        no-clear-button
      ></mv-select>
      <span> rows</span>
    </div>
  `
        
  changeRowsPerPage = (event) => {
    const {
      detail: { option },
    } = event
    this.selectedRowsPerPage = option
    this.rowsPerPage = option.value
    this.dispatchEvent(
      new CustomEvent('changeRowsPerPage', {
        detail: { option },
        bubbles: true,
        composed: true
      }),
    )
  }

  /**
  * ? Fonctions pour la pagination
  */

  gotoPage = (event) => {
    const { detail = {} } = event || {}
    this.dispatchEvent(
      new CustomEvent('change-page', {
        detail: { event },
        bubbles: true,
        composed: true
      }),
    )
  }

  render() {
    const { rowActions } = this
    return html`
      ${this.displayed ? html`
        <div class="container">
        <div class="choose-columns">
          <mv-dropdown
              container
              justify="left"
              position="bottom"
              theme="${this.theme}"
            >
            <mv-dropdown trigger>
              <mv-tooltip position="right">
                <mv-button
                  class="small-button"
                >
                  <mv-fa icon="sliders-h"></mv-fa>
                </mv-button>
                <span slot="tooltip-content">${ msg('Show or hide columns', {id: 'SP.listContent.showOrHide'}) }</span>
              </mv-tooltip>
            </mv-dropdown>
            ${this.formFields.map((group) => this.renderFieldGroup(group))}
          </mv-dropdown>
        </div>
          <div class="pagination ${this.theme}">
            <mv-pagination
              type="text"
              .page="${this.pagination[0]}"
              .pages="${this.pagination[1]}"
              .justify=${"center"}
              .max-buttons="${this.maxButtons}"
              .theme=${"lightV2"}
              @change-page="${this.gotoPage}"
            ></mv-pagination>
          </div>
          <div class="displayed-rows">
            ${this.renderRowsPerPage()}
          </div>
        </div>
      `: null}      
    `;
  }
}

customElements.define("mv-table-options", MvTableOptions);
