import { LitElement, html, css } from "lit-element";

export class MvEntityCell extends LitElement {
  static get properties() {
    return {
      value: { type: Object, attribute: false, reflect: true },
    };
  }

  static get styles() {
    return css`
      :host {
        font-family: var(--font-family, Arial);
        font-size: var(--font-size-m, 10pt);
      }
      .entity-value {
        height: var(--table-row-height);
        overflow: auto;
      }
      .entity-value ul {
        padding: 10px 0;
        margin: 0;
      }
    `;
  }

  render = () => {
    const isArray = Array.isArray(this.value);
    return html`
      <div class="entity-value">
        ${isArray ? this.renderList() : this.renderValues(this.value)}
      </div>
    `;
  };

  renderList = () => html`
    <ul>
      ${this.value.map(this.renderItem)}
    </ul>
  `;

  renderValues = (item) => html`
    <ul>
      ${this.renderItem(item)}
    </ul>
  `;

  renderItem = (item) => {
    const { code, label, name, uuid } = item;
    const itemLabel = label || name || code || uuid || item || "";
    return itemLabel ? html`<li>${itemLabel}</li>` : "";
  };
}

customElements.define("mv-entity-cell", MvEntityCell);
