const exec = require("child_process").execSync;
const processStyleDictionary = require("./style-dictionary");

const config = [
  { outputDir: "dist/light", tokenSetIncludes: ["base", "light"] },
  { outputDir: "dist/dark", tokenSetIncludes: ["base", "dark"] },
];

config.forEach((c) => {
  const styleDictionaryOutput = `style-dictionary/${c.tokenSetIncludes.join(
    "-"
  )}.json`;
  // convert figma tokens to style dictionary json file
  exec(
    `token-transformer tokens.json ${styleDictionaryOutput} ${c.tokenSetIncludes.join(
      ","
    )}`
  );
  // generate final output from style dictionary file case on the config in utils/style-dictionary.js
  processStyleDictionary(styleDictionaryOutput, c.outputDir);
});
