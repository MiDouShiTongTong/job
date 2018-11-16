import { Service } from 'egg';
import { ChatModel } from '../model/chat';

/**
 * user Service
 */
export default class Chat extends Service {
  /**
   * 查找用户消息列表
   *
   * @param chatId
   */
  public async selectChatList(chatId) {
    const { app } = this;
    return await app.model.query(
      `SELECT
        c.*,
        u.avatar as from_avatar
      FROM
        chat c,
        user u
      WHERE
          c.chat_id = '${chatId}'
        AND
          c.from = u.id
      ORDER BY
        c.created_at ASC`,
      { model: app.model.Chat }
    );
  }

  /**
   * 查找用户预览消息列表
   *
   *
   * @param from
   */
  public async selectPreviewChatList(from) {
    const { app } = this;
    let result = await app.model.query(
      `SELECT
        c1.\`to\`,
        c1.\`from\`,
        c1.chat_id,
        c1.created_at,
        SUBSTRING_INDEX(GROUP_CONCAT(c1.content ORDER BY c1.created_at DESC), ',', 1) as content,
        (
          SELECT
            COUNT(id)
          FROM
            chat c2
          WHERE
            c2.chat_id = c1.chat_id
          AND
            c2.is_read = 0
          AND
		    	  c2.to = ${from}
        ) AS not_read_count
      FROM
        chat c1
      WHERE
        c1.\`from\` = ${from} OR c1.\`to\` = ${from}
      GROUP BY
        c1.chat_id`,
      { model: app.model.Chat }
    );

    result = await Promise.all(result.map(async chat => {
      // 发信人为自己获取收信人内容
      if (chat.from === from) {
        let user = await app.model.User.findOne({ where: { id: chat.to } });
        if (user) {
          chat.setDataValue('user', user);
        }
      }
      // 收信人为自己获取发信人内容
      if (chat.to === from) {
        const user = await app.model.User.findOne({ where: { id: chat.from } });
        if (user) {
          chat.setDataValue('user', user);
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
