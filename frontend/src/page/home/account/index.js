import React from 'react';
import { NavBar, WingBlank, WhiteSpace, Result, List, Button, Modal, Toast } from 'antd-mobile';
import { connect } from 'react-redux';
import { updateUserInfo } from '@/store/account';
import api from '@/api';
import '@/page/home/account/index.scss';

export default connect(
  state => {
    // mapStateToProps
    return {
      userInfo: state.account.userInfo
    };
  },
  // mapDispatchToProps
  {
    updateUserInfo
  }
)(
  class HomeAccount extends React.Component {
    state = {};

    // 处理退出按钮
    signOut = () => {
      const { props } = this;
      Modal.animationType = 'slide';
      Modal.alert('退出', '确定退出当前账户?', [
        {
          text: '取消', onPress: () => {
          }
        },
        {
          text: '确定', onPress: async () => {
            Toast.loading('Loading...', 0);
            // 请求退出接口
            await api.account.signOut();
            Toast.hide();
            // 更新 redux
            props.updateUserInfo({});
            // 跳转登陆页面
            props.history.push('/');
          }
        }
      ]);
    };

    render() {
      const { props } = this;
      const { userInfo } = props;
      return (
        <section className="home-account-container">
          <NavBar>个人中心</NavBar>
          {
            userInfo.type === 1
              ? (
                <Result
                  img={<img src={userInfo.avatar} className="avatar" alt=""/>}
                  title={userInfo.username}
                  message={userInfo.company}
                />
              )
              : (
                <Result
                  img={<img src={userInfo.avatar} className="avatar" alt=""/>}
                  title={userInfo.username}
                  message={userInfo.company}
                />
              )
          }
          <WingBlank size="lg">
            <List renderHeader={() => '我的信息'}>
              <List.Item>
                {
                  userInfo.type === 1
                    ? (
                      <List.Item.Brief>
                        <div>
                          <span>求职岗位</span>
                          <span>{userInfo.position}</span>
                        </div>
                        <div>
                          <span>个人介绍</span>
                          <span>{userInfo.description}</span>
                        </div>
                      </List.Item.Brief>
                    )
                    : (
                      <List.Item.Brief>
                        <div>
                          <span>招聘职位</span>
                          <span>{userInfo.position}</span>
                        </div>
                        <div>
                          <span>职位薪资</span>
                          <span>{userInfo.salary}</span>
                        </div>
                        <div>
                          <span>职位描述</span>
                          <span>{userInfo.description}</span>
                        </div>
                      </List.Item.Brief>
                    )
                }
              </List.Item>
            </List>
            <WhiteSpace size="lg"/>
            <Button
              type="warning"
              onClick={this.signOut}
            >退出</Button>
          </WingBlank>
        </section>
      );
    }
  }
);
