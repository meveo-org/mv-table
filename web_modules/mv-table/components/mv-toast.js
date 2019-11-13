import {
  LitElement,
  html,
  css
} from "https://cdn.jsdelivr.net/gh/manaty/mv-dependencies@master/web_modules/lit-element.js";

export class MvToast extends LitElement {
  static get properties() {
    return {
      type: { type: String, attribute: true },
      message: { type: String, attribute: true }
    };
  }

  static get styles() {
    return css`
			:host {
				font-family: var(--mv-font-family, Arial);
				font-size: var(--mv-font-size-m, 10pt);				
      }

      div.mv-toast {
        width: 330px;
        min-height: 111px;
        box-shadow: 0 0 10px 0 rgba(7,17,26, 0.2);
        border-radius: 5px;
        display: flex;
        flex-direction: row;
      }

      div.toast-icon-section {
        width: 77px;        
        border-radius: 5px 0 0 5px;
        box-shadow: 0 0 10px 0 rgba(7,17,26, 0.2);
        display: flex;
        align-items: center;
        justify-content: center;
      }

      div.toast-icon-section i {
        color: #FFFFFF;
        display: inline-block;
        height: 36px;
        width: 36px;
        border: 2px solid #FFFFFF;
        border-radius: 100%;
      }

      div.toast-icon-section i * {
        border: none;
      }

      div.toast-content {
        padding-left: 20px;
        width: 100%;
      }
      
      div.close-button-section {
        width: 100%;        
        text-align: right;
        line-height: 14px
      }
      
      div.close-button-section button {
        border: none;
        background: transparent;
        font-size: 24px;
        line-height: 16px;
        cursor: pointer;
        padding-top: 5px;
      }

      div.close-button-section button:focus {
        outline: none;
      }

      div.type {
        text-transform: uppercase;
        font-size: 16px;
        font-weight: bold;
      }

      div.message {
        padding-right: 8px;
        font-size: 14px;
      }

      div.message.scrollbar {
        width: calc(100% - 8px);
        max-height: 150px;
        float: left;
        overflow-y: auto;
        margin: 0;
        // fallback for firefox
        scrollbar-color: #5A6473 #788394;
        scrollbar-width: thin;
      }

      div.message.scrollbar:focus {
        outline: transparent auto 0;
      }
    
      div.message.scrollbar::-webkit-scrollbar-track {
        box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
        border-radius: 10px;
        background-color: #788394;
      }
    
      div.message.scrollbar::-webkit-scrollbar {
        width: 8px;
        height: 8px;
        background-color: #788394;
        border-radius: 10px;
      }
    
      div.message.scrollbar::-webkit-scrollbar-thumb {
        border-radius: 10px;
        box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
        background-color: #5A6473;
      }

      div.message.scrollbar.light {
        // fallback for firefox
        scrollbar-color: #1D9BC9 #EAEBF0 !important;
      }

      div.message.scrollbar.light::-webkit-scrollbar-track {
        box-shadow: inset 0 0 5px 0 rgba(29, 155, 201, 0.3);
        background-color: #EAEBF0 !important;
      }
  
      div.message.scrollbar.light::-webkit-scrollbar {
        background-color: #1D9BC9;
      }
  
      div.message.scrollbar.light::-webkit-scrollbar-thumb {
        box-shadow: inset 0 0 5px 0 rgba(29, 155, 201, 0.3);
        background-color: #008FC3;
      }

      /* SUCCESS */
      div.mv-toast.success {
        border: 1px solid #54CA95;
      }

      div.toast-icon-section.success {
        background-color: #54CA95;        
      }

      div.toast-icon-section.success i * {
        font-size: 26px;
        padding: 2px 0 0 4px;
      }

      div.close-button-section.success button {
        color: #54CA95;
      }

      div.type.success {
        color: #54CA95;
      }
      
      /* INFORMATION */
      div.mv-toast.information {
        border: 1px solid #3999C1;
      }

      div.toast-icon-section.information {
        background-color: #3999C1;
      }

      div.toast-icon-section.information i * {
        font-size: 26px;
        padding: 1px 0 0 12px;
      }

      div.close-button-section.information button {
        color: #3999C1;
      }

      div.type.information {
        color: #3999C1;
      }

      /* ERROR */
      div.mv-toast.error {
        border: 1px solid #E52F2F;
      }

      div.toast-icon-section.error {
        background-color: #E52F2F;
      }

      div.toast-icon-section.error i * {
        font-size: 36px;
        padding: 0 0 0 6px;
        margin-top: -6px;
      }

      div.close-button-section.error button {
        color: #E52F2F;
      }

      div.type.error {
        color: #E52F2F;
      }
		`;
  }

  constructor() {
    super();
    this.type = "success";
    this.message = "";

    this.icons = {
      success: html`<i class="toast-icon">&check;</i>`,
      information: html`<i class="toast-icon">&excl;</i>`,
      error: html`<i class="toast-icon">&times;</i>`
    };
  }

  render() {
    const { type, icons } = this;
    return html`
    <div class="mv-toast ${type}">
      <div class="toast-icon-section ${type}"><i>${icons[type]}</i></div>
      <div class="toast-content">
        <div class="close-button-section ${type}"><button>&times;</button></div>
        <div class="type ${type}">${this.type}</div>
        <div class="message scrollbar light">
          <slot> </slot>
        </div>
      </div>      
    </div>
    `;
  }
}

customElements.define("mv-toast", MvToast);
