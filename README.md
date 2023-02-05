# Figma Tokens

This repo contains the design tokens created in [Figma](https://docs.tokens.studio) which are transformed to CSS & SCSS with token-transformer and [Style Dictionary](https://amzn.github.io/style-dictionary/#/)

Change your tokens in `tokens.json` (either directly or with the Figma Tokens plugin in Figma). The GitHub action will automatically generate style dictionary tokens to `style-dictionary.json` that can then be read by Style Dictionary, which will output tokens to the format you defined in `style-dictionary.js`

### Before Making Change...

Always `git pull` before making changes as it's very likely there are remote changes because of the auto-commit bot configured in the Github Action

### Pre-Requisites

```sh
npm install
```

### Release

This repo has no release pipeline, instead it relies on jsDelivr's Github CDN.

The release files can be found at https://cdn.jsdelivr.net/gh/hongkiulam/figma-tokens@latest/dist

### Github Actions Pipeline

#### Build
Processes the tokens and outputs into various formats in `dist` - this is done with the `build-utils/build.js` script.

Any changes made during the build step i.e. within `dist` files, will be autocommited by a Github Actions bot

#### Purge
A script which sends a requet to the jsDelivr purge api for purging the cache

Added util which runs in Github Action that purges the jsDelivr Github cache

### Transformers + Filters (Style Dictionary)

Some custom transformers and filters have been registered to the build process in order to get working CSS

They can be found in `build-utils/style-dictionary.js`

### Build

```sh
npm run build
```

This is configured to generate various CSS, SCSS, Javascript etc... assets in `dist`.

This script is also used by the Github Action so to make changes to the CI, simply change this file
