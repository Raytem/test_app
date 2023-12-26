import { Sequelize } from "sequelize";

export async function up({ context: queryInterface }) {
	await queryInterface.createTable('users', {
		id: {
			type: Sequelize.INTEGER,
			allowNull: false,
			primaryKey: true
		},
		balance: {
			type: Sequelize.DOUBLE,
			defaultValue: 0,
			allowNull: false
		},
	});

	try {
		await queryInterface.sequelize.query(`
			INSERT INTO users (id, balance)
			VALUES ('1', '10000');
		`);
	} catch (e) {
		console.log('user already exists');
	}

}

export async function down({ context: queryInterface }) {
	await queryInterface.dropTable('users');
}