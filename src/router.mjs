import express from 'express';
import userController from './realizations/user/user.controller.mjs';
import cronTaskController from './realizations/cronTask/cron-task.controller.mjs';

const appRouter = express.Router();

appRouter.patch('/user/:id([0-9]+)/incBalance', userController.increaseBalance);
appRouter.patch('/user/:id([0-9]+)/decBalance', userController.decreaseBalance);

appRouter.get('/cronTask', cronTaskController.getAll);
appRouter.get('/cronTask/completed', cronTaskController.getAllCompleted);
appRouter.patch('/cronTask/:id([0-9]+)', cronTaskController.update);

export default appRouter;