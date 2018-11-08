import api from '@/api';

// action type
// action type 用于定义修改状态的名称
const UPDATE_USER_INFO = 'updateUserInfo';
const CLEAR_ACCOUNT_STATE = 'clearAccountState';

// state
// state 用于记录状态
const initState = {
  // 已登录用户信息
  userInfo: {}
};

// reducer
// reducer 只干一件事, 根据 旧的状态 和 参数中的状态, 返回新的状态
// reducer 方法只要被调用, 必须返回一个状态
export default (state = initState, action = {}) => {
  switch (action.type) {
    case UPDATE_USER_INFO:
      return {
        ...state,
        ...action.data
      };
    case CLEAR_ACCOUNT_STATE:
      return initState;
    default:
      return {
        ...state
      };
  }
}

// Action
// Action 用于返回 action 给 reducer 操作
export const updateUserInfo = (userInfo) => {
  return {
    type: UPDATE_USER_INFO,
    data: {
      userInfo
    }
  };
};

export const asyncUpdateUserInfo = () => {
  return async dispatch => {
    const result = await api.account.selectUserInfo();
    if (result.code === '0') {
      dispatch({
        type: UPDATE_USER_INFO,
        data: {
          userInfo: result.data
        }
      });
    }
  };
};

// 初始化状态 ===============================
export const clearAccountState = () => {
  return {
    type: CLEAR_ACCOUNT_STATE
  };
};
