// polymorphic ?
export const ResourceLabel = 'Resource';
export enum ResourceMediaType {
  video = 'video',
  text = 'text',
}

export enum ResourceType {
  article = 'article',
  tutorial = 'tutorial',
  introduction = 'introduction',
}

export enum PedagogicalApproach {
  practical = 'practical',
  theoretical = 'theoretical',
  intuitive = 'intuitive',
  gamified = 'gamified',
  visual = 'visual',
  interactive = 'interactive',
  abstract = 'abstract',
  detailed = 'detailed',
}

export interface Resource {
  _id: string;
  name: string;
  type: ResourceType;
  mediaType: ResourceMediaType;
  url: string; // optional in the future ?
  description?: string;
}
