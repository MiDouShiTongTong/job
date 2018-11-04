import { Application } from 'egg';
import { EggShell } from 'egg-shell-decorators';

export default (app: Application) => {
  // const { controller, router } = app;
  // router.get('/', controller.home.index);

  // app.io.of('/chat')
  app.io.of('/chat').route('chat', app.io.controller.chat.index);

  EggShell(app, { prefix: '/' });
};
