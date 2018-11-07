import io from 'socket.io-client';
import config from '@/config';

// action type
const UPDATE_SOCKET = 'updateSocket';
const EMIT_UPDATE_CHAT_LIST = 'emitUpdateChatList';
const EMIT_CHAT = 'emitChat';
const UPDATE_CHAT_LIST = 'updateChatList';
const INSERT_TO_CHAT_LIST = 'insertToChatList';

// state
// init Socket

const initState = {
  // socket
  socket: null,
  // 用户相关的 chat 列表
  chatList: {},
  // 未读的数量
  notReadCount: 0,
  test: 'dwq'
};

// reducer
export default (state = initState, action = {}) => {
  switch (action.type) {
    case UPDATE_SOCKET:
      return {
        ...state,
        ...action.data
      };
    case EMIT_UPDATE_CHAT_LIST:
      // 发送请求到服务端(获取消息列表), 触发 UPDATE_CHAT_LIST
      state.socket.emit('receiveChatList', {
        chatId: action.data.chatId
      });
      return {
        ...state
      };
    case EMIT_CHAT:
      // 发送请求到服务端(保存消息), 触发 INSERT_CHAT_LIST
      state.socket.emit('receiveChat', {
        from: action.data.from,
        to: action.data.to,
        content: action.data.content
      });
      return {
        ...state
      };
    case UPDATE_CHAT_LIST:
      // 修改消息列表
      const chatId = action.data.chatId;
      const chatList = action.data.chatList;
      const currentChatList = JSON.parse(JSON.stringify(state.chatList));
      currentChatList[chatId] = chatList;
      return {
        ...state,
        ...{
          chatList: currentChatList
        }
      };
    case INSERT_TO_CHAT_LIST:
      // 将消息添加到消息列表
      const chatId_ = action.data.chatId;
      const chat = action.data.chat;
      const currentChatList_ = JSON.parse(JSON.stringify(state.chatList));
      currentChatList_[chatId_].push(chat);
      return {
        ...state,
        ...{
          chatList: currentChatList_
        }
      };
    default:
      return {
        ...state
      };
  }
}

// Action
export const initSocket = (userId) => {
  const socket = io(config.HOME_CHAT_SOCKET_API_ROOT, {
    query: {
      userId
    }
  });
  return async dispatch => {
    // 保存 socket
    dispatch({
      type: UPDATE_SOCKET,
      data: {
        socket
      }
    });
    // 监听 socket 事件
    socket.on('connect', () => {
      // WebSocket 连接完成
      console.log('connect success!');

      // 接收新的消息
      socket.on('sendChat', data => {
        console.log('sendChat - ', data);
        // 将消息添加到消息列表
        dispatch({
          type: INSERT_TO_CHAT_LIST,
          data: {
            chatId: data.chatId,
            chat: data.chat
          }
        });
      });

      // 接收消息列表
      socket.on('sendChatList', data => {
        console.log('sendChatList - ', data);
        // 修改消息列表
        dispatch({
          type: UPDATE_CHAT_LIST,
          data: {
            chatId: data.chatId,
            chatList: data.chatList
          }
        });
      });
    });
  };
};

// 触发 emit ================================
export const emitUpdateChatList = (chatId) => {
  return {
    type: EMIT_UPDATE_CHAT_LIST,
    data: {
      chatId
    }
  };
};

export const emitChat = (from, to, content) => {
  return {
    type: EMIT_CHAT,
    data: {
      from,
      to,
      content
    }
  };
};

// 更新状态 =================================
export const updateSocket = (socket) => {
  return dispatch => {
    dispatch({
      type: UPDATE_SOCKET,
      data: {
        socket
      }
    });
  };
};
