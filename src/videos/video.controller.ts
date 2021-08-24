import express, { Request, Response } from "express";

class VideoController {
  public path = "/videos";
  public router = express.Router();

  constructor() {
    this.intializeRoutes();
  }

  public intializeRoutes() {
    this.router.get(this.path + "/trending", this.trending);
    this.router.get(this.path + "/search", this.search);
    this.router.get(this.path + "/upload", this.upload);
    this.router.get(this.path + "/:id", this.see);
    this.router.get(this.path + "/:id/edit", this.edit);
    this.router.get(this.path + "/:id/deleteVideo", this.deleteVideo);
  }

  trending = (req: Request, res: Response) => {
    return res.send("trending");
  };
  see = (req: Request, res: Response) => {
    return res.send("see");
  };
  edit = (req: Request, res: Response) => {
    return res.send("edit");
  };
  search = (req: Request, res: Response) => {
    return res.send("search");
  };
  upload = (req: Request, res: Response) => {
    return res.send("upload");
  };
  deleteVideo = (req: Request, res: Response) => {
    return res.send("deleteVideo");
  };
}

export default VideoController;
