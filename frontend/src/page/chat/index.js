import React from 'react';
import AsyncValidator from 'async-validator';
import { NavBar, List, InputItem, Toast } from 'antd-mobile';
import { connect } from 'react-redux';
import { initSocket, emitChat, emitUpdateChatList } from '@/store/chat';
import permission from '@/util/permission';
import '@/page/chat/index.scss';

export default connect(
  state => {
    // mapStateToProps
    return {
      userInfo: state.account.userInfo,
      socket: state.chat.socket,
      chatList: state.chat.chatList
    };
  },
  // mapDispatchToProps
  {
    initSocket,
    emitChat,
    emitUpdateChatList
  }
)(
  class ChatMessage extends React.Component {
    state = {
      chatFormValue: {
        content: ''
      },
      validateChatFormValue: new AsyncValidator({
        content: [
          { required: true, message: '不能发送空白消息' }
        ]
      }),
      // 用于获取当前的消息列表
      chatId: [this.props.userInfo.id, this.props.match.params.id].sort().join('-'),
      // 消息列表是否获取完成, 用于刷新数据
      chatListGetComplete: false
    };

    constructor(props) {
      super(props);
      // 判断是否登陆
      permission.validateSignIn(props);
      // 未初始化 socket
      if (!props.socket) {
        props.initSocket(props.userInfo.id);
      }
    }

    // 渲染完成获取消息列表
    componentDidMount = () => {
      const { state, props } = this;
      // 获取消息列表
      if (!props.chatList.hasOwnProperty(state.chatId)) {
        props.emitUpdateChatList(state.chatId);
      }
    };

    // 处理所有表单的 change 事件
    changeChatFormValue = (name, value) => {
      const { state } = this;
      state.chatFormValue[name] = value;
      this.setState({
        chatFormValue: state.chatFormValue
      });
    };

    // 处理发送消息
    sendMessage = () => {
      const { state, props } = this;
      // 验证
      state.validateChatFormValue.validate(state.chatFormValue, async errors => {
        if (errors) {
          Toast.info(errors[0].message, 1, null, false);
        } else {
          // 封装请求数据
          const from = props.userInfo.id;
          const to = parseInt(props.match.params.id);
          const content = state.chatFormValue.content;

          // 发送消息
          props.emitChat(from, to, content);

          // 清空输入框
          this.changeChatFormValue('content', '');
        }
      });
    };

    render() {
      const { state, props } = this;
      return (
        <section className="chat-container">
          <NavBar>消息</NavBar>
          <List>
            {
              props.chatList.hasOwnProperty(state.chatId)
                ? props.chatList[state.chatId].length > 0
                ? props.chatList[state.chatId].map((chat, index) => {
                  if (chat.from === props.userInfo.id) {
                    return (
                      <List.Item
                        key={index}
                        wrap
                        thumb={chat.from_avatar}
                        className="my"
                      >
                        {chat.content}
                      </List.Item>
                    );
                  } else {
                    return (
                      <List.Item
                        key={index}
                        wrap
                        thumb={chat.from_avatar}
                      >
                        {chat.content}
                      </List.Item>
                    );
                  }
                })
                : (<div className="alter">暂无更多消息</div>)
                : ''
            }
          </List>
          <div className="send-message">
            <InputItem
              type="text"
              value={state.chatFormValue.content}
              extra={<span
                onClick={this.sendMessage}
              >发送</span>}
              onChange={(value) => this.changeChatFormValue('content', value)}
            />
          </div>
        </section>
      );
    }
  }
);
