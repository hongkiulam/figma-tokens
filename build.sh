# package manager exec
pmex() {
    npx $@
}

if command -v pnpm &> /dev/null
then
    # pnpm exists, use it instead
    pmex() {
        pnpm dlx $@
    }
fi

# Convert Figma Tokens (tokens.json) to an Amazon Style Dictionary tokens file
pmex token-transformer tokens.json style-dictionary.json
# Perform some custom fixes to the style dictionary
node utils/fixStyleDictionary
# Create CSS custom media properties
node utils/createCustomMedia
# Build our assets using the style dictionary file based on configuration (config.json)
pmex style-dictionary build --config config.json

