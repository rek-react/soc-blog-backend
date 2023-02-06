import { Router } from "express";
import userController from "../controller/user.js";
import { authMiddleware } from "../middlewares/auth.js";
import { uploadMiddleware } from "../middlewares/upload.js";
import { validErrorsMiddlware } from "../middlewares/validationErrors.js";
import { updateValidation } from "../validations/user.js";

const router = Router();

router.patch(
  "/update",
  authMiddleware,
  uploadMiddleware("image"),
  updateValidation,
  validErrorsMiddlware,
  userController.update
);

router.post("/refresh", userController.refresh);
router.get("/activate/:link", userController.activate);
router.get("/me", authMiddleware, userController.getMe);
export { router };
