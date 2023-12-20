import express from 'express';
import dotenv from 'dotenv';
import appRouter from './router.mjs';
import errorMiddleware from './middlewares/error-middleware.mjs';
import { sequelize } from './db.mjs';
import { umzug } from './db.mjs';

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

  await umzug.up();
})