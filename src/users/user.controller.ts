import express, { Request, Response } from "express";
import UserModel from "./model/user.model";
import jwt from "jsonwebtoken";
import passport from "passport";
import { AuthMiddleware } from "./user.middleware";
const KakaoStrategy = require("passport-kakao").Strategy;

class UserController {
  public path = "/users";
  public router = express.Router();

  constructor() {
    this.intializeRoutes();
    passport.use(
      "kakao",
      new KakaoStrategy(
        {
          clientID: process.env.KAKAO_CLIENT_KEY,
          clientSecret: process.env.KAKAO_PRIVATE_KEY,
          callbackURL: "https://www.localhost:3000/videos/trending",
        },
        (accessToken: any, refreshToken: any, profile: any) => {
          console.log(profile);
          console.log(accessToken);
          console.log(refreshToken);
        }
      )
    );
  }

  public intializeRoutes() {
    this.router.get(this.path + "/search", this.search);
    this.router.post(this.path + "/join", this.join);
    this.router.post(this.path + "/login", this.login);
    this.router.get(
      this.path + "/kakao-login",
      passport.authenticate("kakao", {
        failureRedirect: `#!/login`,
      }),
      this.kakaoLogin
    );
    this.router.post(this.path + "/remove/:id", AuthMiddleware, this.remove);
    this.router.post(this.path + "/edit/:id", AuthMiddleware, this.edit);
    this.router.get(this.path + "/:id", this.findById);
  }

  kakaoLogin = async (req: Request, res: Response) => {
    return res.json(req);
  };

  join = async (req: Request, res: Response) => {
    try {
      const {
        body: { email, password, username },
      } = req;
      const user = await UserModel.create({
        email,
        password,
        username,
      });
      return res.send({
        ok: true,
        user,
      });
    } catch (error) {
      return res.json({
        ok: false,
        error,
      });
    }
  };

  search = async (req: Request, res: Response) => {
    try {
      const {
        body: { username },
      } = req;
      const users = await UserModel.find({ username });
      return res.json({
        ok: true,
        users,
      });
    } catch (error) {
      return res.json({
        ok: false,
        error,
      });
    }
  };

  findById = async (req: Request, res: Response) => {
    try {
      const {
        params: { id },
      } = req;
      const user = await UserModel.findById(id);
      return res.json(user);
    } catch (error) {
      return res.json(error);
    }
  };

  login = async (req: Request, res: Response) => {
    try {
      const {
        body: { email, password },
      } = req;
      const user = await UserModel.findOne({ email });
      if (!user) {
        return res.json({
          ok: false,
          error: "This email does not exist",
        });
      }
      if (user.password !== password) {
        return res.json({
          ok: false,
          error: "Wrong password",
        });
      }
      const token = jwt.sign(
        { id: user._id },
        process.env.JWT_PRIVATE_KEY || ""
      );

      return res.json({
        ok: true,
        token,
      });
    } catch (error) {
      return res.json({ error });
    }
  };

  edit = async (req: Request, res: Response) => {
    try {
      const {
        params: { id },
        body: editInput,
      } = req;
      await UserModel.findByIdAndUpdate(id, editInput);
      return res.json({
        ok: true,
      });
    } catch (error) {
      return res.json({
        ok: false,
        error,
      });
    }
  };

  remove = async (req: Request, res: Response) => {
    try {
      const {
        params: { id },
      } = req;
      await UserModel.findByIdAndDelete(id);
      return res.json({
        ok: true,
      });
    } catch (error) {
      return res.json({
        ok: false,
        error,
      });
    }
  };
}

export default UserController;
