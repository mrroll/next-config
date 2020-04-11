module.exports = function getPolyfills(config) {
  const originalEntry = config.entry;

  config.entry = async function () {
    const entries = await originalEntry();

    if (!entries["main.js"]) {
      return entries;
    }

    const polyFillFile = require.resolve("./polyfills");

    if (entries["main.js"].includes(polyFillFile)) {
      return entries;
    }

    // Array of strings.
    entries["main.js"] = [...entries["main.js"], polyFillFile];
    return entries;
  };
};
