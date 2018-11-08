import React from 'react';
import AsyncValidator from 'async-validator';
import { NavBar, List, InputItem, Toast } from 'antd-mobile';
import BScroll from 'better-scroll';
import { connect } from 'react-redux';
import { initSocket, emitChat, emitUpdateChatList } from '@/store/chat';
import { asyncUpdateHomeUserList } from '@/store/user';
import permission from '@/util/permission';
import '@/page/chat/index.scss';

export default connect(
  state => {
    // mapStateToProps
    return {
      userInfo: state.account.userInfo,
      homeUserList: state.user.homeUserList,
      socket: state.chat.socket,
      chatList: state.chat.chatList
    };
  },
  // mapDispatchToProps
  {
    initSocket,
    emitChat,
    emitUpdateChatList,
    asyncUpdateHomeUserList
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
      // scroll 组件
      chatListContainerScroll: null,
      // 当前与聊天用户的消息列表
      chatId: [this.props.userInfo.id, this.props.match.params.id].sort().join('-'),
      // 当前最新的一条消息
      currentLastItem: null,
      // 控制是否可以渲染
      isRender: false
    };

    constructor(props) {
      super(props);
      // 判断是否登陆
      permission.validateSignIn(props);
    }

    // 渲染完成初始化操作
    componentDidMount = async () => {
      const { state, props } = this;
      if (props.userInfo.id) {
        // 初始化用户列表(空的列表或者与当前用户类型一样的列表都要刷新)
        if (props.homeUserList.length <= 0 || (props.homeUserList.length > 1 && props.homeUserList[0].type === props.userInfo.type)) {
          Toast.loading('Loading...', 0);
          await props.asyncUpdateHomeUserList(props.userInfo.type);
          Toast.hide();
        }
        // 初始化 socket
        if (!props.socket) {
          props.initSocket(props.userInfo.id);
        } else {
          // socket 已存在, 但不是当前用户的
          console.log('refresh socket');
          if (props.socket.userId !== props.userInfo.id) {
            props.socket.close();
            props.initSocket(props.userInfo.id);
          }
        }
        // 初始化当前消息列表
        if (!props.chatList.hasOwnProperty(state.chatId)) {
          props.emitUpdateChatList(state.chatId);
        }
        // 开始渲染列表
        if (!state.isRender) {
          this.setState({
            isRender: true
          });
        }
      }
    };

    // 判断用户是否是否存在
    shouldComponentUpdate = (nextProps, nextState) => {
      const toUser = nextProps.homeUserList.find(homeUser => homeUser.id === parseInt(nextProps.match.params.id));
      if (toUser === undefined) {
        // 用户不存在
        Toast.info('用户不存在', 1, null, true);
        setTimeout(() => {
          nextProps.history.push('/', 1, null, true);
        }, 1000);
        return false;
      }
      return true;
    };

    // 发送信息滚动条到最底部
    componentDidUpdate = () => {
      const { state } = this;
      const currentLastItem = document.querySelector('.am-list-item:last-child');
      // 对比是不是有新的消息, 有则将滚动条滑倒最底
      if (currentLastItem !== state.currentLastItem) {
        this.setState({
          currentLastItem: currentLastItem
        });
        // 刷新 scroll 重新计算高度
        state.chatListContainerScroll.refresh();
        state.chatListContainerScroll.scrollTo(
          0,
          state.chatListContainerScroll.maxScrollY,
          105
        );
      }
    };

    // 初始化 better-scroll
    chatListContainerDidMount = () => {
      const { state } = this;
      // 初始化 better-scroll
      state.chatListContainerScroll = new BScroll('.chat-list-container', {
        scrollY: true,
        probeType: 3,
        swipeTime: 105
      });
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
      if (state.isRender) {
        return (
          <section className="chat-container">
            <NavBar>
              {props.homeUserList.find(homeUser => homeUser.id === parseInt(props.match.params.id)).username}
            </NavBar>
            <section className="chat-list-container" ref={this.chatListContainerDidMount}>
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
            </section>
            <div className="send-message">
              <InputItem
                type="text"
                value={state.chatFormValue.content}
                extra={<span
                  onClick={this.sendMessage}
                >发送</span>}
                onChange={(value) => this.changeChatFormValue('content', value)}
                onKeyPress={(e) => {
                  if (e.which === 13) {
                    this.sendMessage();
                  }
                }}
              />
            </div>
          </section>
        );
      } else {
        return (
          <div className="alter">渲染失败!</div>
        );
      }
    }
  }
);
