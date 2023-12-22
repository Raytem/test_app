import { Sequelize, Transaction } from "sequelize";
import { sequelize } from "../../db.mjs";
import { ApiError } from "../../errors/api.error.mjs";
import { UserModel } from "./model/user.model.mjs";

class UserService {

  async increaseBalance(userId, changeBalanceDto) {
    let updateData = null;

    const retryFunction = async () => await sequelize.transaction({
      isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
    }, async (t) => {
      const user = await UserModel.findByPk(userId, {
        plain: true, 
        transaction: t,
      });
      if (!user) {
        throw ApiError.NotFound('no such user');
      }

      const newUserBalance = user.balance + changeBalanceDto.amount;
      
      updateData = await UserModel.update(
        { balance: newUserBalance },
        { where: { id: userId }, 
          returning: true, 
          plain: true, 
          transaction: t,
        },
      );
    })

    try {
      await retryFunction();
     } catch (e) {
       if (e instanceof ApiError === false) {
         await retryFunction();
       } else {
        throw e;
       }
     }

    return updateData[1].dataValues;
  }

  async decreaseBalance(userId, changeBalanceDto) {
    let updateData = null;

    const retryFunction = async () => await sequelize.transaction({
      isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
    }, async (t) => {
      const user = await UserModel.findByPk(userId, {
        plain: true,
        transaction: t,
      });
      if (!user) {
        throw ApiError.NotFound('no such user');
      }

      const newUserBalance = user.balance - changeBalanceDto.amount;
      if (newUserBalance < 0) {
        throw ApiError.BadRequestError('there are not enough funds');
      }
      
      updateData = await UserModel.update(
        { balance: newUserBalance },
        { where: { id: userId }, 
          returning: true, 
          plain: true, 
          transaction: t,
        },
      );
    })

    try {
     await retryFunction();
    } catch (e) {
      if (e instanceof ApiError === false) {
        await retryFunction();
      } else {
        throw e;
      }
    }

    return updateData[1].dataValues;
  }
}

export default new UserService();