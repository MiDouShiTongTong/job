import { Controller } from 'egg';
import { Op } from 'sequelize';

export default class HomeMessageController extends Controller {
  /**
   * 保存 chat
   *
   */
  public async receiveChat() {
    const { app, ctx, service } = this;

    // 接收客户端数据
    const from = ctx.session.userId;
    const { to, content } = ctx.args[0];
    const chatId = [from, to].sort().join('-');

    // 持久化数据
    const data = {
      from,
      to,
      // chat_id(from 和 to 的组合)(需要进行排序, 保证双方的 chat_id 一致)
      chat_id: chatId,
      is_read: 0,
      content
    };
    const chat = await service.chat.insertOne(data);
    // 获取发信方头像
    const fromUser = await service.user.selectOne({
      where: {
        id: from
      }
    });
    if (fromUser) {
      chat.from_avatar = fromUser.avatar;
    }

    // 获取收信方以及发信方 socket
    const chatSocketList = await service.chatSocket.selectMany({
      where: {
        user_id: {
          [Op.or]: [from, to]
        }
      }
    });

    // 发送数据到客户端(收信方，发信方都要发)
    const nsp = app.io.of('/home/chat');
    const sendData = {
      chatId: chatId,
      chat: {
        id: chat.id,
        from: chat.from,
        to: chat.to,
        chat_id: chat.chat_id,
        is_read: chat.is_read,
        content: chat.content,
        from_avatar: chat.from_avatar
      }
    };
    // 发给数据给收信方以及发信方
    chatSocketList.forEach(chatSocket => {
      console.log('sendChat-', chatSocket.socket_id);
      nsp.to(chatSocket.socket_id).emit('sendChat', sendData);
    })
  }

  /**
   * 获取 chat 列表
   *
   */
  public async receiveChatList() {
    const { ctx, service } = this;
    // 接收客户端数据
    const from = this.ctx.session.userId;
    const { to } = ctx.args[0];
    const chatId = [from, to].sort().join('-');
    // 获取用户之间的消息列表
    const chatList = await service.chat.selectChatList(chatId);
    ctx.socket.emit('sendChatList', {
      chatId,
      chatList
    });
  }

  /**
   * 获取预览的 chat 列表
   */
  public async receivePreviewChatList() {
    const { ctx, service } = this;
    // 接收客户端数据
    const { from } = ctx.args[0];
    // 获取预览的 chat 列表
    const previewChatList = await service.chat.selectPreviewChatList(from);
    ctx.socket.emit('sendPreviewChatList', {
      previewChatList
    });
  }

  /**
   * 更改聊天记录为以读
   *
   */
  public async receiveChatRead() {
    const { ctx, service, app } = this;
    const from = ctx.session.userId;
    // 获取收信方
    const { to } = ctx.args[0];
    /**
     * 更新 chat 为以读
     *
     * 只改变收信方为自己的数据
     *
     */
    const result = await service.chat.updateMany({
        is_read: 1
      }, {
        where: {
          from: to,
          to: from,
          is_read: 0
        }
      }
    );

    // 获取发送发 socket
    const chatSocketList = await service.chatSocket.selectMany({
      where: {
        user_id: ctx.session.userId
      }
    });

    const nsp = app.io.of('/home/chat');
    // 发给数据给所有发送发，标识为以读状态
    chatSocketList.forEach(chatSocket => {
      console.log('sendChatRead-', chatSocket.socket_id);
      nsp.to(chatSocket.socket_id).emit('sendChatRead', {
        chatId: [from, to].sort().join('-'),
        readCount: result[0]
      });
    })
  }
}
