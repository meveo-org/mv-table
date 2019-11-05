import {
  LitElement,
  html,
  css
} from "https://cdn.jsdelivr.net/gh/manaty/mv-dependencies@master/web_modules/lit-element.js";

import "./mv-button.js";

export class MvPagination extends LitElement {
  static get properties() {
    return {
      page: { type: Number, reflect: true, attribute: true },
      pages: { type: Number, attribute: true },
      totalCount: { type: Number, attribute: true },
      "max-buttons": { type: Number, attribute: true },
      type: { type: String, attribute: true } // recognized type values are: ""
    };
  }

  static get styles() {
    return css`
			:host {
				font-family: var(--font-family, Arial);
				font-size: var(--font-size-m, 10pt);				
      }
      
      .mv-pagination-container {
        margin-top: var(--pagination-group-top-margin, 10px);
        display: flex;
        flex-direction: row;
      }

      .mv-pagination-container.left {
        justify-content: flex-start;
      }

      .mv-pagination-container.center {
        justify-content: center;
      }

      .mv-pagination-container.right {
        justify-content: flex-end;
      }
      
      .pagination-group {
        display: flex;
        align-items: center;
        justify-content: space-evenly;        
      }

      .page-buttons {
        font-size: var(--page-button-font-size, 16px);
      }      
		`;
  }

  constructor() {
    super();
    this.page = 1;
    this.pages = 0;
    this["max-buttons"] = 5;
  }

  render() {
    return html`
      <div class="mv-pagination-container">
        <div class="mv-pagination-group">
          <mv-button
            @button-clicked="${this.gotoPage(1)}"
            ?disabled="${this.isFirstPage}"
          >
            <slot name="first-button"> </slot>
          </mv-button>
          <mv-button
            @button-clicked="${this.gotoPage(this.page - 1)}"
            ?disabled="${this.isFirstPage}"
          >
            <slot name="previous-button"> </slot>
          </mv-button>

          <mv-button
            @button-clicked="${this.gotoPage(1)}"
            ?disabled="${this.isFirstPage}"
          >
            <span class="page-buttons">1</span>
          </mv-button>

          <mv-button
            @button-clicked="${this.gotoPage(this.pages)}"
            ?disabled="${this.isLastPage}"
          >
            <span class="page-buttons">${this.pages}</span>
          </mv-button>
          
          <mv-button
            @button-clicked="${this.gotoPage(this.page + 1)}"
            ?disabled="${this.isLastPage}"
          >
            <slot name="next-button"> </slot>
          </mv-button>
          <mv-button
            @button-clicked="${this.gotoPage(this.pages)}"
            ?disabled="${this.isLastPage}"
          >
            <slot name="last-button"> </slot>
          </mv-button>
        </div>
      </div>
    `;
  }

  connectedCallback() {
    const { page, pages } = this;
    this.isFirstPage = page === 1;
    this.isLastPage = page === pages;
    super.connectedCallback();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "page") {
      const value = parseInt(newValue, 10);
      this.isFirstPage = value === 1;
      this.isLastPage = value === this.pages;
    }
    super.attributeChangedCallback(name, oldValue, newValue);
  }

  gotoPage(page) {
    return () => {
      this.dispatchEvent(new CustomEvent("change-page", { detail: { page } }));
    };
  }
}

customElements.define("mv-pagination", MvPagination);
