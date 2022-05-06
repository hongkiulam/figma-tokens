# figma-tokens-example

This example illustrates how you can transform your tokens stored on Figma Tokens (with GitHub sync enabled) to be automatically transformed with token-transformer and Style Dictionary.

Change your tokens in `tokens.json` (either directly or with the Figma Tokens plugin in Figma). The GitHub action will automatically generate style dictionary tokens to `style-dictionary.json` that can then be read by Style Dictionary, which will output tokens to the format you defined in `style-dictionary.js`

### Before Making Change...

Always `git pull` before making changes as it's very likely there are remote changes because of the auto-commit bot configured in the Github Action

### Pre-Requisites

```sh
npm install
```

### Utils

Added util which runs in Github Action that purges the jsDelivr Github cache

### Transformers + Filters (Style Dictionary)

Some custom transformers and filters have been registered to the build process in order to get working CSS

_Filters_

- `omitTypography` Removes the typography tokens

_Transforms_

- `numberToPx` Convert all number values to `px` as Figma tokens works best with raw number values (allows cross referencing tokens and math i.e. {spacing.sm} * 2)
- `flattenShadow` Check for shadow tokens and convert the object `{ x: 0, y: 0, blur: 0, ...}` to `"0px 0px 0px ..."`
- `fontweightsToNumber` Convert font weight keywords to numbers e.g. Regular -> 400
- `letterSpacingPercentageToEM` converts all percentage-based letter-spacing values to `em` as css doesn't support `%` for this property
### Build

```sh
npm run build
```

This script is also used by the Github Action so to make changes to the CI, simply change this file
