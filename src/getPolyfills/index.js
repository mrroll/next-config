function getPolyfillsFromNextConfig(nextConfig) {
  const { polyfills } = nextConfig;

  if (!polyfills) {
    return [];
  }

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

module.exports = function getPolyfills({ config, nextConfig }) {
  const originalEntry = config.entry;

  const polyfillsFromConfig = getPolyfillsFromNextConfig(nextConfig);

  config.entry = async function () {
    const entries = await originalEntry();

    if (!entries["main.js"]) {
      return entries;
    }

    // In case we want to add a polyfill to the package.
    // const polyFillFile = require.resolve("./polyfills");
    // if (entries["main.js"].includes(polyFillFile)) {
    //   return entries;
    // }

    const arePolyfillsLoaded = entries["main.js"].some(entry => {
      return polyfillsFromConfig.some(polyfillFromConfig => {
        if (polyfillFromConfig === entry) {
          return true;
        }
      });
    });

    if (arePolyfillsLoaded) {
      return entries;
    }

    // Array of strings.
    entries["main.js"] = [
      ...entries["main.js"],
      // In case we want to add a polyfill to the package.
      // polyFillFile,
      ...polyfillsFromConfig,
    ];

    return entries;
  };
};
