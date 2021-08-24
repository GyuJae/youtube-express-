import mongoose, { Schema } from "mongoose";
import Video from "../video.interface";

const schema = new Schema<Video>({
  title: String,
  description: String,
  createdAt: Date,
  hashtags: [{ type: String }],
  meta: {
    views: Number,
    rating: Number,
  },
});

const VideoModel = mongoose.model("Video", schema);

export default VideoModel;
