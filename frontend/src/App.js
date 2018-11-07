import React from 'react';
import { Toast } from 'antd-mobile';
import { connect } from 'react-redux';
import { asyncUpdateUserInfo } from '@/store/account';
// 引入 router 组件
import Router from '@/router';
// 引入 material icon
import 'material-icons/iconfont/material-icons.scss';
// 引入全局 css
import '@/App.scss';

export default connect(
  state => {
    // mapStateToProps
    return {

    };
  },
  // mapDispatchToProps
  {
    asyncUpdateUserInfo
  }
)(
  class App extends React.Component {
    state = {
      initComplete: false
    };

    constructor(props) {
      super(props);
      this.initAppState();
    }

    // 初始化应用状态
    initAppState = async () => {
      const { props } = this;

      // 初始化操作 - 开始
      Toast.loading('Loading...', 0);

      // 初始化用户信息
      await props.asyncUpdateUserInfo();

      Toast.hide();
      // 初始化操作 - 结束

      // 初始化完成, 渲染路由组件
      this.setState({
        initComplete: true
      });
    };

    render() {
      const { state } = this;
      if (state.initComplete) {
        // 初始化应用状态完成, 渲染路由组件
        return (
          <Router/>
        );
      } else {
        // 初始化应用状态未完成, 不渲染路由组件
        return null;
      }
    }
  }
);
