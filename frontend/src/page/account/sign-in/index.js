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
      signInForm: {
        username: '',
        password: ''
      },
      // 表单验证规则
      signInFormValidator: new AsyncValidator({
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
    changeFormValue = (name, value) => {
      const { signInForm } = this.state;
      signInForm[name] = value;
      this.setState({
        signInForm
      });
    };

    // 处理注册按钮
    signIn = () => {
      // 验证
      this.state.signInFormValidator.validate(this.state.signInForm, async errors => {
        if (errors) {
          Toast.info(errors[0].message, 1, null, false);
        } else {
          Toast.loading('Loading...', 0);
          // 请求登陆接口
          const result = await api.account.signIn({
            username: this.state.signInForm.username,
            password: this.state.signInForm.password
          });
          if (result.code === '0') {
            // 保存用户信息到 redux
            this.props.updateUserInfo(result.data);
            Toast.success('登陆成功 跳转中...', 3, null, true);
            // 跳转到首页
            setTimeout(() => {
              this.props.history.push('/');
            }, 3000);
          } else {
            Toast.fail(result.message, 1.5, null, false);
          }
        }
      });
    };

    render() {
      return (
        <section className="sign-in-container">
          <NavBar>直聘</NavBar>
          <Logo/>
          <WingBlank size="lg">
            <List renderHeader={() => '基本信息'}>
              <InputItem
                type="text"
                placeholder="请输入用户名"
                defaultValue={this.state.signInForm.username}
                onChange={(value) => this.changeFormValue('username', value)}
              >用户名</InputItem>
              <InputItem
                type="password"
                placeholder="请输入密码"
                defaultValue={this.state.signInForm.password}
                onChange={(value) => this.changeFormValue('password', value)}
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
              onClick={() => this.props.history.push('/account/signUp')}
            >没有账号? 立即注册</Button>
          </WingBlank>
        </section>
      );
    }
  }
);
