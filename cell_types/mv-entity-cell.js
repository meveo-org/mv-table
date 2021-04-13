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
      .entity-value li {
        list-style: none;
      }
    `;
  }

  render() {
    const keys = Object.keys(this.value || {});
    return (keys || []).length > 0
      ? html`
          <div class="entity-value">
            <ul>
              ${keys.map(
                (key) => html`<li><b>${key}</b>: ${this.value[key]}</li>`
              )}
            </ul>
          </div>
        `
      : null;
  }
}

customElements.define("mv-entity-cell", MvEntityCell);
