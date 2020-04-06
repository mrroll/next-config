const path = require("path");

const getEnvironment = require("./getEnvironment");
const cssModules = require("./cssModules");
const minifyCss = require("./minifyCss");

module.exports = function withConfigure(nextConfig = {}) {
  const assetPrefix = process.env.EXPORT_RELATIVE ? "." : "";
  const defaultOptions = {
    // For filesystem based routing if needed.
    assetPrefix,

    /**
     * Mimic CRA's ability to pass on specific env variables.
     * https://create-react-app.dev/docs/adding-custom-environment-variables/
     */
    env: getEnvironment(),

    /**
     *
     * Plugins
     *
     */

    // next-optimized-images
    optimizeImages: true,
  };
  return Object.assign(
    {},
    // Our default options unless config options are overridden in next.config.js
    { ...defaultOptions, ...nextConfig },
    {
      webpack: function getWebpackConfig(config, options) {
        const { buildId, dev, isServer, defaultLoaders, webpack } = options;

        /**
         * Relative to root
         * Array so that we can add paths if we want.
         */
        config.resolve.modules.push(...[path.resolve(process.cwd(), "src")]);

        /**
         * Functions below MUTATE the config object
         */

        // Add S/CSS Options
        cssModules({ config, dev });
        // Minify stuff
        // https://spectrum.chat/next-js/general/minification-of-css~8d5458ee-39e3-4706-a666-6c471e9fc7f8?m=MTU1MDY1MjIwNzU1NA==
        minifyCss({ config, dev });

        return config;
      },
    }
  );
};
