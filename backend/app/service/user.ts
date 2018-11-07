import { Service } from 'egg';
import { UserModel } from '../model/user';

/**
 * user Service
 */
export default class User extends Service {
  /**
   * 插入用户记录
   *
   * @param user
   */
  public async insertOne(user: UserModel) {
    const { app } = this;
    return await app.model.User.create(user);
  }

  /**
   * 查询单一用户
   *
   * @param condition
   */
  public async selectOne(condition) {
    const { app } = this;
    return await app.model.User.findOne(condition);
  }

  /**
   * 查找多个用户
   *
   * @param condition
   */
  public async selectMany(condition) {
    const { app } = this;
    return await app.model.User.findAll(condition);
  }

  /**
   * 修改用户数据
   *
   * @param data
   * @param condition
   */
  public async updateMany(data, condition) {
    const { app } = this;
    return await app.model.User.update(data, condition);
  }
}
