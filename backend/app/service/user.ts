import { Service } from 'egg';
import { UserModel } from '../model/user';
import { FindOptions, UpdateOptions } from 'sequelize';

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
    return await this.app.model.User.create(user);
  }

  /**
   * 查询单一用户
   *
   * @param findOption
   */
  public async selectOne(findOption: FindOptions<any>) {
    return await this.app.model.User.findOne(findOption);
  }

  /**
   * 修改用户数据
   *
   * @param data
   * @param condition
   */
  public async update(data, condition: UpdateOptions) {
    return await this.app.model.User.update(data, condition);
  }
}
