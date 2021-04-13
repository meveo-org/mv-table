import { LitElement, html, css } from "lit-element";
import "mv-tooltip";

export class MvImageCell extends LitElement {
  static get properties() {
    return {
      href: { type: String, attribute: true },
      alt: { type: String, attribute: true },
      title: { type: String, attribute: true },
      content: { type: String, attribute: true }
    };
  }

  static get styles() {
    return css`
      :host {
        font-family: var(--font-family, Arial);
        font-size: var(--font-size-m, 10pt);
        --width: var(--mv-table-image-width, 50px);
        --height: var(--mv-table-image-height, 50px);
        --radius: var(--mv-table-image-border-radius, 50%);
      }
      
      .image {
        border-radius: var(--radius);
        width: var(--width);
        height: var(--height);
      }
    `;
  }

  constructor() {
    super();
    this.href = "";
    this.alt = "";
  }

  render() {
    const { href, alt, content, title } = this;
    return html`
      <div class="container">
        ${!!title ?
          html`
            <mv-tooltip>
              <img
                src="${href}"
                alt="${alt}"
                class="image"
              />
              <span slot="tooltip-content">${title}</span>
            </mv-tooltip>
          ` :
          html`
            <img
              src="${href}"
              alt="${alt}"
              class="image"
            />
            <span slot="tooltip-content">${title}</span>
          `}
        ${!!content ? html`<div class="content">${content}</div>` : html``}
      </div>
    `;
  }
}

customElements.define("mv-image-cell", MvImageCell);
