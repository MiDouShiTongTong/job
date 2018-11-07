import React from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import Loadable from 'react-loadable';

// 非路由组件
import CommonErrorNotFound from '@/component/common/error/not-found';
import LoadingRouter from '@/component/common/loading-router';

// 路由组件
import Chat from '@/page/chat';
const Home = Loadable({
  loader: () => import('@/page/home'),
  loading: LoadingRouter
});
const Account = Loadable({
  loader: () => import('@/page/account'),
  loading: LoadingRouter
});

export default class Router extends React.Component {
  state = {
    routeList: [
      {
        path: '/',
        redirect: '/home',
        exact: true,
      },
      // 首页
      {
        path: '/home',
        component: Home,
        componentProps: {},
        exact: false
      },
      // 账户相关
      {
        path: '/account',
        component: Account,
        componentProps: {},
        exact: false
      },
      // 聊天
      {
        path: '/chat/:id',
        component: Chat,
        componentProps: {},
        exact: false
      }
    ]
  };

  // 添加元信息
  insertMeta = (Component, meta) => {
    return (props) => <Component meta={meta} {...props}/>;
  };

  render() {
    const { state } = this;

    return (
      <BrowserRouter>
        {/* 所有路由列表 */}
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
      </BrowserRouter>
    );
  }
}
