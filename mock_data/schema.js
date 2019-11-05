export const schema = {
  $schema: "http://json-schema.org/draft-04/schema",
  required: [
    "name",
    "height",
    "mass",
    "hair_color",
    "skin_color",
    "eye_color",
    "birth_year",
    "gender",
    "homeworld",
    "films",
    "species",
    "vehicles",
    "starships",
    "url",
    "created",
    "edited"
  ],
  type: "object",
  title: "People",
  properties: {
    films: {
      description:
        "An array of urls of film resources that this person has been in.",
      type: "array"
    },
    homeworld: {
      description:
        "The url of the planet resource that this person was born on.",
      type: "string"
    },
    url: {
      format: "uri",
      type: "string",
      description: "The url of this resource"
    },
    birth_year: {
      description:
        "The birth year of this person. BBY (Before the Battle of Yavin) or ABY (After the Battle of Yavin).",
      type: "string"
    },
    species: {
      description: "The url of the species resource that this person is.",
      type: "array"
    },
    name: {
      description: "The name of this person.",
      type: "string"
    },
    skin_color: {
      description: "The skin color of this person.",
      type: "string"
    },
    hair_color: {
      description: "The hair color of this person.",
      type: "string"
    },
    mass: {
      description: "The mass of this person in kilograms.",
      type: "string"
    },
    created: {
      format: "date-time",
      type: "string",
      description:
        "The ISO 8601 date format of the time that this resource was created."
    },
    edited: {
      format: "date-time",
      type: "string",
      description:
        "the ISO 8601 date format of the time that this resource was edited."
    },
    vehicles: {
      description: "An array of vehicle resources that this person has piloted",
      type: "array"
    },
    gender: {
      description: "The gender of this person (if known).",
      type: "string"
    },
    starships: {
      description:
        "An array of starship resources that this person has piloted",
      type: "array"
    },
    height: {
      description: "The height of this person in meters.",
      type: "string"
    },
    eye_color: {
      description: "The eye color of this person.",
      type: "string"
    }
  },
  description: "A person within the Star Wars universe"
};
