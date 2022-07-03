// breakpoints require is broken
// not used
const fs = require("fs");
const path = require("path");
const breakpoints = require("../style-dictionary.json").breakpoints;

if (!breakpoints) {
  throw new Error("breakpoints token is missing");
}

let css =
  "/* This file requires PostCSS to work */\n" +
  "/* See https://cssdb.org/#custom-media-queries */\n\n";

for (const breakpoint in breakpoints) {
  let breakpointValue = breakpoints[breakpoint].value;
  if (typeof breakpointValue === "number") {
    breakpointValue = `${breakpointValue}px`;
  }
  const description = breakpoints[breakpoint].description || '';
  const comment = description ? ` /* ${description} */`: ''
  const max = `@custom-media --${breakpoint}-max (max-width: ${breakpointValue});${comment}\n`;
  const min = `@custom-media --${breakpoint}-min (min-width: ${breakpointValue});${comment}\n`;
  css += max + min;
}

fs.writeFileSync(
  path.join(__dirname, "../dist/custom-media.css"),
  css,
  "utf-8"
);
