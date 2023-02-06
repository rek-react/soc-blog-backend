import { Router } from "express";
import postController from "../controller/post.js";
import { authMiddleware } from "../middlewares/auth.js";
import { uploadMiddleware } from "../middlewares/upload.js";
import { validErrorsMiddlware } from "../middlewares/validationErrors.js";
import {
  postCreateValidation,
  postUpdateValidation,
} from "../validations/post.js";

const router = Router();

router.get("/", postController.getAll);
router.get("/tags", postController.getTags);
router.get("/:postId", postController.getOne);
router.get("/user/me", authMiddleware, postController.getMy);
router.post(
  "/",
  authMiddleware,
  uploadMiddleware("image"),
  postCreateValidation,
  validErrorsMiddlware,
  postController.create
);
router.delete("/:postId", authMiddleware, postController.remove);
router.patch(
  "/:postId",
  authMiddleware,
  uploadMiddleware("image"),
  postUpdateValidation,
  validErrorsMiddlware,
  postController.update
);

export { router };
