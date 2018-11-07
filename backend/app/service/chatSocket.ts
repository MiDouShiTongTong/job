import { Service } from 'egg';
import { ChatSocketModel } from "../model/chatSocket";

/**
 * user Service
 */
export default class Chat extends Service {
  /**
   * 查询
   *
   * @param condition
   */
  public async selectMany(condition) {
    const { app } = this;
    return await app.model.ChatSocket.findAll(condition);
  }

  /**
   * 新增
   *
   * @param data
   */
  public async insertOne(data: ChatSocketModel) {
    const { app } = this;
    return await app.model.ChatSocket.create(data);
  }

  /**
   * 修改
   *
   * @param data
   * @param condition
   */
  public async updateMany(data, condition) {
    const { app } = this;
    return await app.model.ChatSocket.update(data, condition);
  }

  /**
   * 删除
   *
   * @param condition
   */
  public async deleteMany(condition) {
    const { app } = this;
    return await app.model.ChatSocket.destroy(condition)
  }

  /**
   * 更新用户 socket id
   *
   * @param userId
   * @param socketId
   */
  public async insertUserSocketId(userId, socketId) {
    // 新增 用户对应的 socket id
    this.insertOne({
      user_id: userId,
      socket_id: socketId
    })
  }
}
