import multer from "multer";
import moment from "moment";
import path from "path";
import { ApiError } from "../exeptions/error.js";

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, process.env.DEST_FILES);
  },
  filename(req, file, cb) {
    const date = moment().format("YYYYMMDDDHHmmssSSS");
    cb(null, `${date}-${file.originalname}`);
  },
});

const limits = {
  fieldSize: 1024 * 1024 * 5,
};

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
    cb(ApiError.badRequest("Изображение должно быть типа: jpeg, jpg, png"));
  }
};

const upload = multer({
  storage,
  limits,
  fileFilter,
});

export const uploadMiddleware = (field) => {
  return (req, res, next) => {
    upload.single(field)(req, res, (err) => {
      if (err) {
        return next(err);
      }
      next();
    });
  };
};
