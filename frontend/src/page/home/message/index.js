import React from 'react';
import { NavBar, List, Badge } from 'antd-mobile';
import QueueAnim from 'rc-queue-anim';
import { connect } from 'react-redux';
import '@/page/home/message/index.scss';

export default connect(
  state => {
    // mapStateToProps
    return {
      previewChatList: state.chat.previewChatList
    };
  },
  // mapDispatchToProps
  {}
)(
  class HomeMessage extends React.Component {
    state = {};

    render() {
      const { props } = this;
      return (
        <section className="home-message-container">
          <NavBar>消息</NavBar>
          <QueueAnim type="left">
            {
              props.previewChatList.length > 0
                ? props.previewChatList.map((chat, index) => {
                  return (
                    <List.Item
                      key={index}
                      extra={<Badge text={chat.not_read_count !== 0 ? `${chat.not_read_count}` : ''}/>}
                      align="top"
                      thumb={chat.user.avatar}
                      multipleLine
                      onClick={() => {
                        props.history.push(`/chat/${chat.user.id}`);
                      }}
                    >
                      {chat.user.username}
                      <List.Item.Brief>{chat.content}</List.Item.Brief>
                    </List.Item>
                  );
                })
                : <div className="alter">暂无更多消息</div>
            }
          </QueueAnim>
        </section>
      );
    }
  }
);
