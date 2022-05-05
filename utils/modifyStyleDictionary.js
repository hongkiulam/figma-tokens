const fs = require("fs");
const path = require("path");
const styleDictionary = require("../style-dictionary.json");

/**
 * @typedef {object} StyleDictionary
 */
/**
 * @callback callback
 * @param {StyleDictionary} styleDictionary
 * @returns {StyleDictionary} modifiedStyleDictionary
 */
/**
 * @param {callback} callback
 */
const modifyStyleDictionary = function (callback) {
  const modifiedStyleDictionary = callback(styleDictionary);
  fs.writeFileSync(
    path.join(__dirname, "../style-dictionary.json"),
    JSON.stringify(modifiedStyleDictionary, null, 2),
    "utf-8"
  );
};

module.exports = modifyStyleDictionary;