import express from 'express';
import userController from './realizations/user/user.controller.mjs';

const appRouter = express.Router();

appRouter.patch('/user/:id([0-9]+)/incBalance', userController.increaseBalance);
appRouter.patch('/user/:id([0-9]+)/decBalance', userController.decreaseBalance);

export default appRouter;