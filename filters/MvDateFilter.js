import { html, css } from "lit";
import FilterTemplate from "./MvFilterTemplate";
import { EMPTY_DATE } from "@meveo-org/mv-calendar/utils/index.js";
import "@meveo-org/mv-calendar";

export default class MvDateFilter extends FilterTemplate {
  static get properties() {
    return {
      ...super.properties,
      start: { type: Object, reactive: true },
      end: { type: Object, reactive: true },
    };
  }

  static get styles() {
    return css`
      :host {
        --mv-input-min-width: 8rem;
        --mv-dropdown-trigger-padding: 0;
      }

      .date-range {
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        align-content: space-around;
        justify-content: start;
        align-items: center;
        gap: 0.5rem;
      }
    `;
  }

  constructor () {
    super();
    this.start = {};
    this.end = {};
  }

  parseDate = (value) => {
    if (value) {
      const [year, month, day] = value.split("/");
      const monthOffset = Number(month) - 1;
      const newValue = {
        date: new Date(`${year}-${month}-${day}`),
        day: Number(day),
        month: monthOffset,
        year: Number(year),
      };
      return newValue;
    }
    return EMPTY_DATE;
  };

  renderInput = () => {
    this.start= new Date()
    this.end = new Date()
    return html`
      <div class="date-range">
        <mv-calendar
          name="start"
          range-calendar
          monday-first
          pattern="MM/DD/YYYY"
          pattern-matcher="MDY"
          pattern-regex="\\d"
          .start=${this.start}
          .end=${this.end}
          @select-date="${this.changeDate}"
        ></mv-calendar>
        <!-- <span> - </span>
        <mv-calendar
          name="end"
          dropdown
          .selected=${this.end}
          @select-date="${this.changeDate}"
        ></mv-calendar> -->
      </div>
    `;
  };

  formatDate = (value) => {
    const hasDate = value && value.year && value.month && value.day;
    if (hasDate) {
      const monthOffset = value.month + 1;
      const month =
        monthOffset && monthOffset < 10 ? `0${monthOffset}` : monthOffset;
      const day = value.day && value.day < 10 ? `0${value.day}` : value.day;
      return `${month}/${day}/${value.year}`;
    }
    return undefined;
  };

  changeDate = (event) => {
    const {
      detail: { name, selected },
    } = event;


    console.log(event)
    console.log(this.start, this.end)
    this.updateValue({
      end: this.end,
      [name]: selected,
    });
  };
}

customElements.define("date-filter", MvDateFilter);
