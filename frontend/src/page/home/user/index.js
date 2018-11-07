import React from 'react';
import { NavBar, Toast, WingBlank, WhiteSpace, Card } from 'antd-mobile';
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
      // 初始化页面
      const type = props.userInfo.type;
      // 1.标题[求职者用户显示企业, 企业用户显示求职者]
      let title = type === 1 ? '企业列表' : '求职者列表';
      // 2.用户列表[企业用户显示求职者用户列表, 求职者用户显示企业用户列表]
      if (props.homeUserList.length <= 0) {
        Toast.loading('Loading...', 0);
        await props.asyncUpdateHomeUserList(type === 1 ? 2 : 1);
        Toast.hide();
      }
      // 初始化完成, 开始渲染渲染
      this.setState({
        title
      });
    };

    render() {
      const { state, props } = this;
      return (
        <section className="home-user-container">
          <NavBar>{state.title}</NavBar>
          <WingBlank size="lg">
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
          </WingBlank>
        </section>
      );
    }
  }
);
