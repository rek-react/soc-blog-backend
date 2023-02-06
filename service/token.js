import jwt from "jsonwebtoken";
import TokenModel from "../models/token.js";

class TokenService {
  generateAccessToken(payload) {
    return jwt.sign(payload, process.env.JWT_ACCESS_KEY, {
      expiresIn: "15h",
    });
  }
  generateRefreshToken(payload) {
    return jwt.sign(payload, process.env.JWT_REFRESH_KEY, {
      expiresIn: "15d",
    });
  }
  generateTokens(payload) {
    const accessToken = this.generateAccessToken(payload);
    const refreshToken = this.generateRefreshToken(payload);
    return {
      accessToken,
      refreshToken,
    };
  }
  async saveToken(userId, refreshToken) {
    const tokenData = await TokenModel.findOne({ user: userId });
    if (tokenData) {
      tokenData.refreshToken = refreshToken;
      return tokenData.save();
    }
    const token = await TokenModel.create({ user: userId, refreshToken });
    return token;
  }
  validateAccessToken(token) {
    try {
      const userData = jwt.verify(token, process.env.JWT_ACCESS_KEY);
      return userData;
    } catch (e) {
      return null;
    }
  }
  validateRefreshToken(token) {
    try {
      const userData = jwt.verify(token, process.env.JWT_REFRESH_KEY);
      return userData;
    } catch (e) {
      return null;
    }
  }
  async findToken(token) {
    const tokenData = await TokenModel.findOne({ refreshToken: token });
    return tokenData;
  }
  async removeToken(refreshToken) {
    const token = await TokenModel.deleteOne({ refreshToken });
    return token;
  }
}
export default new TokenService();
