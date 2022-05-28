const merge = require("lodash/fp/merge");

module.exports = function withConfiguration(config) {
  const defaults = { experimental: { images: { layoutRaw: true } } };

  return {
    ...merge(defaults, config),

    webpack: function getWebpackConfig(config, options) {
      const { buildId, dev, isServer, defaultLoaders, webpack } = options;

      // https://stackoverflow.com/a/68098547
      config.resolve.fallback = { fs: false };

      // Add CSS Options
      require("./css")({ config, dev });

      /**
       * the webpack key is overridden with this so let's try to get the
       * passed in config as well
       */
      if (typeof config.webpack === "function") {
        return config.webpack(config, options);
      }

      return config;
    },
  };
};
