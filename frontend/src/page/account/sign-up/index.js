import React from 'react';
import { WingBlank, WhiteSpace, NavBar, List, InputItem, Radio, Button, Toast } from 'antd-mobile';
import AsyncValidator from 'async-validator';
import Logo from '@/component/common/logo';

export default class SignUp extends React.Component {
  state = {
    // 表单值
    signUpForm: {
      username: '',
      password: '',
      confirmPassword: '',
      type: '1'
    },
    // 表单验证规则
    signUpFormValidator: new AsyncValidator({
      username: [
        { required: true, message: '请输入用户名' },
        { min: 3, max: 20, message: '用户名由3-20个字符组成' }
      ],
      password: [
        { required: true, message: '请输入密码' },
        { min: 5, max: 20, message: '密码由5-20个字符组成' }
      ],
      confirmPassword: [
        { required: true, message: '请再次输入密码' },
        {
          validator: (rule, value, callback) => {
            if (value !== this.state.signUpForm.password) {
              callback(new Error('两次输入密码不一致'));
            } else {
              callback();
            }
          }
        }
      ]
    })
  };

  // 将新的表单值存入 state
  changeFormValue = (name, value) => {
    const { signUpForm } = this.state;
    signUpForm[name] = value;
    this.setState({
      signUpForm
    });
  };

  // 处理注册按钮
  signUp = () => {
    // 验证
    this.state.signUpFormValidator.validate(this.state.signUpForm, (errors) => {
      if (errors) {
        Toast.info(errors[0].message, 1, null, false);
      } else {
        console.log(this.state.signUpForm);
      }
    });
  };

  render() {
    const typeList = [
      {
        value: '1',
        label: '企业'
      },
      {
        value: '2',
        label: '求职者'
      }
    ];
    return (
      <section className="sign-up-container">
        <NavBar>直聘</NavBar>
        <Logo/>
        <WingBlank size="lg">
          <List renderHeader={() => '基本信息'}>
            <InputItem
              type="text"
              placeholder="请输入用户名"
              defaultValue={this.state.signUpForm.username}
              onChange={(value) => this.changeFormValue('username', value)}
            >用户名</InputItem>
            <InputItem
              type="text"
              placeholder="请输入密码"
              defaultValue={this.state.signUpForm.password}
              onChange={(value) => this.changeFormValue('password', value)}
            >密码</InputItem>
            <InputItem
              type="text"
              placeholder="请再次输入密码"
              defaultValue={this.state.signUpForm.confirmPassword}
              onChange={(value) => this.changeFormValue('confirmPassword', value)}
            >确认密码</InputItem>
          </List>
          <List renderHeader={() => '注册类型'}>
            {
              typeList.map(type => (
                <Radio.RadioItem
                  key={type.value}
                  checked={type.value === this.state.signUpForm.type}
                  onChange={() => this.changeFormValue('type', type.value)}
                >{type.label}</Radio.RadioItem>
              ))
            }
          </List>
          <WhiteSpace size="lg"/>
          <Button
            type="primary"
            onClick={this.signUp}
          >注册</Button>
          <WhiteSpace size="md"/>
          <Button
            type="ghost"
            onClick={() => this.props.history.push('/account/signIn')}
          >已有账号? 立即登陆</Button>
        </WingBlank>
      </section>
    );
  }
};
