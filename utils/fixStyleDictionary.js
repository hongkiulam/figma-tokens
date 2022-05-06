const sd = require("./helpers");

/**
 * @param {ReturnType<typeof sd.readStyleDictionary>} styleDictionary
 */
const removeTypography = (styleDictionary) => {
  if (styleDictionary.typography) {
    delete styleDictionary.typography;
  }
};

/**
 * @typedef {object} TokenObject
 * @property {string | number | undefined} value
 * @property {string} type
 */

/**
 * @param {TokenObject} tokenObject
 */
const castNumberToPx = (tokenObject) => {
  if (typeof tokenObject.value === "number") {
    tokenObject.value = `${tokenObject.value}px`;
  }
};

/**
 * @param {TokenObject} tokenObject
 */
const flattenShadowObject = (tokenObject) => {
  if (tokenObject.type === "boxShadow") {
    const { x, y, blur, spread, color, type } = tokenObject.value;

    tokenObject.value = `${x}px ${y}px ${blur}px ${spread}px ${color}`;
    if (type !== "dropShadow") {
      tokenObject.value += " inset";
    }
  }
};

/**
 * @param {TokenObject} tokenObject
 */
const parseFontWeights = (tokenObject) => {
  const fontWeightMapping = {
    Thin: 100,
    "Extra Light": 200,
    Light: 300,
    Regular: 400,
    Medium: 500,
    "Semi Bold": 600,
    Bold: 700,
    "Extra Bold": 800,
    Black: 900,
  };
  if (tokenObject.type === "fontWeights") {
    const numericFontWeight = fontWeightMapping[tokenObject.value];
    if (numericFontWeight !== undefined) {
      tokenObject.value = numericFontWeight;
    } else {
      if (typeof tokenObject.value === "number") {
        // already numeric
      } else {
        throw new Error(`Unrecognised fontweight ${tokenObject.value}`);
      }
    }
  }
};

/**
 * @param {TokenObject} tokenParent
 */
const processTokenValue = (tokenParent) => {
  for (const token in tokenParent) {
    /**
     * @type {TokenObject}
     */
    const tokenObject = tokenParent[token];
    // if the object doesn't have a value, we keep looking deeper for the token
    if (tokenObject.value === undefined) {
      processTokenValue(tokenObject);
    } else {
      // we found the token (because it has a value) - do some processing
      castNumberToPx(tokenObject);
      flattenShadowObject(tokenObject);
      parseFontWeights(tokenObject);
    }
  }
};

// main
const styleDictionary = sd.readStyleDictionary();
removeTypography(styleDictionary);
processTokenValue(styleDictionary);
sd.writeStyleDictionary(styleDictionary);
