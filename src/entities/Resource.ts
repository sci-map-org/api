import { BaseLearningMaterial } from './LearningMaterial';

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
  podcast = 'podcast',
  podcast_episode = 'podcast_episode',
  youtube_video = 'youtube_video',
  youtube_playlist = 'youtube_playlist',
  online_book = 'online_book',
  book = 'book',
  research_paper = 'research_paper',
  talk = 'talk',
  documentary = 'documentary',
  website = 'website',
  video_game = 'video_game',
  infographic = 'infographic',
  tweet = 'tweet',
  other = 'other',
}

export interface Resource extends BaseLearningMaterial {
  name: string;
  type: ResourceType;
  mediaType: ResourceMediaType;
  url: string; // optional in the future ?
  description?: string;
  durationSeconds?: number;
}
