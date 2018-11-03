import React from 'react';
import { connect } from 'react-redux';
import { List, Grid } from 'antd-mobile';
import PropTypes from 'prop-types';
import '@/component/account/select-avatar/index.scss';

export default connect(
  // mapStateToProps
  state => {
    return {};
  },
  // mapDispatcherToProps
  {}
)(
  class selectAvatar extends React.Component {
    state = {
      // 头像列表
      avatarList: Array.from(new Array(20)).map((val, i) => ({
        icon: require(`@/asset/avatar/头像${i + 1}.png`)
      })),
      // 已选头像
      currentSelectAvatar: null
    };

    static propTypes = {
      onChange: PropTypes.func.isRequired
    };

    // 处理选择头像
    changeCurrentSelectAvatar = (avatar) => {
      // 更新当前组件
      this.setState({
        currentSelectAvatar: avatar
      });
      // 触发父组件回调
      this.props.onChange(avatar);
    };

    render() {
      const value = this.state.currentSelectAvatar === null ? '头像' : (
        <div className="tooltip">
          <span>头像</span>
          <img src={this.state.currentSelectAvatar.icon} alt="123"/>
        </div>
      );
      return (
        <div className="select-avatar-container">
          <List renderHeader={value}>
            <Grid
              data={this.state.avatarList}
              columnNum={5}
              onClick={this.changeCurrentSelectAvatar}
            />
          </List>
        </div>
      );
    }
  }
);
