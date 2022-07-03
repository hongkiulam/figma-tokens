module.exports = (source, destinationDir) => {
  const StyleDictionary = require("style-dictionary").extend({
    source: [source],
    platforms: {
      css: {
        transformGroup: "css",
        files: [
          {
            destination: `${destinationDir}/variables.css`,
            format: "css/variables",
            options: { showFileHeader: false },
            filter: "omitTypography",
          },
        ],
      },
      scss: {
        transformGroup: "scss",
        files: [
          {
            destination: `${destinationDir}/variables.scss`,
            format: "scss/variables",
            options: { showFileHeader: false },
            filter: "omitTypography",
          },
        ],
      },
      js: {
        transformGroup: "js",
        files: [
          {
            destination: `${destinationDir}/variables.js`,
            format: "javascript/es6",
            options: { showFileHeader: false },
          },
        ],
      },
    },
  });

  // Custom Filters

  StyleDictionary.registerFilter({
    name: "omitTypography",
    matcher: (token) => token.type !== "typography",
  });

  // Custom Transforms

  StyleDictionary.registerTransform({
    name: "numberToPx",
    type: "value",
    matcher: (token) =>
      typeof token.value === "number" && token.type !== "opacity",
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
    name: "descriptionToComment",
    type: "attribute",
    matcher: (token) => token.description,
    transformer: (token) => (token.comment = token.description),
  });

  const customTransforms = [
    "numberToPx",
    "flattenShadow",
    "fontweightsToNumber",
    "letterSpacingPercentageToEM",
    "descriptionToComment",
  ];

  // Transform Groups

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
    name: "scss",
    transforms: [
      // based on https://amzn.github.io/style-dictionary/#/transform_groups?id=scss
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
    ],
  });

  StyleDictionary.buildAllPlatforms();
};
