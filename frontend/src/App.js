import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Loadable from 'react-loadable';
// Provider 是 react-redux 两个核心工具之一
// 用于将 store 传递到每个项目的组件中
import { Provider } from 'react-redux';
import store from '@/store';
import '@/App.scss';

// 非路由组件
import NotFound from '@/component/common/error/NotFound';
import Loading from '@/component/common/loading';

// 路由组件
const Home = Loadable({
  loader: () => import('@/page/home'),
  loading: Loading
});
const SignUp = Loadable({
  loader: () => import('@/page/account/sign-up'),
  loading: Loading
});
const SignIn = Loadable({
  loader: () => import('@/page/account/sign-in'),
  loading: Loading
});

export default class App extends React.Component {
  render() {
    return (
      <main>
        {/* 将 store 作为 prop 传入, 即可在所有组件中使用 store */}
        <Provider store={store}>
          <Router>
            <Switch>
              <Route path="/" exact component={Home}/>
              <Route path="/account/signUp" component={SignUp}/>
              <Route path="/account/signIn" component={SignIn}/>
              <Route component={NotFound}/>
            </Switch>
          </Router>
        </Provider>
      </main>
    );
  }
}
