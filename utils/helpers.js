const parseType = ({ format, type = "STRING" }) => {
  if (format) {
    switch (format) {
      case "date-time":
        return "DATE";
      case "uri":
        return "URL";
      default:
        break;
    }
  }
  return type.toUpperCase();
};

export const capitalize = (key) => {
  return key.split("_").reduce((title, word) => {
    return `${title} ${word[0].toUpperCase()}${word.slice(1)}`;
  }, "");
};

export const parseColumns = (properties, columnOrder) => {
  return columnOrder.reduce((columnList, key) => {
    const property = properties[key];
    const column = {
      name: key,
      title: key,
      tooltip: property.description,
      type: parseType(property),
    };
    columnList.push(column);
    return columnList;
  }, []);
};
