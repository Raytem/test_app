import { ApiError } from "../../errors/api.error.mjs";
import cronTaskService from "./cron-task.service.mjs";
import { updateTaskSchema } from "./validationSchemas/update-task.schema.mjs";

class CronTaskController {
  async getAllCompleted(req, res, next) {
    try {
      const completedTasks = await cronTaskService.getAllCompleted();
      res.json(completedTasks);
    } catch (e) {
      next(e);
    }
  }

  async getAll(req, res, next) {
    try {
      const tasks = await cronTaskService.getAll();
      res.json(tasks);
    } catch (e) {
      next(e)
    }
  }

  async update(req, res, next) {
    try {
      const id = +req.params.id;
      let updateTaskDto
      try {
        updateTaskDto = await updateTaskSchema.validate(req.body);
      } catch (e) {
        throw ApiError.BadRequestError('invalid body');
      }

      const task = await cronTaskService.update(id, updateTaskDto);
      res.json(task);
    } catch (e) {
      next(e)
    }
  }

}

export default new CronTaskController();