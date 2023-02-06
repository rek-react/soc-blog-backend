import { check } from "express-validator";

export const commentCreateValidation = [
  check("comment", "Комментарий не должен быть пустым")
    .notEmpty()
    .bail()
    .matches(/[^\s]+$/)
    .withMessage("Комментарий должен быть не пробельным"),
];
