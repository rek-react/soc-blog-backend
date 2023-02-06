import userService from "../service/user.js";

class UserController {
  static cookieOptions = {
    maxAge: 30 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  };
  async register(req, res, next) {
    try {
      const { fullName, email, password } = req.body;
      const { refreshToken, ...user } = await userService.register(
        email,
        fullName,
        password
      );
      res.cookie("refreshToken", refreshToken, UserController.cookieOptions);
      return res.status(201).json(user);
    } catch (e) {
      next(e);
    }
  }
  async login(req, res, next) {
    try {
      const { login, password } = req.body;
      const { refreshToken, ...user } = await userService.login(
        login,
        password
      );
      res.cookie("refreshToken", refreshToken, UserController.cookieOptions);
      return res.json(user);
    } catch (e) {
      next(e);
    }
  }
  async update(req, res, next) {
    try {
      const { fullName, email, image: imageUrl } = req.body;
      const image = req.file || imageUrl;
      const user = await userService.update(req.userId, {
        email,
        fullName,
        image,
      });
      return res.json(user);
    } catch (e) {
      next(e);
    }
  }
  async logout(req, res, next) {
    try {
      const { refreshToken } = req.cookies;
      const user = await userService.logout(refreshToken);
      res.clearCookie("refreshToken");
      return res.json(user);
    } catch (e) {
      next(e);
    }
  }
  async refresh(req, res, next) {
    try {
      const { refreshToken } = req.cookies;
      const { refreshToken: newRefreshToken, ...user } =
        await userService.refresh(refreshToken);
      res.cookie("refreshToken", newRefreshToken, UserController.cookieOptions);
      return res.json(user);
    } catch (e) {
      next(e);
    }
  }
  async activate(req, res, next) {
    try {
      const { link } = req.params;
      await userService.activate(link);
      return res.redirect(process.env.CLIENT_URI);
    } catch (e) {
      next(e);
    }
  }
  async getMe(req, res, next) {
    try {
      const userId = req.userId;
      const user = await userService.getMe(userId);
      return res.json(user);
    } catch (e) {
      next(e);
    }
  }
}
export default new UserController();
