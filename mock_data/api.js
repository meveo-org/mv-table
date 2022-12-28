import { people } from "./people.js";
import { schema } from "./schema.js";

export function getSchema() {
  return schema;
}

export function getPeople(data, offset, limit, filtersList) {
  let filteredData = [ ... data.list ];

  if (filtersList) {
    Object.entries(filtersList).map(filter => {
      var dataFilter = filter[1];
      if ((dataFilter.type == "" && ( typeof Object.values(dataFilter)[0] !== 'object' )) || dataFilter.type == "contain") {
        filteredData = filteredData.filter(elt => elt[Object.keys(dataFilter)[0]].toString().toUpperCase().includes(Object.values(dataFilter)[0].toUpperCase()))
      }
      dataFilter.type == "=" ? filteredData = filteredData.filter(elt => elt[Object.keys(dataFilter)[0]].toString().toUpperCase() == (Object.values(dataFilter)[0].toUpperCase()) ) : 
      dataFilter.type == "!=" ? filteredData = filteredData.filter(elt => elt[Object.keys(dataFilter)[0]].toString().toUpperCase() != (Object.values(dataFilter)[0].toUpperCase()) ) : 
      dataFilter.type == "notContain" ? filteredData = filteredData.filter(elt => elt[Object.keys(dataFilter)[0]].toString().toUpperCase().indexOf(Object.values(dataFilter)[0].toUpperCase()) == -1 ) : 
      dataFilter.type == ">" ? filteredData = data.refilteredData(elt => elt[Object.keys(dataFilter)[0]].toString().toUpperCase() > (Object.values(dataFilter)[0].toUpperCase()) ) : 
      dataFilter.type == "<" ? filteredData = data.refilteredData(elt => elt[Object.keys(dataFilter)[0]].toString().toUpperCase() < (Object.values(dataFilter)[0].toUpperCase()) ) : null

    })
  }

  return {
    count: filteredData.length,
    results: filteredData.length < offset ? filteredData : filteredData.slice(offset, offset + limit)
  };
}

export { people };