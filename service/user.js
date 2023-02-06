import { v4 } from "uuid";
import UserDto from "../dtos/user.js";
import { ApiError } from "../exeptions/error.js";
import UserModel from "../models/user.js";
import bcrypt from "bcrypt";
import tokenService from "./token.js";
import mailService from "./mail.js";
import validator from "email-validator";
import { deleteFile } from "../utils/deleteFIle.js";
class UserService {
  async register(email, fullName, password) {
    const candidate = await UserModel.findOne({
      $or: [{ email }, { fullName }],
    });
    if (candidate) {
      throw ApiError.badRequest(
        "Пользователь с таким email или fullname уже существует"
      );
    }
    const passwordHash = await bcrypt.hash(password, 4);
    const activationLink = v4();

    await mailService.sendActivationLink(
      email,
      `${process.env.API_URI}/user/activate/${activationLink}`
    );

    const user = await UserModel.create({
      email,
      passwordHash,
      fullName,
      activationLink,
    });

    return this.resultAuth(user);
  }
  async login(login, password) {
    const isEmail = validator.validate(login);
    const user = await UserModel.findOne({
      [isEmail ? "email" : "fullName"]: login,
    });
    if (!user) {
      throw ApiError.badRequest("Неверный логин или пароль");
    }
    const isPassword = await bcrypt.compare(
      String(password),
      user.passwordHash
    );
    if (!isPassword) {
      throw ApiError.badRequest("Неверный логин или пароль");
    }
    return this.resultAuth(user);
  }
  async logout(refreshToken) {
    if (!refreshToken) {
      throw ApiError.unauthorizedError();
    }
    const token = await tokenService.removeToken(refreshToken);
    return token;
  }
  async update(userId, { email, fullName, image }) {
    const candidate = await UserModel.findOne({
      $or: [{ email }, { fullName }],
      _id: { $ne: userId },
    });
    if (candidate) {
      if (image && image.filename) {
        await deleteFile(image.filename);
      }
      throw ApiError.badRequest(
        "Пользователь с таким email или fullname уже существует"
      );
    }
    const user = await UserModel.findById(userId);
    if (
      (user.avatarUrl && image && image.filename) ||
      (user.avatarUrl && !image)
    ) {
      await deleteFile(user.avatarUrl);
    }
    if (fullName) user.fullName = fullName;
    if (email) {
      user.email = email;
      const activationLink = v4();
      await mailService.sendActivationLink(
        email,
        `${process.env.API_URI}/user/activate/${activationLink}`
      );
      user.isActive = false;
      user.activationLink = activationLink;
    }
    user.avatarUrl = (image && image.filename) || image;
    const updatedUser = await user.save();
    const userDto = new UserDto(updatedUser);
    return userDto;
  }
  async refresh(refreshToken) {
    if (!refreshToken) {
      throw ApiError.unauthorizedError();
    }
    const userData = tokenService.validateRefreshToken(refreshToken);
    const tokenFromDb = await tokenService.findToken(refreshToken);

    if (!userData || !tokenFromDb) {
      throw ApiError.unauthorizedError();
    }

    const user = await UserModel.findById(userData.id);
    return this.resultAuth(user);
  }

  async activate(activationLink) {
    const user = await UserModel.findOne({ activationLink });
    if (!user) {
      throw ApiError.unauthorizedError();
    }
    user.isActive = true;
    await user.save();
  }
  async getMe(userId) {
    const user = await UserModel.findById(userId);
    if (!user) {
      throw ApiError.unauthorizedError();
    }
    const userDto = new UserDto(user);
    return { ...userDto };
  }
  async resultAuth(user) {
    const userDto = new UserDto(user);

    const tokens = tokenService.generateTokens({
      id: userDto._id,
    });

    await tokenService.saveToken(userDto._id, tokens.refreshToken);
    return { ...tokens, userData: userDto };
  }
}
export default new UserService();
