import { Controller } from 'egg';
import { Prefix, Post, Put, Get } from 'egg-shell-decorators';
import { Md5 } from 'md5-typescript';
import requestDataValidateRule from '../util/request-data-validate-rule';
import response from '../util/response';
import permission from '../util/permission';

@Prefix('/account')
export default class AccountController extends Controller {
  /**
   * 用户注册
   *
   */
  @Post('/signUp')
  public async signUp() {
    const { ctx, service } = this;
    // 1. 获取提交参数
    const { username, password, type } = ctx.request.body;
    // 2. 校验请求参数
    ctx.validate(requestDataValidateRule.signUp, {
      username,
      password,
      type
    });
    // 3. 数据库操作
    const user = await service.user.selectOne({
      where: {
        username
      }
    });
    if (user) {
      // 用户名已被注册
      response(ctx, {
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
      const user = await service.user.insertOne({
        username,
        password: Md5.init(password),
        type
      });
      // 保存登陆状态
      ctx.session.userId = user.id;
      response(ctx, {
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
    const { ctx, service } = this;
    // 1. 获取请求参数
    const { username, password } = ctx.request.body;
    // 2. 校验请求参数
    ctx.validate(requestDataValidateRule.signIn, {
      username,
      password
    });
    // 3. 数据库操作
    const user = await service.user.selectOne({
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
      response(ctx, {
        header: {
          status: 200
        },
        body: {
          code: '2',
          message: '用户名或密码不正确'
        }
      });
    } else {
      // 保存登陆状态
      ctx.session.userId = user.id;
      response(ctx, {
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

  @Get('/userInfo')
  public async selectUserInfo() {
    const { ctx, service } = this;
    // 判断是否登陆
    permission.validateSignIn(ctx);
    const userId = ctx.session.userId;
    // 获取用户信息
    const user = await service.user.selectOne({
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
        id: userId
      }
    });
    // 返回用户信息
    response(ctx, {
      header: {
        status: 200
      },
      body: {
        code: '0',
        data: user
      }
    });
  }

  @Put('/userInfo')
  public async updateUserInfo() {
    const { ctx, service } = this;
    // 判断是否登陆
    permission.validateSignIn(ctx);
    const userId  = ctx.session.userId;
    // 查找需要修改的用户
    const user = await service.user.selectOne({
      attributes: [
        'id'
      ],
      where: {
        id: userId
      }
    });
    if (!user) {
      // 用户不存在
      response(ctx, {
        header: {
          status: 200
        },
        body: {
          code: '4',
          message: '用户不存在'
        }
      });
      // 清空 session
      ctx.session.userId = null;
    } else {
      // 获取请求参数, 更新用户信息
      const { avatar, company, position, salary, description } = ctx.request.body;
      await service.user.update({
        avatar: avatar,
        company: company,
        position: position,
        salary: salary,
        description: description,
      }, {
        where: {
          id: userId
        }
      });
      // 重新查找更新后的用户信息
      const user = await service.user.selectOne({
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
          id: userId
        }
      });
      // 返回最新的用户信息
      response(ctx, {
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
