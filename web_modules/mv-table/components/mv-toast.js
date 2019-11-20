import {
  LitElement,
  html,
  css
} from "https://cdn.jsdelivr.net/gh/manaty/mv-dependencies@master/web_modules/lit-element.js";

export class MvToast extends LitElement {
  static get properties() {
    return {
      type: { type: String, attribute: true },
      duration: { type: Number, attribute: true },
      closeable: { type: Boolean, attribute: true },
      visible: { type: Boolean, reflect: true, attribute: false },
      show: { type: Boolean, reflect: true, attribute: false }
    };
  }

  static get styles() {
    return css`
			:host {
				font-family: var(--mv-font-family, Arial);
				font-size: var(--mv-font-size-m, 10pt);				
      }

      @keyframes fade-in {
        0% {
          opacity: 0;
        }
        100% {
          opacity: 1;
        }
      }

      @keyframes fade-out {
        0% {
          opacity: 1;
        }
        100% {
          opacity: 0;
        }
      }

      .mv-toast {
        background-color: #FFFFFF;
        min-width: 330px;
        max-width: 500px;
        min-height: 111px;
        box-shadow: 0 0 10px 0 rgba(7,17,26, 0.2);
        border-radius: 5px;
        display: flex;
        flex-direction: row;
      }

      .mv-toast.show {
        animation: fade-in 1s ease-in;
      }

      .mv-toast.hide {
        animation: fade-out 1s ease-out;
      }

      .toast-icon-section {
        width: 77px;        
        border-radius: 5px 0 0 5px;
        box-shadow: 0 0 10px 0 rgba(7,17,26, 0.2);
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .toast-icon-section i {
        color: #FFFFFF;
        display: inline-block;
        height: 36px;
        width: 36px;
        border: 2px solid #FFFFFF;
        border-radius: 100%;
      }

      .toast-icon-section i * {
        border: none;
      }

      .toast-content {
        padding-left: 20px;
        width: 100%;
      }
      
      .close-button-section {
        width: 100%;
        min-height: 14px;
        text-align: right;
        line-height: 14px;
      }
      
      .close-button-section button {        
        border: none;
        background: transparent;
        font-size: 24px;
        line-height: 16px;
        cursor: pointer;
        padding-top: 5px;
      }

      .close-button-section button:focus {
        outline: none;
      }

      .type {
        text-transform: uppercase;
        font-size: 16px;
        font-weight: bold;
      }

      .message {
        font-size: 14px;
        width: 100%;
        max-width: 480px;
      }

      .message.scrollbar {
        max-height: 150px;
        float: left;
        overflow: auto;
        // fallback for firefox
        scrollbar-color: #5A6473 #788394;
        scrollbar-width: thin;
      }

      .message.scrollbar:focus {
        outline: transparent auto 0;
      }
    
      .message.scrollbar::-webkit-scrollbar-track {
        box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
        border-radius: 10px;
        background-color: #788394;
      }
    
      .message.scrollbar::-webkit-scrollbar {
        width: 8px;
        height: 8px;
        background-color: #788394;
        border-radius: 10px;
      }
    
      .message.scrollbar::-webkit-scrollbar-thumb {
        border-radius: 10px;
        box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
        background-color: #5A6473;
      }

      .message.scrollbar.light {
        // fallback for firefox
        scrollbar-color: #1D9BC9 #EAEBF0 !important;
      }

      .message.scrollbar.light::-webkit-scrollbar-track {
        box-shadow: inset 0 0 5px 0 rgba(29, 155, 201, 0.3);
        background-color: #EAEBF0 !important;
      }
  
      .message.scrollbar.light::-webkit-scrollbar {
        background-color: #1D9BC9;
      }
  
      .message.scrollbar.light::-webkit-scrollbar-thumb {
        box-shadow: inset 0 0 5px 0 rgba(29, 155, 201, 0.3);
        background-color: #008FC3;
      }

      /* SUCCESS */
      .mv-toast.success {
        border: 1px solid #54CA95;
      }

      .toast-icon-section.success {
        background-color: #54CA95;        
      }

      .toast-icon-section.success i * {
        font-size: 26px;
        padding: 2px 0 0 4px;
      }

      .close-button-section.success button {
        color: #54CA95;
      }

      .close-button-section.success button:hover {
        color: #0CA361;
      }

      .type.success {
        color: #54CA95;
      }
      
      /* INFORMATION */
      .mv-toast.information {
        border: 1px solid #3999C1;
      }

      .toast-icon-section.information {
        background-color: #3999C1;
      }

      .toast-icon-section.information i * {
        font-size: 26px;
        padding: 1px 0 0 12px;
      }

      .close-button-section.information button {
        color: #3999C1;
      }

      .close-button-section.information button:hover {
        color: #007FAD;
      }

      .type.information {
        color: #3999C1;
      }

      /* ERROR */
      .mv-toast.error {
        border: 1px solid #E52F2F;
      }

      .toast-icon-section.error {
        background-color: #E52F2F;
      }

      .toast-icon-section.error i * {
        font-size: 36px;
        padding: 0 0 0 6px;
        margin-top: -6px;
      }

      .close-button-section.error button {
        color: #DD5C55;
      }

      .close-button-section.error button:hover {
        color: #E71919;
      }

      .type.error {
        color: #E52F2F;
      }
		`;
  }

  constructor() {
    super();
    this.type = "success";
    this.duration = 1;
    this.closeable = true;
    this.visible = true;
    this.show = true;

    this.icons = {
      success: html`<i class="toast-icon">&check;</i>`,
      information: html`<i class="toast-icon">&excl;</i>`,
      error: html`<i class="toast-icon">&times;</i>`
    };
  }

  render() {
    const { type, icons, closeable, visible, show, close } = this;
    const showClass = show ? "show" : "hide";
    return visible
      ? html`
          <div class="mv-toast ${showClass} ${type}">
            <div class="toast-icon-section ${type}"><i>${icons[type]}</i></div>
            <div class="toast-content">
              <div class="close-button-section ${type}">
                ${closeable
                  ? html`<button @click="${close}">&times;</button>`
                  : html``}
              </div>
              <div class="type ${type}">${this.type}</div>
              <div class="message scrollbar light">
                <slot> </slot>
              </div>
            </div>      
          </div>
          `
      : html``;
  }

  close() {
    this.show = false;
    setTimeout(() => {
      this.clearMessage();
    }, 1000);
  }

  clearMessage() {
    this.visible = false;
    this.dispatchEvent(new CustomEvent("clear-message"));
  }
}

customElements.define("mv-toast", MvToast);
