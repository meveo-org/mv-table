import { people } from "./people.js";
import { schema } from "./schema.js";

export function getSchema() {
  return schema;
}

export function getPeople(offset, limit) {
  return {
    count: people.count,
    results: people.list.slice(offset, offset + limit)
  };
}
