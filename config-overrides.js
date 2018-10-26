const { injectBabelPlugin } = require('react-app-rewired');
const rewireScss = require('react-app-rewire-scss');
const rewireLess = require('react-app-rewire-less-modules');


module.exports = function override(config, env) {
  // babel 按需加载
  config = injectBabelPlugin([
    'import',
    {
      libraryName: 'antd-mobile',
      style: 'css'
    }
  ], config);

  // scss
  config = rewireScss(config, env);

  // less
  config = rewireLess(config, env);

  // less loaderOptions
  config = rewireLess.withLoaderOptions({
    // ant design 默认主题颜色
    modifyVars: {
      "@brand-primary": "#108ee9",
    }
  })(config, env);

  return config;
};
