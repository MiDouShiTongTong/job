import { Application } from 'egg';
import { EggShell } from 'egg-shell-decorators';

export default (app: Application) => {
  // router
  EggShell(app, { prefix: '/' });

  // SocketIo router
  app.io.of('/home/chat').route('receiveChat', app.io.controller.homeChat.receiveChat);
  app.io.of('/home/chat').route('receiveChatList', app.io.controller.homeChat.receiveChatList);
  app.io.of('/home/chat').route('receivePreviewChatList', app.io.controller.homeChat.receivePreviewChatList);
};
