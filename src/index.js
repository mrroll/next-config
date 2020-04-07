// Next
const withOptimizedImages = require("next-optimized-images");
const withConfiguration = require("./withConfiguration");

module.exports = function WithConfig(nextConfig = {}) {
  return withOptimizedImages(withConfiguration(nextConfig));
};
