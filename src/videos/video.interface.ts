interface Hashtag {
  type: string;
}

interface Meta {
  views: number;
  rating: number;
}

interface Video {
  title: string;
  description: string;
  createdAt: Date;
  hashtags: Hashtag[];
  meta: Meta;
}

export default Video;
