// const getEnvironment = require("./getEnvironment");
const cssModules = require("./cssModules");
const minifyCss = require("./minifyCss");
const getPolyfills = require("./getPolyfills");

module.exports = function withConfiguration(nextConfig = {}) {
  const defaultOptions = {
    /**
     * Mimic CRA's ability to pass on specific env variables.
     * https://create-react-app.dev/docs/adding-custom-environment-variables/
     *
     * Not needed since 9.4
     * https://nextjs.org/blog/next-9-4#new-environment-variables-support
     */
    // env: getEnvironment(),

    // Plugins
    // next-optimized-images
    optimizeImages: true,
  };
  return {
    ...defaultOptions,
    ...nextConfig,
    webpack: function getWebpackConfig(config, options) {
      const { buildId, dev, isServer, defaultLoaders, webpack } = options;

      /**
       * Relative to root Array so that we can add paths if we want.
       *
       * No longer needed as there already undocumented support for baseUrl in
       * jsconfig.json and tsconfig.ts
       *
       * config.resolve.modules.push(...[path.resolve(process.cwd(), "src")]);
       */

      /**
       * Functions below MUTATE the config object
       */

      // Add S/CSS Options
      cssModules({ config, dev, nextConfig });
      // Minify stuff
      // https://spectrum.chat/next-js/general/minification-of-css~8d5458ee-39e3-4706-a666-6c471e9fc7f8?m=MTU1MDY1MjIwNzU1NA==
      minifyCss({ config, dev });

      // Add polyfills
      getPolyfills({ config, nextConfig });

      /**
       * the webpack key is overridden with this so let's try to get the
       * passed in config as well
       */
      if (typeof nextConfig.webpack === "function") {
        return nextConfig.webpack(config, options);
      }

      return config;
    },
  };
};
