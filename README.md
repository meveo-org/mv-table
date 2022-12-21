# mv-table

 MvTable is a Meveo table component (based on lit-element) that renders a table component given data in JSON format.

## Features

* Renders the table a single component tag
* Can render dynamic table data based on pre-defined column schema

## Dependencies

* [mv-checkbox](https://github.com/meveo-org/mv-checkbox)
* [mv-font-awesome](https://github.com/meveo-org/mv-font-awesome)
* [mv-button](https://github.com/meveo-org/mv-button)
* [mv-calendar](https://github.com/meveo-org/mv-calendar)
* [mv-input](https://github.com/meveo-org/mv-input)
* [mv-radio](https://github.com/meveo-org/mv-radio)
* [mv-select](https://github.com/meveo-org/mv-select)
* [mv-tooltip](https://github.com/meveo-org/mv-tooltip)

## Quick Start

To experiment with the MvTable component.

1. Clone this repo.
2. Serve the project from the root directory with some http server (best served with meveo itself) 
3. Update the table in the demo.js file

You can also check this [demo](https://table.meveo.org/index.html)

## Sample usage

```html
<mv-table-options
  .columns="${this.columns}"                           // the columns list for the table
  .isButtonVisible="${this.isButtonVisible}"           // TODO
  @changeRowsPerPage="${this.changeRowPerPage}"        // custom event when number of rows per page is updated
  @changeColumnsDiplayed=${this.changeColumnsDiplayed} // custom event when displayed columns are changed
>
  <mv-pagination slot="pagination"></mv-pagination> // Optional pagination inside table option
</mv-table-options>

<mv-table
  .columns="${this.columns}"              // the columns list for the table
  .rows="${this.list}"                    // list containing the table data
  .action-column="${this.actionColumn}"   // optional action column that is rendered as the last column of the table
  @row-click="${this.handleRowClick}"     // custom event when a row is clicked
  @cell-click="${this.handleCellClick}"   // custom event when a cell is clicked
  @select-row="${this.handleRowSelect}"   // custom event when a row is selected (either by checkbox or if selectable is enabled)
  with-checkbox                           // enable checkboxes
  selectable                              // enable selectable rows
></mv-table>

<mv-pagination
  .page="${this.page}"                    // Current pagination number 
  .pages="${this.pages}"                  // Max pagination number
  @change-page="${this.gotoPage}"         // custom event to handle pagination 
></mv-pagination>
```

The column schema has the following properties:

```javascript
{
  name,           // attribute/property name of the column
  title,          // text for column header
  tooltip,        // tooltip text on column header
  type,           // valid types: ARRAY, DATE, TEXT, URL
  hrefProp,       // required for URL type
  target          // optional for URL type
  displayed       // Whether the column should be displayed
  render          // Optional custom renderer for the given cell
}
```

## Acknowledgements

* Table demo data is derived from [Star Wars API (swapi)](https://swapi.co/)
