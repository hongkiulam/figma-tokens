const fs = require("fs");
const sd = require("../style-dictionary.json");

const STYLE_DICTIONARY_PATH = require("path").join(
  __dirname,
  "../style-dictionary.json"
);

/**
 * @typedef {typeof sd} StyleDictionary
 */
/**
 *
 * @returns {StyleDictionary} styleDictionary
 */
const getStyleDictionary = () =>
  JSON.parse(fs.readFileSync(STYLE_DICTIONARY_PATH, "utf-8"));

/**
 *
 * @param {StyleDictionary} styleDictionary
 * @returns
 */
const writeStyleDictionary = (styleDictionary) =>
  fs.writeFileSync(
    STYLE_DICTIONARY_PATH,
    JSON.stringify(styleDictionary, null, 2),
    "utf-8"
  );

exports.STYLE_DICTIONARY_PATH = STYLE_DICTIONARY_PATH;
exports.getStyleDictionary = getStyleDictionary;
exports.writeStyleDictionary = writeStyleDictionary;
