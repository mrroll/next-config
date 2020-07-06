const isArray = require("lodash/isArray");
const get = require("lodash/get");

module.exports = function cssModules({ config, dev, nextConfig }) {
  config.module.rules.forEach(rule => {
    if (!rule.oneOf) {
      return;
    }

    rule.oneOf.forEach(oneOf => {
      const { test, use } = oneOf;

      if (!test || !use) {
        return;
      }

      if (!isArray(use)) {
        return;
      }

      use.forEach(item => {
        const { loader, options } = item;

        // css-loader options
        const isCssLoader =
          loader.includes("css-loader") && !loader.includes("postcss-loader");

        if (isCssLoader) {
          if (options.modules) {
            // Check if CSS Modules are enabled for this rule
            // Format the classnames correctly
            options.modules.localIdentName = dev
              ? "[path][name]__[local]--[hash:base64:5]"
              : "[hash:base64:8]";

            // Remove the functional computation of it.
            delete options.modules.getLocalIdent;

            // Don't force pure css modules so we can use :global(.some-selector){}
            delete options.modules.mode;
          }
        }
      });
    });

    /**
     * Allow the use of Global S/CSS in any file with _app in it.
     */
    rule.oneOf.forEach(oneOf => {
      const hasInclude = get(oneOf, "issuer.include");

      if (!hasInclude) {
        return;
      }

      if (hasInclude.includes("_app.js")) {
        oneOf.issuer.include = [hasInclude, /_app/g];
      }
    });
  });
};
