const cssModules = require("./cssModules");
const minifyCss = require("./minifyCss");

module.exports = function withConfiguration(nextConfig = {}) {
  return {
    ...nextConfig,
    webpack: function getWebpackConfig(config, options) {
      const { buildId, dev, isServer, defaultLoaders, webpack } = options;

      /**
       * Functions below MUTATE the config object
       */

      // Add S/CSS Options
      cssModules({ config, dev, nextConfig });
      // Minify stuff
      // https://spectrum.chat/next-js/general/minification-of-css~8d5458ee-39e3-4706-a666-6c471e9fc7f8?m=MTU1MDY1MjIwNzU1NA==
      minifyCss({ config, dev });

      if (!nextConfig?.disableStaticImages) {
        config.module.rules.forEach(rule => {
          if (
            String(rule?.test ?? "") ===
              String(/\.(png|svg|jpg|jpeg|gif|webp|ico|bmp)$/i) &&
            rule?.loader === "next-image-loader" &&
            rule?.dependency?.not?.[0] === "url"
          ) {
            rule.test = /\.(png|jpg|jpeg|gif|webp|ico|bmp)$/i;
          }
        });
      }

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
