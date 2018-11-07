import { Service } from 'egg';
import { ChatModel } from "../model/chat";

/**
 * user Service
 */
export default class Chat extends Service {
  /**
   * 查找聊天信息
   *
   * @param findOption
   */
  public async selectMany(findOption) {
    const { app } = this;
    let result = await app.model.Chat.findAll(findOption);
    result = await Promise.all(result.map(async chat => {
      // 获取发送人头像
      const from_user = await app.model.User.findOne({ where: { id: chat.from } });
      if (from_user) {
        chat.setDataValue('from_avatar', from_user.avatar);
      }
      return chat;
    }));
    return result;
  }

  /**
   * 查找用户消息列表
   *
   * @param chatId
   */
  public async selectChatList(chatId) {
    // 获取用户聊天记录
    return await this.selectMany({
      where: {
        chat_id: chatId
      },
      order: [
        ['created_at', 'ASC']
      ]
    });
  }

  /**
   * 修改聊天记录
   *
   * @param data
   * @param condition
   */
  public async updateMany(data, condition) {
    const { app } = this;
    return await app.model.Chat.update(data, condition);
  }

  /**
   * 新增聊天记录
   *
   * @param data
   */
  public async insertOne(data: ChatModel) {
    const { app } = this;
    return await app.model.Chat.create(data);
  }
}
