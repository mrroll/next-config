const path = require("path");
const get = require("lodash/get");

function getJsConfigPath() {
  try {
    const jsConfigPath = path.join(process.cwd(), "jsconfig.json");
    const jsConfig = require(jsConfigPath);
    const baseUrl = get(jsConfig, "compilerOptions.baseUrl");
    return baseUrl;
  } catch (error) {
    return null;
  }
}

function getPolyfillsFromNextConfig(nextConfig) {
  // This is currently undocumented.
  const jsConfigPath = getJsConfigPath();

  const { polyfills } = nextConfig;

  if (!polyfills) {
    return [];
  }

  const polyfillsArray = [];

  if (typeof polyfills === "string") {
    polyfillsArray.push(polyfills);
  }

  // Throw exceptions if there are any errors.
  return polyfills
    .map(polyfill => {
      try {
        return require.resolve(polyfill);
      } catch (error) {
        if (jsConfigPath) {
          return require.resolve(
            path.join(process.cwd(), jsConfigPath, polyfill)
          );
        }
        return null;
      }
    })
    .filter(polyfill => polyfill);
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
