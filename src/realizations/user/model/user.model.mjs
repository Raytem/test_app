import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../../db.mjs";

export class UserModel extends Model {}

UserModel.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  balance: {
    type: DataTypes.DOUBLE,
    allowNull: false,
    defaultValue: 0,
  },

}, {
  sequelize,
  modelName: 'users',
  createdAt: false,
  updatedAt: false,
})