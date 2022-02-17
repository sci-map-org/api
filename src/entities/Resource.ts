import { BaseLearningMaterial } from './LearningMaterial';

export const ResourceLabel = 'Resource';

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
  exercise = 'exercise',
  quizz = 'quizz',
  project = 'project',
  other = 'other',
}

export interface Resource extends BaseLearningMaterial {
  key: string;
  name: string;
  types: ResourceType[]; // at least 1, max 3
  url: string; // optional in the future ?
  description?: string;
  durationSeconds?: number;
}
