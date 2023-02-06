import { check } from "express-validator";

export const registerValidation = [
  check("fullName", "Отсутствует fullName")
    .notEmpty()
    .isString()
    .withMessage("FullName должен быть строкой")
    .custom((value) => value.replace(/\s*/g, ""))
    .bail()
    .isLength({
      min: 3,
    })
    .withMessage("Длина fullName должа быть не менее 3 символов"),
  check("email", "Отсутствует email")
    .notEmpty()
    .isEmail()
    .withMessage("Отсутствует пароль"),
  check("password", "Пароль должен быть строкой")
    .notEmpty()
    .isString()
    .withMessage("Пароль должен быть строкой")
    .bail()
    .isLength({
      min: 5,
    })
    .withMessage("Длина пароля должа быть минимум 5 символов"),
];

export const updateValidation = [
  check("fullName", "Отсутствует fullName")
    .optional()
    .notEmpty()
    .isString()
    .withMessage("FullName должен быть строкой")
    .custom((value) => value.replace(/\s*/g, ""))
    .bail()
    .isLength({
      min: 3,
    })
    .withMessage("Длина fullName должа быть не менее 3 символов"),
  check("email", "Отсутствует email")
    .optional()
    .notEmpty()
    .isEmail()
    .withMessage("Отсутствует пароль"),
];
