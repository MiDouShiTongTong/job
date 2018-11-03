import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import permission from '@/util/permission';
import Loadable from 'react-loadable';
import AnimatedRouter from 'react-animated-router'; //我们的AnimatedRouter组件

// 非路由组件
import CommonErrorNotFound from '@/component/common/error/not-found';
import LoadingRouter from '@/component/common/loading-router';
import HomeFooter from '@/component/home/footer';

// 路由组件
const HomeUser = Loadable({
  loader: () => import('@/page/home/user'),
  loading: LoadingRouter
});
const HomeMessage = Loadable({
  loader: () => import('@/page/home/message'),
  loading: LoadingRouter
});
const HomeAccount = Loadable({
  loader: () => import('@/page/home/account'),
  loading: LoadingRouter
});

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
          component: HomeUser,
          exact: true
        },
        {
          path: '/home/message',
          component: HomeMessage,
          exact: true
        },
        {
          path: '/home/account',
          component: HomeAccount,
          exact: true
        }
      ]
    };

    constructor(props) {
      super(props);
      // 判断是否登陆
      permission.validateSignIn(props);
    }

    render() {
      const { state } = this;
      return (
        <div className="home-container">
          {/* 路由组件 */}
          <AnimatedRouter>
            {
              state.routeList.map((route, index) => {
                return <Route
                  key={index}
                  path={route.path}
                  exact={route.exact}
                  component={route.component}
                />;
              })
            }
            {/* 404 */}
            <Route component={CommonErrorNotFound}/>
          </AnimatedRouter>
          {/* 底部菜单 */}
          <HomeFooter/>
        </div>
      );
    }
  }
);
