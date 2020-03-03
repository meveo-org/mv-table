import { LitElement, html, css } from "lit-element";

export class MvArray extends LitElement {
  static get properties() {
    return {
      value: { type: Array, attribute: true },
      scrollable: { type: Boolean, attribute: true }
    };
  }

  static get styles() {
    return css`
      :host {
        font-family: var(--font-family, Arial);
        font-size: var(--font-size-m, 10pt);				
      }
      
      ul {
        list-style: none;
        padding-left: 0;
      }

      ul.scrollbar {
        width: calc(100% - 8px);
        max-height: 66px;
        float: left;
        overflow-y: auto;
        margin: 0;
        // fallback for firefox
        scrollbar-color: #5A6473 #788394;
        scrollbar-width: thin;
      }

      ul.scrollbar:focus {
        outline: transparent auto 0;
      }
    
      ul.scrollbar::-webkit-scrollbar-track {
        box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
        border-radius: 10px;
        background-color: #788394;
      }
    
      ul.scrollbar::-webkit-scrollbar {
        width: 8px;
        height: 8px;
        background-color: #788394;
        border-radius: 10px;
      }
    
      ul.scrollbar::-webkit-scrollbar-thumb {
        border-radius: 10px;
        box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
        background-color: #5A6473;
      }
    
      ul.scrollbar.light {
        // fallback for firefox
        scrollbar-color: #1D9BC9 #EAEBF0 !important;
      }

      ul.scrollbar.light::-webkit-scrollbar-track {
        box-shadow: inset 0 0 5px 0 rgba(29, 155, 201, 0.3);
        background-color: #EAEBF0 !important;
      }
  
      ul.scrollbar.light::-webkit-scrollbar {
        background-color: #1D9BC9;
      }
  
      ul.scrollbar.light::-webkit-scrollbar-thumb {
        box-shadow: inset 0 0 5px 0 rgba(29, 155, 201, 0.3);
        background-color: #008FC3;
      }
    `;
  }

  constructor() {
    super();
  }

  render() {
    return (
      this.value &&
      this.value.length > 0 &&
      html`     
        <ul class="scrollbar light">
          ${this.value.map(value => html`<li>${value}</li>`)}
        </ul>
      `
    );
  }
}

customElements.define("mv-array", MvArray);
