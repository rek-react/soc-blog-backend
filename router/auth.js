import { Router } from "express";
import userController from "../controller/user.js";
import { validErrorsMiddlware } from "../middlewares/validationErrors.js";
import { registerValidation } from "../validations/user.js";

const router = Router();

router.post(
  "/register",
  registerValidation,
  validErrorsMiddlware,
  userController.register
);

router.post("/login", userController.login);
router.post("/logout", userController.logout);
export { router };
