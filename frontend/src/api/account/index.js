import ajax from '@/api/ajax';
import config from '@/config';

export default {
  signUp(data) {
    return ajax(
      'POST',
      `${config.API_ROOT}/account/signUp`,
      data
    );
  },
  signIn(data) {
    return ajax(
      'POST',
      `${config.API_ROOT}/account/signIn`,
      data
    );
  }
};
