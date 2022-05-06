const fs = require("fs");
const path = require("path");
const https = require("https");

const distPath = path.join(__dirname, "../dist");
const distFiles = fs.readdirSync(distPath);

for (const fileName of distFiles) {
  const options = {
    hostname: "purge.jsdelivr.net",
    port: 443,
    path: `/gh/hongkiulam/figma-tokens@latest/${fileName}`,
    method: "GET",
  };
  https
    .request(options, (res) => {
      console.log(`Purged cache for ${options.path} with status ${res.statusCode}`);
    })
    .end();
}
