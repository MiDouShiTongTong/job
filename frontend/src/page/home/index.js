import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import permission from '@/util/permission';
import '@/page/home/index.scss';

// 非路由组件
import CommonErrorNotFound from '@/component/common/error/not-found';
import HomeFooter from '@/component/home/footer';

// 路由组件
import HomeUser from '@/page/home/user';
import HomeMessage from '@/page/home/message';
import HomeAccount from '@/page/home/account';

export default connect(
  state => {
    // mapStateToProps
    return {
      userInfo: state.account.userInfo
    };
  },
  // mapDispatchToProps
  {}
)(
  class Home extends React.Component {
    state = {
      routeList: [
        {
          path: '/home',
          redirect: '/home/user',
          exact: true
        },
        {
          path: '/home/user',
          component: HomeUser,
          componentProps: {},
          exact: true
        },
        {
          path: '/home/message',
          component: HomeMessage,
          componentProps: {},
          exact: true
        },
        {
          path: '/home/account',
          component: HomeAccount,
          componentProps: {},
          exact: true
        }
      ],
      // 控制是否可以渲染
      isRender: false
    };

    constructor(props) {
      super(props);
      // 判断是否登陆
      permission.validateSignIn(props);
    }

    componentDidMount = () => {
      const { props } = this;
      if (props.userInfo.id) {
        this.setState({
          isRender: true
        });
      }
    };

    // 添加元信息
    insertMeta = (Component, meta) => {
      return (props) => <Component meta={meta} {...props}/>;
    };

    render() {
      const { state } = this;
      if (state.isRender) {
        return (
          <div className="home-container">
            {/* 路由组件 */}
            <Switch>
              {
                state.routeList.map((route, index) => {
                  if (route.redirect === undefined) {
                    return <Route
                      key={index}
                      path={route.path}
                      exact={route.exact}
                      component={this.insertMeta(route.component, route.componentMeta)}
                    />;
                  } else {
                    return <Route
                      key={index}
                      path={route.path}
                      exact={route.exact}
                      render={() => {
                        return <Redirect to={route.redirect}/>;
                      }}
                    />;
                  }
                })
              }
              {/* 404 */}
              <Route component={CommonErrorNotFound}/>
            </Switch>
            {/* 底部菜单 */}
            <HomeFooter/>
          </div>
        );
      } else {
        return (
          <div className="alter">渲染失败!</div>
        );
      }
    }
  }
);
