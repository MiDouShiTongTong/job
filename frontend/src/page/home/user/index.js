import React from 'react';
import { NavBar } from 'antd-mobile';
import { connect } from 'react-redux';

export default connect(
  state => {
    // mapStateToProps
    return {
      userInfo: state.account.userInfo
    };
  },
  // mapDispatchToProps
  {

  }
)(
  class HomeUser extends React.Component {
    state = {
      title: ''
    };

    componentDidMount = () => {
      const { props } = this;
      if (parseInt(props.userInfo.type) === 1) {
        this.setState({
          title: '企业'
        });
      } else {
        this.setState({
          title: '求职者'
        });
      }
    };

    render() {
      return (
        <section className="home-user-container">
          <NavBar>{this.state.title}</NavBar>
          user list
        </section>
      );
    }
  }
);
