import io from 'socket.io-client';
import { Toast } from 'antd-mobile';
import config from '@/config';

// action type
const UPDATE_SOCKET = 'updateSocket';
const EMIT_UPDATE_CHAT_LIST = 'emitUpdateChatList';
const UPDATE_CHAT_LIST = 'updateChatList';
const EMIT_CHAT = 'emitChat';
const INSERT_TO_CHAT_LIST = 'insertToChatList';
const INSERT_TO_PREVIEW_CHAT_LIST = 'insertToPreviewChatList';
const EMIT_UPDATE_PREVIEW_CHAT_LIST = 'emitUpdatePreviewChatList';
const UPDATE_PREVIEW_CHAT_LIST = 'updatePreviewChatList';
const EMIT_UPDATE_PREVIEW_CHAT_LIST_NOT_READ_COUNT = 'emitUpdatePreviewChatListNotReadCount';
const UPDATE_PREVIEW_CHAT_LIST_NOT_READ_COUNT = 'updatePreviewChatListNotReadCount';
const CLEAR_CHAT_STATE = 'clearChatState';

// state
// init Socket
const initState = {
  // socket
  socket: null,
  // 用户相关的 chat 列表
  chatList: {},
  // 预览的 chat 列表
  previewChatList: [],
  // 未读的数量
  notReadCount: 0
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
      Toast.loading('Loading...', 0);
      // 发送请求到服务端(获取消息列表), 触发 UPDATE_CHAT_LIST
      state.socket.emit('receiveChatList', {
        chatId: action.data.chatId
      });
      return {
        ...state
      };
    case UPDATE_CHAT_LIST: {
      Toast.hide();
      // 修改消息列表
      const { chatId, chatList } = action.data;
      const currentChatList = JSON.parse(JSON.stringify(state.chatList));
      currentChatList[chatId] = chatList;
      return {
        ...state,
        ...{
          chatList: currentChatList
        }
      };
    }
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
    case INSERT_TO_CHAT_LIST: {
      // 将消息添加到消息列表
      const { chatId, chat } = action.data;
      const currentChatList = JSON.parse(JSON.stringify(state.chatList));
      if (currentChatList.hasOwnProperty(chatId)) {
        // 已展开会话, 添加到数组末尾
        currentChatList[chatId].push(chat);
      } else {
        // 未展开会话, 不做任何操作
        console.log('收到新消息, 但未展开会话 - ', chatId);
      }
      return {
        ...state,
        ...{
          chatList: currentChatList
        }
      };
    }
    case INSERT_TO_PREVIEW_CHAT_LIST: {
      // 更新预览消息列表
      const { chat } = action.data;
      const currentPreviewChatList = JSON.parse(JSON.stringify(state.previewChatList));
      const isFindPreviewChatList = currentPreviewChatList.find(previewChat => {
        if (previewChat.chat_id === chat.chat_id) {
          // 更新预览消息
          previewChat.content = chat.content;
          // 如果是收信方, 添加未读状态
          if (chat.to === state.socket.userId) {
            previewChat.not_read_count += 1;
          }
          return true;
        }
        return false;
      });
      if (!isFindPreviewChatList) {
        // 未初始化预览消息列表
        console.log('未找到预览消息列表 - ', chat);
      }
      return {
        ...state,
        ...{
          previewChatList: currentPreviewChatList
        }
      };
    }
    case EMIT_UPDATE_PREVIEW_CHAT_LIST:
      // 发送请求到服务端(获取预览消息列表), 触发 UPDATE_PREVIEW_CHAT_LIST
      state.socket.emit('receivePreviewChatList', {
        from: action.data.from
      });
      return {
        ...state
      };
    case UPDATE_PREVIEW_CHAT_LIST:
      // 修改预览消息列表
      return {
        ...state,
        ...action.data
      };
    case EMIT_UPDATE_PREVIEW_CHAT_LIST_NOT_READ_COUNT:
      // 发送请求到服务端(改变已读状态)
      state.socket.emit('receiveChatRead', {
        to: action.data.to
      });
      return {
        ...state
      };
    case UPDATE_PREVIEW_CHAT_LIST_NOT_READ_COUNT:
      const { chatId, readCount } = action.data;
      // 更新预览消息列表
      const currentPreviewChatList = JSON.parse(JSON.stringify(state.previewChatList));
      currentPreviewChatList.forEach(previewChat => {
        if (previewChat.chat_id === chatId) {
          previewChat.not_read_count -= readCount;
        }
      });
      return {
        ...state,
        ...{
          previewChatList: currentPreviewChatList
        }
      };
    case CLEAR_CHAT_STATE:
      return initState;
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
  // 保存用户 id, 用于刷新预览列表
  socket.userId = userId;
  return async dispatch => {
    // 保存 socket
    dispatch({
      type: UPDATE_SOCKET,
      data: {
        socket
      }
    });
    socket.on('disconnect', () => {
      console.log('disconnect success');
      // 断开连接移除 event
      socket.removeListener('sendChat');
      socket.removeListener('sendChatList');
      socket.removeListener('sendPreviewChatList');
    });

    // 监听 socket 事件
    socket.on('connect', () => {
      console.log('connect success');

      // 连接完成添加 event

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
        // 更新预览消息列表
        dispatch({
          type: INSERT_TO_PREVIEW_CHAT_LIST,
          data: {
            chat: data.chat
          }
        });
      });

      // 接受预览消息列表
      socket.on('sendPreviewChatList', data => {
        console.log('sendPreviewChatList - ', data);
        // 修改预览消息列表
        dispatch({
          type: UPDATE_PREVIEW_CHAT_LIST,
          data: {
            previewChatList: data.previewChatList
          }
        });
      });

      // 更改已读状态
      socket.on('sendChatRead', data => {
        console.log('sendChatRead - ', data);
        // 修改预览消息列表已读字段
        dispatch({
          type: UPDATE_PREVIEW_CHAT_LIST_NOT_READ_COUNT,
          data: {
            chatId: data.chatId,
            readCount: data.readCount
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

export const emitUpdatePreviewChatList = (from) => {
  return {
    type: EMIT_UPDATE_PREVIEW_CHAT_LIST,
    data: {
      from
    }
  };
};

export const emitUpdatePreviewChatListNotReadCount = (to) => {
  return {
    type: EMIT_UPDATE_PREVIEW_CHAT_LIST_NOT_READ_COUNT,
    data: {
      to
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

// 初始化状态 ===============================
export const clearChatState = () => {
  return {
    type: CLEAR_CHAT_STATE
  };
};
