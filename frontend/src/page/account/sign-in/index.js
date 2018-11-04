import React from 'react';
import AsyncValidator from 'async-validator';
import { WingBlank, WhiteSpace, NavBar, List, InputItem, Button, Toast } from 'antd-mobile';
import { connect } from 'react-redux';
import { updateUserInfo } from '@/store/account/index';
import api from '@/api';
import Logo from '@/component/common/logo';

export default connect(
  state => {
    // mapStateToProps
    return {};
  },
  // mapDispatchToProps
  {
    updateUserInfo
  }
)(
  class SignIn extends React.Component {
    state = {
      // 表单值
      signInFormValue: {
        username: '',
        password: ''
      },
      // 表单验证规则
      validateSignInFormValue: new AsyncValidator({
        username: [
          { required: true, message: '请输入用户名' },
          { min: 3, max: 20, message: '用户名由3-20个字符组成' }
        ],
        password: [
          { required: true, message: '请输入密码' },
          { min: 5, max: 20, message: '密码由5-20个字符组成' }
        ]
      })
    };

    // 处理所有表单的 change 事件
    changeSignInFormValue = (name, value) => {
      const { state } = this;
      state.signInFormValue[name] = value;
      this.setState({
        signInFormValue: state.signInFormValue
      });
    };

    // 处理注册按钮
    signIn = () => {
      const { state, props } = this;
      // 验证
      state.validateSignInFormValue.validate(state.signInFormValue, async errors => {
        if (errors) {
          Toast.info(errors[0].message, 1, null, false);
        } else {
          Toast.loading('Loading...', 0);
          // 请求登陆接口
          const { username, password } = state.signInFormValue;
          const result = await api.account.signIn({
            username,
            password
          });
          if (result.code === '0') {
            // 保存用户信息到 redux
            props.updateUserInfo(result.data);
            Toast.success('登陆成功 跳转中...', 3, null, true);
            // 跳转到首页
            setTimeout(() => {
              props.history.push('/');
            }, 3000);
          } else {
            Toast.fail(result.message, 1.5, null, false);
          }
        }
      });
    };

    render() {
      const { state, props } = this;
      return (
        <section className="sign-in-container">
          <NavBar>登陆账户</NavBar>
          <Logo/>
          <WingBlank size="lg">
            <List>
              <InputItem
                type="text"
                placeholder="请输入用户名"
                defaultValue={state.signInFormValue.username}
                onChange={(value) => this.changeSignInFormValue('username', value)}
              >用户名</InputItem>
              <InputItem
                type="password"
                placeholder="请输入密码"
                defaultValue={state.signInFormValue.password}
                onChange={(value) => this.changeSignInFormValue('password', value)}
              >密码</InputItem>
            </List>
            <WhiteSpace size="lg"/>
            <Button
              type="primary"
              onClick={this.signIn}
            >登陆</Button>
            <WhiteSpace size="md"/>
            <Button
              type="ghost"
              onClick={() => props.history.push('/account/signUp')}
            >没有账号? 立即注册</Button>
          </WingBlank>
        </section>
      );
    }
  }
);
