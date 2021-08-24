import express, { Request, Response } from "express";

class UserController {
  public path = "/users";
  public router = express.Router();

  constructor() {
    this.intializeRoutes();
  }

  public intializeRoutes() {
    this.router.get(this.path + "/join", this.join);
    this.router.get(this.path + "/edit", this.edit);
    this.router.get(this.path + "/remove", this.remove);
    this.router.get(this.path + "/login", this.login);
    this.router.get(this.path + "/logout", this.logout);
    this.router.get(this.path + "/see", this.see);
  }

  join = (req: Request, res: Response) => {
    return res.send("join");
  };
  edit = (req: Request, res: Response) => {
    return res.send("edit");
  };
  remove = (req: Request, res: Response) => {
    return res.send("remove");
  };
  login = (req: Request, res: Response) => {
    return res.send("login");
  };
  logout = (req: Request, res: Response) => {
    return res.send("logout");
  };
  see = (req: Request, res: Response) => {
    return res.send("see");
  };
}

export default UserController;
