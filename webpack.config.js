const defaultConfig = require("@wordpress/scripts/config/webpack.config");
const path = require("path");

module.exports = {
  ...defaultConfig,
  entry: {
    ...defaultConfig.entry(),
    helpers: "./src/scss/index.scss", // Add your custom entry point
  },
  resolve: {
    ...defaultConfig.resolve,
    alias: {
      ...defaultConfig.alias,
      "@helpers": path.resolve("src/helpers"),
      "@library": path.resolve("src/lib"),
    },
  },
};
