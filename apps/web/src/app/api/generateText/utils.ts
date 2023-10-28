export function fillTemplate(template, values) {
  return template.replace(/{(\w+)}/g, (match, key) => {
    if (values.hasOwnProperty(key)) {
      return values[key];
    }
    return match; // Return the placeholder if no value is found
  });
}

export function getMissingKeys(obj, template) {
  const result : any[] = [];
  const matchedStrings = getUniqueStringsInBraces(template, /\{(.*?)\}/g);
  for (const key of matchedStrings) {
    if (!obj.hasOwnProperty(key)) {
      result.push(key);
    }
  }
  return result;
}

function getUniqueStringsInBraces(inputString, regex) {
  // Use a Set to store unique matches
  const uniqueStrings = new Set();

  let match;
  while ((match = regex.exec(inputString)) !== null) {
    uniqueStrings.add(match[1]);
  }

  // Convert the Set to an array
  const uniqueStringsArray = Array.from(uniqueStrings);

  return uniqueStringsArray;
}