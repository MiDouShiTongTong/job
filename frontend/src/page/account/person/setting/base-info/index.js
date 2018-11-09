import React from 'react';
import AsyncValidator from 'async-validator';
import { NavBar, WingBlank, WhiteSpace, List, InputItem, TextareaItem, Button, Toast } from 'antd-mobile';
import { connect } from 'react-redux';
import { updateUserInfo } from "@/store/account";
import AccountSelectAvatar from '@/component/account/select-avatar';
import api from '@/api';

export default connect(
  // mapStateToProps
  state => {
    return {};
  },
  // mapDispatcherToProps
  {
    updateUserInfo
  }
)(
  class EnterpriseSettingBaseInfo extends React.Component {
    state = {
      // 表单值
      personBaseInfoFormValue: {
        // 头像
        avatar: '',
        // 求职岗位
        position: '',
        // 个人介绍
        description: ''
      },
      // 表单验证规则
      validatePersonBaseInfoFormValue: new AsyncValidator({
        position: [
          { required: true, message: '请输入求职岗位' },
          { min: 2, max: 20, message: '求职岗位由3-20个字符组成' }
        ],
        description: [
          { required: true, message: '请输入个人介绍' },
          { min: 2, max: 100, message: '个人介绍由2-100个字符组成' }
        ]
      })
    };

    // 将新的表单值存入 state
    changePersonBaseInfoFormValue = (name, value) => {
      const { state } = this;
      state.personBaseInfoFormValue[name] = value;
      this.setState({
        personBaseInfoFormValue: state.personBaseInfoFormValue
      });
    };

    // 处理保存按钮
    updatePersonBaseInfo = () => {
      const { state, props } = this;
      // 验证
      state.validatePersonBaseInfoFormValue.validate(state.personBaseInfoFormValue, async errors => {
        if (errors) {
          Toast.info(errors[0].message, 1, null, false);
        } else {
          Toast.loading('Loading...', 0);
          // 请求修改接口
          const { avatar, position, description } = state.personBaseInfoFormValue;
          const result = await api.account.updateUserInfo({
            avatar,
            position,
            description
          });
          if (result.code === '0') {
            // 保存用户信息到 redux
            props.updateUserInfo(result.data);
            Toast.success('保存成功 跳转中...', 3, null, true);
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

    // 选择头像组件回调
    changeAvatarValue = (avatar) => {
      this.changePersonBaseInfoFormValue('avatar', avatar.icon);
    };

    render() {
      const { state } = this;
      return (
        <div className="enterprise-setting-base-info-container">
          <NavBar>个人信息完善</NavBar>
          <WingBlank size="lg">
            <AccountSelectAvatar
              onChange={this.changeAvatarValue}
            />
            <List renderHeader={() => '个人信息'}>
              <InputItem
                type="text"
                placeholder="请输入求职岗位"
                defaultValue={state.personBaseInfoFormValue.position}
                onChange={(value) => this.changePersonBaseInfoFormValue('position', value)}
              >求职岗位</InputItem>
              <TextareaItem
                title="个人介绍"
                placeholder="请输入个人介绍"
                defaultValue={state.personBaseInfoFormValue.description}
                onChange={(value) => this.changePersonBaseInfoFormValue('description', value)}
                rows="3"
                autoHeight
              >个人介绍</TextareaItem>
            </List>
            <WhiteSpace size="lg"/>
            <Button
              type="primary"
              onClick={this.updatePersonBaseInfo}
            >保存</Button>
          </WingBlank>
        </div>
      );
    }
  }
);
