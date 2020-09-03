export const ResourceLabel = 'Resource';

export enum ResourceMediaType {
  video = 'video',
  text = 'text',
  audio = 'audio',
  image = 'image',
  interactive_content = 'interactive_content',
}

export enum ResourceType {
  article = 'article',
  article_series = 'article_series',
  course = 'course',
  youtube_video = 'youtube_video',
  book = 'book',
  podcast = 'podcast',
  podcast_series = 'podcast_series',
  talk = 'talk',
  documentary = 'documentary',
  website = 'website',
  video_game = 'video_game',
  infographic = 'infographic',
  tweet = 'tweet',
  other = 'other',
}

export interface Resource {
  _id: string;
  name: string;
  type: ResourceType;
  mediaType: ResourceMediaType;
  url: string; // optional in the future ?
  description?: string;
  durationMs?: number;
}
