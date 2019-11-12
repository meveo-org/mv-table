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

      // max-buttons must be an odd number >= 3, default 5
      "max-buttons": { type: Number, attribute: true },
      // valid justify values are: "left", "right", or "center", default "center"
      justify: { type: String, attribute: true },
      // valid type values are: "button", "text", or "none", default "button"
      type: { type: String, attribute: true }
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

      .mv-pagination-group {
        display: flex;
        align-items: center;
        justify-content: space-evenly;        
      }

      .button-group {
        display: flex;
        justify-content: space-evenly;
        align-items: center;
        background-color: #EAEBF0;
        border-radius: 55px;
        margin: 0px 15px;
        --mv-button-margin: 0 5px;
      }

      .button-group mv-button:first-child,
      .button-group mv-button:nth-child(2) {
        --mv-button-margin: 0 5px 0 0;
      }


      .button-group mv-button:last-child,
      .button-group mv-button:nth-last-child(2) {
        --mv-button-margin: 0 0 0 5px;
      }
		`;
  }

  constructor() {
    super();
    this.page = 1;
    this.pages = 0;
    this["max-buttons"] = 5;
    this.justify = "center";
    this.type = "button";
    this.isButtonType = true;
    this.showLeftSeparator = false;
    this.showRightSeparator = false;
    this.showFirstPageButton = false;
    this.showLastPageButton = false;
    this.leftMostButton = 0;
    this.rightMostButton = 0;
    this.pageGroup = [];
  }

  render() {
    const containerClass = `mv-pagination-container ${this.justify}`;
    return html`
      <div class="${containerClass}">
        <div class="mv-pagination-group">
          
          <mv-button
            @button-clicked="${this.gotoPage(1)}"
            ?disabled="${this.isFirstPage}"
            .visible="${!this.isButtonType}"
            type="round"
          >
            <slot name="first-button"> </slot>
          </mv-button>
            
          
          <mv-button
            @button-clicked="${this.gotoPage(this.page - 1)}"
            ?disabled="${this.isFirstPage}"
            type="round"
          >
            <slot name="previous-button"> </slot>
          </mv-button>

          ${this.type === "text"
            ? html`
                <span>${`Page ${this.page} of ${this.pages}`}</span>
              `
            : html``}

            ${this.isButtonType
              ? html`
                <div class="button-group">
                  <mv-button
                    @button-clicked="${this.gotoPage(1)}"
                    ?disabled="${this.isFirstPage}"
                    .visible="${this.showFirstPageButton}"
                    type="round"
                  >
                    <span class="page-buttons">1</span>
                  </mv-button>

                  ${this.showLeftSeparator
                    ? html`<span class="page-buttons">...</span>`
                    : html``}
                  
                  ${this.pageGroup.map(
                    page => html`
                    <mv-button
                      @button-clicked="${this.gotoPage(page)}"
                      ?selected="${page === this.page}"
                      ?disabled="${page === this.page}"
                      type="round"
                    >
                      <span class="page-buttons">${page}</span>
                    </mv-button>
                    `
                  )}

                  ${this.showRightSeparator
                    ? html`<span class="page-buttons">...</span>`
                    : html``}

                  <mv-button
                    @button-clicked="${this.gotoPage(this.pages)}"
                    ?disabled="${this.isLastPage}"
                    .visible="${this.showLastPageButton}"
                    type="round"
                  >
                    <span class="page-buttons">${this.pages}</span>
                  </mv-button>
                </div>
                `
              : html``}          
            
          <mv-button
            @button-clicked="${this.gotoPage(this.page + 1)}"
            ?disabled="${this.isLastPage}"
            type="round"
          >
            <slot name="next-button"> </slot>
          </mv-button>

          <mv-button
            @button-clicked="${this.gotoPage(this.pages)}"
            ?disabled="${this.isLastPage}"
            .visible="${!this.isButtonType}"
            type="round"
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
    if (this.type === "button") {
      const maxButtons = this["max-buttons"];
      const isEven = maxButtons % 2 === 0;
      if (isEven) {
        this["max-buttons"] = maxButtons - 1;
      }
      this.setButtonProps();
    }
    super.connectedCallback();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "page") {
      const value = parseInt(newValue, 10);
      this.isFirstPage = value === 1;
      this.isLastPage = value === this.pages;
      this.isButtonType = this.type === "button";
      this.pageGroup = [];
      if (this.isButtonType) {
        this.setButtonProps();
      }
    }
    super.attributeChangedCallback(name, oldValue, newValue);
  }

  setButtonProps() {
    const maxButtons = this["max-buttons"];
    const adjacentButtonCount = Math.floor(maxButtons / 2);
    this.leftMostButton = this.page - adjacentButtonCount;
    this.rightMostButton = this.page + adjacentButtonCount;
    let start = 1;
    if (this.leftMostButton < 1) {
      start = 1;
    } else if (this.rightMostButton > this.pages) {
      start = this.pages - maxButtons + 1;
    } else {
      start = this.leftMostButton;
    }
    this.pageGroup = Array.from({ length: maxButtons }, (_, i) => i + start);
    this.showLeftSeparator = this.leftMostButton > 2;
    this.showRightSeparator = this.rightMostButton < this.pages - 1;
    this.showFirstPageButton =
      (this.isButtonType && this.showLeftSeparator) ||
      this.leftMostButton === 2;
    this.showLastPageButton =
      (this.isButtonType && this.showRightSeparator) ||
      this.rightMostButton === this.pages - 1;
  }

  gotoPage(page) {
    return () => {
      this.dispatchEvent(new CustomEvent("change-page", { detail: { page } }));
    };
  }
}

customElements.define("mv-pagination", MvPagination);
