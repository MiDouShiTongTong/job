import { Instance, INTEGER, STRING, DATE } from "sequelize";
import { Application } from 'egg';

// ide 提示
export interface UserModel {
  // id
  id?: number;
  // 用户名
  username: string;
  // 密码
  password: string;
  // 类型
  type: string;
  // 头像
  avatar?: string;
  // 职位
  position?: string;
  // 简介
  description?: string;
  // 公司名称
  company?: string;
  // 薪资
  salary?: string;
  // 创建时间
  createdAt?: Date;
  // 修改时间
  updatedAt?: Date;
}

interface UserModelInstance extends UserModel, Instance<UserModel> {
}

// 数据库字段
const schema = {
  id: { type: INTEGER, primaryKey: true, autoIncrement: true },
  username: STRING(20),
  password: STRING(60),
  type: INTEGER,
  avatar: STRING(50),
  position: STRING(50),
  description: STRING(50),
  company: STRING(50),
  salary: STRING(50),
  created_at: DATE,
  updated_at: DATE,
};

const schemaOption = {
  timestamps: true,
  underscored: true,
  freezeTableName: true
};

export default (app: Application) => {
  return app.model.define<UserModelInstance, UserModel>('user', schema, schemaOption);
}
