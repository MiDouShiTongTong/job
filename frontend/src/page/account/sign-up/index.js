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
      signUpFormValue: {
        username: '',
        password: '',
        confirmPassword: '',
        type: '1'
      },
      // 表单验证规则
      validateSignUpFormValue: new AsyncValidator({
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
              const { state } = this;
              if (value !== state.signUpFormValue.password) {
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
    changeSignUpFormValue = (name, value) => {
      const { state } = this;
      state.signUpFormValue[name] = value;
      this.setState({
        signUpFormValue: state.signUpFormValue
      });
    };

    // 处理注册按钮
    signUp = () => {
      const { state, props } = this;
      // 验证
      state.validateSignUpFormValue.validate(state.signUpFormValue, async (errors) => {
        if (errors) {
          // 验证失败, 提示错误信息
          Toast.info(errors[0].message, 1.5, null, false);
        } else {
          Toast.loading('Loading...', 0);
          // 请求注册接口
          const { username, password, type } = state.signUpFormValue;
          const result = await api.account.signUp({
            username,
            password,
            type
          });
          if (result.code === '0') {
            // 保存用户信息到 redux
            props.updateUserInfo(result.data);
            Toast.success('注册成功 跳转中...', 3, null, true);
            // 跳转完善用户信息页面
            const redirectURL = state.signUpFormValue.type === '1'
              ? '/account/person/setting/baseInfo'
              : '/account/enterprise/setting/baseInfo';
            setTimeout(() => {
              props.history.push(redirectURL);
            }, 3000);
          } else {
            Toast.fail(result.message, 1.5, null, false);
          }
        }
      });
    };

    render() {
      const { state, props } = this;
      // 注册类型
      const typeList = [
        {
          value: '1',
          label: '求职者'
        },
        {
          value: '2',
          label: '企业'
        }
      ];
      return (
        <section className="sign-up-container">
          <NavBar>注册账户</NavBar>
          <Logo/>
          <WingBlank size="lg">
            {/*显示错误信息*/}
            <List renderHeader={() => '基本信息'}>
              <InputItem
                type="text"
                placeholder="请输入用户名"
                defaultValue={state.signUpFormValue.username}
                onChange={(value) => this.changeSignUpFormValue('username', value)}
              >用户名</InputItem>
              <InputItem
                type="password"
                placeholder="请输入密码"
                defaultValue={state.signUpFormValue.password}
                onChange={(value) => this.changeSignUpFormValue('password', value)}
              >密码</InputItem>
              <InputItem
                type="password"
                placeholder="请再次输入密码"
                defaultValue={state.signUpFormValue.confirmPassword}
                onChange={(value) => this.changeSignUpFormValue('confirmPassword', value)}
              >确认密码</InputItem>
            </List>
            <List renderHeader={() => '注册类型'}>
              {
                typeList.map(type => (
                  <Radio.RadioItem
                    key={type.value}
                    checked={type.value === state.signUpFormValue.type}
                    onChange={() => this.changeSignUpFormValue('type', type.value)}
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
              onClick={() => props.history.push('/account/signIn')}
            >已有账号? 立即登陆</Button>
          </WingBlank>
        </section>
      );
    }
  }
);
