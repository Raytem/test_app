import { Sequelize, Transaction } from "sequelize";
import { sequelize } from "../../db.mjs";
import { ApiError } from "../../errors/api.error.mjs";
import { UserModel } from "./model/user.model.mjs";

class UserService {

  async increaseBalance(userId, changeBalanceDto) {
    let updatedUser = null;

    const user = await UserModel.findByPk(userId, {
      plain: true, 
    });
    if (!user) {
      throw ApiError.NotFound('no such user');
    }
      
    await sequelize.transaction({
    }, async (t) => {
      const updateData = await UserModel.update(
        { balance: sequelize.literal(`"balance" + ${changeBalanceDto.amount}`) },
        { where: { id: userId }, 
          returning: true, 
          plain: true, 
          transaction: t,
        },
      );
      
      updatedUser = updateData[1].get();
    })      

    return updatedUser;
  }

  async decreaseBalance(userId, changeBalanceDto) {
    let updatedUser = null;

    const user = await UserModel.findByPk(userId, {
      plain: true,
    });
    if (!user) {
      throw ApiError.NotFound('no such user');
    }

    await sequelize.transaction({
    }, async (t) => {
      const updateData = await UserModel.update(
        { balance: sequelize.literal(`"balance" - ${changeBalanceDto.amount}`) },
        { where: { id: userId }, 
          returning: true, 
          plain: true, 
          transaction: t,
        },
      );
      
      updatedUser = updateData[1].get();
      if (updatedUser.balance < 0) {
        throw ApiError.BadRequestError('there are not enough funds');
      }
    })      

    return updatedUser;
  }
}

export default new UserService();