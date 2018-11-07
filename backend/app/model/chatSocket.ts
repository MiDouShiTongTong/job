import { Instance, INTEGER, STRING, DATE } from "sequelize";
import { Application } from 'egg';

// ide 提示
export interface ChatSocketModel {
  // id
  id?: number;
  // 用户 id
  user_id: number;
  // 用户对应的 socket id
  socket_id: string;
  // 创建日期
  created_at?: Date,
  // 修改日期
  updated_at?: Date,
}

interface ChatSocketModelInstance extends ChatSocketModel, Instance<ChatSocketModel> {
}

// 数据库字段
const schema = {
  id: { type: INTEGER, primaryKey: true, autoIncrement: true },
  user_id: INTEGER,
  socket_id: STRING(100),
  created_at: DATE,
  updated_at: DATE
};

const schemaOption = {
  timestamps: true,
  underscored: true,
  freezeTableName: true
};

export default (app: Application) => {
  return app.model.define<ChatSocketModelInstance, ChatSocketModel>('chat_socket', schema, schemaOption);
}
