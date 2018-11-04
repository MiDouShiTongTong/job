import React from 'react';
import ReactDOM from 'react-dom';
// Provider 是 react-redux 两个核心工具之一, 用于将 redux store 传递到每个项目的组件中
import { Provider } from 'react-redux';
// store 是 redux 的 store 对象, 整个应用唯一, 用于存放整个应用的 redux 状态
import store from '@/store';
// 引入根组件
import App from '@/App';

// 测试 websocket
import '@/test/sockio-test';

ReactDOM.render(
  <main>
    {/* 将 store 作为 prop 传入, 即可在所有组件中使用 store */}
    <Provider store={store}>
      <App/>
    </Provider>
  </main>,
  document.getElementById('root')
);
