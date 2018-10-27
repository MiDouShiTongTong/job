import { EggAppConfig, EggAppInfo, PowerPartial } from 'egg';

export default (appInfo: EggAppInfo) => {
  const config = {} as PowerPartial<EggAppConfig>;

  // cookie sign key
  config.keys = appInfo.name + '_1540652820912_2530';

  // middleware
  config.middleware = [];

  config.sequelize = {
    username: 'root',
    password: '123456',
    database: 'job',
    host: '127.0.0.1',
    port: 3306,
    dialect: 'mysql'
  };

  // the return config will combines to EggAppConfig
  return {
    ...config
  };
};
