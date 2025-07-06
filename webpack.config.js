const defaultConfig = require("@wordpress/scripts/config/webpack.config");
const { getWebpackEntryPoints } = require("@wordpress/scripts/utils/config");

module.exports = async () => {
  const dynamicEntries = await getWebpackEntryPoints();

  return {
    ...defaultConfig,
    // entry: {
    //   ...dynamicEntries,
    //   index: "./src/index.js", // Your custom file
    // },
  };
};
