import React from 'react';
import { NavBar, List, Badge } from 'antd-mobile';
import { connect } from 'react-redux';
import { emitUpdatePreviewChatList } from '@/store/chat';
import '@/page/home/message/index.scss';

export default connect(
  state => {
    // mapStateToProps
    return {
      userInfo: state.account.userInfo,
      socket: state.chat.socket,
      previewChatList: state.chat.previewChatList
    };
  },
  // mapDispatchToProps
  {
    emitUpdatePreviewChatList
  }
)(
  class HomeMessage extends React.Component {
    state = {};

    componentDidMount = () => {
      const { props } = this;
      // 获取预览消息列表
      if (props.previewChatList.length <= 0) {
        props.emitUpdatePreviewChatList(props.userInfo.id);
      }
    };

    render() {
      const { props } = this;
      return (
        <section className="home-message-container">
          <NavBar>消息</NavBar>
          {
            props.previewChatList.length > 0
              ? props.previewChatList.map((chat, index) => {
                return (
                  <List.Item
                    key={index}
                    extra={<Badge text="5+" />}
                    align="top"
                    thumb={chat.avatar}
                    multipleLine
                    onClick={() => {
                      props.history.push(`/chat/${chat.user_id}`);
                    }}
                  >
                    {chat.username}
                    <List.Item.Brief>{chat.content}</List.Item.Brief>
                  </List.Item>
                )
              })
              : <div className="alter">暂无更多消息</div>
          }
        </section>
      );
    }
  }
);
