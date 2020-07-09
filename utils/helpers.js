const parseType = ({ format, type }) => {
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
      title: property.description,
      tooltip: property.description,
      type: parseType(property),
    };
    columnList.push(column);
    return columnList;
  }, []);
};
