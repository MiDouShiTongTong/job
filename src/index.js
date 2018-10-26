import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Loadable from 'react-loadable';
import './index.scss';

// 非路由组件
import NotFound from './component/common/NotFound';
import Loading from './component/common/Loading';

// 路由组件
const Home = Loadable({
  loader: () => import('./page/home'),
  loading: Loading
});
const SignUp = Loadable({
  loader: () => import('./page/account/SignUp'),
  loading: Loading
});
const SignIn = Loadable({
  loader: () => import('./page/account/SignIn'),
  loading: Loading
});

ReactDOM.render((
  <Router>
    <section>
      <Switch>
      <Route path="/" exact component={Home}/>
      <Route path="/account/signUp" component={SignUp}/>
      <Route path="/account/signIn" component={SignIn}/>
      <Route component={NotFound} />
      </Switch>
    </section>
  </Router>
), document.getElementById('root'));
