/*
  Reducer 只是一些纯函数，它接收先前的 state 和 action，并返回新的 state
 */
// combineReducers 工具函数, 用于组织多个 reducer, 并返回 reducer 集合
import { combineReducers } from 'redux';

function foo(state = 0, action) {
  return state;
}

function bar(state = 0, action) {
  return state;
}

// 暴露 reducer 函数
export default combineReducers({
  foo,
  bar
});
