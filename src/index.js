const withSvgr = require("next-plugin-svgr");
const withConfiguration = require("./withConfiguration");

module.exports = function withConfig(nextConfig = {}) {
  return withSvgr(withConfiguration(nextConfig));
};
