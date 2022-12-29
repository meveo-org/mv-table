import { LitElement, html, css } from "lit";

export class MvArrayCell extends LitElement {
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
        width: calc(100% - 0.587vw);
        max-height: 4.842vw;
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
        box-shadow: inset 0 0 0.44vw rgba(0, 0, 0, 0.3);
        border-radius: 0.734vw;
        background-color: #788394;
      }
    
      ul.scrollbar::-webkit-scrollbar {
        width: 0.587vw;
        height: 0.587vw;
        background-color: #788394;
        border-radius: 0.734vw;
      }
    
      ul.scrollbar::-webkit-scrollbar-thumb {
        border-radius: 0.734vw;
        box-shadow: inset 0 0 0.44vw rgba(0, 0, 0, 0.3);
        background-color: #5A6473;
      }
    
      ul.scrollbar.light {
        // fallback for firefox
        scrollbar-color: #1D9BC9 #EAEBF0 !important;
      }

      ul.scrollbar.light::-webkit-scrollbar-track {
        box-shadow: inset 0 0 0.367vw 0 rgba(29, 155, 201, 0.3);
        background-color: #EAEBF0 !important;
      }
  
      ul.scrollbar.light::-webkit-scrollbar {
        background-color: #1D9BC9;
      }
  
      ul.scrollbar.light::-webkit-scrollbar-thumb {
        box-shadow: inset 0 0 0.367vw 0 rgba(29, 155, 201, 0.3);
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

customElements.define("mv-array-cell", MvArrayCell);
