import { Controller } from 'egg';
import { Prefix, Get } from 'egg-shell-decorators';
import response from '../util/response';
import permission from '../util/permission';

@Prefix('/user')
export default class UserController extends Controller {

  @Get('/')
  public async selectUserList() {
    const { ctx, service } = this;
    // 判断是否登陆
    permission.validateSignIn(ctx);
    // 查询用户信息
    const { type } = ctx.request.query;
    const userList = await service.user.selectMany({
      attributes: [
        'id',
        'username',
        'type',
        'avatar',
        'company',
        'position',
        'salary',
        'description'
      ],
      where: {
        type
      }
    });
    response(ctx, {
      header: {
        status: 200
      },
      body: {
        code: '0',
        data: userList
      }
    });
  }
}
