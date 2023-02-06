import { Router } from "express";
import commentController from "../controller/comment.js";
import { authMiddleware } from "../middlewares/auth.js";
import { validErrorsMiddlware } from "../middlewares/validationErrors.js";
import { commentCreateValidation } from "../validations/comment.js";
const router = Router();

router.post(
  "/:postId",
  authMiddleware,
  commentCreateValidation,
  validErrorsMiddlware,
  commentController.create
);
router.get("/:postId", commentController.get);

export { router };
