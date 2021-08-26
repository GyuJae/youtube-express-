import express, { Request, Response } from "express";
import { Error, _AllowStringsForIds } from "mongoose";
import VideoModel from "./model/video.model";
import IVideo from "./video.interface";

class VideoController {
  public path = "/videos";
  public router = express.Router();

  constructor() {
    this.intializeRoutes();
  }

  public intializeRoutes() {
    this.router.get(this.path + "/trending", this.trending);
    this.router.get(this.path + "/search", this.search);
    this.router.post(this.path + "/upload", this.upload);
    this.router.get(this.path + "/:id", this.see);
    this.router.post(this.path + "/:id/edit", this.edit);
    this.router.post(this.path + "/:id/delete", this.deleteVideo);
  }

  trending = async (req: Request, res: Response) => {
    try {
      await VideoModel.find({}, (error, videos) => {
        if (error) {
          return res.json(error);
        }
        return res.json(videos);
      });
    } catch (error) {
      return res.json(error);
    }
  };

  upload = async (req: Request, res: Response) => {
    try {
      const { title, description, hashtags } = req.body;
      const video = await VideoModel.create({
        title,
        description,
        hashtags: hashtags.split(" ").map((hashtag: string) => `#${hashtag}`),
      });
      return res.json(video);
    } catch (error) {
      return res.status(404).json(error);
    }
  };

  see = async (req: Request, res: Response) => {
    try {
      const {
        params: { id },
      } = req;
      await VideoModel.findById(id, (error: Error, video: IVideo) => {
        if (error) {
          return res.json(error);
        }
        return res.json(video);
      });
    } catch (error) {
      return res.json(error);
    }
  };

  edit = async (req: Request, res: Response) => {
    try {
      const {
        params: { id },
      } = req;
      const {
        body: { title, description, hashtags },
      } = req;
      const video = await VideoModel.findByIdAndUpdate(id, {
        title,
        description,
        hashtags: hashtags.split(" ").map((hashtag: string) => `#${hashtag}`),
      });
      return res.json(video);
    } catch (error) {
      console.log(error);
      return res.json(error);
    }
  };

  deleteVideo = async (req: Request, res: Response) => {
    try {
      const {
        params: { id },
      } = req;
      const video = await VideoModel.findByIdAndDelete(id);
      return res.json(video);
    } catch (error) {
      return res.json(error);
    }
  };

  search = async (req: Request, res: Response) => {
    try {
      const {
        query: { keyword },
      } = req;
      let videos: IVideo[] = [];
      if (keyword) {
        videos = await VideoModel.find({
          title: {
            $regex: new RegExp(`${keyword}$`, "i"),
          },
        });
      }
      return res.json(videos);
    } catch (error) {
      return res.json(error);
    }
  };
}

export default VideoController;
