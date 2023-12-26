import axios from 'axios';
import schedule from 'node-schedule';
import CronTaskStatus from '../../enums/cron-task-status.mjs';
import { ApiError } from '../../errors/api.error.mjs';
import { CronTaskModel, cronTask_tableName } from './model/cron-task.model.mjs';
import { jobFunctionsList } from './job.functions.mjs';
import { CompletedTaskModel } from './model/completed-task.model.mjs';
import { DatabaseError, Sequelize, Transaction } from 'sequelize';
import { Op } from 'sequelize';
import { sequelize } from '../../db.mjs';

class CronTaskService {
  static progressingTasks = new Map();

  async getOne(id) {
    const task = await CronTaskModel.findByPk(id, {
      plain: true, 
    });

    if (!task) {
      throw ApiError.NotFound('no such cronTask');
    }

    return task.get();
  }

  async getAll() {
    const tasks = await CronTaskModel.findAll({
      order: [['id', 'ASC']],
    });

    return tasks.map(task => task.get());
  }

  async getAllCompleted() {
    const tasks = await CompletedTaskModel.findAll({
      include: CronTaskModel,
      order: [['id', 'ASC']],
    });
    return tasks.map(task => task.get());
  }

  async update(id, updateTaskDto) {
    const task = await this.getOne(id);
    let updatedTask = null;

    if (task.status !== CronTaskStatus.UNSCHEDULED) {
      if (updateTaskDto.interval && CronTaskService.progressingTasks.size) {
        const cronJob = CronTaskService.progressingTasks.get(id);
  
        if (cronJob) {
          cronJob.reschedule(updateTaskDto.interval);
        } else {
          try {
            const serverUrl = `http://${task.server}:${process.env.APP_PORT}`;
            const updateLink = `${serverUrl}/cronTask/${id}`
            const resp = await axios.patch(updateLink, updateTaskDto);
            updatedTask = resp.data;
            return updatedTask;
          } catch (e) {
            console.log(e)
            throw ApiError.NotFound('Server with such job was not found / invalid route');
          }
        }
      }
    }

    const updateData = await CronTaskModel.update(updateTaskDto, {
      where: {id},
      returning: true, 
      plain: true, 
    });

    updatedTask = updateData[1].get()
    console.log(`---task ${task.id} was rescheduled by server "${process.env.DOCKER_CONTAINER_APP_HOST}"
    old interval: ${task.interval}
    new interval: ${updatedTask.interval}`);

    return updatedTask;
  }

  async updateStatus(taskId, status) {
    await this.getOne(taskId);

    let updateData = null;
    const filter = {
      where: {id: taskId},
      returning: true, 
      plain: true, 
    };
    
    if (status === CronTaskStatus.IN_WAITING) {
      updateData = await CronTaskModel.update({
        status,
        startTime: null,
        server: process.env.DOCKER_CONTAINER_APP_HOST,
      }, filter);
    } else if (status === CronTaskStatus.IN_PROGRESS) {
      updateData = await CronTaskModel.update({
        status,
        startTime: Date.now(),
        server: process.env.DOCKER_CONTAINER_APP_HOST,
      }, filter);
    } else {
      updateData = await CronTaskModel.update({
        status,
      }, filter);
    }

    return updateData[1].get();
  }

  startTask(task) {
    const cronTaskService = new CronTaskService();

    const cronFunc = async (task, cronTaskService) => {
      try {
        console.log(`---task ${task.id} was started by server "${process.env.DOCKER_CONTAINER_APP_HOST}"`);
        task = await cronTaskService.updateStatus(task.id, CronTaskStatus.IN_PROGRESS);

        await jobFunctionsList[task.id - 1]();
        
        await cronTaskService.updateStatus(task.id, CronTaskStatus.IN_WAITING);
        await CompletedTaskModel.create({
          startTime: task.startTime,
          endTime: Date.now(),
          cronTask_id: task.id,
        });
        console.log(`---task ${task.id} was ended by server "${process.env.DOCKER_CONTAINER_APP_HOST}"`);
      } catch (e) {
        console.log(e);
      }}

      const job = schedule.scheduleJob(task.interval, async () => await cronFunc(task, cronTaskService));

      CronTaskService.progressingTasks.set(task.id, job);
  }

  async scheduleTasks() {
    const replicasCnt = +process.env.REPLICAS_CNT;
    const tasksCnt = await CronTaskModel.count();
    const cntOfTasksPerReplica = Math.ceil(tasksCnt / replicasCnt);

    const maxRetryCnt = process.env.REPLICAS_CNT;
    let retryCnt = 0;
    let tasks = [];

    while(retryCnt < maxRetryCnt) {
      try {
        await sequelize.transaction({
          isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
        }, async (t) => {
          const updateData = await CronTaskModel.update(
            {
              status: CronTaskStatus.IN_WAITING, 
              server: process.env.DOCKER_CONTAINER_APP_HOST,
              startTime: null,
            },
            {
              where: {
                id: {
                  [Op.in]: sequelize.literal(`
                    (
                      SELECT id FROM (
                        SELECT id FROM "${cronTask_tableName}"
                        WHERE status='${CronTaskStatus.UNSCHEDULED}'
                        ORDER BY id ASC
                        LIMIT ${cntOfTasksPerReplica}
                      ) tmp
                    )
                  `)
                },
              },
              returning: true,
              transaction: t,
            }
          );

          tasks = updateData[1].map(t => t.get());
        });

        break;
      } catch (e) {
        if (e instanceof DatabaseError) {
          console.error(`Retrying after serialization failure. Retry count: ${retryCnt + 1}`);
          retryCnt++;
          continue;
        }
        console.error(e);
        break;
      } 
    }

    if (tasks.length) {
      tasks.forEach(task => this.startTask(task));
      console.log(`---Server "${process.env.DOCKER_CONTAINER_APP_HOST}" has scheduled tasks with id: ${tasks.map(t => t.id)}`);
    }
  }
}

export default new CronTaskService();