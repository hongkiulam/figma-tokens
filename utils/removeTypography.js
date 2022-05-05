const modifyStyleDictionary = require("./modifyStyleDictionary");

modifyStyleDictionary((styleDictionary) => {
  if (styleDictionary.typography) {
    delete styleDictionary.typography;
  }
  return styleDictionary;
});
