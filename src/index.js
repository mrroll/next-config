module.exports = function withConfig(config = {}) {
  return require("next-plugin-svgr")(require("./next-plugin-config")(config));
};
