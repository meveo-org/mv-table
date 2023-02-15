import { LitElement, html, css } from "lit";
import "@meveo-org/mv-button";
import "@meveo-org/mv-dropdown";

import { msg } from '@lit/localize';

export class ColumnPicker extends LitElement {
    static get properties() {
        return {
          //  valid theme values are: "light", "dark"
          // default : "light"
          theme: { type: String },
          columns: { type: Object, reflect: true },
        };
      }

    static get styles() {
        return css`
          :host {
            --mv-button-circle-button-size: 1.051vw;
            --mv-button-circle-background: #328CC0;
            --mv-button-circle-color: white;
            --mv-circle-button-border: 2px solid #02657E;
            --row-height: var(--table-row-height);
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

          mv-button.circle {
            border: 2px solid #02657E;
            line-height: 0;
            font-size: 12px;
            font-weight: 600;
            color: white;
          }

          .picker_container {
            display: flex;
            align-items: center;
            background: #328CC0; 
            height: var(--row-height); 
            width: 50%; 
            border-top-right-radius: 20px; 
            border-bottom-right-radius: 20px;
          }
        `
    }

    constructor() {
        super();
        this.theme = "light";
        this.columns = {};
      }

    render() {
        return html`
          <div class="picker_container">
            <mv-dropdown
              container
              justify="right"
              position="bottom"
              theme="${this.theme}"
            >
              <mv-dropdown trigger>
                <mv-tooltip position="left">
                  <mv-button
                    class="small-button"
                    type="circle"
                  >
                    <span>...</span>
                  </mv-button>
                  <span slot="tooltip-content">${ msg('Show or hide columns', {id: 'listContent.showOrHide'}) }</span>
                </mv-tooltip>
              </mv-dropdown>
              ${this.renderFieldGroup(null)}
            </mv-dropdown>
          </div>
        `;
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

}

customElements.define("column-picker", ColumnPicker);