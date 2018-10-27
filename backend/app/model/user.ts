import { Instance, INTEGER, STRING, DATE } from "sequelize";
import { Application } from 'egg';

interface UserModel {
  id?: number;
  name?: string;
  age?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface UserModelInstance extends UserModel, Instance<UserModel> {
}

const schema = {
  id: {type: INTEGER, primaryKey: true, autoIncrement: true},
  name: STRING(30),
  age: INTEGER,
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
