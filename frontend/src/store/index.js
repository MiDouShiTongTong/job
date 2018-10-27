/*
  redux 最核心的管理对象模块
 */

import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';

import reducers from './reducer';
import reduxThunk from 'redux-thunk';

// 暴露 store 对象
export default createStore(
  reducers,
  composeWithDevTools(applyMiddleware(reduxThunk))
);
