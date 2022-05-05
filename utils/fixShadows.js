const modifyStyleDictionary = require("./modifyStyleDictionary");

modifyStyleDictionary((styleDictionary) => {
  const fixShadow = (shadowTokenParent) => {
    for (const token in shadowTokenParent) {
      const shadowTokenObject = shadowTokenParent[token];
      if (shadowTokenObject.value === undefined) {
        fixShadow(shadowTokenObject);
      } else if (shadowTokenObject.type === "boxShadow") {
        const { x, y, blur, spread, color, type } = shadowTokenObject.value;

        shadowTokenObject.value = `${x} ${y} ${blur} ${spread} ${color}`;
        if (type !== "dropShadow") {
          shadowTokenObject.value += " inset";
        }
      }
    }
  };

  fixShadow(styleDictionary);
  return styleDictionary;
});
