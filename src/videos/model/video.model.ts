import mongoose, { Schema, model } from "mongoose";
import Video from "../video.interface";

const schema = new Schema<Video>({
  title: { type: String, trim: true, required: true },
  description: { type: String, trim: true, required: true },
  createdAt: { type: Date, required: true, default: Date.now },
  hashtags: [{ type: String, trim: true }],
  meta: {
    views: Number,
    rating: Number,
  },
});

const VideoModel = model<Video>("Video", schema);

export default VideoModel;
