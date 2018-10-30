import { Controller } from 'egg';
import { Get, Prefix } from 'egg-shell-decorators';

@Prefix('/')
export default class HomeController extends Controller {

  @Get('/')
  public async index() {
    const { ctx } = this;
    ctx.body = 'hello world';
  }
}
