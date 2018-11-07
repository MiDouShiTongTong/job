import { Instance, INTEGER, STRING, DATE, TEXT } from "sequelize";
import { Application } from 'egg';

// ide 提示
export interface ChatModel {
  // id
  id?: number;
  // 发信人
  from: string;
  // 收信人
  to: string;
  // 收信人id + 发信人id, 分组用
  chat_id: string,
  // 信息
  content: string,
  // 是否以读[0 未读, 1 以读]
  is_read: number,
  // 创建日期
  created_at?: Date,
  // 修改日期
  updated_at?: Date,

  // 发信人头像
  from_avatar?: string,
  // 收信人头像
  to_avatar?: string
}

interface ChatModelInstance extends ChatModel, Instance<ChatModel> {
}

// 数据库字段
const schema = {
  id: { type: INTEGER, primaryKey: true, autoIncrement: true },
  from: INTEGER,
  to: INTEGER,
  chat_id: STRING(50),
  content: TEXT,
  is_read: INTEGER,
  created_at: DATE,
  updated_at: DATE
};

const schemaOption = {
  timestamps: true,
  underscored: true,
  freezeTableName: true
};

export default (app: Application) => {
  return app.model.define<ChatModelInstance, ChatModel>('chat', schema, schemaOption);
}
