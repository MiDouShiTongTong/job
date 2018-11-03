import React from 'react';
import { TabBar } from 'antd-mobile';
import { withRouter } from 'react-router-dom';
import '@/component/home/footer/index.scss';

export default withRouter(
  class HomeFooter extends React.Component {
    state = {
      currentSelectPath: '',
      navList: [
        {
          path: '/home',
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
          name: '123',
          icon: 'account_circle'
        }
      ]
    };

    componentDidMount = () => {
      this.setState({
        currentSelectPath: this.props.location.pathname
      });
    };

    render() {
      const { state, props } = this;
      return (
        <section className="home-footer-container">
          <TabBar
            tintColor="#108ee9"
          >
            {
              state.navList.map((nav, index) => {
                return (
                  <TabBar.Item
                    key={index}
                    title={nav.name}
                    icon={<span className="material-icons">{nav.icon}</span>}
                    selectedIcon={<span className="material-icons">{nav.icon}</span>}
                    selected={state.currentSelectPath === nav.path}
                    onPress={() => {
                      this.setState({
                        currentSelectPath: nav.path
                      });
                      // 跳转路由
                      props.history.push(nav.path);
                    }}
                  >
                  </TabBar.Item>
                );
              })
            }
          </TabBar>
        </section>
      );
    }
  }
);
