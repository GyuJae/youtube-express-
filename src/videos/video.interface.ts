interface Hashtag {
  type: string;
}

interface Meta {
  views: number;
  rating: number;
}

interface IVideo {
  videoFile: string;
  ownerId: string;
  title: string;
  description: string;
  createdAt: Date;
  hashtags: Hashtag[];
  meta: Meta;
}

export default IVideo;
