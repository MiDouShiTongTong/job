import React from 'react';
import { NavBar, Toast, WingBlank, WhiteSpace, Card } from 'antd-mobile';
import QueueAnim from 'rc-queue-anim';
import { connect } from 'react-redux';
import { asyncUpdateHomeUserList } from '@/store/user';
import '@/page/home/user/index.scss';

export default connect(
  state => {
    // mapStateToProps
    return {
      userInfo: state.account.userInfo,
      homeUserList: state.user.homeUserList
    };
  },
  // mapDispatchToProps
  {
    asyncUpdateHomeUserList
  }
)(
  class HomeUser extends React.Component {
    state = {
      title: '',
      userList: []
    };

    componentDidMount = async () => {
      const { props } = this;
      const type = parseInt(props.userInfo.type);
      // 初始化标题
      let title = type === 1 ? '企业列表' : '求职者列表';
      this.setState({
        title
      });
      // 初始化用户列表
      if (props.homeUserList.length <= 0) {
        Toast.loading('Loading...', 0);
        await props.asyncUpdateHomeUserList(props.userInfo.type);
        Toast.hide();
      }
    };

    render() {
      const { state, props } = this;
      return (
        <section className="home-user-container">
          <NavBar>{state.title}</NavBar>
          <WingBlank size="lg">
            <QueueAnim type="left">
              {
                props.homeUserList.length > 0
                  ? props.homeUserList.map((user, index) => {
                    return (
                      <section
                        key={index}
                      >
                        <WhiteSpace size="lg"/>
                        <Card
                          onClick={() => {
                            props.history.push(`/chat/${user.id}`);
                          }}
                        >
                          <Card.Header
                            thumb={user.avatar}
                            extra={<span>{user.username}</span>}
                          />
                          {
                            user.type === 1
                              ? (
                                <Card.Body>
                                  <div>
                                    <span>求职岗位：</span>
                                    <span>{user.position}</span>
                                  </div>
                                  <div>
                                    <span>个人介绍：</span>
                                    <span>{user.description}</span>
                                  </div>
                                </Card.Body>
                              )
                              : (
                                <Card.Body>
                                  <div>
                                    <span>公司名称：</span>
                                    <span>{user.company}</span>
                                  </div>
                                  <div>
                                    <span>招聘职位：</span>
                                    <span>{user.position}</span>
                                  </div>
                                  <div>
                                    <span>职位薪资：</span>
                                    <span>{user.salary}</span>
                                  </div>
                                  <div>
                                    <span>职位描述：</span>
                                    <span>{user.description}</span>
                                  </div>
                                </Card.Body>
                              )
                          }
                        </Card>
                      </section>
                    );
                  })
                  : (
                    <div className="alter">暂无更多用户</div>
                  )
              }
            </QueueAnim>
          </WingBlank>
        </section>
      );
    }
  }
);
