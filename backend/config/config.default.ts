import { EggAppConfig, EggAppInfo, PowerPartial } from 'egg';

export default (appInfo: EggAppInfo) => {
  const config = {} as PowerPartial<EggAppConfig>;

  // cookie 加密
  config.keys = appInfo.name + '_1540652820912_2530';

  // 安全
  config.security = {
    csrf: {
      enable: false
    }
  };

  // cros
  config.cors = {
    // 跨域白名单
    origin: 'http://127.0.0.1:3000',
    // 允许 携带 cookie
    credentials: true
  };

  // 中间件
  config.middleware = [
    'errorHandler'
  ];

  // session
  config.session = {
    maxAge: 24 * 3600 * 1000
  };

  // sequelize
  config.sequelize = {
    username: 'root',
    password: '123456',
    database: 'job',
    host: '127.0.0.1',
    port: 3306,
    dialect: 'mysql',
    operatorsAliases: false
  };

  return {
    ...config
  };
};
