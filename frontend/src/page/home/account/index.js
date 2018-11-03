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
  class HomeAccount extends React.Component {
    state = {};

    render() {
      return (
        <section className="home-account-container">
          <NavBar>个人中心</NavBar>
          account center
        </section>
      );
    }
  }
);
