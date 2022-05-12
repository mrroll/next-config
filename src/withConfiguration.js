const merge = require("lodash/fp/merge");
const cssModules = require("./cssModules");

module.exports = function withConfiguration(nextConfig = {}) {
  const defaults = { experimental: { images: { layoutRaw: true } } };

  const combined = merge(defaults, nextConfig);

  const webpack = {
    webpack: function getWebpackConfig(config, options) {
      const { buildId, dev, isServer, defaultLoaders, webpack } = options;

      // https://stackoverflow.com/a/68098547
      config.resolve.fallback = { fs: false };

      /**
       * Functions below MUTATE the config object
       */

      // Add S/CSS Options
      cssModules({ config, dev, nextConfig });

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

  return {
    ...combined,
    ...webpack,
  };
};
