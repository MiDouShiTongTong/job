// Action type - (vue mutation type)

// state - (vue state)
const initState = {

};

// Reducer - (vue mutation)
// Reducer 只干一件事, 根据 旧的状态 和 参数中的状态, 返回新的状态
// Reducer 方法只要被调用, 必须返回一个状态
export default (state = initState, action = {}) => {
  switch (action.type) {
    default:
      return state;
  }
}

// Action - (vue action)
