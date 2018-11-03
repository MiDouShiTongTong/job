import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import Loadable from 'react-loadable';
import { connect } from 'react-redux';

// 非路由组件
import CommonErrorNotFound from '@/component/common/error/not-found';
import LoadingRouter from '@/component/common/loading-router';

// 路由组件
const AccountSignUp = Loadable({
  loader: () => import('@/page/account/sign-up'),
  loading: LoadingRouter
});
const AccountSignIn = Loadable({
  loader: () => import('@/page/account/sign-in'),
  loading: LoadingRouter
});
const AccountPersonSettingBaseInfo = Loadable({
  loader: () => import('@/page/account/person/setting/base-info'),
  loading: LoadingRouter
});
const AccountEnterpriseSettingBaseInfo = Loadable({
  loader: () => import('@/page/account/enterprise/setting/base-info'),
  loading: LoadingRouter
});

export default connect(
  // mapStateToProps
  state => {
    return {
      userInfo: state.account.userInfo
    };
  },
  // mapDispatcherToProps
  {}
)(
  class AccountPerson extends React.Component {
    state = {
      routeList: [
        // 注册
        {
          path: '/account/signUp',
          component: AccountSignUp,
          exact: true
        },
        // 登陆
        {
          path: '/account/signIn',
          component: AccountSignIn,
          exact: true
        },
        // 普通用户完善基本信息
        {
          path: '/account/person/setting/baseInfo',
          component: AccountPersonSettingBaseInfo,
          exact: true
        },
        // 企业用户完善基本信息
        {
          path: '/account/enterprise/setting/baseInfo',
          component: AccountEnterpriseSettingBaseInfo,
          exact: true
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
        <div className="account-container">
          <Switch>
            {
              state.routeList.map((route, index) => {
                if (route.redirect === undefined) {
                  return <Route
                    key={index}
                    path={route.path}
                    exact={route.exact}
                    component={this.insertMeta(route.component, route.meta)}
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
        </div>
      );
    }
  }
);
