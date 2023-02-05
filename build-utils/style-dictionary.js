// @ts-check
module.exports = (source, destinationDir) => {
  const StyleDictionary = require("style-dictionary").extend({
    source: [source],
    platforms: {
      "web/css": {
        transformGroup: "css",
        buildPath: destinationDir,
        files: [
          {
            destination: `variables.css`,
            format: "css/variables",
            options: { showFileHeader: false },
            filter: "cssFilter",
          },
          {
            destination: "custom-media.css",
            format: "css/custom-media",
            options: { showFileHeader: false },
          },
        ],
      },
      "web/js": {
        transformGroup: "js",
        buildPath: destinationDir,
        files: [
          {
            destination: `variables.js`,
            format: "javascript/module-custom",
            options: { showFileHeader: false },
            filter: "jsFilter",
          },
          {
            destination: `tokens.d.ts`,
            format: "typescript/accurate-module-declarations",
            options: { showFileHeader: false },
            filter: "jsFilter",
          },
        ],
      },
    },
  });

  // Custom Formats

  StyleDictionary.registerFormat({
    name: "css/custom-media",
    formatter: ({ dictionary }) => {
      const breakpointTokens = dictionary.allTokens.filter(
        (token) =>
          token.path.includes("breakpoint") ||
          token.path.includes("breakpoints")
      );

      let output = ``;
      breakpointTokens.forEach((token) => {
        const comment = token.comment ? ` /* ${token.comment} */` : "";
        const variableKebabName = token.path.join("-");
        const max = `${comment}\n@custom-media --${variableKebabName}-max (max-width: ${token.value});\n`;
        const min = `${comment}\n@custom-media --${variableKebabName}-min (min-width: ${token.value});\n`;
        output += max + min;
      });
      return output;
    },
  });

  /**
   * converts `primary: { value: "red", attributes: "", ...}` to `primary: "red"`
   * @param {import('style-dictionary').Dictionary} dictionary
   */
  const javascriptModuleFormat = (dictionary) => {
    const onlyFinalValues = { ...dictionary.properties };
    /**
     * @param {typeof dictionary.properties} obj
     */
    const getNestedValue = (obj) => {
      for (const key in obj) {
        if (obj[key].value !== undefined) {
          obj[key] = obj[key].value;
        } else {
          getNestedValue(obj[key]);
        }
      }
    };
    getNestedValue(onlyFinalValues);
    return JSON.stringify(onlyFinalValues, null, 2);
  };
  StyleDictionary.registerFormat({
    name: "javascript/module-custom",
    formatter: function ({ dictionary }) {
      return `module.exports = ${javascriptModuleFormat(dictionary)};`;
    },
  });

  StyleDictionary.registerFormat({
    name: "typescript/accurate-module-declarations",
    formatter: function ({ dictionary }) {
      let typesObjectString = javascriptModuleFormat(dictionary);
      const keyRegex = /\"(.*)\"/.source; // "key"
      const trailingCommaRegex = /,?/.source;
      const valueRegexes = [
        /{/, // { - not needed but the output looks cleaner
        /\".*\"/, // "100px"
        /-?\d+\.\d+/, // 1.00
        /-?\d+/, // 100
      ].map((r) => r.source);

      typesObjectString = typesObjectString.replace(
        new RegExp(
          `${keyRegex}: (${valueRegexes.join("|")})${trailingCommaRegex}`,
          "g"
        ),
        (match, one, two) => {
          if (match.includes("{")) {
            return `${one}: ${two}`;
          }
          return `${one}: ${two};`;
        }
      );

      return (
        "declare const root: RootObject;\n" +
        "export default root;\n" +
        `interface RootObject ${typesObjectString}`
      );
    },
  });
  // Custom Filters

  const typographyFilter = (token) => token.type === "typography";

  StyleDictionary.registerFilter({
    name: "cssFilter",
    matcher: (token) => !typographyFilter(token),
  });

  StyleDictionary.registerFilter({
    name: "jsFilter",
    matcher: (token) => !typographyFilter(token),
  });

  // Custom Transforms
  StyleDictionary.registerTransform({
    name: "numberToPx",
    type: "value",
    matcher: (token) =>
      typeof token.value === "number" &&
      token.type !== "opacity" &&
      token.attributes?.category !== "zIndex",
    transformer: (token) => `${token.value}px`,
  });

  StyleDictionary.registerTransform({
    name: "flattenShadow",
    type: "value",
    matcher: (token) => token.type === "boxShadow",
    transformer: (token) => {
      const { x, y, blur, spread, color, type } = token.value;
      let newValue = `${x}px ${y}px ${blur}px ${spread}px ${color}`;
      if (type !== "dropShadow") {
        newValue += " inset";
      }
      return newValue;
    },
  });

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
  const fontWeightKeywords = Object.keys(fontWeightMapping);

  StyleDictionary.registerTransform({
    name: "fontweightsToNumber",
    type: "value",
    matcher: (token) =>
      token.type === "fontWeights" && fontWeightKeywords.includes(token.value),
    transformer: (token) => fontWeightMapping[token.value],
  });

  StyleDictionary.registerTransform({
    name: "letterSpacingPercentageToEM",
    type: "value",
    matcher: (token) =>
      token.type === "letterSpacing" && token.value.endsWith("%"),
    transformer: (token) => {
      const rawNumber = Number(token.value.replace("%", ""));
      const percentageAsEmValue = rawNumber / 100;
      return `${percentageAsEmValue}em`;
    },
  });

  StyleDictionary.registerTransform({
    name: "lineHeightPercentageToDecimal",
    type: "value",
    matcher: (token) =>
      token.type === "lineHeights" && token.value.endsWith("%"),
    transformer: (token) => {
      const rawNumber = Number(token.value.replace("%", ""));
      const percentageAsDecValue = rawNumber / 100;
      return percentageAsDecValue;
    },
  });

  StyleDictionary.registerTransform({
    name: "descriptionToComment",
    type: "attribute",
    matcher: (token) => token.description,
    transformer: (token) => (token.comment = token.description),
  });

  StyleDictionary.registerTransform({
    name: "removePxFromBreakpoints",
    type: "value",
    matcher: (token) => token.attributes?.category === "breakpoints",
    transformer: (token) => {
      if (token.value.includes("px")) {
        return parseInt(token.value.replace("px", ""));
      } else {
        return token.value;
      }
    },
  });

  const customTransforms = [
    "numberToPx",
    "flattenShadow",
    "fontweightsToNumber",
    "letterSpacingPercentageToEM",
    "descriptionToComment",
    "lineHeightPercentageToDecimal",
  ];

  // Custom Transform Groups

  StyleDictionary.registerTransformGroup({
    name: "css",
    transforms: [
      // based on https://amzn.github.io/style-dictionary/#/transform_groups?id=css
      "attribute/cti",
      "name/cti/kebab",
      "time/seconds",
      "content/icon",
      "size/rem",
      "color/css",
      // custom transforms
      ...customTransforms,
    ],
  });

  StyleDictionary.registerTransformGroup({
    name: "js",
    transforms: [
      "attribute/cti",
      "name/cti/pascal",
      "size/rem",
      "color/hex",
      ...customTransforms,
      "removePxFromBreakpoints",
    ],
  });

  StyleDictionary.buildAllPlatforms();
};
