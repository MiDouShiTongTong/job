import { Context } from "egg";

module.exports = () => {
  return async function errorHandler(ctx: Context, next: any) {
    try {
      return new Promise(resolve => {
        setTimeout(async () => {
          await next();
          resolve();
        }, 1000);
      });
    } catch (error) {
      console.log(error);
      // 清空响应体
      ctx.body = {};

      // http 状态码
      ctx.status = error.status;

      // 响应错误状态码
      switch (error.code) {
        // 验证插件单独处理
        case 'invalid_param':
          ctx.body.code = '10011';
          break;
        default:
          ctx.body.code = error.code;
      }

      // 响应错误信息
      switch (error.code) {
        // 验证插件单独处理
        case 'invalid_param':
          ctx.body.message = error.errors;
          break;
        default:
          ctx.body.message = error.message;
      }
    }
  };
};
