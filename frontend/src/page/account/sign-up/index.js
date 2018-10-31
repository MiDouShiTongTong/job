import React from 'react';
import AsyncValidator from 'async-validator';
import { WingBlank, WhiteSpace, NavBar, List, InputItem, Radio, Button, Toast } from 'antd-mobile';
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
  class SignUp extends React.Component {
    state = {
      // 表单值
      signUpForm: {
        username: '',
        password: '',
        confirmPassword: '',
        type: '2'
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
      this.state.signUpFormValidator.validate(this.state.signUpForm, async (errors) => {
        if (errors) {
          // 验证失败, 提示错误信息
          Toast.info(errors[0].message, 1.5, null, false);
        } else {
          Toast.loading('Loading...', 0);
          // 请求注册接口
          const result = await api.account.signUp({
            username: this.state.signUpForm.username,
            password: this.state.signUpForm.password,
            type: this.state.signUpForm.type
          });
          if (result.code === '0') {
            // 保存用户信息到 redux
            this.props.updateUserInfo(result.data);
            Toast.success('注册成功 跳转中...', 3, null, true);
            // 跳转到首页
            setTimeout(() => {
              this.props.history.push('/');
            }, 3000);
          } else {
            Toast.fail(result.message, 3, null, false);
          }
        }
      });
    };

    render() {
      // 注册类型
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
            {/*显示错误信息*/}
            <List renderHeader={() => '基本信息'}>
              <InputItem
                type="text"
                placeholder="请输入用户名"
                defaultValue={this.state.signUpForm.username}
                onChange={(value) => this.changeFormValue('username', value)}
              >用户名</InputItem>
              <InputItem
                type="password"
                placeholder="请输入密码"
                defaultValue={this.state.signUpForm.password}
                onChange={(value) => this.changeFormValue('password', value)}
              >密码</InputItem>
              <InputItem
                type="password"
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
  }
);
