import { ApiError } from '../../errors/api.error.mjs';
import userService from './user.service.mjs';
import { changeBalanceSchema } from './validationSchemas/change-balance.schema.mjs';

class UserController {
  async increaseBalance(req, res, next) {
    try {
      let changeBalanceDto;
      
      try {
        changeBalanceDto = await changeBalanceSchema.validate(req.body);
      } catch (e) {
        throw ApiError.BadRequestError('invalid body');
      }
    
      const updatedUser = await userService.increaseBalance(+req.params.id, changeBalanceDto);

      res.json(updatedUser);
    } catch (e) {
      next(e);
    }
  }

  async decreaseBalance(req, res, next) {
    try {
      let changeBalanceDto;

      try {
        changeBalanceDto = await changeBalanceSchema.validate(req.body);
      } catch (e) {
        throw ApiError.BadRequestError('invalid body');
      }
    
      const updatedUser = await userService.decreaseBalance(req.params.id, changeBalanceDto);
      
      res.json(updatedUser);
    } catch (e) {
      next(e);
    }
  }

}

export default new UserController();