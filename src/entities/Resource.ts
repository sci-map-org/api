// polymorphic ?
export const ResourceLabel = 'Resource';
export enum ResourceMediaType {
  video = 'video',
  text = 'text',
  audio = 'audio',
}

export enum ResourceType {
  article = 'article',
  article_series = 'article_series',
  tutorial = 'tutorial',
  introduction = 'introduction',
  course = 'course',
  guide = 'guide',
  podcast = 'podcast',
  podcast_series = 'podcast_series',
  other = 'other',
}

// export enum PedagogicalApproach {
//   practical = 'practical',
//   theoretical = 'theoretical',
//   intuitive = 'intuitive',
//   gamified = 'gamified',
//   visual = 'visual',
//   interactive = 'interactive',
//   abstract = 'abstract',
//   detailed = 'detailed',
// }

export interface Resource {
  _id: string;
  name: string;
  type: ResourceType;
  mediaType: ResourceMediaType;
  url: string; // optional in the future ?
  description?: string;
  durationMn?: number;
}
