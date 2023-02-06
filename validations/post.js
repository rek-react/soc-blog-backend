import { check } from "express-validator";

export const postCreateValidation = [
  check("title", "Загаловок должен быть строкой")
    .isString()
    .bail()
    .isLength({
      min: 3,
    })
    .withMessage("Длина загаловка должна быть минимум 3 символа"),
  check("text").optional().isString().withMessage("Текст должен быть строкой"),
  check("tags", "Неверный формат тегов (нужна строка)").optional().isString(),
];
export const postUpdateValidation = [
  check("title", "Загаловок должен быть строкой")
    .optional()
    .isString()
    .bail()
    .isLength({
      min: 3,
    })
    .withMessage("Длина загаловка должна быть минимум 3 символа"),
  check("text").optional().isString().withMessage("Текст должен быть строкой"),
  check("tags", "Неверный формат тегов (нужна строка)").optional().isString(),
];
