import api from '@/api';

// action type
const UPDATE_HOME_USER_LIST = 'updateHomeUserList';
const CLEAR_USER_STATE = 'clearUserState';

// state
// init Socket

const initState = {
  // 用户的列表
  homeUserList: []
};

// reducer
export default (state = initState, action = {}) => {
  switch (action.type) {
    case UPDATE_HOME_USER_LIST:
      return {
        ...state,
        ...action.data
      };
    case CLEAR_USER_STATE:
      return initState;
    default:
      return {
        ...state
      };
  }
}

// Action
export const asyncUpdateHomeUserList = (type) => {
  return async dispatch => {
    let result = await api.user.selectUserList({
      type: type === 1 ? 2 : 1
    });
    dispatch({
      type: UPDATE_HOME_USER_LIST,
      data: {
        homeUserList: result.data
      }
    });
  };
};

// 初始化状态 ===============================
export const clearUserState = () => {
  return {
    type: CLEAR_USER_STATE
  };
};
