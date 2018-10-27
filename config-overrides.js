const { injectBabelPlugin } = require('react-app-rewired');
const rewireScss = require('react-app-rewire-scss');
const rewireLess = require('react-app-rewire-less-modules');
const path = require('path');

module.exports = function override(config, env) {
  config.resolve = {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  };

  // babel 按需加载
  config = injectBabelPlugin([
    'import',
    {
      libraryName: 'antd-mobile',
      style: 'css'
    }
  ], config);

  config = injectBabelPlugin([
    'syntax-dynamic-import'
  ], config);

  // scss
  config = rewireScss(config, env);

  // less
  config = rewireLess(config, env);

  // less loaderOptions
  config = rewireLess.withLoaderOptions({
    // ant design 默认主题颜色
    modifyVars: {
      "@brand-primary": "#108ee9"
    }
  })(config, env);

  return config;
};
