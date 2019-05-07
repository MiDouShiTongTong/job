// This file is created by egg-ts-helper@1.25.2
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportChat from '../../../app/service/chat';
import ExportChatSocket from '../../../app/service/chatSocket';
import ExportUser from '../../../app/service/user';

declare module 'egg' {
  interface IService {
    chat: ExportChat;
    chatSocket: ExportChatSocket;
    user: ExportUser;
  }
}
