import React from 'react';
import { NavBar } from 'antd-mobile';
import { connect } from 'react-redux';

export default connect(
  state => {
    // mapStateToProps
    return {};
  },
  // mapDispatchToProps
  {

  }
)(
  class HomeMessage extends React.Component {
    state = {};

    render() {
      return (
        <section className="home-message-container">
          <NavBar>消息</NavBar>
          message list
        </section>
      );
    }
  }
);
