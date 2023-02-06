import { ApiError } from "../exeptions/error.js";
import tokenService from "../service/token.js";

export const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return next(ApiError.unauthorizedError());
    }
    const tokenHeader = authHeader.split(" ")[1];
    if (!tokenHeader) {
      return next(ApiError.unauthorizedError());
    }
    const detected = tokenService.validateAccessToken(tokenHeader);
    if (!detected) {
      return next(ApiError.unauthorizedError());
    }
    req.userId = detected.id;
    next();
  } catch (e) {
    return next(ApiError.unauthorizedError());
  }
};
