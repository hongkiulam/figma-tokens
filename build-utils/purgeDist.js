// @ts-check
const fs = require("fs");
const path = require("path");
const https = require("https");

const invalidate = (path) => {
  const options = {
    hostname: "purge.jsdelivr.net",
    port: 443,
    path: `/gh/hongkiulam/figma-tokens@latest/${path}`,
    method: "GET",
  };
  https
    .request(options, (res) => {
      console.log(
        `Purged cache for ${options.path} with status ${res.statusCode}`
      );
    })
    .end();
};

const rootDir = path.join(__dirname, "../");
const invalidateFilesInDir = (relativeDirPath) => {
  const filesAndFolders = fs.readdirSync(path.join(rootDir, relativeDirPath));
  for (const fileOrFolderName of filesAndFolders) {
    const relativeFileOrFolderPath = `${relativeDirPath}/${fileOrFolderName}`;
    const isDir = fs
      .lstatSync(path.join(rootDir, relativeFileOrFolderPath))
      .isDirectory();
    if (isDir) {
      invalidateFilesInDir(relativeFileOrFolderPath);
    } else {
      invalidate(relativeFileOrFolderPath)
    }
  }
};
invalidateFilesInDir("dist");
