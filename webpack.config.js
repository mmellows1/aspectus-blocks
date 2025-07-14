const defaultConfig = require("@wordpress/scripts/config/webpack.config");
const path = require("path");

module.exports = {
  ...defaultConfig,
  resolve: {
    ...defaultConfig.resolve,
    alias: {
      ...defaultConfig.alias,
      "@helpers": path.resolve("src/helpers"),
      "@library": path.resolve("src/lib"),
    },
  },
};
