module.exports = {
  rollup(config, options) {
    return { ...config, inlineDynamicImports: true };
  },
};
