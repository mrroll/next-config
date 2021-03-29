const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

module.exports = function minifyCss({ config, dev }) {
  if (dev) {
    return;
  }
  // https://spectrum.chat/next-js/general/production-build-css-files-are-not-minified~9f9f43b8-ec8b-45e5-a8e3-5b57a62e9e67?m=MTU0MTE3OTU1OTI3Mg==
  config.optimization.minimize = true;
  config.optimization.minimizer.push(
    new OptimizeCssAssetsPlugin({
      cssProcessorPluginOptions: {
        preset: ["default", { discardComments: { removeAll: true } }],
      },
    })
  );
  // Webpack 5.
  // Error: Cannot find module 'webpack/lib/RequestShortener'
  config.optimization.minimize.push(
    new CssMinimizerPlugin({
      preset: ["default", { discardComments: { removeAll: true } }],
    })
  );
};
