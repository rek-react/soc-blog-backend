import { validationResult } from "express-validator";
import { ApiError } from "../exeptions/error.js";

export const validErrorsMiddlware = (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(ApiError.badRequest("Ошибка при валидации", errors.array()));
    }
    next();
  } catch (e) {
    next(e);
  }
};
