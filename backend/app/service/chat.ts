import { Service } from 'egg';
import { ChatModel } from '../model/chat';

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
    const result = await app.model.Chat.findAll(findOption);
    return result;
  }

  /**
   * 查找用户消息列表
   *
   * @param chatId
   */
  public async selectChatList(chatId) {
    const { app } = this;
    // 获取用户聊天记录
    let result = await this.selectMany({
      where: {
        chat_id: chatId
      },
      order: [
        ['created_at', 'ASC']
      ]
    });
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
   * 查找用户预览消息列表
   * 
   * 
   * @param from
   */
  public async selectPreviewChatList(from) {
    const { app } = this;
    console.log(from);
    let result = await app.model.query(
      `SELECT
        c.\`to\`,
        c.\`from\`,
        c.chat_id,
        c.is_read,
        c.created_at,
        SUBSTRING_INDEX(GROUP_CONCAT(c.content ORDER BY c.created_at DESC), ',', 1) as content
      FROM 
        chat c,
        user u
      WHERE
        c.\`from\` = ${from} OR c.\`to\` = ${from}
      GROUP BY
        c.chat_id`,
      { model: app.model.Chat }
    );
    result = await Promise.all(result.map(async chat => {
      // 发信人为自己获取收信人头像
      if (chat.from === from) {
        let user = await app.model.User.findOne({ where: { id: chat.to } });
        if (user) {
          chat.setDataValue('user_id', user.id);
          chat.setDataValue('username', user.username);
          chat.setDataValue('avatar', user.avatar);
        }
      }
      // 收信人为自己获取发信人头像
      if (chat.to === from) {
        const user = await app.model.User.findOne({ where: { id: chat.from } });
        if (user) {
          chat.setDataValue('user_id', user.id);
          chat.setDataValue('username', user.username);
          chat.setDataValue('avatar', user.avatar);
        }
      }
      return chat;
    }));
    return result;
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
