import CommonException from './common-exception';

export default {
  validateSignIn: (ctx) => {
    const userId = ctx.session.userId;
    if (!userId) {
      throw new CommonException({
        status: 200,
        code: '3',
        message: '用户未登录'
      });
    }
  }
}
