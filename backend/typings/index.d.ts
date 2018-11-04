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
    middleware: xxx;
    controller: xxx;
  }

  interface Namespace {
    route(event: string, handler: Function): any
  }
}
