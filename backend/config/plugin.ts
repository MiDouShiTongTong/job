import { EggPlugin } from 'egg';

const plugin: EggPlugin = {
  // sequelize
  sequelize: {
    enable: true,
    package: 'egg-sequelize'
  },

  // validate
  validate: {
    enable: true,
    package: 'egg-validate',
  }
};

export default plugin;
