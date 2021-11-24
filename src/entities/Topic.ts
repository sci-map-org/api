
export const TopicLabel = 'Topic';

export interface Topic {
  _id: string;
  name: string;
  key: string;
  description?: string;
  updatedAt: number
  createdAt: number
}

