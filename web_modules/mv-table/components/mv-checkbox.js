import {
  LitElement,
  html,
  css
} from "https://cdn.jsdelivr.net/gh/manaty/mv-dependencies@master/web_modules/lit-element.js";

export class MvCheckbox extends LitElement {
  static get properties() {
    return {
      value: { type: Object, attribute: true },
      checked: { type: Boolean, attribute: true },
      disabled: { type: Boolean, attribute: true },
      label: { type: String, attribute: true },
      // theme is either "light" or "dark", default: "light"
      theme: { type: String, attribute: true }
    };
  }

  static get styles() {
    return css`
			label {
        font-family: var(--mv-font-family, Arial);
        font-size: var(--mv-font-size, 16px);
        display: flex;
        align-items: center;
      }

      span {        
        color: #818181;
        display: flex;
        align-items: center;
      }

      span::before {
        display: inline-block;    
      }

      label * {
        cursor: pointer;
      }

      input[type="checkbox"] {
        opacity: 0;
        position: absolute;
      }

      input[type="checkbox"]:disabled {
        cursor: default;
      }

      input[type="checkbox"] + span::before {
        content: "\u2003";
        font-weight: bolder;
        font-size: 10px;
        width: 12px;
        height: 12px;
        margin: 0 4px 0 0;
        line-height: 12px;
        text-align: center;
        border-radius: 3px;
      }

      input[type="checkbox"]:checked + span::before {
        content: "\u2713";
      }

      input[type="checkbox"] + span.light::before {
        border: 1px solid #4E686D;
      }

      label:hover input[type="checkbox"] + span.light::before {
        border: 1px solid #1D9BC9;
        box-shadow: inset 0 0 5 0 rgba(29,155,201,0.3);
      }

      input[type="checkbox"]:checked + span.light::before {
        border: 1px solid #0792C5;
        background-color: #0792C5;
        color: #FFFFFF;
      }

      label:hover input[type="checkbox"]:disabled + span.light,
      input[type="checkbox"]:disabled + span.light {
        color: #C7C7C7;
        cursor: default;
      }

      label:hover input[type="checkbox"]:disabled + span.light::before,
      input[type="checkbox"]:disabled + span.light::before {
        border: 1px solid #A8B5B7;
        color: #C7C7C7;
        cursor: default;
      }

      input[type="checkbox"] + span.dark::before {
        border: 1px solid #FFFFFF;
      }

      label:hover input[type="checkbox"] + span.dark::before {
        border: 1px solid #FFFFFF;
        background-color: #656C75;
      }

      input[type="checkbox"]:checked + span.dark::before {
        border: 1px solid #FFFFFF;
        background-color: #FFFFFF;
        color: #3F4753;
      }

      label:hover input[type="checkbox"]:disabled + span.dark,
      input[type="checkbox"]:disabled + span.dark {
        color: #C7C7C7;
        cursor: default;
      }

      label:hover input[type="checkbox"]:disabled + span.dark::before,
      input[type="checkbox"]:disabled + span.dark::before {
        border: 1px solid #A8B5B7;
        color: #C7C7C7;
        cursor: default;
      }
		`;
  }

  constructor() {
    super();
    this.label = "";
    this.checked = false;
    this.disabled = false;
    this.theme = "light";
  }

  render() {
    const { checked, label, handleClick } = this;
    return html`
    <label>
      ${checked
        ? html`
            <input
              type="checkbox"
              @click="${handleClick}"
              ?disabled="${this.disabled}"
              checked="checked"
            />`
        : html`
            <input
              type="checkbox"
              @click="${handleClick}"
              ?disabled="${this.disabled}"
            />`}
      <span class="${this.theme}">${label}</span>
    </label>
    `;
  }

  handleClick(originalEvent) {
    originalEvent.stopPropagation();
    const { value, checked } = this;
    this.dispatchEvent(
      new CustomEvent("click-checkbox", {
        detail: { value, checked: !checked, originalEvent }
      })
    );
  }
}

customElements.define("mv-checkbox", MvCheckbox);
