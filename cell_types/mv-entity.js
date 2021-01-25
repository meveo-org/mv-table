import { LitElement, html, css } from "lit-element";
import "mv-tooltip";

export class MvEntity extends LitElement {
  static get properties() {
    return {
      value: { type: Object },
    };
  }

  static get styles() {
    return css`
      :host {
        font-family: var(--font-family, Arial);
        font-size: var(--font-size-m, 10pt);
      }
      .entity-label {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .tooltip-value {
        margin: 0 15px;
        display: flex;
        align-content: left;
      }
    `;
  }

  render() {
    const keys = Object.keys(this.value || {});
    const hasOwnProperties = keys.length > 0;
    const label = hasOwnProperties
      ? keys.map((key) => this.value[key]).join(" | ")
      : "";
    return hasOwnProperties
      ? html`
          <mv-tooltip position="right">
            <span slot="tooltip-content">
              ${keys.map(
                (key) =>
                  html`
                    <div class="tooltip-value">
                      <b>${key}:</b>&nbsp;<div> ${this.value[key]}</div>
                    </div>
                  `
              )}
            </span>
            <span class="entity-label"
              >${!!this.value.uuid ? this.value.uuid : label}</span
            >
          </mv-tooltip>
        `
      : html``;
  }
}

customElements.define("mv-entity", MvEntity);
