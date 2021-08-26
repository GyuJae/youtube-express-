import express, { Request, Response } from "express";
import UserModel from "./model/user.model";
import jwt from "jsonwebtoken";
import passport from "passport";
const KakaoStrategy = require("passport-kakao").Strategy;

//_id : 612653107defb907b5686d59
//token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxMjY1MzEwN2RlZmI5MDdiNTY4NmQ1OSIsImlhdCI6MTYyOTk3ODY5M30.W79okqhYG5B7sCwnLWwyOCBJYD2Q1xYDLAlIecawXB0

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
          return res.json({
            accessToken,
            refreshToken,
            profile,
          });
        }
      )
    );
  }

  public intializeRoutes() {
    this.router.post(this.path + "/join", this.join);
    this.router.get(this.path + "/search", this.search);
    this.router.post(this.path + "/login", this.login);
    this.router.get(
      this.path + "/kakao-login",
      passport.Authenticator("kakao", {
        failureRedirect: "/login",
      })
    );
    this.router.post(this.path + "/edit", this.edit);
    this.router.post(this.path + "/remove", this.remove);
    this.router.get(this.path + "/:id", this.findById);
  }

  kakaoLogin = async (req: Request, res: Response) => {};

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
      return res.send(user);
    } catch (error) {
      return res.json(error);
    }
  };

  search = async (req: Request, res: Response) => {
    try {
      const {
        body: { username },
      } = req;
      console.log(req.headers);
      const user = await UserModel.find({ username });
      return res.json(user);
    } catch (error) {
      return res.json(error);
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
          error: "This email does not exist",
        });
      }
      if (user.password !== password) {
        return res.json({
          error: "wrong password",
        });
      }
      const token = jwt.sign(
        { id: user._id },
        process.env.JWT_PRIVATE_KEY || ""
      );
      return res.json({
        token,
      });
    } catch (error) {
      return res.json(error);
    }
  };

  edit = (req: Request, res: Response) => {
    return res.send("edit");
  };
  remove = (req: Request, res: Response) => {
    return res.send("remove");
  };
}

export default UserController;
