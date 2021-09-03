import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import VideoModel from "./model/video.model";

export const VideoAuthMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.headers["token"]) {
    const token = req.headers["token"];
    const decoded = await jwt.verify(
      token as string,
      process.env.JWT_PRIVATE_KEY || ""
    );
    if (typeof decoded === "object" && decoded.hasOwnProperty("id")) {
      const userId = decoded["id"];
      const {
        params: { id: videoId },
      } = req;
      const video = await VideoModel.findById(videoId);

      if (userId === video?.ownerId) {
        return next();
      }
    }
  }
  return res.json({
    ok: false,
    error: "You don't have access",
  });
};

export const VideoUploadMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.headers["token"]) {
    const token = req.headers["token"];
    const decoded = await jwt.verify(
      token as string,
      process.env.JWT_PRIVATE_KEY || ""
    );
    if (typeof decoded === "object" && decoded.hasOwnProperty("id")) {
      const userId = decoded["id"];

      if (userId) {
        return next();
      }
    }
  }
  return res.json({
    ok: false,
    error: "You don't have access",
  });
};
