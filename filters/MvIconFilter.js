import { html, css } from "lit";
import "@meveo-org/mv-tooltip";
import "@meveo-org/mv-font-awesome"
import FilterTemplate from "./MvFilterTemplate";

export class MvIconFilter extends FilterTemplate {
    static get properties() {
        return {
            data: { type: Array, attribute: true },
            isFilter: { type: Boolean },
            name: { type: String },
        };
    }

    static get styles() {
        return css`
            :host {
                font-family: var(--font-family, Arial);
                font-size: var(--font-size-, 10pt);
                --width: var(--mv-table-image-width, 50px);
                --height: var(--mv-table-image-height, 50px);
                --radius: var(--mv-table-image-border-radius, 50%);
            }

            custom-icon-cell:hover {
                cursor: pointer;
            }
        `
        }

    constructor() {
        super();
        this.data = "";
        this.isFilter = false;
        this.name = "";
    }

    selectIcon = (event) =>{
        const {
            detail: { data },
        } = event;
        console.log(data)
        this.updateValue(data);

        // const {
        //     detail: { data },
        // } = event;
        // this.updateValue(data);
        };

    renderInput() {
        const { data } = this;
        return html`
            <div class="container">
                ${this.data.map((val) => html`
                    <custom-icon-cell
                        .name="${this.name}"
                        .value="${val}"
                        .isFilter=${this.isFilter}
                    ></custom-icon-cell>
                    `
                )}
            </div>
        `;
    }
}

customElements.define("icon-filter", MvIconFilter);