import { LitElement, html, css } from "lit";
import "@meveo-org/mv-button";
import "@meveo-org/mv-select";
import "@meveo-org/mv-button";
import "@meveo-org/mv-checkbox";
import "@meveo-org/mv-font-awesome";

import { msg } from '@lit/localize';

const ROWS_PER_PAGE = [
  { label: '10', value: 10 },
  { label: '20', value: 20 },
  { label: '50', value: 50 },
  { label: '100', value: 100 },
]

export class MvTableOptions extends LitElement {
  static get properties() {
    return {
      //  valid theme values are: "light", "dark"
      // default : "light"
      theme: { type: String, attribute: true },
      columns: { type: Object, reflect: true },
      displayed: { type: Boolean },
      isButtonVisible: { type: Boolean}
    };
  }

  static get styles() {
    return css`
      :host {
        font-family: var(--font-family, Arial);
        font-size: var(--font-size-m, 0.954vw);
        --light-background: var(--mv-pagination-light-background, #eaebf0);
        --dark-background: var(--mv-pagination-dark-background, #3999c1);
        position: sticky;
        top: 0px;
        z-index: 20;
        --mv-button-font-size: 1.027vw;
      }

      ul {
        padding-inline-start: 0.734vw !important;
      }
      
      .container {
        display: flex;
        justify-content: space-evenly;
        height: 6.603vw;
        max-height: 10.734vw;
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
        margin: 0 0.367vw;
      }

      .choose-columns {
        display: flex;
        justify-content: space-between;
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
        --mv-button-min-width: 2.054vw;
        --mv-button-padding: 0.734vw;
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
    this.theme = "light";
    this.columns = {};
    this.displayed = true;
    this.maxButtons = 5;
    this.isButtonVisible = true;
  }
  
  selectColumn = (group, item) => (event) => {
    item.displayed = event.detail.checked;
    this.dispatchEvent(
      new CustomEvent('changeColumnsDiplayed', {
        detail: { group, item, ...event.detail },
        bubbles: true,
        composed: true
      }),
    )
  }

  /**
  * ? Fonctions pour le choix des colonnes à afficher
  */

  renderFieldGroup = () => {
    return html`
      <mv-dropdown content theme=${this.theme}>
        <ul>
          ${this.columns.map((item) => this.renderColumnItem(item))}
        </ul>
      </mv-dropdown>
    `
  }

  renderColumnItem = (item) => {
    const { title, displayed=true } = item;
    return html`
      <li style="list-style-type: none">
        <mv-checkbox
          .theme="${this.theme}"
          .checked="${displayed}"
          @click-checkbox="${this.selectColumn(null, item)}"
          label="${title}"
        ></mv-checkbox>
      </li> 
    `
  }

  /**
  * ? Fonctions pour le choix du nombre de lignes affichées
  */

  renderRowsPerPage = () => html`
    <div class="rows-per-page">
      <span>${ msg("Show", {id: 'listContent.show'}) } </span>
      <mv-select
        .value="${this.selectedRowsPerPage}"
        .options="${ROWS_PER_PAGE}"
        @select-option="${this.changeRowsPerPage}"
        no-clear-button
      ></mv-select>
      <span> rows</span>
    </div>
  `
        
  changeRowsPerPage = (event) => {
    const {
      detail: { option },
    } = event;
    this.selectedRowsPerPage = option;
    this.rowsPerPage = option.value;
    this.dispatchEvent(
      new CustomEvent('changeRowsPerPage', {
        detail: { option, value: this.rowsPerPage },
        bubbles: true,
        composed: true
      }),
    )
  }

  /**
  * ? Fonctions pour la pagination
  */

  gotoPage = (event) => {
    this.dispatchEvent(
      new CustomEvent('change-page', {
        detail: { event },
        bubbles: true,
        composed: true
      }),
    )
  }

  render() {
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
                <span slot="tooltip-content">${ msg('Show or hide columns', {id: 'listContent.showOrHide'}) }</span>
              </mv-tooltip>
            </mv-dropdown>
            ${this.renderFieldGroup(null)}
          </mv-dropdown>

        </div>
        <div class="pagination ${this.theme}">
          <slot name="pagination">
          </slot>
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
