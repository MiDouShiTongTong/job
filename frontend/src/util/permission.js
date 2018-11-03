export default {
  validateSignIn: (props) => {
    if (!props.userInfo.id) {
      // 未登录, 跳转登录组件
      props.history.push('/account/signIn');
    }
  }
};
