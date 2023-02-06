import { config } from "dotenv";
config();
import path from "path";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import { router as auth } from "./router/auth.js";
import { router as user } from "./router/user.js";
import { router as post } from "./router/post.js";
import { router as comment } from "./router/comment.js";
import { errorMiddleware } from "./middlewares/error.js";

const app = express();
app.use(cors({ credentials: true, origin: process.env.CLIENT_URI }));
app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(process.env.DEST_FILES));
app.use("/auth", auth);
app.use("/user", user);
app.use("/posts", post);
app.use("/comments", comment);
app.use(errorMiddleware);

const start = async () => {
  try {
    await mongoose.connect(process.env.MONGO_DB);
    app.listen(process.env.PORT, () => {
      console.log(`Server started on ${process.env.PORT}`);
    });
  } catch (e) {
    throw e;
  }
};
start();
