/*
  redux 最核心的管理对象模块
 */
import { createStore, applyMiddleware, combineReducers } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import reduxThunk from 'redux-thunk';
import account from '@/store/account/index';
import test from '@/store/test/index';

// 暴露 store 对象
export default createStore(
  // 封装 reducer 集合
  combineReducers({
    account,
    test
  }),
  composeWithDevTools(applyMiddleware(reduxThunk))
);
