// This file was auto created by egg-ts-helper
// Do not modify this file!!!!!!!!!

import 'egg'; // Make sure ts to import egg declaration at first
import Chat from '../../../app/model/chat';
import ChatSocket from '../../../app/model/chatSocket';
import User from '../../../app/model/user';

declare module 'sequelize' {
  interface Sequelize {
    Chat: ReturnType<typeof Chat>;
    ChatSocket: ReturnType<typeof ChatSocket>;
    User: ReturnType<typeof User>;
  }
}
