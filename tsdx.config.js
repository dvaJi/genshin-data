const dynamicImportVariables = require('rollup-plugin-dynamic-import-variables');

module.exports = {
  rollup(config, options) {
    config.plugins.push(
      dynamicImportVariables({
        // options
      })
    );
    return { ...config, inlineDynamicImports: true };
  },
};
