import { Service } from 'egg';
import { UserModel } from '../model/user';
import { FindOptions } from 'sequelize';

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
}
