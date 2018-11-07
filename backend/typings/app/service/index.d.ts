// This file was auto created by egg-ts-helper
// Do not modify this file!!!!!!!!!

import 'egg'; // Make sure ts to import egg declaration at first
import Chat from '../../../app/service/chat';
import ChatSocket from '../../../app/service/chatSocket';
import User from '../../../app/service/user';

declare module 'egg' {
  interface IService {
    chat: Chat;
    chatSocket: ChatSocket;
    user: User;
  }
}
