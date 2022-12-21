import { people } from "./people.js";
import { schema } from "./schema.js";

export function getSchema() {
  return schema;
}

export function getPeople(data, offset, limit) {
  return {
    count: data.count,
    results: data.count < offset ? data.list : data.list.slice(offset, offset + limit)
  };
}

export { people };