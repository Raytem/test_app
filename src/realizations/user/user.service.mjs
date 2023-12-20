import { Transaction } from "sequelize";
import { sequelize } from "../../db.mjs";
import { ApiError } from "../../errors/api.error.mjs";
import { UserModel } from "./model/user.model.mjs";

class UserService {

  async increaseBalance(userId, changeBalanceDto) {
    let updateData = null;

    await sequelize.transaction({
      isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
    }, async (t) => {
      const user = await UserModel.findByPk(userId, {plain: true});
      if (!user) {
        throw ApiError.NotFound('no such user');
      }

      const newUserBalance = user.balance + changeBalanceDto.amount;
      
      updateData = await UserModel.update(
        { balance: newUserBalance },
        { where: { id: userId }, returning: true, plain: true },
      );
    })

    return updateData[1].dataValues;
  }

  async decreaseBalance(userId, changeBalanceDto) {
    let updateData = null;

    await sequelize.transaction({
      isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
    }, async (t) => {
      const user = await UserModel.findByPk(userId, {plain: true});
      if (!user) {
        throw ApiError.NotFound('no such user');
      }

      const newUserBalance = user.balance - changeBalanceDto.amount;
      if (newUserBalance < 0) {
        throw ApiError.BadRequestError('there are not enough funds');
      }
      
      updateData = await UserModel.update(
        { balance: newUserBalance },
        { where: { id: userId }, returning: true, plain: true },
      );
    })

    return updateData[1].dataValues;
  }
}

export default new UserService();