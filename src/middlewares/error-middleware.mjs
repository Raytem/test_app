import { ApiError } from '../errors/api.error.mjs';

export default function errorMiddleware(err, req, res, next) {
  console.log('--------------------------------------------------')
  console.error(err);

  if (err instanceof ApiError) {
      return res.status(err.status).json({
          message: err.message,
          errors: err.errors
      })
  } 
  return res.status(500).json({
      message: "Unexpected error",
  })
}