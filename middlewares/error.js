import { ApiError } from "../exeptions/error.js";

export const errorMiddleware = (err, req, res, next) => {
  if (err instanceof ApiError) {
    return res
      .status(err.status)
      .json({ message: err.message, errors: err.errors });
  }
  console.log(err);
  return res
    .status(500)
    .json({ message: "Не предвиденная ошибка на сервере" });
};
