import 'egg';

import { Socket, Server } from 'socket.io';

declare module 'egg' {
  export interface Application {
    io: Serverr & EggSocketIO & Namespace;
  }

  export interface Context {
    socket: Socket
  }

  interface EggSocketIO {
    middleware: homeMessage;
    controller: homeMessage;
  }

  interface Namespace {
    route(event: string, handler: Function): any
  }
}
