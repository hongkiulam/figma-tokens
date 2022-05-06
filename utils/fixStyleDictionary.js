const sd = require("./styleDictionary");

/**
 * @callback callback
 * @param {StyleDictionary} styleDictionary
 * @returns {StyleDictionary} modifiedStyleDictionary
 */
/**
 * @param {callback} callback
 */
const modifyStyleDictionary = function (callback) {
  const styleDictionary = sd.getStyleDictionary();
  const modifiedStyleDictionary = callback({ ...styleDictionary });
  sd.writeStyleDictionary(modifiedStyleDictionary);
};

// ? Remove Typography Tokens
modifyStyleDictionary((styleDictionary) => {
  if (styleDictionary.typography) {
    delete styleDictionary.typography;
  }
  return styleDictionary;
});

// ? Convert all number values to pixel
// ? Fix shadow object
modifyStyleDictionary((styleDictionary) => {
  const castNumberToPx = (tokenObject) => {
    if (typeof tokenObject.value === "number") {
      tokenObject.value = `${tokenObject.value}px`;
    }
  };
  const flattenShadowObject = (tokenObject) => {
    if (tokenObject.type === "boxShadow") {
      const { x, y, blur, spread, color, type } = tokenObject.value;

      tokenObject.value = `${x}px ${y}px ${blur}px ${spread}px ${color}`;
      if (type !== "dropShadow") {
        tokenObject.value += " inset";
      }
    }
  };

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
    if (typeof tokenObject.type === "fontWeights") {
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

  const processValue = (tokenParent) => {
    for (const token in tokenParent) {
      const tokenObject = tokenParent[token];
      // if the object doesn't have a value, we keep looking deeper for the token
      if (tokenObject.value === undefined) {
        processValue(tokenObject);
      } else {
        // we found the token (because it has a value) - do some processing
        castNumberToPx(tokenObject);
        flattenShadowObject(tokenObject);
        parseFontWeights(tokenObject);
      }
    }
  };
  processValue(styleDictionary);
  return styleDictionary;
});
