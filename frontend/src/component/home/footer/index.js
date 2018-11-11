import React from 'react';
import { TabBar } from 'antd-mobile';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import '@/component/home/footer/index.scss';


export default withRouter(
  connect(
    state => {
      // mapStateToProps
      return {
        userInfo: state.account.userInfo,
        previewChatList: state.chat.previewChatList
      };
    },
    // mapDispatchToProps
    {
      
    }
  )(
    class HomeFooter extends React.Component {
      state = {
        navList: [
          {
            path: '/home/user',
            name: '首页',
            icon: 'home'
          },
          {
            path: '/home/message',
            name: '消息',
            icon: 'message'
          },
          {
            path: '/home/account',
            name: '个人中心',
            icon: 'account_circle'
          }
        ]
      };

      render() {
        const { state, props } = this;
        const notReadCount = props.previewChatList.reduce((pre, chat) => chat.not_read_count + pre, 0);
        return (
          <section className="home-footer-container">
            <TabBar
              tintColor="#108ee9"
            >
              {
                state.navList.map((nav, index) => {
                  return nav.path === '/home/message'
                    ? <TabBar.Item
                      key={index}
                      title={nav.name}
                      icon={<span className="material-icons">{nav.icon}</span>}
                      selectedIcon={<span className="material-icons">{nav.icon}</span>}
                      selected={this.props.location.pathname === nav.path}
                      badge={notReadCount}
                      onPress={() => {
                        // 跳转路由
                        props.history.push(nav.path);
                      }}
                    />
                    : <TabBar.Item
                      key={index}
                      title={nav.name}
                      icon={<span className="material-icons">{nav.icon}</span>}
                      selectedIcon={<span className="material-icons">{nav.icon}</span>}
                      selected={this.props.location.pathname === nav.path}
                      onPress={() => {
                        // 跳转路由
                        props.history.push(nav.path);
                      }}
                    >
                    </TabBar.Item>
                })
              }
            </TabBar>
          </section>
        );
      }
    }
  )
)
