import express, { Request, Response } from "express";
import { Error, _AllowStringsForIds } from "mongoose";
import VideoModel from "./model/video.model";
import IVideo from "./video.interface";
import { VideoAuthMiddleware, VideoUploadMiddleware } from "./video.middleware";
import { findUserByToken } from "../utils/findUserByToken";

class VideoController {
  public path = "/videos";
  public router = express.Router();

  constructor() {
    this.intializeRoutes();
  }

  public intializeRoutes() {
    this.router.get(this.path + "/trending", this.trending);
    this.router.get(this.path + "/search", this.search);
    this.router.post(this.path + "/upload", VideoUploadMiddleware, this.upload);
    this.router.get(this.path + "/:id", this.see);
    this.router.post(this.path + "/:id/edit", VideoAuthMiddleware, this.edit);
    this.router.post(
      this.path + "/:id/delete",
      VideoAuthMiddleware,
      this.deleteVideo
    );
  }

  trending = async (req: Request, res: Response) => {
    try {
      await VideoModel.find({}, (error, videos) => {
        if (error) {
          return res.json({
            ok: false,
            error,
          });
        }
        return res.json({
          ok: true,
          videos,
        });
      });
    } catch (error) {
      return res.json({
        ok: false,
        error,
      });
    }
  };

  upload = async (req: Request, res: Response) => {
    try {
      const { title, description, hashtags, videoFile } = req.body;
      const token = req.headers["token"];
      const owner = await findUserByToken(token as string);
      if (!owner) {
        return res.json({ ok: false, error: "Auth error" });
      }
      const video = await VideoModel.create({
        videoFile,
        title,
        description,
        ownerId: owner._id,
        hashtags: hashtags.split(" ").map((hashtag: string) => `#${hashtag}`),
      });
      return res.json({
        ok: true,
        video,
      });
    } catch (error) {
      return res.status(404).json({
        ok: false,
        error,
      });
    }
  };

  see = async (req: Request, res: Response) => {
    try {
      const {
        params: { id },
      } = req;
      await VideoModel.findById(id, (error: Error, video: IVideo) => {
        if (error) {
          return res.json({
            ok: false,
            error,
          });
        }
        return res.json({
          ok: true,
          video,
        });
      });
    } catch (error) {
      return res.json({
        ok: false,
        error,
      });
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
      // await VideoModel.findByIdAndUpdate(id, {
      //   title,
      //   description,
      //   hashtags: hashtags.split(" ").map((hashtag: string) => `#${hashtag}`),
      // });
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

  deleteVideo = async (req: Request, res: Response) => {
    try {
      const {
        params: { id },
      } = req;
      await VideoModel.findByIdAndDelete(id);
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
      return res.json({
        ok: true,
        videos,
      });
    } catch (error) {
      return res.json({
        ok: false,
        error,
      });
    }
  };
}

export default VideoController;
