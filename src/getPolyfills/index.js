function getPolyfillsFromConfig(config) {
  const { polyfills } = config;

  const isString = typeof polyfills === "string";
  if (isString) {
    return [polyfills];
  }

  const isArray = Array.isArray(polyfills);
  if (isArray) {
    return polyfills;
  }

  throw new Error(
    "The 'polyfills' key must conatain either a string or array."
  );
}

module.exports = function getPolyfills(config) {
  const originalEntry = config.entry;

  const polyfillsFromConfig = getPolyfillsFromConfig();

  // Ensure that the polyfills are valid.
  polyfillsFromConfig.forEach(polyfill => {
    require.resolve(polyfill);
  });

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
    entries["main.js"] = [
      ...entries["main.js"],
      polyFillFile,
      ...polyfillsFromConfig,
    ];
    return entries;
  };
};
