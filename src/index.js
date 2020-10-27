// Next
// const withOptimizedImages = require("@mrroll/next-optimized-images");
const withConfiguration = require("./withConfiguration");

// module.exports = function WithConfig(nextConfig = {}) {
//   return withOptimizedImages(withConfiguration(nextConfig));
// };

module.exports = withConfiguration;
