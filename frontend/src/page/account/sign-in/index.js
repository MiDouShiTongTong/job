import React from 'react';
import { WingBlank, WhiteSpace, NavBar, List, InputItem, Button, Toast } from 'antd-mobile';
import AsyncValidator from 'async-validator';
import Logo from '@/component/common/logo';

export default class SignIn extends React.Component {
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
    this.state.signInFormValidator.validate(this.state.signInForm, (errors) => {
      if (errors) {
        Toast.info(errors[0].message, 1, null, false);
      } else {
        console.log(this.state.signInForm);
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
              type="text"
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
