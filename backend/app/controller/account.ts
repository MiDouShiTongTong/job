import { Controller } from 'egg';
import { Prefix, Post } from 'egg-shell-decorators';
import { Md5 } from 'md5-typescript';
import requestDataValidateRule from '../util/request-data-validate-rule';
import response from '../util/response';


@Prefix('/account')
export default class AccountController extends Controller {
  /**
   * 用户注册
   *
   */
  @Post('/signUp')
  public async signUp() {
    // 1. 获取提交参数
    const { username, password, type } = this.ctx.request.body;
    // 2. 校验请求参数
    this.ctx.validate(requestDataValidateRule.signUp, {
      username,
      password,
      type
    });
    // 3. 数据库操作
    const user = await this.service.user.selectOne({
      where: {
        username
      }
    });
    if (user) {
      // 用户名已被注册
      response(this.ctx, {
        header: {
          status: 200
        },
        body: {
          code: '1',
          message: '用户名已被注册'
        }
      });
    } else {
      // 用户插入数据库
      const user = await this.service.user.insertOne({
        username,
        password: Md5.init(password),
        type
      });
      // 保存登陆状态
      this.ctx.session.userId = user.id;
      response(this.ctx, {
        header: {
          status: 200
        },
        body: {
          code: '0',
          // 响应用户信息
          data: {
            id: user.id,
            username: user.username,
            type: user.type
          }
        }
      });
    }
  }

  @Post('/signIn')
  public async signIn() {
    // 1. 获取请求参数
    const { username, password } = this.ctx.request.body;
    // 2. 校验请求参数
    this.ctx.validate(requestDataValidateRule.signIn, {
      username,
      password
    });
    // 3. 数据库操作
    const user = await this.service.user.selectOne({
      attributes: [
        'id',
        'username',
        'type',
        'avatar',
        'position',
        'description',
        'salary'
      ],
      where: {
        username,
        password: Md5.init(password)
      }
    });
    if (!user) {
      response(this.ctx, {
        header: {
          status: 200
        },
        body: {
          code: '2',
          message: '用户名或密码不正确'
        }
      });
    } else {
      response(this.ctx, {
        header: {
          status: 200
        },
        body: {
          code: '0',
          data: user
        }
      });
    }
  }
}
