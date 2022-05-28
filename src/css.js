const { traverse } = require("object-traversal");

module.exports = function css({ config, dev }) {
  let loaderUtils;

  const paths = [
    "next/dist/compiled/loader-utils",
    "next/dist/compiled/loader-utils3",
  ];

  for (const loaderUtilsPath of paths) {
    try {
      // eslint-disable-next-line import/no-dynamic-require
      loaderUtils = require(loaderUtilsPath);
    } catch (error) {
      // noop
    }
  }

  if (loaderUtils === undefined) {
    console.warn(
      "+++ Warning: loader-utils not found. Falling back to original CSS Class Names."
    );
  }

  traverse(config, context => {
    const { parent, value } = context;

    if (typeof value !== "string") {
      return null;
    }

    if (
      value.includes("css-loader") &&
      value.includes("postcss-loader") === false
    ) {
      if (parent.options.modules.mode !== undefined) {
        delete parent.options.modules.mode;
      }

      if (parent.options.modules.getLocalIdent !== undefined) {
        const getLocalIdent = parent.options.modules.getLocalIdent.bind();

        parent.options.modules.getLocalIdent = new Proxy(
          parent.options.modules.getLocalIdent,
          {
            apply(target, thisArg, argArray) {
              if (dev) {
                return Reflect.apply(target, thisArg, argArray);
              }

              const original = getLocalIdent(...argArray);

              if (loaderUtils === undefined) {
                return original;
              }

              const computed = loaderUtils
                .getHashDigest(Buffer.from(original), "md5", "base64", 8) // Replace invalid symbols with underscores instead of escaping
                // https://mathiasbynens.be/notes/css-escapes#identifiers-strings
                .replace(/[^a-zA-Z0-9-_]/g, "_")
                // "they cannot start with a digit, two hyphens, or a hyphen followed by a digit [sic]"
                // https://www.w3.org/TR/CSS21/syndata.html#characters
                .replace(/^(\d|--|-\d)/, "__$1");

              return computed;
            },
          }
        );
      }

      if (parent.options.modules.localIdentName !== undefined) {
        const localIdentName = (function (dev) {
          if (dev) {
            return "[path][name]__[local]--[hash:base64:5]";
          }

          return "[hash:base64:8]";
        })(dev);

        parent.options.modules.localIdentName = localIdentName;
      }
    }
  });
};
