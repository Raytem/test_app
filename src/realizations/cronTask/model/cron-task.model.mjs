import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../../db.mjs";
import CronTaskStatus from '../../../enums/cron-task-status.mjs';

export const cronTask_tableName = 'cronTasks';

export class CronTaskModel extends Model {}

CronTaskModel.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  interval: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: CronTaskStatus.UNSCHEDULED,
  },
  startTime: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  server: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  timeFromStartToNow_ms: {
    type: DataTypes.VIRTUAL(DataTypes.DATE, ['startTime']),
    get() {
      if (!this.startTime) {
        return null;
      }
      return Date.now() - this.startTime.getTime();
    },
  }
}, {
  sequelize,
  modelName: cronTask_tableName,
  createdAt: false,
  updatedAt: false,
})