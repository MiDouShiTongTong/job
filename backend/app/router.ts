import { Application } from 'egg';
import { EggShell } from 'egg-shell-decorators';

export default (app: Application) => {
  // const { controller, router } = app;
  // router.get('/', controller.home.index);

  EggShell(app, { prefix: '/' });
};
