// This file is created by egg-ts-helper@1.25.2
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportChat from '../../../app/model/chat';
import ExportChatSocket from '../../../app/model/chatSocket';
import ExportUser from '../../../app/model/user';

declare module 'sequelize' {
  interface Sequelize {
    Chat: ReturnType<typeof ExportChat>;
    ChatSocket: ReturnType<typeof ExportChatSocket>;
    User: ReturnType<typeof ExportUser>;
  }
}
