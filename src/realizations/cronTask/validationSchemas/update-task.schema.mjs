import yup from 'yup';
import cron from 'node-cron';

yup.addMethod(yup.string, 'cron', function () {
  return this.test('is-cron', 'Invalid cron expression', function (value) {
    if (!value) {
      return true;
    }
    const cronRegex = /^[\d\*\-\,\/]+\s[\d\*\-\,\/]+\s[\d\*\-\,\/]+\s[\d\*\-\,\/]+\s[\d\*\-\,\/]+$/;

    return cronRegex.test(value) && cron.validate(value);
  });
});

// Example usage
export const updateTaskSchema = yup.object({
  name: yup.string().optional(),
  interval: yup.string().cron().optional(),
});