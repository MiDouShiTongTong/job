import React from 'react';
import AsyncValidator from 'async-validator';
import { NavBar, WingBlank, WhiteSpace, List, InputItem, TextareaItem, Button, Toast } from 'antd-mobile';
import { connect } from 'react-redux';
import { updateUserInfo } from '@/store/account';
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
      enterpriseBaseInfoFormValue: {
        // 头像
        avatar: '',
        // 公司名称
        company: '',
        // 招聘职位
        position: '',
        // 职业薪资
        salary: '',
        // 职位描述
        description: ''
      },
      // 表单验证规则
      validateEnterpriseBaseInfoFormValue: new AsyncValidator({
        avatar: [
          { required: true, message: '请选择头像' }
        ],
        company: [
          { required: true, message: '请输入公司名称' },
          { min: 2, max: 20, message: '公司名称由3-20个字符组成' }
        ],
        position: [
          { required: true, message: '请输入招聘职位' },
          { min: 2, max: 20, message: '招聘职位由3-20个字符组成' }
        ],
        salary: [
          { required: true, message: '请输入职业薪资' },
          { min: 2, max: 20, message: '职业薪资由3-20个字符组成' }
        ],
        description: [
          { required: true, message: '请输入职位描述' },
          { min: 2, max: 100, message: '职位描述由3-100个字符组成' }
        ]
      })
    };

    // 将新的表单值存入 state
    changeEnterpriseBaseFormValue = (name, value) => {
      const { state } = this;
      state.enterpriseBaseInfoFormValue[name] = value;
      this.setState({
        enterpriseBaseInfoFormValue: state.enterpriseBaseInfoFormValue
      });
    };

    // 处理保存按钮
    updateEnterpriseBaseInfo = () => {
      const { state, props } = this;
      // 验证
      state.validateEnterpriseBaseInfoFormValue.validate(state.enterpriseBaseInfoFormValue, async errors => {
        if (errors) {
          Toast.info(errors[0].message, 1, null, false);
        } else {
          Toast.loading('Loading...', 0);
          const { avatar, company, position, salary, description } = state.enterpriseBaseInfoFormValue;
          // 请求修改接口
          const result = await api.account.updateUserInfo({
            avatar,
            company,
            position,
            salary,
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
      this.changeEnterpriseBaseFormValue('avatar', avatar.icon);
    };

    render() {
      const { state } = this;
      return (
        <div className="enterprise-setting-base-info-container">
          <NavBar>企业信息完善</NavBar>
          <WingBlank size="lg">
            <AccountSelectAvatar
              onChange={this.changeAvatarValue}
            />
            <List renderHeader={() => '企业信息'}>
              <InputItem
                type="text"
                placeholder="请输入公司名称"
                defaultValue={state.enterpriseBaseInfoFormValue.company}
                onChange={(value) => this.changeEnterpriseBaseFormValue('company', value)}
              >公司名称</InputItem>
              <InputItem
                type="text"
                placeholder="请输入招聘职位"
                defaultValue={state.enterpriseBaseInfoFormValue.position}
                onChange={(value) => this.changeEnterpriseBaseFormValue('position', value)}
              >招聘职位</InputItem>
              <InputItem
                type="text"
                placeholder="请输入职位薪资"
                defaultValue={state.enterpriseBaseInfoFormValue.salary}
                onChange={(value) => this.changeEnterpriseBaseFormValue('salary', value)}
              >职位薪资</InputItem>
              <TextareaItem
                title="职位描述"
                placeholder="请输入职位描述"
                defaultValupe={state.enterpriseBaseInfoFormValue.description}
                onChange={(value) => this.changeEnterpriseBaseFormValue('description', value)}
                rows="3"
                autoHeight
              />
            </List>
            <WhiteSpace size="lg"/>
            <Button
              type="primary"
              onClick={this.updateEnterpriseBaseInfo}
            >保存</Button>
          </WingBlank>
        </div>
      );
    }
  }
);
