const isArray = require("lodash/isArray");

function findLoaderUtils() {
  const paths = [
    "next/dist/compiled/loader-utils",
    "next/dist/compiled/loader-utils3",
  ];

  for (const loaderUtils of paths) {
    try {
      return require(loaderUtils);
    } catch (error) {
      // noop
    }
  }

  return null;
}

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
          loader?.includes("css-loader") && !loader.includes("postcss-loader");

        if (isCssLoader) {
          if (options.modules) {
            // Check if CSS Modules are enabled for this rule
            // Format the classnames correctly
            options.modules.localIdentName = dev
              ? "[path][name]__[local]--[hash:base64:5]"
              : "[hash:base64:8]";
            const originalGetLocalIdent = options.modules.getLocalIdent;

            // This is a pretty hacky way of doing this but localIdentName is ignored in NextJS ^12.
            // https://github.com/vercel/next.js/blob/canary/packages/next/build/webpack/config/blocks/css/loaders/getCssModuleLocalIdent.ts
            options.modules.getLocalIdent = dev
              ? originalGetLocalIdent
              : (...args) => {
                  const computed = originalGetLocalIdent(...args);

                  const loaderUtils = findLoaderUtils();

                  if (loaderUtils === null) {
                    console.warn(
                      "+++ Warning: loader-utils not found. Falling back to original CSS Class Names."
                    );
                    return computed;
                  }

                  return (
                    loaderUtils
                      .getHashDigest(Buffer.from(computed), "md5", "base64", 8) // Replace invalid symbols with underscores instead of escaping
                      // https://mathiasbynens.be/notes/css-escapes#identifiers-strings
                      .replace(/[^a-zA-Z0-9-_]/g, "_")
                      // "they cannot start with a digit, two hyphens, or a hyphen followed by a digit [sic]"
                      // https://www.w3.org/TR/CSS21/syndata.html#characters
                      .replace(/^(\d|--|-\d)/, "__$1")
                  );
                };

            // Don't force pure css modules so we can use :global(.some-selector){}
            delete options.modules.mode;
          }
        }
      });
    });
  });
};
