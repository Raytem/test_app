import yup from 'yup';

export const changeBalanceSchema = yup.object({
  amount: yup.number().min(0).required(),
})