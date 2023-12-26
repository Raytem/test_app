import { Sequelize } from "sequelize";
import CronTaskStatus from "../enums/cron-task-status.mjs";
import { cronTask_tableName } from "../realizations/cronTask/model/cron-task.model.mjs";

export async function up({ context: queryInterface }) {
	await queryInterface.createTable(cronTask_tableName, {
		id: {
			type: Sequelize.INTEGER,
			autoIncrement: true,
			primaryKey: true
		},
		name: {
			type: Sequelize.STRING,
			allowNull: false,
		},
		interval: {
			type: Sequelize.STRING,
			allowNull: false,
		},
		status: {
			type: Sequelize.STRING,
			allowNull: false,
			defaultValue: CronTaskStatus.UNSCHEDULED,
		},
		startTime: {
			type: Sequelize.DATE,
			allowNull: true,
		},
		server: {
			type: Sequelize.STRING,
			allowNull: true,
		},
	});

	const tasks = [
		{ id: 1, name: 'TASK1', interval: '*/2 * * * *', status: CronTaskStatus.UNSCHEDULED, startTime: null, server: null },
		{ id: 2, name: 'TASK2', interval: '*/3 * * * *', status: CronTaskStatus.UNSCHEDULED, startTime: null, server: null },
		{ id: 3, name: 'TASK3', interval: '* * * * *', status: CronTaskStatus.UNSCHEDULED, startTime: null, server: null },
		{ id: 4, name: 'TASK4', interval: '*/10 * * * *', status: CronTaskStatus.UNSCHEDULED, startTime: null, server: null },
		{ id: 5, name: 'TASK5', interval: '* * * * *', status: CronTaskStatus.UNSCHEDULED, startTime: null, server: null },
		{ id: 6, name: 'TASK6', interval: '*/7 * * * *', status: CronTaskStatus.UNSCHEDULED, startTime: null, server: null },
		{ id: 7, name: 'TASK7', interval: '*/5 * * * *', status: CronTaskStatus.UNSCHEDULED, startTime: null, server: null },
		{ id: 8, name: 'TASK8', interval: '* * * * *', status: CronTaskStatus.UNSCHEDULED, startTime: null, server: null },
		{ id: 9, name: 'TASK9', interval: '*/4 * * * *', status: CronTaskStatus.UNSCHEDULED, startTime: null, server: null },
		{ id: 10, name: 'TASK10', interval: '* * * * *', status: CronTaskStatus.UNSCHEDULED, startTime: null, server: null },
	];

	try {
		await queryInterface.bulkInsert(cronTask_tableName, tasks);
	} catch (e) {
		console.log(e)
		console.log('some tasks already exists');
	}

}

export async function down({ context: queryInterface }) {
	await queryInterface.dropTable(cronTask_tableName);
}