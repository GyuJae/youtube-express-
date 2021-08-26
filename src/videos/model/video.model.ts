import { Schema, model } from "mongoose";
import IVideo from "../video.interface";

const schema = new Schema<IVideo>({
  title: { type: String, trim: true, required: true },
  description: { type: String, trim: true, required: true },
  createdAt: { type: Date, required: true, default: new Date() },
  hashtags: [{ type: String, trim: true }],
  meta: {
    views: Number,
    rating: Number,
  },
});

const VideoModel = model<IVideo>("Video", schema);

export default VideoModel;
