import { Model } from "sequelize";
import { sequelize } from "../../../db.mjs";
import { CronTaskModel } from "./cron-task.model.mjs";
import { DataTypes } from "sequelize";

export const completedTask_tableName = 'completedTasks';

export class CompletedTaskModel extends Model {}

CompletedTaskModel.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  startTime: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  endTime: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  duration_ms: {
    type: DataTypes.VIRTUAL(DataTypes.DATE, ['endTime', 'startTime']),
    get() {
      if (!this.startTime || !this.endTime) {
        return null;
      }
      return this.endTime.getTime() - this.startTime.getTime();
    },
  }
}, {
  sequelize,
  modelName: completedTask_tableName,
  createdAt: false,
  updatedAt: false,
})

CronTaskModel.hasMany(CompletedTaskModel, {foreignKey: 'cronTask_id'});
CompletedTaskModel.belongsTo(CronTaskModel, {foreignKey: 'cronTask_id'});