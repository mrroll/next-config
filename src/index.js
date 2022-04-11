const withSvgr = require("next-plugin-svgr");
const withConfiguration = require("./withConfiguration");

module.exports = function WithConfig(nextConfig = {}) {
  return withSvgr(withConfiguration(nextConfig));
};
