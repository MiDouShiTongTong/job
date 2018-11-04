import { Controller } from 'egg';

export default class ChatController extends Controller {

  public async index() {
    this.ctx.socket.emit('res');
  }
}
