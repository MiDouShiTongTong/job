import ajax from '@/util/ajax';
import config from '@/config';

/**
 * 账户相关接口
 *
 */
export default {
  // 注册
  signUp(data) {
    return ajax(
      'POST',
      `${config.API_ROOT}/account/signUp`,
      data
    );
  },
  // 登陆
  signIn(data) {
    return ajax(
      'POST',
      `${config.API_ROOT}/account/signIn`,
      data
    );
  },
  // 修改用户信息
  updateUserInfo(data) {
    return ajax(
      'PUT',
      `${config.API_ROOT}/account/userInfo`,
      data
    );
  }
};
