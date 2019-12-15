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

export interface Resource {
  _id: string;
  name: string;
  type: ResourceType;
  mediaType: ResourceMediaType;
  url: string; // optional in the future ?
  description?: string;
}
