import express from 'express';
import dotenv from 'dotenv';
import appRouter from './router.mjs';
import errorMiddleware from './middlewares/error-middleware.mjs';
import { sequelize } from './db.mjs';
import { umzug } from './db.mjs';
import cronTaskService from './realizations/cronTask/cron-task.service.mjs';
import { sleep } from './utils/sleep.mjs';

dotenv.config();

const app = express();
const port = +process.env.APP_PORT || 8080;

app.use(express.json());
app.use(appRouter);
app.use(errorMiddleware);

app.listen(port, async () => {
  console.log(`----Server started on port: ${port}`);
  try {
    sequelize.authenticate();
    console.log('----Connected to the DB');
  } catch(e) {
    console.error('----Unable to connect to the DB:', e);
  }

  if (process.env.DOCKER_CONTAINER_APP_HOST === process.env.APP1_HOST) {
    console.log('---Running migrations...');
    await umzug.up();
    console.log('---Migrations was applied');
  } else {
    await sleep(3000);
  }

  await cronTaskService.scheduleTasks();
})