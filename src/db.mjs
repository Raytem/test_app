import path from "path";
import dotenv from "dotenv";
import { Sequelize } from "sequelize";
import { Umzug, SequelizeStorage } from "umzug";

dotenv.config();

export const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'postgres',
});

export const umzug = new Umzug({
    migrations: { glob: 'src/migrations/*.mjs' },
    context: sequelize.getQueryInterface(),
    storage: new SequelizeStorage({ sequelize }),
    logger: console,
  });