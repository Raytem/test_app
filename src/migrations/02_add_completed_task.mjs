import { Sequelize } from "sequelize";
import { cronTask_tableName } from "../realizations/cronTask/model/cron-task.model.mjs";
import { completedTask_tableName } from "../realizations/cronTask/model/completed-task.model.mjs";

export async function up({ context: queryInterface }) {
	await queryInterface.createTable(completedTask_tableName, {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    startTime: {
      type: Sequelize.DATE,
      allowNull: true,
    },
    endTime: {
      type: Sequelize.DATE,
      allowNull: true,
    },
    cronTask_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: cronTask_tableName,
        key: 'id',
      },
    },
	});

  // const completedTasks = [
  //   {id: 1, startTime: '2023-12-25T18:07:21.266Z', endTime: '2023-12-25T18:07:25.266Z', cronTask_id: 1},
  // ];

	try {
		// await queryInterface.bulkInsert(completedTask_tableName, completedTasks);
	} catch (e) {
    console.log(e);
		console.log('some tasks already exists');
	}

}

export async function down({ context: queryInterface }) {
	await queryInterface.dropTable(completedTask_tableName);
}