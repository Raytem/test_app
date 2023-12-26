import { sleep } from '../../utils/sleep.mjs';

export const jobFunction1 = async () => {
  await sleep(1000 * 90 * 2);
}

export const jobFunction2 = async () => {
  await sleep(1000 * 60 * 2);
}

export const jobFunction3 = async () => {
  await sleep(1000 * 60 * 4);
}

export const jobFunction4 = async () => {
  await sleep(1000 * 60 * 2);
}

export const jobFunction5 = async () => {
  await sleep(1000 * 60 * 2);
}

export const jobFunction6 = async () => {
  await sleep(1000 * 10 * 3);
}

export const jobFunction7 = async () => {
  await sleep(1000 * 60 * 3);
}

export const jobFunction8 = async () => {
  await sleep(1000 * 60 * 2);
}

export const jobFunction9 = async () => {
  await sleep(1000 * 60 * 4);
}

export const jobFunction10 = async () => {
  await sleep(1000 * 60 * 2);
}

export const jobFunctionsList = [jobFunction1, jobFunction2, jobFunction3, jobFunction4, jobFunction5, 
  jobFunction6, jobFunction7, jobFunction8, jobFunction9, jobFunction10];